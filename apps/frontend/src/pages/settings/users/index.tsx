import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Box, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowId } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apolloClient from '@/lib/apolloClient';
import { useUser } from '@/providers/UserProvider';
import { GET_MEMBERS } from '@/lib/queries';
import { UPDATE_USER_ROLE, UPDATE_USER_NAME } from '@/lib/mutations';

const USER_ROLES = [
  { value: 'GUEST', label: 'Guest' },
  { value: 'MEMBER', label: 'Member' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OWNER', label: 'Owner' },
];






const UsersPage: React.FC = () => {
  // TanStack Query pour récupérer tous les utilisateurs
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only', });
      return (result.data as any).users;
    },
  });

  // Mutation pour changer le rôle d'un utilisateur
  const { mutate: updateUserRole, isLoading: isUpdatingRole } = useMutation({
    mutationFn: async ({ discordId, role }: { discordId: string; role: string }) => {
      await apolloClient.mutate({ mutation: UPDATE_USER_ROLE, variables: { input: { discordId, role } },});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Mutation pour changer le nom affiché d'un utilisateur
  const { mutate: updateUserName, isLoading: isUpdatingName } = useMutation({
    mutationFn: async ({ discordId, name }: { discordId: string; name: string }) => {
      await apolloClient.mutate({ mutation: UPDATE_USER_NAME, variables: { input: { discordId, name } }, });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });


  // Gestion de l'édition du nom affiché (inline DataGrid)
  const [nameEditRows, setNameEditRows] = useState<{ [id: string]: string }>({});

  // Récupère l'utilisateur connecté
  const { user: currentUser } = useUser();
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
        <Avatar src={params.value} alt={params.row.username} />
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    { field: 'username', headerName: 'Nom Discord', width: 180 },
    {
      field: 'name',
      headerName: 'Nom affiché',
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
                  updateUserName({ discordId: params.row.discordId, name: newName });
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
          <select
            value={user.role}
            disabled={disabled}
            onChange={e => updateUserRole({ discordId: user.discordId, role: e.target.value })}
            style={{ width: '100%', padding: 4, fontSize: 14, borderRadius: 4 }}
          >
            {USER_ROLES.map(role => {
              const isSuperior = currentUser && roleHierarchy[role.value] > roleHierarchy[currentUser.role];
              return (
                <option key={role.value} value={role.value} disabled={isSuperior} style={isSuperior ? { color: '#aaa' } : {}}>
                  {role.label}
                </option>
              );
            })}
          </select>
        );
      },
    },
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
