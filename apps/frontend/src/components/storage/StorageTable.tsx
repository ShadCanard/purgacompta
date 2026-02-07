import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

// TODO: Remplacer par un fetch dynamique depuis l'API
const STORAGE_DATA = [
  {
    id: 1,
    objet: 'Sacs',
    QG_montant: 675,
    QG_poids: 101.25,
    Miky_montant: 0,
    Miky_poids: 0,
    Jax_montant: 0,
    Jax_poids: 0,
    Mathieu_montant: 0,
    Mathieu_poids: 0,
    Brandon_montant: 0,
    Brandon_poids: 0,
    Reservation_montant: 0,
    Reservation_poids: 0,
    Total_montant: 675,
    Total_poids: 101.25,
  },
  // ... autres objets à compléter
];

const columns: GridColDef[] = [
  { field: 'objet', headerName: 'Objet', width: 180 },
  { field: 'QG_montant', headerName: 'QG Montant', width: 110, type: 'number' },
  { field: 'QG_poids', headerName: 'QG Poids (kg)', width: 110, type: 'number' },
  { field: 'Miky_montant', headerName: 'A - Miky Montant', width: 120, type: 'number' },
  { field: 'Miky_poids', headerName: 'A - Miky Poids (kg)', width: 120, type: 'number' },
  { field: 'Jax_montant', headerName: 'B - Jax Montant', width: 120, type: 'number' },
  { field: 'Jax_poids', headerName: 'B - Jax Poids (kg)', width: 120, type: 'number' },
  { field: 'Mathieu_montant', headerName: 'C - Mathieu Montant', width: 130, type: 'number' },
  { field: 'Mathieu_poids', headerName: 'C - Mathieu Poids (kg)', width: 130, type: 'number' },
  { field: 'Brandon_montant', headerName: 'D - Brandon Montant', width: 130, type: 'number' },
  { field: 'Brandon_poids', headerName: 'D - Brandon Poids (kg)', width: 130, type: 'number' },
  { field: 'Reservation_montant', headerName: 'Réservation Montant', width: 130, type: 'number' },
  { field: 'Reservation_poids', headerName: 'Réservation Poids (kg)', width: 130, type: 'number' },
  { field: 'Total_montant', headerName: 'Total Montant', width: 120, type: 'number' },
  { field: 'Total_poids', headerName: 'Total Poids (kg)', width: 120, type: 'number' },
];

const StorageTable: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tableau des stocks consolidés
      </Typography>
      <DataGrid
        rows={STORAGE_DATA}
        columns={columns}
        autoHeight
        paginationModel={{ page: 0, pageSize: 20 }}
        pageSizeOptions={[20]}
        disableRowSelectionOnClick
        sx={{ background: 'rgba(30,30,46,0.95)', borderRadius: 2 }}
      />
    </Box>
  );
};

export default StorageTable;
