import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';

const TransactionsPage: React.FC = () => {
  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Retrouvez ici l'ensemble des transactions financières de l'organisation.
        </Typography>
      </Box>
      <Paper sx={{ p: 3, minHeight: 300 }}>
        <Typography color="text.secondary">Aucune transaction à afficher pour le moment.</Typography>
      </Paper>
    </MainLayout>
  );
};

export default TransactionsPage;
