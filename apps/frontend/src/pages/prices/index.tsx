import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import MainLayout from '@/components/layout/MainLayout';
import CreateUpdateItemPriceModal from '@/components/prices/CreateUpdateItemPriceModal';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { formatDollar } from '@/lib/utils';
import ActionsMenu from '@/components/layout/ActionsMenu';
const DELETE_ITEM_PRICE = gql`
  mutation DeleteItemPrice($id: ID!) {
    deleteItemPrice(id: $id)
  }
`;

const CREATE_ITEM_PRICE = gql`
  mutation CreateItemPrice($input: CreateItemPriceInput!) {
    createItemPrice(input: $input) {
      id
      price
      item { id name }
      group { id name }
      createdAt
      updatedAt
    }
  }
`;

const GET_ITEMS = gql`
  query Items {
    items { id name }
  }
`;

const GET_GROUPS = gql`
  query Groups {
    groups { id name }
  }
`;

const GET_ITEM_PRICES = gql`
  query ItemPrices {
    itemPrices {
      id
      price
      item { id name }
      group { id name }
      createdAt
      updatedAt
    }
  }
`;

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
    },
    {
      field: 'group',
      headerName: 'Groupe',
      flex: 1,
      renderCell: (params: any) => params.row.group?.name || '',
    },
    {
      field: 'price',
      headerName: 'Prix',
      flex: 1,
      type: 'number',
      renderCell: (params: any) => formatDollar(params.row.price),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <ActionsMenu row={params.row} onEdit={params.row.onEdit} onDelete={params.row.onDelete} />
      ),
    },
  ];

const UPDATE_ITEM_PRICE = gql`
  mutation UpdateItemPrice($input: UpdateItemPriceInput!) {
    updateItemPrice(input: $input) {
      id
      price
      item { id name }
      group { id name }
      createdAt
      updatedAt
    }
  }
`;

const PricesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editPrice, setEditPrice] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const queryClient = useQueryClient();
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; price: any | null }>({ open: false, price: null });


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
  const { data: items = [] } = useQuery<{ id: string; name: string }[]>({
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

  // Injection des handlers dans chaque ligne
  const rows = (itemPrices || []).map((row: any) => ({ ...row, onEdit: handleEdit, onDelete: handleDelete }));


  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Prix des objets par groupe
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} size="small" onClick={() => setOpen(true)}>
            Nouveau
          </Button>
        </Stack>
      </Box>
      <Paper sx={{ p: 2, mb: 2 }}>
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
        />
      </Paper>

      <CreateUpdateItemPriceModal
        open={open || !!editPrice}
        onClose={() => { setOpen(false); setEditPrice(null); setModalLoading(false); }}
        onSubmit={data => {
          if (editPrice && editPrice.id) {
            updateItemPriceMutation.mutate({ id: editPrice.id, price: data.price });
          } else {
            createItemPriceMutation.mutate(data);
          }
        }}
        loading={modalLoading}
        items={items}
        groups={groups}
        initialData={editPrice ? {
          itemId: editPrice.item?.id,
          groupId: editPrice.group?.id,
          price: editPrice.price,
        } : undefined}
      />
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
