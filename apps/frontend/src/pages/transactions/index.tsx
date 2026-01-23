
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Stack, Button, TextField, MenuItem, Autocomplete, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';
import { Add, Delete } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import apolloClient from '@/lib/apolloClient';
import { formatDollar } from '@/lib/utils';
import { GET_CONTACTS, GET_GROUPS, GET_ITEM_PRICES, GET_ITEM_PRICES_BY_TARGET, GET_ITEMS, GET_PURGATORY } from '@/lib/queries';

const TransactionsPage: React.FC = () => {
    // Récupère tous les prix item/groupe
    const { data: itemPrices = [] } = useQuery({
      queryKey: ['itemPrices'],
      queryFn: async () => {
        const result = await apolloClient.query({ query: GET_ITEM_PRICES });
        return (result.data as any).itemPrices;
      },
    });
  
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  // Pour les transactions sortantes, le groupe source est toujours 'Purgatory'
  const [groupOrContact, setGroupOrContact] = useState<any>(null);
  const [group, setGroup] = useState<any>({ id: 'purgatory', name: 'Purgatory' }); // pour compatibilité OUT
  const [targetGroup, setTargetGroup] = useState<any>(null);
  const [items, setItems] = useState<any[]>([{ item: null, quantity: 1, price: 0 }]);
  const [reduction, setReduction] = useState<number>(0);
  const [purgatoryId, setPurgatoryId] = useState<string>('');

  useEffect(() => {
    // Récupère l'ID du groupe 'Purgatory'
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

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_CONTACTS });
      return (result.data as any).contacts;
    },
  });
  const { data: allItems = [] } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_ITEMS });
      return (result.data as any).items;
    },
  });

  const { data: pricesByTarget = [] } = useQuery({
    queryKey: ['itemPricesByTarget', targetGroup ? targetGroup.id : null],
    queryFn: async () => {
      const variables = targetGroup && targetGroup.id ? { targetId: targetGroup.id } : {};
      const result = await apolloClient.query({ query: GET_ITEM_PRICES_BY_TARGET, variables });
      return (result.data as any).itemPricesByTarget;
    },
  });
  
  // Gestion dynamique des lignes d'objets
  const handleAddItem = () => setItems([...items, { item: null, quantity: 1, price: 0 }]);
  const handleRemoveItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  // Lorsqu'on change d'objet, on auto-remplit le prix si possible
  const handleItemChange = (idx: number, field: string, value: any) => {
    setItems(items.map((row, i) => {
      if (i !== idx) return row;
      if (field === 'item') {
        // Détermine le groupe cible selon le type
        let groupId = null;
        if (type === 'IN') {
            groupId = purgatoryId;
        } else {
          groupId = targetGroup?.id;
        }
        let foundPrice = null;
        if (value && groupId) {
          foundPrice = itemPrices.find((p: any) => p.item.id === value.id && p.group.id === groupId);
        }
        return {
          ...row,
          item: value,
          price: foundPrice ? foundPrice.price : 0,
        };
      } else {
        return { ...row, [field]: value };
      }
    }));
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Saisissez une transaction entrante ou sortante.
        </Typography>
      </Box>
      <Paper sx={{ p: 3, minHeight: 300, maxWidth: 700 }}>
        <Stack spacing={3}>
          <TextField
            select
            label="Type de transaction"
            value={type}
            onChange={e => setType(e.target.value as 'IN' | 'OUT')}
            fullWidth
          >
            <MenuItem value="IN">Entrante (achat/vente par un groupe ou contact)</MenuItem>
            <MenuItem value="OUT">Sortante (achat/vente à un autre groupe)</MenuItem>
          </TextField>

          {type === 'IN' && (
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Autocomplete
                options={[
                  ...groups,
                  ...contacts.filter((c: any) => !c.group)
                ]}
                getOptionLabel={option => `${option.name}` || ''}
                value={groupOrContact}
                onChange={(_, v) => setGroupOrContact(v)}
                renderInput={params => <TextField {...params} label="Groupe ou contact" fullWidth />}
                sx={{ minWidth: 220 }}
              />
            </Stack>
          )}

          {type === 'OUT' && (
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
          )}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Objet</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Prix unitaire</TableCell>
                  <TableCell>Prix total par objet</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ minWidth: 180 }}>
                      <Autocomplete
                        options={
                          type === 'OUT' && targetGroup
                            ? allItems.filter((item: any) =>
                                itemPrices.some(
                                  (p: any) => p.item.id === item.id && p.group.id === targetGroup.id
                                )
                              )
                            : type === 'IN' ? allItems.filter((item: any) =>
                                itemPrices.some(
                                  (p: any) => p.item.id === item.id && p.group.id === purgatoryId
                                )
                              ) : []
                        }
                        getOptionLabel={i => i?.name || ''}
                        value={row.item}
                        onChange={(_, v) => handleItemChange(idx, 'item', v)}
                        renderInput={params => <TextField {...params} label="Objet" />}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={row.quantity}
                        onChange={e => handleItemChange(idx, 'quantity', Math.max(1, Number(e.target.value)))}
                        inputProps={{ min: 1, style: { width: 60 } }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        value={formatDollar(row.price)}
                        onChange={e => handleItemChange(idx, 'price', Number(e.target.value))}
                        inputProps={{ min: 0, step: 0.01, style: { width: 90 } }}
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      {formatDollar((row.quantity || 0) * (row.price || 0))}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRemoveItem(idx)} disabled={items.length === 1}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button startIcon={<Add />} onClick={handleAddItem} sx={{ alignSelf: 'flex-start' }}>Ajouter un objet</Button>
          <Box sx={{ my: 2 }}>
            <hr style={{ border: 0, borderTop: '1px solid #333', margin: 0 }} />
          </Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2, mb: 1 }}>
            <Typography variant="body1" fontWeight={500}>Total Corrigé (Réduction, ...)</Typography>
            <TextField
              size="small"
              type="text"
              value={formatDollar(reduction)}
              onChange={e => {
                // Nettoie la saisie pour ne garder que les chiffres
                const val = Number((e.target.value || '').replace(/[^\d.-]/g, ''));
                setReduction(isNaN(val) ? 0 : val);
              }}
              inputProps={{ min: 0, step: 1, style: { width: 90 } }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Total : {formatDollar(Math.max(0, reduction ? reduction : items.reduce((sum: number, row: any) => sum + (row.quantity || 0) * (row.price || 0), 0)))}
            </Typography>
            <Button variant="contained" color="primary">
              Enregistrer la transaction
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </MainLayout>
  );
};

export default TransactionsPage;
