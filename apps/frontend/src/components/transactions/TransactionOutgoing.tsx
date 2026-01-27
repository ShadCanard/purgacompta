import React, { useEffect, useState } from 'react';
import {
    Paper, Stack, Button, TextField, Autocomplete, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSnackbar } from '@/providers';
import apolloClient from '@/lib/apolloClient';
import { formatDollar } from '@/lib/utils';
import { CREATE_TRANSACTION } from '@/lib/mutations';
import {
    GET_GROUPS,
    GET_ITEM_PRICES,
    GET_ITEMS, GET_PURGATORY
} from '@/lib/queries';

const TransactionOutgoing: React.FC = () => {
  const { notify } = useSnackbar();
  const { mutate: saveTransaction, status: savingTransactionStatus } = useMutation({
    mutationFn: async (input: any) => {
      const result = await apolloClient.mutate({
        mutation: CREATE_TRANSACTION,
        variables: { input },
      });
      return (result.data as any)?.createTransaction;
    },
    onSuccess: () => {
      notify('Succès', 'success');
    },
    onError: (err: any) => {
      notify((err?.message || 'Erreur') + (err?.stack ? '\n' + err.stack : ''), 'error');
    },
  });

  const { data: itemPrices = [] } = useQuery({
    queryKey: ['itemPrices'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_ITEM_PRICES });
      return (result.data as any).itemPrices;
    },
  });

  const [targetGroup, setTargetGroup] = useState<any>(null);
  const [itemsOut, setItemsOut] = useState<any[]>([{ item: null, quantity: 1, price: 0 }]);
  const [reductionOut, setReductionOut] = useState<number>(0);
  const [purgatoryId, setPurgatoryId] = useState<string>('');

  useEffect(() => {
    apolloClient.query({ query: GET_PURGATORY }).then(result => {
      const myGroup = (result.data as any).myGroup;
      setPurgatoryId(myGroup.id);
    });
  }, []);

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_GROUPS });
      return (result.data as any).groups;
    },
  });

  const { data: allItems = [] } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_ITEMS });
      return (result.data as any).items;
    },
  });

  // Gestion dynamique des lignes d'objets pour Sortante
  const handleAddItemOut = () => setItemsOut([...itemsOut, { item: null, quantity: 1, price: 0 }]);
  const handleRemoveItemOut = (idx: number) => setItemsOut(itemsOut.filter((_, i) => i !== idx));
  const handleItemChangeOut = (idx: number, field: string, value: any) => {
    setItemsOut(itemsOut.map((row, i) => {
      if (i !== idx) return row;
      if (field === 'item') {
        let groupId = targetGroup?.id;
        let foundPrice = null;
        if (value && groupId) {
          foundPrice = itemPrices.find((p: any) => p.item.id === value.id && p.group.id === groupId);
        }
        return {
          ...row,
          item: value,
          price: foundPrice ? foundPrice.price : 0,
          buying: foundPrice ? foundPrice.buying : false,
        };
      } else {
        return { ...row, [field]: value };
      }
    }));
  };

  return (
    <Paper sx={{ p: 3, minHeight: 300 }}>
      <Stack spacing={3}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Autocomplete
            options={groups.filter((g: any) => g.name !== 'Purgatory')}
            getOptionLabel={g => g?.name || ''}
            value={targetGroup}
            onChange={(_, v) => setTargetGroup(v)}
            renderInput={params => <TextField {...params} label="Groupe" fullWidth />}
            sx={{ minWidth: 220 }}
          />
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '100%' }}>Objet</TableCell>
                <TableCell sx={{ minWidth: 80, maxWidth: 100, width: 100 }}>Quantité</TableCell>
                <TableCell sx={{ minWidth: 120, maxWidth: 140, width: 140 }}>Prix unitaire</TableCell>
                <TableCell sx={{ minWidth: 140, maxWidth: 160, width: 160 }}>Prix total par objet</TableCell>
                <TableCell sx={{ minWidth: 40, maxWidth: 60, width: 60 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsOut.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ minWidth: 180 }}>
                    <Autocomplete
                      options={targetGroup
                        ? allItems.filter((item: any) =>
                            itemPrices.some(
                              (p: any) => p.item.id === item.id && p.group.id === targetGroup.id
                            )
                          )
                        : []}
                      getOptionLabel={i => i?.name || ''}
                      value={row.item}
                      onChange={(_, v) => handleItemChangeOut(idx, 'item', v)}
                      renderInput={params => <TextField {...params} label="Objet" />}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.quantity}
                      onChange={e => handleItemChangeOut(idx, 'quantity', Math.max(0, Number(e.target.value)))}
                      inputProps={{ min: 0, style: { width: 60 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      value={formatDollar(row.price)}
                      onChange={e => handleItemChangeOut(idx, 'price', Number(e.target.value))}
                      inputProps={{ min: 0, step: 0.01, style: { width: 90 } }}
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    {formatDollar((row.quantity || 0) * (row.price || 0))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemoveItemOut(idx)} disabled={itemsOut.length === 1}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button startIcon={<Add />} onClick={handleAddItemOut} sx={{ alignSelf: 'flex-start' }}>Ajouter un objet</Button>
        <Box sx={{ my: 2 }}>
          <hr style={{ border: 0, borderTop: '1px solid #333', margin: 0 }} />
        </Box>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body1" fontWeight={500}>Total Corrigé (Réduction, ...)</Typography>
          <TextField
            size="small"
            type="text"
            value={formatDollar(reductionOut)}
            onChange={e => {
              const val = Number((e.target.value || '').replace(/[^\d.-]/g, ''));
              setReductionOut(isNaN(val) ? 0 : val);
            }}
            inputProps={{ min: 0, step: 1, style: { width: 90 } }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Total : {formatDollar(Math.max(0, reductionOut ? reductionOut : itemsOut.reduce((sum: number, row: any) => sum + (row.quantity || 0) * (row.price || 0), 0)))}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!targetGroup) return alert('Sélectionnez un groupe');
              const input = {
                sourceId: targetGroup?.id,
                targetId: purgatoryId,
                blanchimentPercent: 0,
                amountToBring: 0,
                blanchimentAmount: 0,
                totalFinal: Math.max(0, reductionOut ? reductionOut : itemsOut.reduce((sum: number, row: any) => sum + (row.quantity || 0) * (row.price || 0), 0)),
                lines: itemsOut.filter(row => row.item && row.quantity > 0).map(row => ({
                  itemId: row.item.id,
                  quantity: row.quantity,
                  unitPrice: row.price || 0,
                })),
              };
              saveTransaction(input);
            }}
            disabled={savingTransactionStatus === 'pending'}
          >
            {savingTransactionStatus === 'pending' ? 'Enregistrement...' : 'Enregistrer la transaction'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TransactionOutgoing;
