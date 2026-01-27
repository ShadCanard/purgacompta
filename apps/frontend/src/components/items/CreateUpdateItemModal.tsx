import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Switch,
    FormGroup,
    FormControlLabel,
} from '@mui/material';

interface CreateUpdateItemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; weight: number; sellable: boolean; weapon: boolean }) => void;
  initialData?: { name: string; weight: number; sellable: boolean; weapon: boolean } | null;
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
  const [weapon, setWeapon] = useState(false);
  const [sellable, setSellable] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setWeight(initialData.weight.toString().replace('.', ','));
      setSellable(initialData.sellable || false);
      setWeapon(initialData.weapon || false);
    } else {
      setName('');
      setWeight('');
      setSellable(false);
      setWeapon(false);
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
    onSubmit({ name: name.trim(), weight: weightValue, sellable: sellable, weapon: weapon });
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
          <FormGroup>
            <FormControlLabel 
            control={
              <Switch
                checked={weapon}
                onChange={e => setWeapon(e.target.checked)}
                disabled={loading}
              />
            }
            label="Arme"
            />
            <FormControlLabel 
            control={
              <Switch
                checked={sellable}
                onChange={e => setSellable(e.target.checked)}
                disabled={loading}
              />
            }
            label="Vente possible"
            />
          </FormGroup>
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
