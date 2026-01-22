import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const GET_GROUPS = gql`
  query Groups {
    groups {
      id
      name
    }
  }
`;

const CREATE_CONTACT = gql`
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
      name
      phone
      group { id name }
    }
  }
`;

interface CreateContactModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', phone: '', groupId: '' });
  const [error, setError] = useState('');

  const { data: groupsData, isLoading: loadingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_GROUPS });
      return result.data.groups as { id: string; name: string }[];
    },
  });

  const createContactMutation = useMutation({
    mutationFn: async (input: { name: string; phone: string; groupId?: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_CONTACT,
        variables: { input },
      });
      return data.createContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      handleClose();
    },
    onError: (err: any) => {
      setError(err?.message || 'Erreur lors de la création');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setForm({ name: '', phone: '', groupId: '' });
    setError('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Nom et téléphone requis');
      return;
    }
    createContactMutation.mutate({
      name: form.name,
      phone: form.phone,
      groupId: form.groupId || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Créer un contact</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Téléphone (ex: 555-1234)"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            select
            margin="dense"
            label="Groupe (optionnel)"
            name="groupId"
            value={form.groupId}
            onChange={handleChange}
            fullWidth
            disabled={loadingGroups}
          >
            <MenuItem value="">Aucun</MenuItem>
            {groupsData?.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </TextField>
          {error && <Box mt={1}><Typography color="error">{error}</Typography></Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary" disabled={createContactMutation.status === 'pending'}>
            Créer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateContactModal;
