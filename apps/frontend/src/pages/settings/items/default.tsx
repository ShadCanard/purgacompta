import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useQuery } from '@tanstack/react-query';

const GET_ITEMS = gql`
  query Items {
    items {
      id
      name
      weight
    }
  }
`;

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nom', flex: 1, minWidth: 180 },
  { field: 'weight', headerName: 'Poids (kg)', flex: 1, minWidth: 120, type: 'number',
    valueFormatter: (params) => params.value?.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  },
];

const ItemsSettingsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_ITEMS, fetchPolicy: 'network-only' });
      return result.data.items;
    },
  });

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Gestion des objets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ajoutez, modifiez ou supprimez les objets utilisables en jeu. Chaque objet possède un nom et un poids (en kilo, décimal possible).
        </Typography>
      </Box>
      <Paper sx={{ p: 3, minHeight: 300 }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={data || []}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            autoHeight
          />
        </div>
      </Paper>
    </MainLayout>
  );
};

export default ItemsSettingsPage;
