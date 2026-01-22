import React, { useState, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { MainLayout } from '@/components';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useQuery } from '@tanstack/react-query';

const GET_MEMBERS = gql`
  query Members {
    users {
      id
      username
      name
      email
      avatar
      role
      createdAt
      updatedAt
      isOnline
      balance
      maxBalance
    }
  }
`;

type User = {
    id: string;
    username: string;
    name: string;
    email?: string;
    avatar?: string;
    isOnline?: boolean;
    balance?: number;
    maxBalance?: number;
    role: string;
    createdAt: string;
    updatedAt: string;
};

const columns: GridColDef[] = [
  { field: 'username', headerName: 'Pseudo Discord', flex: 1 },
  { field: 'name', headerName: 'Nom affiché', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'createdAt', headerName: 'Créé le', flex: 1 },
  { field: 'isOnline', headerName: 'En ligne', flex: 1 },
  { field: 'balance', headerName: 'Solde', flex: 1 },
  { field: 'maxBalance', headerName: 'Solde max', flex: 1 },
];

const MembersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['members'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only' });
      const users = (result.data as { users: User[] }).users;
      // Affiche MEMBER ou supérieur (MANAGER, ADMIN, OWNER)
      const hierarchy = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      return users.filter(u => hierarchy.indexOf(u.role) >= hierarchy.indexOf('MEMBER'));
    },
  });

  const filteredRows = useMemo(() => {
    if (!data) return [];
    const lower = search.toLowerCase();
    return data.filter((row) =>
      row.username.toLowerCase().includes(lower) ||
      row.name.toLowerCase().includes(lower) ||
      (row.email?.toLowerCase().includes(lower) ?? false)
    );
  }, [search, data]);

  return (
    <MainLayout>
      <Box sx={{ height: 500, width: '100%', p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Membres
        </Typography>
        <Box sx={{ mb: 2 }}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 6,
              border: '1px solid #444',
              background: '#23243a',
              color: '#fff',
              fontSize: 16,
              marginBottom: 8
            }}
            aria-label="Recherche membres"
          />
        </Box>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={row => row.id}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          autoHeight
          disableRowSelectionOnClick
          loading={isLoading}
        />
      </Box>
    </MainLayout>
  );
};

export default MembersPage;
