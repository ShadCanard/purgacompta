import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useUser } from '@/providers/UserProvider';
import apolloClient from '@/lib/apolloClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/lib/useSnackbar';
import { UPDATE_USER_ONLINE } from '@/lib/mutations';
// Mutation pour mettre à jour le statut en ligne

const CurrentUserCard: React.FC = () => {
  const { user, loading, refetch } = useUser();
  const queryClient = useQueryClient();

  const { notify } = useSnackbar();
  const { mutate: updateOnline, isLoading: isUpdating } = useMutation({
    mutationFn: async (isOnline: boolean) => {
      await apolloClient.mutate({
        mutation: UPDATE_USER_ONLINE,
        variables: { discordId: user?.discordId, isOnline },
      });
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['dashboard-members'] });
      notify('Statut en ligne mis à jour', 'success');
    },
    onError: (err: any) => {
      notify(err?.message || 'Erreur lors de la mise à jour du statut', 'error');
    },
  });

  if (loading || !user) return null;

  const handleToggleOnline = () => {
    if (!isUpdating) {
      updateOnline(!user.isOnline);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        background: 'rgba(30, 30, 46, 0.8)',
        border: '1px solid rgba(156, 39, 176, 0.2)',
        borderRadius: 3,
        boxShadow: 'none',
        cursor: 'pointer',
        opacity: isUpdating ? 0.7 : 1,
      }}
      onClick={handleToggleOnline}
    >
      <CardContent>
        <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 64, height: 64, mr: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mx: 5 }}>
            {user.name}
          </Typography>
          <Chip
            label={user.isOnline ? 'En ligne' : 'Hors ligne'}
            color={user.isOnline ? 'success' : 'error'}
            size="small"
            sx={{ fontWeight: 600, mx: 5 }}
          />
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mx: 5 }}>
            Solde : {`$${user.balance}`}
          </Typography>
          <FormControlLabel control={<Switch checked={user.isOnline} />} label="En ligne" />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CurrentUserCard;
