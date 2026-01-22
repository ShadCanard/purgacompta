
import React from 'react';
import { Avatar, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Switch } from '@mui/material';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/providers/UserProvider';
import { formatDollar } from '@/lib/utils';

const GET_MEMBERS = gql`
  query Members {
    users {
      id
      name
      avatar
      isOnline
      balance
      role
    }
  }
`;

type Member = {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  balance: number;
  role: string;
};



const MembersGrid: React.FC = () => {
  const { user: currentUser } = useUser();
  const { data, isLoading } = useQuery<Member[]>({
    queryKey: ['dashboard-members'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only' });
      const users = (result.data as { users: Member[] }).users;
      // Affiche MEMBER ou supérieur, sans l'utilisateur courant
      const hierarchy = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      return users.filter(u => hierarchy.indexOf(u.role) >= hierarchy.indexOf('MEMBER'));
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Nom affiché</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Compte</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data || []).map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Avatar src={row.avatar} alt={row.name} sx={{ width: 36, height: 36 }} />
              </TableCell>
              <TableCell>
                <Typography fontWeight={500}>{row.name}</Typography>
              </TableCell>
              <TableCell>
                <Switch
                  size="small"
                  sx={{
                    fontWeight: 600,
                  }}
                  disabled
                  checked={row.isOnline}
                />
              </TableCell>
              <TableCell>
                <Typography fontFamily="monospace">{formatDollar(row.balance)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MembersGrid;
