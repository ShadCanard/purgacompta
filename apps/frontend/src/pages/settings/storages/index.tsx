import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useStoragesInventory } from '@/lib/hooks/storages';
import CreateUpdateStorageModal from '@/components/storage/CreateUpdateStorageModal';
import { MainLayout } from '@/components/layout';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nom', flex: 1 },
  { field: 'location', headerName: 'Emplacement', flex: 1 },
  { field: 'actions', headerName: 'Actions', width: 140, sortable: false, filterable: false, renderCell: (params) => params.value },
];

const StoragesSettingsPage: React.FC = () => {
  const { storagesQuery } = useStoragesInventory();
  const [openModal, setOpenModal] = React.useState(false);
  const [editStorage, setEditStorage] = React.useState<any | null>(null);

  const rows = (storagesQuery.data || []).map((storage: any) => ({
    ...storage,
    actions: (
      <Button size="small" variant="outlined" onClick={() => setEditStorage(storage)}>
        Modifier
      </Button>
    ),
  }));

  return (
    <MainLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Gestion des stockages
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          Nouveau stockage
        </Button>
      </Box>
      <Card>
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={20}
            rowsPerPageOptions={[20]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
            sx={{ background: 'rgba(30,30,46,0.95)', borderRadius: 2 }}
          />
        </CardContent>
      </Card>
      <CreateUpdateStorageModal
        open={openModal || !!editStorage}
        onClose={() => { setOpenModal(false); setEditStorage(null); }}
        storageId={editStorage?.id}
        initialName={editStorage?.name}
        initialLocation={editStorage?.location}
      />
    </MainLayout>
  );
};

export default StoragesSettingsPage;
