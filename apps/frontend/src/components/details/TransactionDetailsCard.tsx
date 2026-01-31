import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { formatDollar, formatDateTime } from '@/lib/utils';

interface TransactionDetailsCardProps {
  totalAmount: number;
  lastTransactionAt: string | number | null;
}

function timeAgo(date: string | number | null): string {
  if (!date) return '';
  const now = Date.now();
  const d = typeof date === 'number' ? date : Number(date) || new Date(date).getTime();
  if (!d) return '';
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `Il y a ${diff} seconde${diff > 1 ? 's' : ''}`;
  if (diff < 3600) return `Il y a ${Math.floor(diff/60)} minute${diff >= 120 ? 's' : ''}`;
  if (diff < 86400) return `Il y a ${Math.floor(diff/3600)} heure${diff >= 7200 ? 's' : ''}`;
  if (diff < 604800) return `Il y a ${Math.floor(diff/86400)} jour${diff >= 172800 ? 's' : ''}`;
  if (diff < 2592000) return `Il y a ${Math.floor(diff/604800)} semaine${diff >= 1209600 ? 's' : ''}`;
  return `Il y a ${Math.floor(diff/2592000)} mois`;
}

const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({ totalAmount, lastTransactionAt }) => {
  return (
    <Card sx={{ mb: 3, maxWidth: 350, minWidth: 250 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Détails des transactions</Typography>
        <Box mb={1}>
          <Typography variant="body2" color="text.secondary">Montant total</Typography>
          <Typography variant="h5" fontWeight={700}>{formatDollar(totalAmount)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Dernière transaction</Typography>
          {lastTransactionAt ? (
            <Typography variant="body1">
              {formatDateTime(lastTransactionAt)}{' '}
              <span style={{ color: '#888', fontStyle: 'italic' }}>({timeAgo(lastTransactionAt)})</span>
            </Typography>
          ) : (
            <Typography variant="body1">Aucune</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailsCard;
