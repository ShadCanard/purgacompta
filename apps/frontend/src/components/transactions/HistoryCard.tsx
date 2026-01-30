import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmModal from '../layout/ConfirmModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/lib/useSnackbar';
import { DELETE_TRANSACTION } from '@/lib/mutations/transactions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatDollar } from '@/lib/utils';
import { getApolloClient } from '@/lib/apolloClient';

export interface TransactionLine {
  id: string;
  item: { id: string; name: string };
  quantity: number;
  unitPrice: number;
}

export interface Transaction {
  id: string;
  sourceGroup?: { id: string; name: string } | null;
  targetGroup?: { id: string; name: string } | null;
  targetContact?: { id: string; name: string } | null;
  blanchimentPercent?: number;
  amountToBring?: number;
  blanchimentAmount?: number;
  totalFinal?: number;
  createdAt: string;
  user?: { id: string; name: string };
  lines: TransactionLine[];
}

interface HistoryCardProps {
  transaction: Transaction;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ transaction }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const { notify } = useSnackbar()!;
  const queryClient = useQueryClient();
  const apolloClient = getApolloClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apolloClient.mutate({
        mutation: DELETE_TRANSACTION,
        variables: { id },
      });
    },
    onSuccess: () => {
      notify('Transaction supprimée',"success");
      queryClient.invalidateQueries();
    },
    onError: (err: any) => {
      notify('Erreur lors de la suppression : ' + (err?.message || err), "error");
    },
  });

  return (
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" color="text.secondary">
          {new Date(transaction.createdAt).toLocaleString('fr-FR')}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Par : {transaction.user?.name || 'Inconnu'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} mb={1}>
          <Typography variant="body1">
            <b>Source :</b> {transaction.sourceGroup?.name || '-'}
          </Typography>
          <Typography variant="body1">
            <b>Cible :</b> {transaction.targetGroup?.name || transaction.targetContact?.name || '-'}
          </Typography>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Objet</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Prix unitaire</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transaction.lines.map(line => (
                <TableRow key={line.id}>
                  <TableCell>{line.item?.name || '-'}</TableCell>
                  <TableCell>{line.quantity}</TableCell>
                  <TableCell>{formatDollar(line.unitPrice)}</TableCell>
                  <TableCell>{formatDollar(line.unitPrice * line.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2}>
          <Typography variant="body2">
            <b>Blanchiment :</b> {transaction.blanchimentPercent ? `${transaction.blanchimentPercent}%` : '-'}
          </Typography>
          <Typography variant="body2">
            <b>À apporter :</b> {formatDollar(transaction.amountToBring || 0)}
          </Typography>
          <Typography variant="body2">
            <b>Montant blanchi :</b> {formatDollar(transaction.blanchimentAmount || 0)}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            <b>Total final :</b> {formatDollar(transaction.totalFinal || 0)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
          <IconButton color="error" aria-label="Supprimer la transaction" onClick={() => setOpenConfirm(true)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        <ConfirmModal
          open={openConfirm}
          title="Supprimer la transaction ?"
          content="Cette action est irréversible. Confirmer la suppression de cette transaction ?"
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(transaction.id)}
          onCancel={() => setOpenConfirm(false)}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default HistoryCard;
