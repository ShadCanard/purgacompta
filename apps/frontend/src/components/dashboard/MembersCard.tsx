
import React, { useState } from 'react';
import UpdateUserInfoModal from '../users/UpdateUserInfoModal';
import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import Card, { CardProps } from '@mui/material/Card';
import { getApolloClient } from '@/lib/apolloClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/providers/UserProvider';
import { formatDisplayName, formatDollar, formatFullName } from '@/lib/utils';
import { User } from '@/purgacompta/common';
import { useSubscription } from '@/lib/useSubscription';
import { AttachMoney, Edit } from '@mui/icons-material';
import { USER_UPDATED } from '@/lib/subscriptions/user';
import { GET_MEMBERS } from '@/lib/queries/users';
import UserAccountUpdateModal from '../accounts/UserAccountUpdateModal';

interface MembersCardProps extends CardProps {
  refresh?: number;
  online?: boolean;
}

const MembersCard: React.FC<MembersCardProps> = ({ refresh = 0, online = false, ...cardProps }) => {
  const { user: currentUser } = useUser();
  const [editUserModalOpen, setEditUserModal] = useState(false);
  const [editAccountModalOpen, setEditAccountModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const userUpdated = useSubscription(USER_UPDATED);
  const apolloClient = getApolloClient();
  const [membersCount, setMembersCount] = useState(0);

  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['dashboard-members', refresh, online],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only' });
      const users = (result.data as { users: User[] }).users;
      // Affiche MEMBER ou supérieur, sans l'utilisateur courant, et filtre par statut online
      const hierarchy = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      return users.filter(u =>
        hierarchy.indexOf(u.role) >= hierarchy.indexOf('MEMBER') &&
        (typeof u.data?.isOnline === 'boolean' ? u.data.isOnline === online : !online)
      );
    },
  });

  // Subscription USER_UPDATED pour rafraîchir la liste en temps réel
  React.useEffect(() => {
    if(userUpdated)
      queryClient.invalidateQueries({ queryKey: ['dashboard-members'] });
  }, [userUpdated]);

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  if(data?.length === 0) {
    return null;      
  }
  return (
    <Card
      sx={{
        background: 'rgba(30, 30, 46, 0.8)',
        border: '1px solid rgba(156, 39, 176, 0.2)',
        borderRadius: 3,
        p: 3,
        ...cardProps.sx,
      }}
      {...cardProps}
    >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Membres ({data?.length ?? 0} {online ? 'en ligne' : 'hors-ligne'})
          </Typography>
        </Stack>
        <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Nom affiché</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Compte</TableCell>
                {(currentUser?.role === 'OWNER' && data && data?.length > 1 ) && (<TableCell colSpan={4} align="right">Actions</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {(data || []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Avatar src={row.avatar} alt={formatDisplayName(row)} sx={{ width: 36, height: 36 }} />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{formatFullName(row)}</Typography>
                  </TableCell>
                  <TableCell>
                  <Chip
                    label={row.data?.isOnline ? 'En ligne' : 'Hors ligne'}
                    color={row.data?.isOnline ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 600, mx: 5 }}
                  />
                  </TableCell>
                  <TableCell>
                    <Typography fontFamily="monospace">{formatDollar(row.data?.balance ?? 0)}</Typography>
                  </TableCell>
              {/* Bouton d'édition pour OWNER */}
              {(currentUser?.role === 'OWNER') && (
                  <TableCell colSpan={4} align="right">
                    {(currentUser?.id !== row.id) && (
                      <Box mt={1}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => { setSelectedUser(row); setEditUserModal(true); }}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="text"
                          color='success'
                          size="small"
                          onClick={() => { setSelectedUser(row); setEditAccountModal(true); }}
                        >
                          <AttachMoney />
                        </Button>
                      </Box>
                    )}
                  </TableCell>
              )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      {/* Modale d'édition */}
      <UpdateUserInfoModal open={editUserModalOpen} onClose={() => setEditUserModal(false)} user={selectedUser} />
      <UserAccountUpdateModal userId={selectedUser?.id || ''} open={editAccountModalOpen} onClose={() => setEditAccountModal(false)} />
      </Card>
  );
};

export default MembersCard;
