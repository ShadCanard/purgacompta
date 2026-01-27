
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';

import HistoryTransactions from '@/components/transactions/HistoryTransactions';
import IncomingTransaction from '@/components/transactions/IncomingTransaction';
import TransactionOutgoing from '@/components/transactions/TransactionOutgoing';


const TransactionsPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0); // 0: Sortante, 1: Entrante, 2: Historique


  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Transactions
        </Typography>
      </Box>
      <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
        <Tab label="Sortante" />
        <Tab label="Entrante" />
        <Tab label="Historique" />
      </Tabs>
      {tabIndex === 0 && (
        <TransactionOutgoing />
      )}
      {tabIndex === 1 && (
        <IncomingTransaction />
      )}
      {tabIndex === 2 && (
          <HistoryTransactions />
      )}
    </MainLayout>
  );
};

export default TransactionsPage;
