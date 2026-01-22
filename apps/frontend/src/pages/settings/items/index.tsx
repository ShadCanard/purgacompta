import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import ConfirmModal from '@/components/layout/ConfirmModal';
import AddIcon from '@mui/icons-material/Add';
import CreateUpdateItemModal from '@/components/items/CreateUpdateItemModal';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';

const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      name
      weight
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation UpdateItem($input: UpdateItemInput!) {
    updateItem(input: $input) {
      id
      name
      weight
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;
const GET_ITEMS = gql`
  query Items {
    items {
      id
      name
      weight
    }
  }
`;

const ActionsCell: React.FC<{ row: any; onEdit: (row: any) => void; onDelete: (row: any) => void }> = ({ row, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => { handleClose(); onEdit(row); }}>Modifier</MenuItem>
        <MenuItem onClick={() => { handleClose(); onDelete(row); }}>Supprimer</MenuItem>
      </Menu>
    </>
  );
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nom', flex: 1, minWidth: 180 },
  { field: 'weight', headerName: 'Poids (kg)', flex: 1, minWidth: 120, type: 'number',
    valueFormatter: (params) => params.value?.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  },
  {
    field: 'actions',
    headerName: '',
    width: 60,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams) => (
      <ActionsCell row={params.row} onEdit={params.row.onEdit} onDelete={params.row.onDelete} />
    ),
  },
];

const ItemsSettingsPage: React.FC = () => {

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_ITEMS, fetchPolicy: 'network-only' });
      return result.data.items;
    },
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const createItemMutation = useMutation({
    mutationFn: async (input: { name: string; weight: number }) => {
      setModalLoading(true);
      await apolloClient.mutate({
        mutation: CREATE_ITEM,
        variables: { input },
      });
    },
    onSuccess: () => {
      setOpenModal(false);
      setModalLoading(false);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: () => {
      setModalLoading(false);
    },
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalLoading(false);
  };
  const handleCreateItem = (data: { name: string; weight: number }) => {
    createItemMutation.mutate(data);
  };

  // Gestion des actions Modifier/Supprimer

  const [editItem, setEditItem] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });

  const updateItemMutation = useMutation({
    mutationFn: async (input: { id: string; name: string; weight: number }) => {
      setEditLoading(true);
      await apolloClient.mutate({
        mutation: UPDATE_ITEM,
        variables: { input },
      });
    },
    onSuccess: () => {
      setEditItem(null);
      setEditLoading(false);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: () => {
      setEditLoading(false);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeleteLoadingId(id);
      await apolloClient.mutate({
        mutation: DELETE_ITEM,
        variables: { id },
      });
    },
    onSuccess: () => {
      setDeleteLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: () => {
      setDeleteLoadingId(null);
    },
  });

  const handleEdit = (row: any) => setEditItem(row);
  const handleDelete = (row: any) => {
    setConfirmDelete({ open: true, item: row });
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.item) {
      deleteItemMutation.mutate(confirmDelete.item.id);
    }
    setConfirmDelete({ open: false, item: null });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, item: null });
  };

  // Injection des handlers dans chaque ligne
  const rows = (data || []).map((row: any) => ({ ...row, onEdit: handleEdit, onDelete: handleDelete }));

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Gestion des objets
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenModal}>
            Nouveau
          </Button>
        </Stack>
        <CreateUpdateItemModal
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={handleCreateItem}
          loading={modalLoading}
        />
        <Typography variant="body1" color="text.secondary">
          Ajoutez, modifiez ou supprimez les objets utilisables en jeu. Chaque objet possède un nom et un poids (en kilo, décimal possible).
        </Typography>
      </Box>
      <Paper sx={{ p: 3, minHeight: 300 }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            autoHeight
          />
        </div>
      </Paper>
      {/* Modale édition */}
      <CreateUpdateItemModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSubmit={(data) => {
          if (editItem) {
            updateItemMutation.mutate({ id: editItem.id, ...data });
          }
        }}
        initialData={editItem}
        loading={editLoading}
      />
      {/* Modale de confirmation suppression */}
      <ConfirmModal
        open={confirmDelete.open}
        title="Confirmer la suppression"
        content={confirmDelete.item ? `Supprimer l'objet "${confirmDelete.item.name}" ?` : ''}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={!!deleteLoadingId}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </MainLayout>
  );
};

export default ItemsSettingsPage;
