import GraphDetailsCard from '@/components/details/GraphDetailsCard';
import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Paper, CircularProgress, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import GroupDetailsCard from '@/components/details/GroupDetailsCard';
import ContactDetailsCard from '@/components/details/ContactDetailsCard';
import TransactionDetailsCard from '@/components/details/TransactionDetailsCard';
import { getApolloClient } from '@/lib/apolloClient';
import { MainLayout } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { GET_TRANSACTIONS_BY_ENTITY, GET_VEHICLE_TRANSACTIONS_BY_TARGET } from '@/lib/queries/transactions';
import { formatDollar, formatDateTime } from '@/lib/utils';
import { GET_CONTACT_BY_ID } from '@/lib/queries/contacts';

const DetailsEntityPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const apolloClient = getApolloClient();


  // Transactions standards
  const { data: standardTransactions = [], isLoading: isLoadingStandard } = useQuery({
    queryKey: ['transactions-by-entity', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_TRANSACTIONS_BY_ENTITY,
        variables: { entityId: id },
      });
      return (data as any).transactionsByEntity;
    },
  });

  // Transactions véhicules filtrées côté backend
  const { data: vehicleTransactions = [], isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['vehicle-transactions-by-target', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_VEHICLE_TRANSACTIONS_BY_TARGET,
        variables: { targetId: id },
      });
      return (data as any).vehicleTransactionsByTarget;
    },
  });

  // Contact (on tente d'afficher le contact si le groupe n'existe pas)
  useQuery({
    queryKey: ['contact-by-id', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_CONTACT_BY_ID, variables: { id } });
      return (data as any).contactById;
    },
    retry: false,
  });



  // Recherche
  const [search, setSearch] = React.useState('');

  // Colonnes fusionnées pour les deux types de transactions
  const columns = [
    { field: 'createdAt', headerName: 'Date', width: 180, renderCell: (params: any) => formatDateTime(params.value) },
    { field: 'amount', headerName: 'Montant', width: 140, renderCell: (params: any) => formatDollar(params.value) },
    { field: 'type', headerName: 'Type de transaction', width: 200 },
  ];

  // Fusionne et mappe les transactions pour le DataGrid
  const rows = React.useMemo(() => {
    const stdRows = standardTransactions.map((t: any) => ({
      id: `std-${t.id}`,
      createdAt: t.createdAt,
      amount: t.totalFinal,
      type: 'Standard',
      searchString: `${formatDateTime(t.createdAt)} ${formatDollar(t.totalFinal)} Standard`,
    }));
    const vehRows = vehicleTransactions
      .filter((t: any) => {
        if (t.targetGroup && t.targetGroup.id === id) return true;
        if (t.targetContact && t.targetContact.id === id) return true;
        return false;
      })
      .map((t: any) => {
        let typeLabel = '';
        if (t.isMoney) {
          typeLabel = t.isDirtyMoney ? 'Véhicule (Argent sale)' : 'Véhicule (Argent propre)';
        } else {
          typeLabel = `Véhicule (${t.item?.name || 'Item'})`;
        }
        return {
          id: `veh-${t.id}`,
          createdAt: t.createdAt,
          amount: t.rewardAmount,
          type: typeLabel,
          searchString: `${formatDateTime(t.createdAt)} ${formatDollar(t.rewardAmount)} ${typeLabel}`,
        };
      });
    let allRows = [...stdRows, ...vehRows];
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      allRows = allRows.filter(r => r.searchString.toLowerCase().includes(s));
    }
    return allRows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [standardTransactions, vehicleTransactions, id, search]);

  // Calcul du montant total et de la dernière transaction
  const allTransactions = React.useMemo(() => [
    ...standardTransactions.map((t: any) => ({
      amount: t.totalFinal,
      createdAt: t.createdAt,
    })),
    ...vehicleTransactions.map((t: any) => ({
      amount: t.rewardAmount,
      createdAt: t.createdAt,
    })),
  ], [standardTransactions, vehicleTransactions]);

    const d = new Date(); // Assuming this is where 'd' is defined
    if (Number.isNaN(d.getTime())) return; // Updated line
  const totalAmount = allTransactions.reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0), 0);
  const lastTransactionAt = allTransactions.length > 0
    ? allTransactions.reduce((latest, t) => (new Date(t.createdAt).getTime() > new Date(latest).getTime() ? t.createdAt : latest), allTransactions[0].createdAt)
    : null;

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Détail de l'entité
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
          <Box>
            {id && <GroupDetailsCard groupId={id as string} />}
            {id && <ContactDetailsCard contactId={id as string} />}
          </Box>
          <TransactionDetailsCard totalAmount={totalAmount} lastTransactionAt={lastTransactionAt} />
        </Box>
        {id && <GraphDetailsCard targetId={id as string} />}
          <TextField
            label="Recherche"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />
        <Paper sx={{ height: 500, mb: 4 }}>
          {(isLoadingStandard || isLoadingVehicle) ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={row => row.id}
              disableRowSelectionOnClick
              sx={{ '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
            />
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default DetailsEntityPage;
