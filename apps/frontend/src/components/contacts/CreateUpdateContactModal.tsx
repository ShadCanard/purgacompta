import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    Autocomplete,
} from '@mui/material';
import { getApolloClient } from '@/lib/apolloClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/lib/useSnackbar';
import { CREATE_CONTACT, UPDATE_CONTACT } from '@/lib/mutations';
import { GET_GROUPS } from '@/lib/queries';

interface CreateUpdateContactModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    phone: string;
    groupId?: string;
  } | null;
}

const CreateUpdateContactModal: React.FC<CreateUpdateContactModalProps> = ({ open, onClose, initialData = null }) => {
  const queryClient = useQueryClient();
  const { notify } = useSnackbar()!;
  const [form, setForm] = useState({ name: '', phone: '', groupId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        phone: initialData.phone || '',
        groupId: (initialData as any).group?.id || initialData.groupId || '',
      });
    } else {
      setForm({ name: '', phone: '', groupId: '' });
    }
    setError('');
  }, [open, initialData]);

  const { data: groupsData, isLoading: loadingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const result = await getApolloClient().query<{ groups: { id: string; name: string }[] }>({ query: GET_GROUPS });
      if (!result.data?.groups) return [];
      return result.data.groups;
    },
  });

  const createContactMutation = useMutation({
    mutationFn: async (input: { name: string; phone: string; groupId?: string | null }) => {
      setLoading(true);
      const { data } = await getApolloClient().mutate<{ createContact: { id: string; name: string; phone: string; group: { id: string; name: string } | null } }>({
        mutation: CREATE_CONTACT,
        variables: { input },
      });
      setLoading(false);
      return data?.createContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      notify('Contact créé avec succès', 'success');
      handleClose();
    },
    onError: (err: any) => {
      setLoading(false);
      setError(err?.message || 'Erreur lors de la création');
      notify(err?.message || 'Erreur lors de la création', 'error');
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async (input: { id: string; name?: string; phone?: string; groupId?: string | null }) => {
      setLoading(true);
      const { data } = await getApolloClient().mutate<{ updateContact: { id: string; name: string; phone: string; group: { id: string; name: string } | null } }>({
        mutation: UPDATE_CONTACT,
        variables: { input },
      });
      setLoading(false);
      return data?.updateContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      notify('Contact modifié avec succès', 'success');
      handleClose();
    },
    onError: (err: any) => {
      setLoading(false);
      setError(err?.message || 'Erreur lors de la modification');
      notify(err?.message || 'Erreur lors de la modification', 'error');
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
    if (initialData) {
      updateContactMutation.mutate({
        id: initialData.id,
        name: form.name,
        phone: form.phone,
        groupId: form.groupId === '' ? null : form.groupId,
      });
    } else {
      createContactMutation.mutate({
        name: form.name,
        phone: form.phone,
        groupId: form.groupId === '' ? null : form.groupId,
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Modifier un contact' : 'Créer un contact'}</DialogTitle>
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
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Téléphone (ex: 555-1234)"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
          />
          <Autocomplete
            options={groupsData || []}
            getOptionLabel={option => option?.name || ''}
            value={groupsData?.find((g: any) => g.id === form.groupId) || null}
            onChange={(_, value) => setForm(f => ({ ...f, groupId: value ? value.id : '' }))}
            renderInput={params => (
              <TextField
                {...params}
                margin="dense"
                label="Groupe (optionnel)"
                fullWidth
                disabled={loading || loadingGroups}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            clearOnEscape
          />
          {error && <Box mt={1}><Typography color="error">{error}</Typography></Box>}
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

export default CreateUpdateContactModal;
