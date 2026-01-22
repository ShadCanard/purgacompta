import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack, Switch } from '@mui/material';
import ConfirmModal from '@/components/layout/ConfirmModal';
import CreateUpdateGroupModal from '../../../components/groups/CreateUpdateGroupModal';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import MainLayout from '@/components/layout/MainLayout';
import { useUser } from '@/providers/UserProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import GroupActionsMenu from '@/components/groups/GroupActionsMenu';

const GroupsPage: React.FC = () => {
  
  const [open, setOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; group: any | null }>({ open: false, group: null });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const queryClient = useQueryClient();
  const { hasPermission } = useUser();

  const GET_GROUPS = gql`
    query Groups {
      groups {
        id
        name
        tag
        description
        isActive
        createdAt
        updatedAt
        color1
        color2
      }
    }
  `;

  const UPDATE_GROUP_IS_ACTIVE = gql`
    mutation UpdateGroupIsActive($id: ID!, $isActive: Boolean!) {
      updateGroupIsActive(input: { id: $id, isActive: $isActive }) {
        id
        isActive
      }
    }
  `;

  const DELETE_GROUP = gql`
    mutation DeleteGroup($id: ID!) {
      deleteGroup(id: $id)
    }
  `;
  const deleteGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeleteLoadingId(id);
      await apolloClient.mutate({
        mutation: DELETE_GROUP,
        variables: { id },
      });
    },
    onSuccess: () => {
      // Toujours placer les hooks React (useMutation, useQuery, etc.) à l'intérieur du composant fonctionnel !
      const DELETE_GROUP = gql`
        mutation DeleteGroup($id: ID!) {
          deleteGroup(id: $id)
        }
      `;
      const deleteGroupMutation = useMutation({
        mutationFn: async (id: string) => {
          setDeleteLoadingId(id);
          await apolloClient.mutate({
            mutation: DELETE_GROUP,
            variables: { id },
          });
        },
        onSuccess: () => {
          setDeleteLoadingId(null);
          queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
        onError: () => {
          setDeleteLoadingId(null);
        },
      });
      setDeleteLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: () => {
      setDeleteLoadingId(null);
    },
  });

  const columns: GridColDef[] = [
    {
      field: 'colors',
      headerName: 'Couleurs',
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const color1 = params.row.color1 || '#000000';
        const color2 = params.row.color2 || '#000000';
        return (
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <svg width={36} height={36} style={{ display: 'block' }}>
                <defs>
                  <linearGradient id={`split-diag-${params.row.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color1} />
                    <stop offset="49%" stopColor={color1} />
                    <stop offset="51%" stopColor={color2} />
                    <stop offset="100%" stopColor={color2} />
                  </linearGradient>
                </defs>
                <circle cx={18} cy={18} r={16} fill={`url(#split-diag-${params.row.id})`} />
              </svg>
          </Box>
        );
      },
    },
    { field: 'name', headerName: 'Nom', width: 200 },
    { field: 'tag', headerName: 'Tag', width: 100 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'isActive',
      headerName: 'Actif',
      width: 100,
      type: 'boolean',
      editable: true,
      renderCell: (params) => (
        <Switch
          checked={!!params.value}
          disabled
          style={{ pointerEvents: 'none' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <GroupActionsMenu row={params.row} onEdit={params.row.onEdit} onDelete={params.row.onDelete} />
      ),
    },
  ];
  type Group = {
    id: string;
    name: string;
    tag?: string;
    description?: string;
    isActive: boolean;
    color1: string;
    color2: string;
    createdAt: string;
    updatedAt: string;
  };

  const { data, isLoading } = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_GROUPS, fetchPolicy: 'network-only' });
      const data = result.data as { groups?: Group[] };
      return data.groups ?? [];
    },
  });

  const updateGroupIsActiveMutation = useMutation({
    mutationFn: async (input: { id: string; isActive: boolean }) => {
      await apolloClient.mutate({
        mutation: UPDATE_GROUP_IS_ACTIVE,
        variables: input,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });


  const handleProcessRowUpdate = async (newRow: any, oldRow: any) => {
    if (newRow.isActive !== oldRow.isActive) {
      await updateGroupIsActiveMutation.mutateAsync({ id: newRow.id, isActive: newRow.isActive });
    }
    return newRow;
  };


  // Handlers pour actions
  const handleEdit = (row: any) => setEditGroup(row);
  const handleDelete = (row: any) => {
    setConfirmDelete({ open: true, group: row });
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.group) {
      deleteGroupMutation.mutate(confirmDelete.group.id);
    }
    setConfirmDelete({ open: false, group: null });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, group: null });
  };

  // Injection des handlers dans chaque ligne
  const rows = (data || []).map((row: any) => ({ ...row, onEdit: handleEdit, onDelete: handleDelete }));

  return (
    <MainLayout>
      {!hasPermission('MANAGER') ? (
        <Typography color="error">Accès réservé aux managers et plus.</Typography>
      ) : (
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4" fontWeight={700} gutterBottom>Groupes criminels</Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
              Ajouter
            </Button>
          </Stack>
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
              processRowUpdate={handleProcessRowUpdate}
            />
          </Paper>

          <CreateUpdateGroupModal open={open} onClose={handleClose} />
          {/* Modale édition */}
          <CreateUpdateGroupModal
            open={!!editGroup}
            onClose={() => setEditGroup(null)}
            initialData={editGroup}
            // loading={editLoading} // à activer si gestion loading mutation
          />
          {/* Modale de confirmation suppression */}
          <ConfirmModal
            open={confirmDelete.open}
            title="Confirmer la suppression"
            content={confirmDelete.group ? `Supprimer le groupe "${confirmDelete.group.name}" ?` : ''}
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            loading={!!deleteLoadingId}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </Box>
      )}
    </MainLayout>
  );
};

export default GroupsPage;
