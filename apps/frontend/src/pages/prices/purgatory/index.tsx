import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack, TextField, Autocomplete, Switch, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/providers';
import MainLayout from '@/components/layout/MainLayout';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { formatDollar } from '@/lib/utils';
import ActionsMenu from '@/components/layout/ActionsMenu';
import { CREATE_ITEM_PRICE, DELETE_ITEM_PRICE, UPDATE_ITEM_PRICE } from '@/lib/mutations';
import {
  GET_CONTACTS_WITHOUT_GROUP,
  GET_GROUPS,
  GET_ITEM_PRICES_BY_GROUP,
  GET_ITEMS,
  GET_PURGATORY,
} from '@/lib/queries';
import { Contact, Group, ItemPrice } from '@/lib/types';
import { getApolloClient } from '@/lib/apolloClient';

const PricesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editPrice, setEditPrice] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const queryClient = useQueryClient();
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; price: any | null }>({ open: false, price: null });
  const [groupId, setGroupId] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [buying, setBuying] = useState<boolean>(true);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [rows, setRows] = useState<any>([]);
  const [itemPrices, setItemPrices] = useState<any>(null);

  const { notify } = useSnackbar()!;
  const apolloClient = getApolloClient();
  
  const createItemPriceMutation = useMutation({
    mutationFn: async (input: { itemId: string; groupId: string; price: number; targetId?: string; buying?: boolean }) => {
      setModalLoading(true);
      await apolloClient.mutate({
        mutation: CREATE_ITEM_PRICE,
        variables: { input },
      });
    },
    onSuccess: () => {
      setOpen(false);
      setEditPrice(null);
      setModalLoading(false);
      queryClient.invalidateQueries({ queryKey: ['itemPricesByGroup'] });
      notify('Succès', 'success');
    },
    onError: (err: any) => {
      setModalLoading(false);
      notify((err?.message || 'Erreur') + (err?.stack ? '\n' + err.stack : ''), 'error');
    },
  });

  const updateItemPriceMutation = useMutation({
    mutationFn: async (input: { id: string; price?: number; targetId?: string; buying?: boolean }) => {
      setModalLoading(true);
      await apolloClient.mutate({
        mutation: UPDATE_ITEM_PRICE,
        variables: { input },
      });
    },
    onSuccess: () => {
      setOpen(false);
      setEditPrice(null);
      setModalLoading(false);
      queryClient.invalidateQueries({ queryKey: ['itemPricesByGroup'] });
      notify('Succès', 'success');
    },
    onError: (err: any) => {
      setModalLoading(false);
      notify((err?.message || 'Erreur') + (err?.stack ? '\n' + err.stack : ''), 'error');
    },
  });

  const deleteItemPriceMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeleteLoadingId(id);
      await apolloClient.mutate({
        mutation: DELETE_ITEM_PRICE,
        variables: { id },
      });
    },
    onSuccess: () => {
      setDeleteLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ['itemPricesByGroup'] });
      notify('Succès', 'success');
    },
    onError: (err: any) => {
      setDeleteLoadingId(null);
      notify((err?.message || 'Erreur') + (err?.stack ? '\n' + err.stack : ''), 'error');
    },
  });

  const { data: _, isLoading } = useQuery<ItemPrice[]>({
    queryKey: ['itemPricesByGroup', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      if (!groupId) return [];
      const result = await apolloClient.query({ query: GET_ITEM_PRICES_BY_GROUP, variables: { groupId }, fetchPolicy: 'network-only' });
      setItemPrices((result.data as any).itemPricesByGroup);
      return (result.data as any).itemPricesByGroup;
    },
  });
  const { data: items = [] } = useQuery<{ id: string; name: string; sellable?: boolean }[]>({
    queryKey: ['items'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_ITEMS });
      return (result.data as any).items;
    },
  });
  const { data: group } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['myGroup'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_PURGATORY });
      setGroupId((result.data as any).myGroup.id);
      return (result.data as any).myGroup;
    },
  });

  const {data: groups = []} = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_GROUPS });
      return (result.data as any).groups;
    },
  });

  const {data: contacts = []} = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_CONTACTS_WITHOUT_GROUP });
      return (result.data as any).contactsWithoutGroup;
    },
});

  const handleEdit = (row: ItemPrice) => setEditPrice(row);
  const handleDelete = (row: ItemPrice) => setConfirmDelete({ open: true, price: row });
  const handleConfirmDelete = () => {
    if (confirmDelete.price) {
      deleteItemPriceMutation.mutate(confirmDelete.price.id);
    }
    setConfirmDelete({ open: false, price: null });
  };
  const handleCancelDelete = () => setConfirmDelete({ open: false, price: null });

  const handleAddItem = () => {
    if (selectedItemId && price) {
      createItemPriceMutation.mutate({
        itemId: selectedItemId,
        groupId: groupId,
        price: parseFloat(price.replace(',', '.')) || 0,
        targetId: selectedTargetId || undefined,
        buying,
      });
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'item',
      headerName: 'Objet',
      flex: 1,
      renderCell: (params: any) => params.row.item?.name || '',
      editable: false,
    },
    {
      field: 'price',
      headerName: 'Prix',
      flex: 1,
      type: 'number',
      editable: true,
      renderCell: (params: any) => formatDollar(params.value),
      valueFormatter: (params: any) => params.value ?? '',
    },
    {
      field: 'buying',
      headerName: 'Rachat',
      flex: 0.5,
      type: 'boolean',
      editable: true,
      renderCell: (params: any) => (
        <Switch checked={!!params.value} color="primary" disabled />
      ),
      renderEditCell: (params: any) => (
        <Switch
          checked={!!params.value}
          color="primary"
          onChange={(_, checked) => {
            params.api.setEditCellValue({ id: params.id, field: 'buying', value: checked }, event);
          }}
        />
      ),
      valueFormatter: (params: any) => params.value ? 'Oui' : 'Non',
    },
    {
      field: 'targetId',
      headerName: 'Contact ou Groupe',
      flex: 1,
      editable: true,
      renderCell: (params: any) => {
        // Affichage simple en lecture
        const target = [...groups, ...contacts].find((i: any) => i.id === params.value);
        return target ? target.name : 'Tous';
      },
      renderEditCell: (params: any) => (
        <Autocomplete
          size="small"
          sx={{ minWidth: 200 }}
          options={[...groups, ...contacts.filter(c => !c.group)]}
          getOptionLabel={(option: any) => option?.name || ''}
          value={[...groups, ...contacts].find((i: any) => i.id === params.value) || null}
          onChange={(_, value) => {
            params.api.setEditCellValue({ id: params.id, field: 'targetId', value: value ? value.id : '' }, event);
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(inputParams) => (
            <TextField {...inputParams} label="Contact ou Groupe" placeholder="Contact ou Groupe..." />
          )}
          clearOnEscape
        />
      ),
      valueFormatter: (params: any) => params?.value ?? '',
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <ActionsMenu row={params.row} onDelete={params.row.onDelete} canEdit={false} />
      ),
    },
  ];


  useEffect(() => {
      // Filtrage par groupe
    const filteredPrices = groupId
      ? (itemPrices || []).filter((row: ItemPrice) => row.group?.id === groupId)
      : (itemPrices || []);
    // Injection des handlers dans chaque ligne
    setRows(filteredPrices.map((row: ItemPrice) => ({ ...row, onEdit: handleEdit, onDelete: handleDelete })));

  }, [itemPrices, groupId]);

  const targets = [
    ...groups.toSorted((a, b) => a.name.localeCompare(b.name)),
    ...contacts.toSorted((a, b) => a.name.localeCompare(b.name)),
  ];

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Prix des objets par groupe
          </Typography>
        </Stack>
      </Box>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Autocomplete
              size="small"
              sx={{ minWidth: 220 }}
              options={items.filter((item: any) => item.sellable !== false)}
              getOptionLabel={(option: any) => option?.name || ''}
              value={items.find((i: any) => i.id === selectedItemId) || null}
              onChange={(_, value) => setSelectedItemId(value ? value.id : '')}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Objet" placeholder="Objet..." />
              )}
              clearOnEscape
            />
            <Autocomplete
              size="small"
              sx={{ minWidth: 220 }}
              options={targets}
              getOptionLabel={(option: any) => option?.name || ''}
              value={targets.find((i: any) => i.id === selectedTargetId) || null}
              onChange={(_, value) => setSelectedTargetId(value ? value.id : '')}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Groupe ou Contact" placeholder="Groupe ou Contact..." />
              )}
              clearOnEscape
            />
          <TextField
            autoFocus
            label="Prix"
            name="price"
            size='small'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={buying}
                onChange={(_, checked) => setBuying(checked)}
                color="primary"
              />
            }
            label="Rachat (buying)"
          />
          <Button variant='outlined' color='primary' startIcon={<AddIcon />} onClick={() => handleAddItem()}>Ajouter</Button>
          </Stack>
          <hr />
          {!isLoading && <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            getRowId={row => row.id}
            loading={isLoading}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            disableRowSelectionOnClick
            sx={{ background: '#181a2a', borderRadius: 2 }}
            processRowUpdate={async (newRow, oldRow) => {
              if (newRow.price !== oldRow.price) {
                await updateItemPriceMutation.mutateAsync({ id: newRow.id, price: newRow.price });
                queryClient.invalidateQueries({ queryKey: ['itemPricesByGroup', groupId] });
              }
              if(newRow.targetId !== oldRow.targetId) {
                await updateItemPriceMutation.mutateAsync({ id: newRow.id, targetId: newRow.targetId });
                queryClient.invalidateQueries({ queryKey: ['itemPricesByGroup', groupId] });
              }
              if(newRow.buying !== oldRow.buying) {
                await updateItemPriceMutation.mutateAsync({ id: newRow.id, buying: newRow.buying });
                queryClient.invalidateQueries({ queryKey: ['itemPricesByGroup', groupId] });
              }
              return { ...newRow };
            }}
          />}
        </Paper>

      <ConfirmModal
        open={confirmDelete.open}
        title="Confirmer la suppression"
        content={confirmDelete.price ? `Supprimer le prix pour l'objet "${confirmDelete.price.item?.name}" et le groupe "${confirmDelete.price.group?.name}" ?` : ''}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={!!deleteLoadingId}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </MainLayout>
  );
};

export default PricesPage;
