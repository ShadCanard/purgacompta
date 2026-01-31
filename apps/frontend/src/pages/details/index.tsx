import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getApolloClient } from '@/lib/apolloClient';
import { MainLayout } from '@/components';
import { formatDollar, formatDateTime } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { GET_TRANSACTION_DETAILS_LIST } from '@/lib/queries/transactions';

const DetailsPage: React.FC = () => {
  
  const apolloClient = getApolloClient();

  // Récupération des entités avec montants et dernières transactions
  const { data: detailsDataRaw = [], isLoading: loadingDetails } = useQuery({
    queryKey: ['transaction-details-list'],
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_TRANSACTION_DETAILS_LIST });
      return (data as any).transactionDetailsList;
    },
  });

  // Filtrer pour n'afficher que ceux ayant un montant total non nul
  const detailsData = detailsDataRaw.filter((row: any) => row.totalAmount && row.totalAmount !== 0);

  const detailsColumns: GridColDef<any>[] = [
    { field: 'name', headerName: 'Nom', width: 300 },
    {
      field: 'totalAmount',
      headerName: 'Montant total',
      width: 180,
      type: 'number',
      renderCell: (params: any) => formatDollar(params.value),
    },
    {
      field: 'lastTransactionAt',
      headerName: 'Dernière transaction',
      width: 220,
      renderCell: (params: any) => formatDateTime(params.value),
    },
  ];

  const router = useRouter();

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Suivi des groupes et contacts</Typography>
        <Paper sx={{ height: 400, mb: 4 }}>
          <DataGrid
            rows={detailsData}
            columns={detailsColumns}
            getRowId={row => row.id}
            loading={loadingDetails}
            disableRowSelectionOnClick
            onRowClick={(params) => {
              router.push(`/details/${params.row.id}`);
            }}
            sx={{
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
              },
            }}
          />
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default DetailsPage;
