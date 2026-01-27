import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Box, Typography, Paper, Avatar, CircularProgress, Autocomplete, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/providers';
import apolloClient from '@/lib/apolloClient';
import { useUser } from '@/providers/UserProvider';
import { GET_MEMBERS } from '@/lib/queries';
import { UPDATE_USER } from '@/lib/mutations';

const USER_ROLES = [
  { value: 'GUEST', label: 'Guest' },
  { value: 'MEMBER', label: 'Member' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OWNER', label: 'Owner' },
];

const UsersPage: React.FC = () => {
  const [nameEditRows, setNameEditRows] = useState<{ [id: string]: string }>({});
  const [phoneEditRows, setPhoneEditRows] = useState<{ [id: string]: string }>({});
  const { user: currentUser } = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only', });
      return (result.data as any).users;
    },
  });
  // Mutation unifiée pour mettre à jour un utilisateur (nom, téléphone, rôle...)
  const { notify } = useSnackbar();
  const { mutate: updateUser, isLoading: isUpdatingUser } = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: any }) => {
      await apolloClient.mutate({ mutation: UPDATE_USER, variables: { id, input } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notify('Succès', 'success');
    },
    onError: (err: any) => {
      notify((err?.message || 'Erreur') + (err?.stack ? '\n' + err.stack : ''), 'error');
    },
  });
  const roleHierarchy: Record<string, number> = {
    GUEST: 0,
    MEMBER: 1,
    MANAGER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  // Colonnes du DataGrid
  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar src={params.value} alt={params.row.username} sx={{mt: 1}} />
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'name',
      headerName: 'Nom ingame',
      width: 180,
      editable: true,
      renderEditCell: (params) => {
        return (
          <input
            type="text"
            value={nameEditRows[params.id as string] ?? params.value ?? ''}
            onChange={e => setNameEditRows({ ...nameEditRows, [params.id as string]: e.target.value })}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const newName = nameEditRows[params.id as string];
                if (newName && newName !== params.value) {
                  updateUser({ id: params.row.id, input: { name: newName } });
                }
              }
            }}
            disabled={isUpdatingName}
            style={{ width: '100%', padding: 4, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' }}
            autoFocus
          />
        );
      },
    },
    {
      field: 'phone',
      headerName: 'Téléphone',
      width: 140,
      editable: true,
      renderEditCell: (params) => {
        return (
          <input
            type="text"
            value={phoneEditRows[params.id as string] ?? params.value ?? ''}
            onChange={e => setPhoneEditRows({ ...phoneEditRows, [params.id as string]: e.target.value })}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const newPhone = phoneEditRows[params.id as string];
                if (newPhone && newPhone !== params.value && newPhone.startsWith('555-')) {
                  updateUser({ id: params.row.id, input: { phone: newPhone } });
                }
              }
            }}
            disabled={isUpdatingPhone}
            style={{ width: '100%', padding: 4, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' }}
            autoFocus
            placeholder="555-XXXX"
          />
        );
      },
    },
    {
      field: 'role',
      headerName: 'Rôle',
      width: 160,
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        const user = params.row;
        const disabled =
          isUpdatingRole ||
          !currentUser ||
          roleHierarchy[currentUser.role] <= roleHierarchy[user.role];
        return (
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', height: '100%' }}>
            <Autocomplete
              options={USER_ROLES}
              getOptionLabel={option => option.label}
              value={USER_ROLES.find(r => r.value === user.role) || null}
              onChange={(_, value) => {
                if (value && !disabled) {
                  updateUser({ id: user.id, input: { role: value.value } });
                }
              }}
              size='small'
              disableClearable
              disabled={disabled}
              renderInput={params => (
                <TextField {...params} label="Rôle" placeholder="Rôle..." />
              )}
              sx={{ width: '100%', mt: 2  }}
            />
          </Box>
        );
      },
    },
    { field: 'username', headerName: 'Nom Discord', width: 180 },
  ];

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Gestion des utilisateurs & permissions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Modifier les rôles et le nom affiché des membres.
        </Typography>
      </Box>
      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Erreur lors du chargement des utilisateurs.</Typography>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={row => row.id}
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{ minHeight: 400, background: 'transparent' }}
            disableColumnMenu
            hideFooterSelectedRowCount
            localeText={{ noRowsLabel: 'Aucun utilisateur.' }}
          />
        )}
      </Paper>
    </MainLayout>
  );
};

export default UsersPage;
