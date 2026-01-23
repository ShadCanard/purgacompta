import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack, TextField, Autocomplete, FormControl, InputLabel, Select, MenuItem, Input } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import MainLayout from '@/components/layout/MainLayout';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { formatDollar } from '@/lib/utils';
import ActionsMenu from '@/components/layout/ActionsMenu';
import { CREATE_ITEM_PRICE, UPDATE_ITEM_PRICE, DELETE_ITEM_PRICE } from '@/lib/mutations';
import { GET_GROUPS, GET_ITEM_PRICES, GET_ITEMS } from '@/lib/queries';

interface Group {
  id: string;
  name: string;
}

type ItemPrice = {
  id: string;
  price: number;
  item: { id: string; name: string };
  group: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
};

  const columns: GridColDef[] = [
    {
      field: 'item',
      headerName: 'Objet',
      flex: 1,
      renderCell: (params: any) => params.row.item?.name || '',
      editable: false,
    },
    {
      field: 'group',
      headerName: 'Groupe',
      flex: 1,
      renderCell: (params: any) => params.row.group?.name || '',
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

const PricesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editPrice, setEditPrice] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const queryClient = useQueryClient();
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; price: any | null }>({ open: false, price: null });
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const createItemPriceMutation = useMutation({
    mutationFn: async (input: { itemId: string; groupId: string; price: number }) => {
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
      queryClient.invalidateQueries({ queryKey: ['itemPrices'] });
    },
    onError: () => {
      setModalLoading(false);
    },
  });

  const updateItemPriceMutation = useMutation({
    mutationFn: async (input: { id: string; price: number }) => {
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
      queryClient.invalidateQueries({ queryKey: ['itemPrices'] });
    },
    onError: () => {
      setModalLoading(false);
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
      queryClient.invalidateQueries({ queryKey: ['itemPrices'] });
    },
    onError: () => {
      setDeleteLoadingId(null);
    },
  });

  const { data: itemPrices, isLoading } = useQuery<ItemPrice[]>({
    queryKey: ['itemPrices'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_ITEM_PRICES, fetchPolicy: 'network-only' });
      return (result.data as any).itemPrices;
    },
  });
  const { data: items = [] } = useQuery<{ id: string; name: string; sellable?: boolean }[]>({
    queryKey: ['items'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_ITEMS });
      return (result.data as any).items;
    },
  });
  const { data: groups = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_GROUPS });
      return (result.data as any).groups;
    },
  });

  const handleEdit = (row: any) => setEditPrice(row);
  const handleDelete = (row: any) => setConfirmDelete({ open: true, price: row });
  const handleConfirmDelete = () => {
    if (confirmDelete.price) {
      deleteItemPriceMutation.mutate(confirmDelete.price.id);
    }
    setConfirmDelete({ open: false, price: null });
  };
  const handleCancelDelete = () => setConfirmDelete({ open: false, price: null });

  const handleAddItem = () => {
    if (selectedGroup && selectedItemId && price) {
      createItemPriceMutation.mutate({
        itemId: selectedItemId,
        groupId: selectedGroup,
        price: parseFloat(price.replace(',', '.')) || 0,
      });
    }
  }

  // Filtrage par groupe
  const filteredPrices = selectedGroup
    ? (itemPrices || []).filter((row: any) => row.group?.id === selectedGroup)
    : (itemPrices || []);
  // Injection des handlers dans chaque ligne
  const rows = filteredPrices.map((row: any) => ({ ...row, onEdit: handleEdit, onDelete: handleDelete }));


  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Prix des objets par groupe
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2} mt={2}>
          <Autocomplete
            size="small"
            sx={{ minWidth: 220 }}
            options={groups}
            getOptionLabel={(option: any) => option?.name || ''}
            value={groups.find((g: any) => g.id === selectedGroup) || undefined}
            onChange={(_, value) => setSelectedGroup(value ? value.id : '')}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Filtrer par groupe" placeholder="Groupe..." />
            )}
            clearOnEscape
            disableClearable
          />
        </Stack>
      </Box>
      {selectedGroup && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Autocomplete
            size="small"
            sx={{ minWidth: 220 }}
            options={items.filter(item => item.sellable !== false)}
            getOptionLabel={(option: any) => option?.name || ''}
            value={items.find((i: any) => i.id === selectedItemId) || null}
            onChange={(_, value) => setSelectedItemId(value ? value.id : '')}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Objet" placeholder="Objet..." />
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
          <Button variant='outlined' color='primary' startIcon={<AddIcon />} onClick={() => handleAddItem()}>Ajouter</Button>
          </Stack>
          <hr />
          <DataGrid
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
              }
              return { ...newRow };
            }}
          />
        </Paper>
      )}

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
