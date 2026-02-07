import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  GridLegacy as Grid,
  Autocomplete,
  MenuItem,
} from '@mui/material';
import { useCreateVehicleTransaction } from '../../lib/hooks/vehicleTransaction';
import { useApolloClient } from '@apollo/client/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_ITEMS } from '@/lib/queries/items';
import { GET_CONTACTS_OR_GROUPS_TRANSACTION } from '@/lib/queries/transactions';

interface CreateVehicleTransactionModalProps {
  open: boolean;
  onClose: () => void;
  vehicleUserId: string;
}

enum RewardType {
    MONEY = "money",
    DIRTY_MONEY = "dirty_money",
    ITEM = "item",
}

const CreateVehicleTransactionModal: React.FC<CreateVehicleTransactionModalProps> = ({
  open,
  onClose,
  vehicleUserId,
}) => {

    const [rewardAmount, setRewardAmount] = useState('');
    const [rewardType, setRewardType] = useState<RewardType>(RewardType.MONEY);
    const [itemId, setItemId] = useState('');
    const [vehicleUserIdState, setVehicleUserIdState] = useState(vehicleUserId);
    const [groupOrContact, setGroupOrContact] = useState<any>(null);
      // Items pour le select objet
      const { data: itemsData = [], isLoading: loadingItems } = useQuery({
        queryKey: ['items-list'],
        queryFn: async () => {
          const { data } = await apolloClient.query({ query: GET_ITEMS });
          return (data as any).items;
        },
      });
    const apolloClient = useApolloClient();
    const queryClient = useQueryClient();


  // Queries
  const {data: contactsOrGroups = { groups: [], contactsWithoutGroup: [] }, isLoading: loadingGroupsOrContacts} = useQuery({
    queryKey: ['contactsOrGroupsTransaction'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_CONTACTS_OR_GROUPS_TRANSACTION });
      return (result.data as any);
    },
  });

  const { mutate: createTransaction, isPending } = useCreateVehicleTransaction();
  useEffect(() => {
    console.log('vehicleUserId changed:', vehicleUserId);
    setVehicleUserIdState(vehicleUserId);
  }, [vehicleUserId]);

  const handleSubmit = () => {
    createTransaction(
      {
        vehicleUserId: vehicleUserIdState,
        targetId: groupOrContact?.id,
        rewardAmount: parseFloat(rewardAmount),
        isMoney: rewardType === RewardType.MONEY || rewardType === RewardType.DIRTY_MONEY,
        isDirtyMoney: rewardType === RewardType.DIRTY_MONEY,
        itemId: rewardType === RewardType.ITEM ? itemId : null,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Nouvelle transaction véhicule</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
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
              loading={loadingGroupsOrContacts}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Type de récompense"
              value={rewardType}
              onChange={e => setRewardType(e.target.value as RewardType)}
              fullWidth
            >
              <MenuItem value={RewardType.MONEY}>Argent propre</MenuItem>
              <MenuItem value={RewardType.DIRTY_MONEY}>Argent sale</MenuItem>
              <MenuItem value={RewardType.ITEM}>Objet</MenuItem>
            </TextField>
          </Grid>
          {rewardType === RewardType.ITEM && (
            <Grid item xs={12}>
              <TextField
                select
                label="Objet"
                value={itemId}
                onChange={e => setItemId(e.target.value)}
                fullWidth
                disabled={loadingItems}
              >
                {itemsData.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Montant ou quantité"
              type="number"
              value={rewardAmount}
              onChange={e => setRewardAmount(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isPending || !rewardAmount}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVehicleTransactionModal;
