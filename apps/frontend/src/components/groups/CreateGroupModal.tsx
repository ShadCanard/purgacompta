import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box } from '@mui/material';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $tag: String, $description: String, $isActive: Boolean) {
    createGroup(name: $name, tag: $tag, description: $description, isActive: $isActive) {
      id
      name
      tag
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}


const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', tag: '', description: '', isActive: true });
  const [error, setError] = useState('');

  const createGroupMutation = useMutation<any, any, { name: string; tag?: string; description?: string; isActive?: boolean }>({
    mutationFn: async (input) => {
      const result = await apolloClient.mutate({
        mutation: CREATE_GROUP,
        variables: input,
      });
      return (result as any).data.createGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      handleClose();
    },
    onError: (err: any) => {
      setError(err?.message || 'Erreur lors de la création');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleClose = () => {
    setForm({ name: '', tag: '', description: '', isActive: true });
    setError('');
    onClose();
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    createGroupMutation.mutate(form);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Ajouter un groupe</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du groupe"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Tag (optionnel)"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description (optionnelle)"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
          />
          <Box display="flex" alignItems="center" mt={1}>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="isActive">Actif (en activité)</label>
          </Box>
          {error && <Typography color="error" variant="body2" mt={1}>{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary" disabled={createGroupMutation.status === 'pending'}>
            Créer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateGroupModal;
