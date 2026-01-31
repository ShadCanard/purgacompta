import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { useStoragesInventory } from '@/lib/hooks/storages';

export interface CreateUpdateStorageModalProps {
  open: boolean;
  onClose: () => void;
  storageId?: string;
  initialName?: string;
  initialLocation?: string;
}

const CreateUpdateStorageModal: React.FC<CreateUpdateStorageModalProps> = ({ open, onClose, storageId, initialName = '', initialLocation = '' }) => {
  const [name, setName] = React.useState(initialName);
  const [location, setLocation] = React.useState(initialLocation);
  const { createStorage, updateStorage } = useStoragesInventory();

  React.useEffect(() => {
    if (open) {
      setName(initialName);
      setLocation(initialLocation);
    }
  }, [open, initialName, initialLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;
    if (storageId) {
      await updateStorage.mutateAsync({ storageId, name: name.trim(), location: location.trim() });
    } else {
      await createStorage.mutateAsync({ name: name.trim(), location: location.trim() });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{storageId ? 'Modifier le stockage' : 'Créer un nouveau stockage'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Nom du stockage"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Emplacement"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Annuler
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {storageId ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUpdateStorageModal;
