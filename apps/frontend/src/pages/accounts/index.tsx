import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { useAccountHistories } from '@/lib/hooks/useUserAccountHistory';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, Paper, CircularProgress, Avatar, Button } from '@mui/material';
import UserAccountUpdateModal from '@/components/accounts/UserAccountUpdateModal';
import { useUser } from '@/providers/UserProvider';
import { formatDollar, formatFullName, formatDateTime } from '@/lib/utils';
import { useSubscription } from '@/lib/useSubscription';
import { ACCOUNT_UPDATED } from '@/lib/subscriptions/accounts';
import { useQueryClient } from '@tanstack/react-query';

const AccountsPage: React.FC = () => {

  const { data: accountsData = [], isLoading } = useAccountHistories();
  const queryClient = useQueryClient();
  const accountUpdated = useSubscription(ACCOUNT_UPDATED);

  useEffect(() => {
    if (accountUpdated) {
      queryClient.invalidateQueries({ queryKey: ['user-account-histories'] });
    } 
  }, [accountUpdated, queryClient]);

  // Ne garder que la dernière entrée (createdAt la plus récente) pour chaque userId
  const latestByUser = React.useMemo(() => {
    const map = new Map<string, typeof accountsData[0]>();
    accountsData.forEach(entry => {
      const key = entry.userId;
      if (!map.has(key) || new Date(entry.createdAt) > new Date(map.get(key)!.createdAt)) {
        map.set(key, entry);
      }
    });
    // Aplatir chaque ligne pour la DataGrid
    return Array.from(map.values()).map(row => ({
      ...row,
      userAlias: row.user?.data?.alias ?? '',
      userFullName: row.user ? formatFullName(row.user) : '',
      userAvatar: row.user?.avatar ?? '',
      userUsername: row.user?.username ?? '',
    }));
  }, [accountsData]);

  const columns: GridColDef<any>[] = [
    {
      field: 'userAvatar',
      headerName: 'Avatar',
      width: 100,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <Avatar
          src={params.row.userAvatar || undefined}
          alt={params.row.userFullName}
          sx={{ mt: 0.5 }}
        >
          {params.row.userUsername?.[0]?.toUpperCase() || '?'}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'userFullName',
      headerName: 'Utilisateur',
      width: 200,
    },
    { field: 'amount', headerName: 'Montant', width: 120, type: 'number', renderCell: (params: any) => formatDollar(params.value) },
    { field: 'createdAt', headerName: 'Date (dernière MàJ)', width: 180, renderCell: (params: any) => formatDateTime(params.value) },
    { field: 'notes', headerName: 'Notes (dernière MàJ)', width: 300 },
  ];

  const [modalOpen, setModalOpen] = React.useState(false);
  const { user } = useUser();
  const router = useRouter();

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Historique des comptes utilisateurs</Typography>
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => setModalOpen(true)}>
          Mettre à jour mon compte
        </Button>
        <Paper sx={{ height: 500, mb: 4 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={latestByUser}
              columns={columns}
              getRowId={row => row.id}
              disableRowSelectionOnClick
              sx={{ '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
              onRowClick={(params) => {
                router.push(`/accounts/${params.row.userId}`);
              }}
            />
          )}
        </Paper>
        <UserAccountUpdateModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Box>
    </MainLayout>
  );
};

export default AccountsPage;
