
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
} from '@mui/material';
import { getApolloClient } from '@/lib/apolloClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/providers/UserProvider';
import { formatDisplayName, formatDollar, formatFullName } from '@/lib/utils';
import { User } from '@/purgacompta/common';
import { GET_MEMBERS } from '@/lib/queries';
import { USER_UPDATED } from '@/lib/subscriptions';
import { useSubscription } from '@/lib/useSubscription';
import { Edit } from '@mui/icons-material';

const MembersGrid: React.FC<{ refresh?: number }> = ({ refresh = 0 }) => {
  const { user: currentUser } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const userUpdated = useSubscription(USER_UPDATED);
  const apolloClient = getApolloClient();

  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['dashboard-members', refresh],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only' });
      const users = (result.data as { users: User[] }).users;
      // Affiche MEMBER ou supérieur, sans l'utilisateur courant
      const hierarchy = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      return users.filter(u => hierarchy.indexOf(u.role) >= hierarchy.indexOf('MEMBER'));
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

  return (
    <>
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
                        onClick={() => { setSelectedUser(row); setModalOpen(true); }}
                      >
                        <Edit />
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
      <UpdateUserInfoModal open={modalOpen} onClose={() => setModalOpen(false)} user={selectedUser} />
    </>
  );
};

export default MembersGrid;
