import React from 'react';
import { formatDollar } from '@/lib/utils';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useCreateAccountHistory } from '@/lib/hooks/useUserAccountHistory';


export interface UserAccountUpdateModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}


const UserAccountUpdateModal: React.FC<UserAccountUpdateModalProps> = ({
  open,
  onClose,
  userId
}) => {
    const [amount, setAmount] = React.useState<string>('');
    const [notes, setNotes] = React.useState<string>('');
    const [type, setType] = React.useState<string>('Mise à jour du compte');
    const createAccountHistory = useCreateAccountHistory();

  React.useEffect(() => {
    setAmount('');
    setNotes('');
    setType('Mise à jour du compte');
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!userId) return;
    const parsedAmount = parseFloat(amount.replace(/\s/g, '').replace(',', '.'));
    if (isNaN(parsedAmount)) return;
    await createAccountHistory.mutateAsync({
        userId,
        amount: parsedAmount,
        notes: type + (notes ? ' - ' + notes : ''),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Mettre à jour le solde utilisateur</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth sx={{mt:2}}>
              <InputLabel id="account-type-label">Type d'opération</InputLabel>
              <Select
                labelId="account-type-label"
                value={type}
                label="Type d'opération"
                onChange={e => setType(e.target.value)}
                required
              >
                <MenuItem value="Mise à jour du compte">Mise à jour du compte</MenuItem>
                <MenuItem value="Paiement (Darrel, Contrats)">Paiement (Darrel, Contrats)</MenuItem>
                <MenuItem value="Virement">Virement</MenuItem>
                <MenuItem value="Transaction">Transaction</MenuItem>
                <MenuItem value="Ajustement manuel">Ajustement manuel</MenuItem>
                <MenuItem value="Blanchiment">Blanchiment</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Montant"
              type="text"
              value={formatDollar(amount === '' ? 0 : parseFloat(amount.replace(/\s/g, '').replace(',', '.')))}
              onChange={e => {
                // Autorise chiffres, point, virgule et un seul signe moins au début
                let val = e.target.value
                  .replace(/(?!^)-/g, '') // supprime tous les - sauf le premier caractère
                  .replace(/[^\d.,-]/g, '');
                setAmount(val);
              }}
              required
              fullWidth
              inputProps={{ inputMode: 'decimal', pattern: '^-?[0-9.,]*' }}
              helperText="Utilisez un point ou une virgule pour les décimales. Les valeurs négatives sont autorisées."
            />
            <TextField
              label="Notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
    </Dialog>
  );
};

export default UserAccountUpdateModal;
