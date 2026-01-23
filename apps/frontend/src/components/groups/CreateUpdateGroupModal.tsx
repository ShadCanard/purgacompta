import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box, Switch } from '@mui/material';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertServerPatchToFullTree } from 'next/dist/client/components/segment-cache/navigation';
import { CREATE_GROUP, UPDATE_GROUP } from '@/lib/mutations';

interface CreateUpdateGroupModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    tag?: string;
    description?: string;
    isActive: boolean;
    color1?: string;
    color2?: string;
  } | null;
}

const CreateUpdateGroupModal: React.FC<CreateUpdateGroupModalProps> = ({ open, onClose, initialData = null }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', tag: '', description: '', isActive: true, color1: '#000000', color2: '#000000' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        tag: initialData.tag || '',
        description: initialData.description || '',
        isActive: initialData.isActive,
        color1: initialData.color1 || '#000000',
        color2: initialData.color2 || '#000000',
      });
    } else {
      setForm({ name: '', tag: '', description: '', isActive: true, color1: '#000000', color2: '#000000' });
    }
    setError('');
  }, [open, initialData]);

  const createGroupMutation = useMutation<any, any, { name: string; tag?: string; description?: string; color1?: string; color2?: string; isActive?: boolean }>(
    {
      mutationFn: async (input) => {
        setLoading(true);
        const result = await apolloClient.mutate({
          mutation: CREATE_GROUP,
          variables: {
            ...input
          },
        });
        setLoading(false);
        return (result as any).data.createGroup;
      },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      handleClose();
    },
    onError: (err: any) => {
      setLoading(false);
      setError(err?.message || 'Erreur lors de la création');
    },
  });

  const updateGroupMutation = useMutation<any, any, { id: string; name: string; tag?: string; description?: string; color1?: string; color2?: string; isActive: boolean }>(
    {
      mutationFn: async (input) => {
        setLoading(true);
        console.dir("form", form);
        console.dir("input", input);
        await apolloClient.mutate({
          mutation: UPDATE_GROUP,
          variables: {
            ...input
          },
        });
        setLoading(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
        handleClose();
      },
      onError: (err: any) => {
        setLoading(false);
        setError(err?.message || 'Erreur lors de la modification');
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleClose = () => {
    setForm({ name: '', tag: '', description: '', isActive: true, color1: '#000000', color2: '#000000' });
    setError('');
    onClose();
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (initialData) {
      updateGroupMutation.mutate({ id: initialData.id, ...form });
    } else {
      createGroupMutation.mutate(form);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Modifier un groupe' : 'Ajouter un groupe'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2} mt={2} mb={1}>
            <Box>
              <Typography variant="body2">Couleur principale</Typography>
              <input
                type="color"
                name="color1"
                value={form.color1 || '#000000'}
                onChange={handleChange}
                style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer' }}
                disabled={loading}
              />
            </Box>
            <Box>
              <Typography variant="body2">Couleur secondaire</Typography>
              <input
                type="color"
                name="color2"
                value={form.color2 || '#000000'}
                onChange={handleChange}
                style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer' }}
                disabled={loading}
              />
            </Box>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du groupe"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Tag (optionnel)"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            fullWidth
            disabled={loading}
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
            disabled={loading}
          />
          <Box display="flex" alignItems="center" mt={1}>
            <Switch
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              style={{ marginRight: 8 }}
              disabled={loading}
            />
            <label htmlFor="isActive">Actif (en activité)</label>
          </Box>
          {error && <Typography color="error" variant="body2" mt={1}>{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {initialData ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUpdateGroupModal;
