import React, { useState, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { MainLayout } from '@/components';
import CreateContactModal from '@/components/contacts/CreateContactModal';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useQuery } from '@tanstack/react-query';

const GET_CONTACTS = gql`
  query Contacts {
    contacts {
      id
      name
      phone
      group {
        id
        name
      }
    }
  }
`;

type Contact = {
  id: string;
  name: string;
  phone: string;
  group?: { id: string; name: string } | null;
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nom', flex: 1 },
  { field: 'phone', headerName: 'Téléphone', flex: 1 },
  {
    field: 'group',
    headerName: 'Groupe',
    flex: 1,
    valueGetter: (params: any) => {
      if (!params || !params.value) return '';
      if (typeof params.value === 'object' && 'name' in params.value && params.value.name) return params.value.name;
      return '';
    },
  },
];

const ContactsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { data, isLoading } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_CONTACTS, fetchPolicy: 'network-only' });
      const data = result.data as { contacts: Contact[] };
      return data.contacts;
    },
  });

  const filteredRows = useMemo(() => {
    if (!data) return [];
    const lower = search.toLowerCase();
    return data.filter((row) =>
      row.name.toLowerCase().includes(lower) ||
      row.phone.toLowerCase().includes(lower) ||
      (row.group?.name.toLowerCase().includes(lower) ?? false)
    );
  }, [search, data]);

  return (
    <MainLayout>
      <Box sx={{ height: 500, width: '100%', p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Annuaire des contacts
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<UploadFileIcon />}>Import</Button>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>Nouveau</Button>
          </Stack>
        </Stack>
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
            aria-label="Recherche contacts"
          />
        </Box>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={row => row.id}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          autoHeight
          disableRowSelectionOnClick
          loading={isLoading}
        />
        <CreateContactModal open={open} onClose={handleClose} />
      </Box>
    </MainLayout>
  );
};

export default ContactsPage;
