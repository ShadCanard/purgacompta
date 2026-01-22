import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper
} from '@mui/material';

interface Item {
  id: string;
  name: string;
}
interface ItemPrice {
  id?: string;
  item: Item;
  price: number;
}

interface EditItemPriceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (prices: ItemPrice[]) => void;
  items: Item[];
  initialPrices: ItemPrice[];
}

const EditItemPriceModal: React.FC<EditItemPriceModalProps> = ({ open, onClose, onSave, items, initialPrices }) => {
  const [prices, setPrices] = useState<ItemPrice[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  useEffect(() => {
    setPrices(initialPrices);
    setSelectedItemId('');
  }, [open, initialPrices]);

  const handlePriceChange = (itemId: string, value: string) => {
    setPrices(prices => prices.map(p =>
      p.item.id === itemId ? { ...p, price: parseFloat(value.replace(',', '.')) || 0 } : p
    ));
  };

  const handleAddItem = () => {
    if (!selectedItemId) return;
    const item = items.find(i => i.id === selectedItemId);
    if (!item) return;
    if (prices.some(p => p.item.id === item.id)) return;
    setPrices(prices => [...prices, { item, price: 0 }]);
    setSelectedItemId('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Éditer les prix des objets</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="select-item-label">Ajouter un objet</InputLabel>
            <Select
              labelId="select-item-label"
              value={selectedItemId}
              label="Ajouter un objet"
              onChange={e => setSelectedItemId(e.target.value)}
            >
              <MenuItem value=""><em>Sélectionner un objet</em></MenuItem>
              {items.filter(i => !prices.some(p => p.item.id === i.id)).map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddItem} disabled={!selectedItemId}>
            Ajouter
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Objet</TableCell>
                <TableCell>Prix</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prices.map((row) => (
                <TableRow key={row.item.id}>
                  <TableCell>{row.item.name}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={row.price}
                      onChange={e => handlePriceChange(row.item.id, e.target.value)}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={() => onSave(prices)}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemPriceModal;
// FICHIER SUPPRIMÉ
