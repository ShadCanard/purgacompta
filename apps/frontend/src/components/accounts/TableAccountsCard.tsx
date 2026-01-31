import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useAccountHistoriesByUser } from '@/lib/hooks/useUserAccountHistory';
import { formatDateTime, formatDollar } from '@/lib/utils';

interface TableAccountsCardProps {
  userId: string;
}

const columns: GridColDef[] = [
  { field: 'createdAt', headerName: 'Date', width: 180 },
  { field: 'amount', headerName: 'Montant', width: 120 },
  { field: 'notes', headerName: 'Raison', flex: 1 },
];

const TableAccountsCard: React.FC<TableAccountsCardProps> = ({ userId }) => {
  const { data: accountHistories = [], isLoading } = useAccountHistoriesByUser(userId ?? '');

  // Log pour debug : structure réelle des données
  console.log('accountHistories', accountHistories);
  if (accountHistories && accountHistories.length > 0) {
    console.log('accountHistories[0]', JSON.stringify(accountHistories[0], null, 2));
  }

  // Mapping camelCase si besoin (créé createdAt/amount à partir de created_at/amount)
  const rows = (accountHistories || []).map((row: any) => ({
    ...row,
    createdAt: row.createdAt
      ? formatDateTime(/^\d+$/.test(row.createdAt) ? Number(row.createdAt) : row.createdAt)
      : '—',
    amount: row.amount !== undefined && row.amount !== null
      ? formatDollar(row.amount)
      : '—',
  }));

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Historique du compte
        </Typography>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            localeText={{ noRowsLabel: 'Aucune donnée' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TableAccountsCard;
