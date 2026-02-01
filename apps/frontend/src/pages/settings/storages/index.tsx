import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApolloClient } from '@/lib/apolloClient';
import { GET_STORAGE_LOCATIONS, GET_STORAGES_BY_STORAGE_LOCATION_ID } from '@/lib/queries/storages';
import { Add, Edit } from '@mui/icons-material';
import CreateUpdateStorageLocationModal from '@/components/storage/CreateUpdateStorageLocationModal';
import CreateUpdateStorageModal from '@/components/storage/CreateUpdateStorageModal';
import { MainLayout } from '@/components';
import { GET_STORAGE_BY_ID } from '@/lib/queries/storages';


const StoragesSettingsPage: React.FC = () => {
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [editLocationId, setEditLocationId] = useState<string|null>(null);
  const [openStorageModal, setOpenStorageModal] = useState(false);
  const [editStorageId, setEditStorageId] = useState<string|null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [selectedStorageData, setSelectedStorageData] = useState<any | null>(null);
  const queryClient = useQueryClient();
  const apolloClient = getApolloClient();


  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nom', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'maxWeight', headerName: 'Poids max (kg)', flex: 1 },
    { field: 'actions', headerName: 'Actions', width: 140, sortable: false, filterable: false, renderCell: (params) => params.value },
  ];

  const { data: storageLocations, isLoading: loadingLocations } = useQuery({
    queryKey: ['storageLocations'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_STORAGE_LOCATIONS,
      });
      return (data as any).storageLocations;
    },
  });

  const selectedLocationObj = React.useMemo(() => {
    if (!selectedLocation || !storageLocations) return null;
    return storageLocations.find((loc: any) => loc.id === selectedLocation.id) || null;
  }, [selectedLocation, storageLocations]);

  // Query pour récupérer dynamiquement les storages liés à l'emplacement sélectionné
  const { data: storagesByLocation, isLoading: loadingStorages } = useQuery({
    queryKey: ['storagesByStorageLocationId', selectedLocationObj?.id],
    queryFn: async () => {
      if (!selectedLocationObj?.id) return [];
      const { data } = await apolloClient.query({
        query: GET_STORAGES_BY_STORAGE_LOCATION_ID,
        variables: { storageLocationId: selectedLocationObj.id },
      });
      return (data as any).storagesByStorageLocationId;
    },
    enabled: !!selectedLocationObj?.id,
  });

  const storageRows = React.useMemo(() => {
    if (!storagesByLocation) return [];
    return storagesByLocation.map((storage: any) => ({
      ...storage,
      actions: (
        <Button size="small" variant="outlined" onClick={() => { setEditStorageId(storage.id); setOpenStorageModal(true); }}>
          Modifier
        </Button>
      ),
    }));
  }, [storagesByLocation]);

  useEffect(() => {
    console.log('Selected Location changed:', selectedLocation);
    queryClient.invalidateQueries({ queryKey: ['storageData'] });
  }, [selectedLocation]);

  
    const {data: storageData } = useQuery({
      queryKey: ['storageData', selectedLocation?.id],
      queryFn: async () => {
        const { data } = await apolloClient.query({
          query: GET_STORAGE_BY_ID,
          variables: { id: selectedLocation?.id },
          fetchPolicy: 'network-only',
        });
        return (data as any).storageLocations;
      },
    });

  return (
    <MainLayout>
      <Box>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Gestion des stockages
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }} display="flex" alignItems="center">
          <Autocomplete
            options={storageLocations ? storageLocations.map((loc: any) => ({ label: loc.name, id: loc.id })) : []}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label}
            value={selectedLocation}
            onChange={(_, value) => setSelectedLocation(value)}
            loading={loadingLocations}
            renderInput={(params) => (
              <TextField
                placeholder="Filtrer par emplacement"
                style={{ width: 300 }}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingLocations ? <CircularProgress color="inherit" size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {!selectedLocation && (<Button sx={{ ml: 2 }} startIcon={<Add />} variant="contained" color="primary" onClick={() => { setEditLocationId(null); setOpenLocationModal(true); }}>
            Nouvel emplacement
          </Button>)}
          {selectedLocation && (<Button sx={{ ml: 2 }} startIcon={<Edit />} variant='contained' color="warning" onClick={() => { setEditLocationId(selectedLocation?.id); setOpenLocationModal(true); }}>Modifier l'emplacement</Button>)}
              <CreateUpdateStorageLocationModal
                open={openLocationModal}
                onClose={() => { setOpenLocationModal(false); setEditLocationId(null); }}
                storageLocationId={editLocationId}
              />
        </Box>
        {selectedLocationObj && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Gestion du stockage de l'emplacement ({selectedLocationObj.name})
                </Typography>
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setEditStorageId(null); setOpenStorageModal(true); }}>
                  Nouveau stockage
                </Button>
                    <CreateUpdateStorageModal
                      open={openStorageModal}
                      onClose={() => { setOpenStorageModal(false); queryClient.invalidateQueries({ queryKey: ['storagesByStorageLocationId'] }); setEditStorageId(null); }}
                      storageLocationId={selectedLocationObj?.id}
                      storageId={editStorageId}
                    />
              </Box>
              <DataGrid
                rows={storageRows}
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
        )}
      </Box>
    </MainLayout>
  );
};

export default StoragesSettingsPage;
