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
import { useUser, useUpdateUser } from '@/providers/UserProvider';
import { useSnackbar } from '@/lib/useSnackbar';
import { formatDollar, formatFullName } from '@/lib/utils';


const CurrentUserCard: React.FC = () => {
  const { user, loading, refetch } = useUser();
  const { notify } = useSnackbar()!;
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  if (loading || !user) return null;

  const handleToggleOnline = () => {
    if (!isUpdating && user) {
      updateUser(
        { id: user.id, input: { data: { ...user.data, isOnline: !user.data?.isOnline } } },
        {
          onSuccess: () => {
            refetch();
            notify('Statut en ligne mis à jour', 'success');
          },
          onError: (err: any) => {
            notify(err?.message || 'Erreur lors de la mise à jour du statut', 'error');
          },
        }
      );
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
          <Avatar src={user.avatar} alt={formatFullName(user)} sx={{ width: 64, height: 64, mr: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mx: 5 }}>
            {formatFullName(user)}
          </Typography>
          <Chip
            label={user.data?.isOnline ? 'En ligne' : 'Hors ligne'}
            color={user.data?.isOnline ? 'success' : 'error'}
            size="small"
            sx={{ fontWeight: 600, mx: 5 }}
          />
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mx: 5 }}>
            Solde : {formatDollar(user.data?.balance)}
          </Typography>
          <FormControlLabel control={<Switch checked={user.data?.isOnline} />} label="En ligne" />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CurrentUserCard;
