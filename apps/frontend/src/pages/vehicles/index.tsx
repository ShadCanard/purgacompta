import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Paper, Grid, Chip, Autocomplete, TextField } from '@mui/material';
import { GET_VEHICLE_USERS, GET_VEHICLES, GET_MEMBERS } from '@/lib/queries';
import { getApolloClient } from '@/lib/apolloClient';
import { MainLayout } from '@/components';
import { useSnackbar } from '@/providers';
import { SET_VEHICLE_USER } from '@/lib/mutations';

const VehiclesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { notify } = useSnackbar();

  // Récupère tous les VehicleUser
  const { data: vehicleUsers, isLoading: loadingVU } = useQuery({
    queryKey: ['vehicleUsers-list'],
    queryFn: async () => {
      const { data } = await getApolloClient().query({ query: GET_VEHICLE_USERS });
      return (data as any).vehicleUsers;
    },
  });

  // Récupère tous les Vehicles
  const { data: vehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles-list'],
    queryFn: async () => {
      const { data } = await getApolloClient().query({ query: GET_VEHICLES });
      return (data as any).vehicles;
    },
  });

  // Récupère tous les membres
  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['members-list'],
    queryFn: async () => {
      const { data } = await getApolloClient().query({ query: GET_MEMBERS });
      return (data as any).users;
    },
  });

  // Mutation pour modifier le véhicule d'un membre
  const { mutate: setVehicleUser, isPending } = useMutation({
    mutationFn: async (input: any) => {
      const result = await getApolloClient().mutate({
        mutation: SET_VEHICLE_USER,
        variables: { input },
      });
      return (result.data as any)?.setVehicleUser;
    },
    onSuccess: () => {
      notify('Succès', 'success');
      queryClient.invalidateQueries({ queryKey: ['vehicleUsers-list'] });
    },
    onError: (err: any) => {
      notify((err?.message || 'Erreur') + (err?.stack ? '\n' + err.stack : ''), 'error');
    },
  });
  
  if (loadingVU || loadingVehicles || loadingMembers) {
    return <Box sx={{ minHeight: '100vh', bgcolor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</Box>;
  }

  return (
    <MainLayout>
        <Box>
        <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>Gestion des véhicules par membre</Typography>
        <Paper sx={{ mx: 'auto', p: 3 }}>
            <Grid container spacing={3}>
            {members.map((member: any) => {
                const vu = vehicleUsers.find((v: any) => v.user.id === member.id);
                return (
                <Grid item xs={12} md={6} key={member.id}>
                    <Box sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>{member.name} <Chip label={member.username} size="small" sx={{ ml: 1 }} /></Typography>
                    <Autocomplete
                      options={[{ id: '', name: 'Aucun' }, ...vehicles]}
                      getOptionLabel={(option: any) => option.name}
                      value={vu?.vehicle?.id ? vehicles.find((v: any) => v.id === vu.vehicle.id) : { id: '', name: 'Aucun' }}
                      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                      onChange={(_, newValue) => {
                        if (!newValue?.id) {
                          setVehicleUser({ userId: member.id });
                        } else {
                          setVehicleUser({ userId: member.id, vehicleId: newValue.id });
                        }
                      }}
                      renderInput={params => (
                        <TextField {...params} label="Véhicule" variant="outlined" sx={{ bgcolor: '#222', color: 'white', '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { color: 'white' } }} />
                      )}
                      sx={{ mb: 2 }}
                    />
                    {isPending && <Typography sx={{ color: 'orange', fontSize: 14 }}>Modification en cours...</Typography>}
                    </Box>
                </Grid>
                );
            })}
            </Grid>
        </Paper>
        </Box>
    </MainLayout>
  );
};

export default VehiclesPage;
