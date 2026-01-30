import React, { useState, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { MainLayout } from '@/components';
import CreateUpdateContactModal from '@/components/contacts/CreateUpdateContactModal';
import ImportContactModal from '@/components/contacts/ImportContactModal';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useSnackbar } from '@/lib/useSnackbar';
import ActionsMenu from '@/components/layout/ActionsMenu';
import { DELETE_CONTACT, IMPORT_CONTACTS } from '@/lib/mutations/contacts';
import { GET_CONTACTS } from '@/lib/queries/contacts';
import { Contact } from '@/lib/types';
import { getApolloClient } from '@/lib/apolloClient';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nom', flex: 1 },
  { field: 'phone', headerName: 'Téléphone', flex: 1 },
  {
    field: 'group',
    headerName: 'Groupe',
    flex: 1,
    renderCell: (params: any) => params.row.group?.name || '',
  },
  {
    field: 'actions',
    headerName: '',
    width: 60,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: any) => (
      <ActionsMenu row={params.row} onEdit={params.row.onEdit} onDelete={params.row.onDelete} />
    ),
  },
];

const ContactsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; contact: Contact | null }>({ open: false, contact: null });
  const [importOpen, setImportOpen] = useState(false);
  const { notify } = useSnackbar()!;
  const apolloClient = getApolloClient();
  
  // Mutation GraphQL pour l'import
  const importContactsMutation = useMutation({
    mutationFn: async (contacts: any[]) => {
      await apolloClient.mutate({
        mutation: IMPORT_CONTACTS,
        variables: { input: contacts },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      notify('Import des contacts réussi', 'success');
    },
    onError: (err: any) => {
      notify(err?.message || 'Erreur lors de l\'import des contacts', 'error');
    },
  });

  // Handler pour l'import JSON
  const handleImportContacts = (contacts: any[]) => {
    importContactsMutation.mutate(contacts);
  };
  
  const queryClient = useQueryClient();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    const deleteContactMutation = useMutation({
      mutationFn: async (id: string) => {
        setDeleteLoadingId(id);
        await apolloClient.mutate({
          mutation: DELETE_CONTACT,
          variables: { id },
        });
      },
      onSuccess: () => {
        setDeleteLoadingId(null);
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
        notify('Contact supprimé avec succès', 'success');
      },
      onError: (err: any) => {
        setDeleteLoadingId(null);
        notify(err?.message || 'Erreur lors de la suppression', 'error');
      },
    });

    const handleEdit = (row: any) => setEditContact(row);
    const handleDelete = (row: any) => setConfirmDelete({ open: true, contact: row });
    const handleConfirmDelete = () => {
      if (confirmDelete.contact) {
        deleteContactMutation.mutate(confirmDelete.contact.id);
      }
      setConfirmDelete({ open: false, contact: null });
    };
    const handleCancelDelete = () => setConfirmDelete({ open: false, contact: null });
  const { data, isLoading } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_CONTACTS, fetchPolicy: 'network-only' });
      const data = result.data as { contacts: Contact[] };
      return data.contacts;
    },
  });

  // Injection des handlers dans chaque ligne
  const filteredRows = useMemo(() => {
    if (!data) return [];
    const terms = search.toLowerCase().split(' ').filter(Boolean);
    return data
      .filter((row) => {
        const fields = [row.name, row.phone, row.group?.name || '']
          .map(f => (f || '').toLowerCase());
        // Chaque terme doit être présent dans au moins un champ
        return terms.every(term => fields.some(f => f.includes(term)));
      })
      .map((row) => ({ ...row, onEdit: handleEdit, onDelete: handleDelete }));
  }, [search, data]);

  return (
    <MainLayout>
      <Box sx={{ height: 500, width: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Annuaire des contacts
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>Import</Button>
                    <ImportContactModal
                      open={importOpen}
                      onClose={() => setImportOpen(false)}
                      onImport={handleImportContacts}
                    />
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
          initialState={{ pagination: { paginationModel: { pageSize: 10 } }, sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
          autoHeight
          disableRowSelectionOnClick
          loading={isLoading}
        />
        <CreateUpdateContactModal open={open} onClose={handleClose} />
        <CreateUpdateContactModal
          open={!!editContact}
          onClose={() => setEditContact(null)}
          initialData={editContact}
        />
        <ConfirmModal
          open={confirmDelete.open}
          title="Confirmer la suppression"
          content={confirmDelete.contact ? `Supprimer le contact "${confirmDelete.contact.name}" ?` : ''}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          loading={!!deleteLoadingId}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </Box>
    </MainLayout>
  );
};

export default ContactsPage;
