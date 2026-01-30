import React from 'react';
import {
  Stack,
  Paper,
  Autocomplete,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Typography,
  InputAdornment
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { formatDollar } from '@/lib/utils';
import CreateUpdateContactModal from '@/components/contacts/CreateUpdateContactModal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSnackbar } from '@/providers';
import { CREATE_TRANSACTION } from '@/lib/mutations/transactions';
import {
  GET_CONTACTS_OR_GROUPS_TRANSACTION, GET_ITEM_PRICES_BY_TARGET
} from '@/lib/queries/transactions';
import { GET_PURGATORY } from '@/lib/queries/groups';
import { getApolloClient } from '@/lib/apolloClient';

const IncomingTransaction: React.FC = () => {

    
    const [groupOrContact, setGroupOrContact] = React.useState<any>(null);
    const [loadingItemsIn, setLoadingItemsIn] = React.useState(false);
    const [itemsIn, setItemsIn] = React.useState<any[]>([{ item: null, quantity: 1, price: 0, buying: false }]);
    const [purgatoryId, setPurgatoryId] = React.useState<string>('');
    const [blanchimentForced, setBlanchimentForced] = React.useState(false);
    const [useBlanchiment, setUseBlanchiment] = React.useState(false);
    const [blanchimentPercent, setBlanchimentPercent] = React.useState<number>(60);
    const [extraBlanchiment, setExtraBlanchiment] = React.useState(0);
    const [reductionIn, setReductionIn] = React.useState<number>(0);
    const { notify } = useSnackbar()!;


  // Queries
  const { data: contactsOrGroups = { groups: [], contactsWithoutGroup: [] }, refetch: refetchContactsOrGroups } = useQuery({
    queryKey: ['contactsOrGroupsTransaction'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_CONTACTS_OR_GROUPS_TRANSACTION });
      return (result.data as any);
    },
  });

  // Modale création contact
  const [openCreateContact, setOpenCreateContact] = React.useState(false);
  const apolloClient = getApolloClient();

  // Rafraîchit la liste après ajout d'un contact
  React.useEffect(() => {
    if (!openCreateContact) {
      refetchContactsOrGroups();
    }
  }, [openCreateContact]);
  // Récupère les prix d'items filtrés par groupe/contact sélectionné
  const { data: itemPricesByTarget = [] } = useQuery({
    queryKey: ['itemPricesByTarget', groupOrContact ? groupOrContact.id : null],
    queryFn: async () => {
      if (!groupOrContact || !groupOrContact.id) return [];
      const result = await apolloClient.query({ query: GET_ITEM_PRICES_BY_TARGET, variables: { targetId: groupOrContact.id } });
      return (result.data as any).itemPricesByTarget;
    },
    enabled: !!groupOrContact && !!groupOrContact.id,
  });

  React.useEffect(() => {
    apolloClient.query({ query: GET_PURGATORY }).then((result: { data: any; }) => {
      const myGroup = (result.data as any).myGroup;
      setPurgatoryId(myGroup.id);
    });
  }, []);

  // Gestion dynamique des lignes d'objets pour Entrante
  const handleAddItemIn = () => setItemsIn([...itemsIn, { item: null, quantity: 1, price: 0, buying: false }]);
  const handleRemoveItemIn = (idx: number) => setItemsIn(itemsIn.filter((_, i) => i !== idx));
  const handleItemChangeIn = (idx: number, field: string, value: any) => {
    setItemsIn(itemsIn.map((row, i) => {
      if (i !== idx) return row;
      if (field === 'item') {
        let foundPrice = null;
        if (value) {
          foundPrice = itemPricesByTarget.find((p: any) => p.item.id === value.id);
        }
        // On suppose que le champ buying est déterminé par le prix (si buying existe déjà, on le garde)
        return {
          ...row,
          item: value,
          price: foundPrice ? foundPrice.price : 0,
          buying: foundPrice ? !!foundPrice.buying : false,
        };
      } else {
        return { ...row, [field]: value };
      }
    }));
  };

  // Mutation pour enregistrer la transaction (exemple, à adapter selon besoin)
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

  return (
    <Paper sx={{ p: 3, minHeight: 300 }}>
      <Stack spacing={3}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Autocomplete
            options={[
              ...contactsOrGroups.groups,
              ...[...contactsOrGroups.contactsWithoutGroup].sort((a, b) => a.name.localeCompare(b.name))
            ]}
            getOptionLabel={option => `${option.name}` || ''}
            value={groupOrContact}
            onChange={async (_, v) => setGroupOrContact(v)}
            renderInput={params => <TextField {...params} label="Groupe ou contact" fullWidth />}
            sx={{ minWidth: 220, flex: 1 }}
            loading={loadingItemsIn}
          />
          <IconButton aria-label="Nouveau contact" color="primary" sx={{ ml: 1 }} onClick={() => setOpenCreateContact(true)}>
            <Add />
          </IconButton>
        </Box>
      </Stack>
      {/* Modale création contact */}
      <CreateUpdateContactModal
        open={openCreateContact}
        onClose={() => setOpenCreateContact(false)}
        initialData={null}
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Objet</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Prix unitaire</TableCell>
              <TableCell>Prix total par objet</TableCell>
              {/* <TableCell>Type</TableCell> */}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsIn.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ width: '100%' }}>
                  <Autocomplete
                    options={itemPricesByTarget.map((p: any) => p.item)}
                    getOptionLabel={i => i?.name || ''}
                    value={row.item}
                    onChange={(_, v) => handleItemChangeIn(idx, 'item', v)}
                    renderInput={params => <TextField {...params} label="Objet" />}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={row.quantity}
                    onChange={e => {
                      const val = Number((e.target.value || '').replace(/[^\d.-]/g, ''));
                      handleItemChangeIn(idx, 'quantity', isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', style: { width: 60 } }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={row.overridePrice !== undefined && row.overridePrice !== null ? formatDollar(row.overridePrice) : ''}
                    onChange={e => {
                      const val = Number((e.target.value || '').replace(/[^\d.-]/g, ''));
                      handleItemChangeIn(idx, 'overridePrice', e.target.value === '' ? null : (isNaN(val) ? null : val));
                    }}
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*', style: { width: 90 } }}
                    placeholder={(() => {
                      const foundPrice = row.item ? itemPricesByTarget.find((p: any) => p.item.id === row.item.id) : null;
                      return foundPrice ? formatDollar(foundPrice.price) : '';
                    })()}
                  />
                </TableCell>
                <TableCell sx={{minWidth:150}}>
                  {formatDollar((row.quantity || 0) * (
                    row.overridePrice !== undefined && row.overridePrice !== null
                      ? row.overridePrice
                      : (row.item ? (itemPricesByTarget.find((p: any) => p.item.id === row.item.id)?.price || 0) : 0)
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveItemIn(idx)} disabled={itemsIn.length === 1}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button startIcon={<Add />} onClick={handleAddItemIn} sx={{ alignSelf: 'flex-start' }}>Ajouter un objet</Button>
      <Box sx={{ my: 2 }}>
        <hr style={{ border: 0, borderTop: '1px solid #333', margin: 0 }} />
      </Box>
      {/* Totaux séparés rachat/vente + blanchiment */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2, mb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useBlanchiment}
              onChange={(_, checked) => {
                if (!blanchimentForced) setUseBlanchiment(checked);
              }}
              color="primary"
              disabled={blanchimentForced}
            />
          }
          label={`Blanchiment`}
        />
        <TextField
          size="small"
          type="text"
          value={blanchimentPercent}
          onChange={e => {
            let val = Number((e.target.value || '').replace(/[^\d.]/g, ''));
            if (isNaN(val) || val < 0) val = 0;
            if (val > 100) val = 100;
            setBlanchimentPercent(val);
          }}
          inputProps={{ min: 0, max: 100, step: 1, style: { width: 60 }, inputMode: 'numeric', pattern: '[0-9]*' }}
          sx={{ maxWidth: 90 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        <TextField
          size="medium"
          type="text"
          value={extraBlanchiment ? formatDollar(extraBlanchiment) : ''}
          onChange={e => {
            const val = Number((e.target.value || '').replace(/[^\d.-]/g, ''));
            setExtraBlanchiment(isNaN(val) ? 0 : val);
          }}
          inputProps={{ min: 0, step: 1, style: { width: 90 } }}
          placeholder="+ somme à blanchir"
        />
        <Typography variant="body1">
          À apporter : {formatDollar(((blanchimentPercent || 60) / 100) * (extraBlanchiment || 0))}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1, mb: 1 }}>
        <Typography variant="body1" fontWeight={500}>Vente : </Typography>
        <Typography variant="body1">
          {formatDollar(itemsIn.filter(row => row.buying === false).reduce((sum: number, row: any) => sum + (row.quantity || 0) * (row.overridePrice !== undefined && row.overridePrice !== null ? row.overridePrice : (row.item ? (itemPricesByTarget.find((p: any) => p.item.id === row.item.id)?.price || 0) : 0)), 0))}
        </Typography>
        <Typography variant="body1" fontWeight={500} sx={{ ml: 4 }}>Achat : </Typography>
        <Typography variant="body1">
          {formatDollar(itemsIn.filter(row => row.buying === true).reduce((sum: number, row: any) => sum + (row.quantity || 0) * (row.overridePrice !== undefined && row.overridePrice !== null ? row.overridePrice : (row.item ? (itemPricesByTarget.find((p: any) => p.item.id === row.item.id)?.price || 0) : 0)), 0))}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1, mb: 1 }}>
        <Typography variant="body1" fontWeight={500}>Total Corrigé (Réduction, ...)</Typography>
        <TextField
          size="small"
          type="text"
          value={formatDollar(reductionIn)}
          onChange={e => {
            const val = Number((e.target.value || '').replace(/[^\d.-]/g, ''));
            setReductionIn(isNaN(val) ? 0 : val);
          }}
          inputProps={{ min: 0, step: 1, style: { width: 90 } }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {(() => {
            // Calculs corrigés pour utiliser buying et le bon prix
            let totalRecup = itemsIn.filter(row => row.buying === false).reduce((sum: number, row: any) => sum + (row.quantity || 0) * (row.overridePrice !== undefined && row.overridePrice !== null ? row.overridePrice : (row.item ? (itemPricesByTarget.find((p: any) => p.item.id === row.item.id)?.price || 0) : 0)), 0);
            let totalApport = itemsIn.filter(row => row.buying === true).reduce((sum: number, row: any) => sum + (row.quantity || 0) * (row.overridePrice !== undefined && row.overridePrice !== null ? row.overridePrice : (row.item ? (itemPricesByTarget.find((p: any) => p.item.id === row.item.id)?.price || 0) : 0)), 0);
            // Si blanchiment activé, appliquer 60% sur les sous-totaux objets
            const percent = (blanchimentPercent || 60) / 100;
            if (useBlanchiment) {
              totalRecup = percent * totalRecup;
              totalApport = percent * totalApport;
            }
            const blanchiment = useBlanchiment ? percent * (extraBlanchiment || 0) : 0;
            const total = totalRecup - (totalApport + blanchiment);
            if (total >= 0) {
              return <>Total (à récupérer) : {formatDollar(total)}</>;
            } else {
              return <>Total (à apporter) : {formatDollar(Math.abs(total))}</>;
            }
          })()}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Construction de l'input pour la mutation
            const lines = itemsIn
              .filter(row => row.item && row.quantity > 0)
              .map(row => ({
                itemId: row.item.id,
                quantity: row.quantity,
                unitPrice: row.overridePrice !== undefined && row.overridePrice !== null
                  ? row.overridePrice
                  : (row.item ? (itemPricesByTarget.find((p: any) => p.item.id === row.item.id)?.price || 0) : 0),
              }));
            if (!groupOrContact) {
              notify('Veuillez sélectionner un groupe ou un contact', 'error');
              return;
            }
            if (lines.length === 0) {
              notify('Veuillez ajouter au moins un objet', 'error');
              return;
            }
            // Calculs pour amountToBring, blanchimentAmount, totalFinal
            // (reprend la logique d'affichage du total corrigé)
            let totalRecup = itemsIn.filter(row => row.buying === false).reduce((sum, row) => sum + (row.quantity || 0) * (row.overridePrice !== undefined && row.overridePrice !== null ? row.overridePrice : (row.item ? (itemPricesByTarget.find((p: { item: { id: any; }; }) => p.item.id === row.item.id)?.price || 0) : 0)), 0);
            let totalApport = itemsIn.filter(row => row.buying === true).reduce((sum, row) => sum + (row.quantity || 0) * (row.overridePrice !== undefined && row.overridePrice !== null ? row.overridePrice : (row.item ? (itemPricesByTarget.find((p: { item: { id: any; }; }) => p.item.id === row.item.id)?.price || 0) : 0)), 0);
            const percent = (blanchimentPercent || 60) / 100;
            if (useBlanchiment) {
              totalRecup = percent * totalRecup;
              totalApport = percent * totalApport;
            }
            const blanchimentAmount = useBlanchiment ? percent * (extraBlanchiment || 0) : 0;
            const total = totalRecup - (totalApport + blanchimentAmount) - (reductionIn || 0);
            const amountToBring = total < 0 ? Math.abs(total) : 0;
            const totalFinal = total;
            saveTransaction({
              targetId: groupOrContact.id,
              lines,
              blanchimentPercent: useBlanchiment ? blanchimentPercent : 0,
              amountToBring,
              blanchimentAmount,
              totalFinal,
            });
          }}
          disabled={savingTransactionStatus === 'pending'}
        >
          Enregistrer la transaction
        </Button>
      </Stack>
    </Stack>
  </Paper>
  );
}

export default IncomingTransaction;
