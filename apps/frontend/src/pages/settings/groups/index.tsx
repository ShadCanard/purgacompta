import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import CreateGroupModal from '../../../components/groups/CreateGroupModal';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import MainLayout from '@/components/layout/MainLayout';
import { useUser } from '@/providers/UserProvider';

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

import { useMutation, useQueryClient } from '@tanstack/react-query';

const columns: GridColDef[] = [
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
      <input
        type="checkbox"
        checked={!!params.value}
        disabled
        style={{ pointerEvents: 'none' }}
      />
    ),
  },
];



const GroupsPage: React.FC = () => {
  const { hasPermission } = useUser();
  const queryClient = useQueryClient();
  type Group = {
    id: string;
    name: string;
    tag?: string;
    description?: string;
    isActive: boolean;
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleProcessRowUpdate = async (newRow: any, oldRow: any) => {
    if (newRow.isActive !== oldRow.isActive) {
      await updateGroupIsActiveMutation.mutateAsync({ id: newRow.id, isActive: newRow.isActive });
    }
    return newRow;
  };

  return (
    <MainLayout>
      {!hasPermission('MANAGER') ? (
        <Typography color="error">Accès réservé aux managers et plus.</Typography>
      ) : (
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Groupes criminels</Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} size="small" onClick={handleOpen}>
              Ajouter
            </Button>
          </Stack>
          <Paper sx={{ p: 2, mb: 2 }}>
            <DataGrid
              autoHeight
              rows={data || []}
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

          <CreateGroupModal open={open} onClose={handleClose} />
        </Box>
      )}
    </MainLayout>
  );
};

export default GroupsPage;
