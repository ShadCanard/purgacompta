import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_VEHICLE } from '@/lib/queries';
import { CREATE_VEHICLE, UPDATE_VEHICLE } from '@/lib/mutations';
import { getApolloClient } from '@/lib/apolloClient';



interface CreateUpdateVehicleModalProps {
  open: boolean;
  onClose: () => void;
  vehicleId?: string;
}

const CreateUpdateVehicleModal: React.FC<CreateUpdateVehicleModalProps> = ({ open, onClose, vehicleId }) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(vehicleId);
  const [form, setForm] = useState({ name: '', front: '', back: '' });
  const apolloClient = getApolloClient();

  // Réinitialise le formulaire à chaque fermeture
  React.useEffect(() => {
    if (!open) {
      setForm({ name: '', front: '', back: '' });
    }
  }, [open]);

  // Charger les données si édition
  useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      if (!vehicleId) return null;
      const { data } = await apolloClient.query({ query: GET_VEHICLE, variables: { id: vehicleId } });
      var vehicleData = (data as any).vehicleById;
      setForm({
        name: vehicleData.name || '',
        front: vehicleData.front || '',
        back: vehicleData.back || '',
      });
      return vehicleData;
    },
    enabled: !!vehicleId && open,
  });

  const mutation = useMutation({
    mutationFn: async (input: any) => {
      if (isEdit) {
        await apolloClient.mutate({
          mutation: UPDATE_VEHICLE,
          variables: { input: { id: vehicleId, ...input } },
        });
      } else {
        await apolloClient.mutate({
          mutation: CREATE_VEHICLE,
          variables: { input },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      onClose();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? 'Modifier le véhicule' : 'Nouveau véhicule'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Nom"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Image avant (URL)"
            name="front"
            value={form.front}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image arrière (URL)"
            name="back"
            value={form.back}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={mutation.isPending}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending} startIcon={isEdit ? <EditIcon /> : <AddIcon />}>
            {mutation.isPending ? <CircularProgress size={20} /> : isEdit ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUpdateVehicleModal;
