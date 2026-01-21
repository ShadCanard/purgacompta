import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Select, MenuItem, CircularProgress
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useUser } from '@/providers/UserProvider';

const USER_ROLES = [
  { value: 'GUEST', label: 'Guest' },
  { value: 'MEMBER', label: 'Member' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OWNER', label: 'Owner' },
];

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      discordId
      username
      name
      avatar
      role
    }
  }
`;

const UPDATE_USER_NAME = gql`
  mutation UpdateUserName($input: UpdateUserNameInput!) {
    updateUserName(input: $input) {
      id
      discordId
      username
      name
      avatar
      role
    }
  }
`;

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      id
      discordId
      username
      avatar
      role
    }
  }
`;

const UsersPage: React.FC = () => {
  // TanStack Query pour récupérer tous les utilisateurs
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await (apolloClient as ApolloClient<NormalizedCacheObject>).query({
        query: GET_USERS,
        fetchPolicy: 'network-only',
      });
      return result.data.users;
    },
  });

  // Mutation pour changer le rôle d'un utilisateur
  const { mutate: updateUserRole, isLoading: isUpdatingRole } = useMutation({
    mutationFn: async ({ discordId, role }: { discordId: string; role: string }) => {
      await (apolloClient as ApolloClient<NormalizedCacheObject>).mutate({
        mutation: UPDATE_USER_ROLE,
        variables: { input: { discordId, role } },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Mutation pour changer le nom affiché d'un utilisateur
  const { mutate: updateUserName, isLoading: isUpdatingName } = useMutation({
    mutationFn: async ({ discordId, name }: { discordId: string; name: string }) => {
      await (apolloClient as ApolloClient<NormalizedCacheObject>).mutate({
        mutation: UPDATE_USER_NAME,
        variables: { input: { discordId, name } },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Gestion de l'édition du nom affiché
  const [editingName, setEditingName] = useState<{ [discordId: string]: string }>({});

  // Récupère l'utilisateur connecté
  const { user: currentUser } = useUser();
  const roleHierarchy: Record<string, number> = {
    GUEST: 0,
    MEMBER: 1,
    MANAGER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Gestion des utilisateurs & permissions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Modifier les rôles et le nom affiché des membres.
        </Typography>
      </Box>
      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Erreur lors du chargement des utilisateurs.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Nom Discord</TableCell>
                  <TableCell>Nom affiché</TableCell>
                  <TableCell>Rôle</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar src={user.avatar} alt={user.username} />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={editingName[user.discordId] !== undefined ? editingName[user.discordId] : user.name || ''}
                        onChange={e => setEditingName({ ...editingName, [user.discordId]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const newName = editingName[user.discordId];
                            if (newName && newName !== user.name) {
                              updateUserName({ discordId: user.discordId, name: newName });
                            }
                          }
                        }}
                        disabled={isUpdatingName}
                        style={{ width: '100%', padding: 4, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        size="small"
                        onChange={e => updateUserRole({ discordId: user.discordId, role: e.target.value })}
                        disabled={
                          isUpdatingRole ||
                          !currentUser ||
                          roleHierarchy[currentUser.role] <= roleHierarchy[user.role]
                        }
                      >
                        {USER_ROLES.map(role => {
                          const isSuperior = currentUser && roleHierarchy[role.value] > roleHierarchy[currentUser.role];
                          return (
                            <MenuItem
                              key={role.value}
                              value={role.value}
                              disabled={isSuperior}
                              style={isSuperior ? { color: '#aaa' } : {}}
                            >
                              {role.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </MainLayout>
  );
};

export default UsersPage;
