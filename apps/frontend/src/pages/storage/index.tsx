import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import StorageTable from '@/components/storage/StorageTable';
import { MainLayout } from '@/components/layout';

const StoragePage: React.FC = () => {
  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Stockage
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualisez l’état des stocks par emplacement et le total consolidé.
        </Typography>
      </Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary">
          Nouveau stockage
        </Button>
      </Box>
      <Card>
        <CardContent>
          <StorageTable />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default StoragePage;
