import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import GroupDetailsCard from '@/components/details/GroupDetailsCard';
import ContactDetailsCard from '@/components/details/ContactDetailsCard';
import { getApolloClient } from '@/lib/apolloClient';
import { MainLayout } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { GET_TRANSACTIONS_BY_ENTITY, GET_VEHICLE_TRANSACTION } from '@/lib/queries/transactions';
import { formatDollar, formatDateTime } from '@/lib/utils';

const GET_CONTACT = `
  query ContactById($id: ID!) {
    contactById(id: $id) {
      id
      name
      phone
    }
  }
`;

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

  // Transactions véhicules
  const { data: vehicleTransactions = [], isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['vehicle-transactions-by-entity', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_VEHICLE_TRANSACTION,
        variables: { id },
      });
      // Peut être un tableau ou un objet unique selon l'API, on normalise
      const tx = (data as any).vehicleTransactions || (data as any).vehicleTransaction;
      if (!tx) return [];
      return Array.isArray(tx) ? tx : [tx];
    },
  });

  // Contact (on tente d'afficher le contact si le groupe n'existe pas)
  useQuery({
    queryKey: ['contact-by-id', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_CONTACT, variables: { id } });
      return (data as any).contactById;
    },
    retry: false,
  });

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
    }));
    const vehRows = vehicleTransactions.map((t: any) => {
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
      };
    });
    return [...stdRows, ...vehRows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [standardTransactions, vehicleTransactions]);

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Détail de l'entité
        </Typography>
        {id && <GroupDetailsCard groupId={id as string} />}
        {id && <ContactDetailsCard contactId={id as string} />}
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
