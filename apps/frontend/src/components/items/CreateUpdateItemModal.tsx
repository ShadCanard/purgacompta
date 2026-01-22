import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack
} from '@mui/material';

interface CreateUpdateItemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; weight: number }) => void;
  initialData?: { name: string; weight: number } | null;
  loading?: boolean;
}

const CreateUpdateItemModal: React.FC<CreateUpdateItemModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setWeight(initialData.weight.toString().replace('.', ','));
    } else {
      setName('');
      setWeight('');
    }
    setError('');
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Le nom est requis');
      return;
    }
    const weightValue = parseFloat(weight.replace(',', '.'));
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Le poids doit être un nombre positif');
      return;
    }
    setError('');
    onSubmit({ name: name.trim(), weight: weightValue });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Modifier un objet' : 'Créer un objet'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nom de l'objet"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            autoFocus
            disabled={loading}
          />
          <TextField
            label="Poids (kg)"
            value={weight}
            onChange={e => setWeight(e.target.value.replace(/[^\d.,]/g, ''))}
            fullWidth
            disabled={loading}
            helperText="Utilisez une virgule pour les décimales."
          />
          {error && <span style={{ color: 'red', fontSize: 13 }}>{error}</span>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {initialData ? 'Enregistrer' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUpdateItemModal;
