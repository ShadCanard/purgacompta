import React, { useMemo, useState } from 'react';
import { Box, Typography, TextField, MenuItem, Stack, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/providers/UserProvider';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import MainLayout from '@/components/layout/MainLayout';
import { GET_LOGS, GET_MEMBERS } from '@/lib/queries';



const ACTIONS = [
  { value: '', label: 'Toutes' },
  { value: 'CREATE', label: 'Création' },
  { value: 'UPDATE', label: 'Modification' },
  { value: 'DELETE', label: 'Suppression' },
];

const LogsPage: React.FC = () => {
  const { hasPermission } = useUser();
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('');
  const [userId, setUserId] = useState('');
  const [pageSize, setPageSize] = useState(25);

  // Récupère la liste des utilisateurs pour le filtre
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only' });
      return (data as any).users;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['logs', { search, action, entity, userId }],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_LOGS,
        variables: {
          filter: {
            search: search || undefined,
            action: action || undefined,
            entity: entity || undefined,
            userId: userId || undefined,
          },
          take: 100,
        },
        fetchPolicy: 'network-only',
      });
      return (data as any).logs;
    },
  });

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'createdAt', headerName: 'Date', width: 160, valueGetter: (params) => new Date(params.value).toLocaleString() },
      { field: 'action', headerName: 'Action', width: 110 },
      { field: 'entity', headerName: 'Entité', width: 120 },
      { field: 'entityId', headerName: 'ID cible', width: 180 },
      { field: 'user', headerName: 'Utilisateur', width: 160, valueGetter: (params) => params.row?.user?.name || '' },
      { field: 'diff', headerName: 'Diff', width: 300, renderCell: (params) => <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, maxWidth: 280, overflow: 'auto' }}>{params.value}</pre> },
    ],
    []
  );

  return (
    <MainLayout>
      {!hasPermission('ADMIN') ? (
        <Typography color="error">Accès réservé aux administrateurs.</Typography>
      ) : (
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>Logs d'activité</Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Recherche"
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="small"
              />
              <TextField
                select
                label="Action"
                value={action}
                onChange={e => setAction(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {ACTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Entité"
                value={entity}
                onChange={e => setEntity(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              />
              <TextField
                select
                label="Utilisateur"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                size="small"
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">Tous</MenuItem>
                {usersData?.map((u: any) => (
                  <MenuItem key={u.id} value={u.id}>{u.name} ({u.role})</MenuItem>
                ))}
              </TextField>
            </Stack>
          </Paper>
          <DataGrid
            autoHeight
            rows={data || []}
            columns={columns}
            getRowId={row => row.id}
            loading={isLoading}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[10, 25, 50, 100]}
            disableSelectionOnClick
            sx={{ background: '#181a2a', borderRadius: 2 }}
          />
        </Box>
      )}
    </MainLayout>
  );
};

export default LogsPage;
