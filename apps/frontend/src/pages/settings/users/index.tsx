
import React from 'react';
import { MainLayout } from '@/components/layout';
import { Box, Typography, Paper, Avatar, CircularProgress, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import UpdateUserInfoModal from '@/components/users/UpdateUserInfoModal';
import { useQuery } from '@tanstack/react-query';
import { GET_MEMBERS } from '@/lib/queries/users';
import { getApolloClient } from '@/lib/apolloClient';
import { formatDisplayName } from '@/lib/utils';
import { Edit } from '@mui/icons-material';

const USER_ROLES_MAP: Record<string, string> = {
  GUEST: 'Guest',
  MEMBER: 'Member',
  MANAGER: 'Manager',
  ADMIN: 'Admin',
  OWNER: 'Owner',
};

const UsersPage: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const apolloClient = getApolloClient();
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only', });
      console.dir(result);
      return (result.data as any).users;
    },
  });

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar src={params.row.avatar} alt={params.row.username} sx={{ mt: 1 }} />
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'name',
      headerName: 'Nom ingame',
      width: 180,
    },
    {
      field: 'phone',
      headerName: 'Téléphone',
      width: 140,
    },
    {
      field: 'role',
      headerName: 'Rôle',
      width: 120,
      valueGetter: (params: any) => USER_ROLES_MAP[params] || params,
    },
    {
      field: 'username',
      headerName: 'Nom Discord',
      width: 180,
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="text"
          size="small"
          onClick={e => {
            e.stopPropagation();
            setSelectedUser(params.row);
            setModalOpen(true);
          }}
        >
          <Edit />
        </Button>
      ),
    },
  ];

  // Mapping à plat pour DataGrid
  const usersData = Array.isArray(data)
    ? data.map((u: any) => ({
        ...u,
        name: formatDisplayName(u) || '',
        phone: u.data?.phone || '',
        role: u.role,
      }))
    : [];

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
          <>
            <DataGrid
              rows={usersData}
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
            <UpdateUserInfoModal open={modalOpen} onClose={() => setModalOpen(false)} user={selectedUser} />
          </>
        )}
      </Paper>
    </MainLayout>
  );
};

export default UsersPage;
