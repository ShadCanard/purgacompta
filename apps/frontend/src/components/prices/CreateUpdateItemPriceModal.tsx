import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';

interface Item {
  id: string;
  name: string;
}
interface Group {
  id: string;
  name: string;
}

export interface CreateUpdateItemPriceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { itemId: string; groupId: string; price: number }) => void;
  loading?: boolean;
  items: Item[];
  groups: Group[];
  initialData?: { itemId: string; groupId: string; price: number } | null;
}

const CreateUpdateItemPriceModal: React.FC<CreateUpdateItemPriceModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  items,
  groups,
  initialData,
}) => {
  const [itemId, setItemId] = React.useState('');
  const [groupId, setGroupId] = React.useState('');
  const [price, setPrice] = React.useState('');

  useEffect(() => {
    if (initialData) {
      setItemId(initialData.itemId);
      setGroupId(initialData.groupId);
      setPrice(initialData.price.toString());
    } else {
      setItemId('');
      setGroupId('');
      setPrice('');
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !groupId || !price) return;
    onSubmit({ itemId, groupId, price: parseFloat(price) });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialData ? 'Modifier un prix' : 'Ajouter un prix'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              select
              label="Objet"
              value={itemId}
              onChange={e => setItemId(e.target.value)}
              fullWidth
              required
              disabled={!!initialData}
            >
              {items.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Groupe"
              value={groupId}
              onChange={e => setGroupId(e.target.value)}
              fullWidth
              required
              disabled={!!initialData}
            >
              {groups.map(group => (
                <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Prix ($)"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {initialData ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUpdateItemPriceModal;
