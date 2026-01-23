
import React, { useState, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Avatar, Box, Typography } from '@mui/material';
import { MainLayout } from '@/components';
import apolloClient from '@/lib/apolloClient';
import { useQuery } from '@tanstack/react-query';
import { formatDollar } from '@/lib/utils';
import { GET_MEMBERS } from '@/lib/queries';
import { User } from '@/lib/types';

const columns: GridColDef[] = [
  { field: 'avatar', headerName: '', renderCell: (params) => (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Avatar src={params.value} sx={{ width: 36, height: 36, verticalAlign: 'middle' }} />
    </Box>)
  },
  { field: 'name', headerName: 'Nom', flex: 1  },
  { field: 'balance', headerName: 'Solde', renderCell: (params) => (formatDollar(params.value)) },
  { field: 'maxBalance', headerName: 'Solde max', renderCell: (params) => (formatDollar(params.value)) },
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
