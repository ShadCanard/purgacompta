import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Button, Typography, Chip, Autocomplete, TextField } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_VEHICLE_USERS, GET_VEHICLES } from '@/lib/queries/vehicles';
import { getApolloClient } from '@/lib/apolloClient';
import { SET_VEHICLE_USER } from '@/lib/mutations/vehicles';
import { useSnackbar } from '@/providers';
import { TABLET_UPDATED } from '@/lib/subscriptions/vehicles';
import Switch from '@mui/material/Switch';
import { useUpdateUser } from '@/providers/UserProvider';
import { User } from '@purgacompta/common';
import { formatDisplayName } from '@/lib/utils';

export interface VehiclesUserItemProps {
  member: User;
}
const VehiclesUserItem: React.FC<VehiclesUserItemProps> = ({ member }) => {
      const updateUser = useUpdateUser();
      const manageTablet = !!member.data?.manageTablet;
      const [switchValue, setSwitchValue] = useState(manageTablet);

      useEffect(() => {
        setSwitchValue(manageTablet);
      }, [manageTablet]);

    const apolloClient = getApolloClient();
    const { notify} = useSnackbar()!;
    const queryClient = useQueryClient();

    
    // Query vehicleUsers pour ce composant
    const { data: vehicleUsers } = useQuery({
        queryKey: ['vehicleUsers-list'],
        queryFn: async () => {
        const { data } = await apolloClient.query({ query: GET_VEHICLE_USERS });
        return (data as any).vehicleUsers;
        },
    });

    
    const vu = vehicleUsers?.find((v: any) => v.user?.id === member.id);

    const { data: vehicles = [], isLoading: loadingVehicles } = useQuery({
      queryKey: ['vehicles-list'],
      queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_VEHICLES });
      return (data as any).vehicles;
      },
    });

    // Subscription manuelle pour rafraîchir la liste à chaque update
    useEffect(() => {
      if (!apolloClient) return;
      const observable = apolloClient.subscribe({ query: TABLET_UPDATED });
      const sub = observable.subscribe({
        next: (event: any) => {
          queryClient.invalidateQueries({ queryKey: ['vehicleUsers-list'] });
        },
        error: (err: any) => { console.error('Erreur de subscription tablette', err);
        },
      });
      return () => sub.unsubscribe();
    }, [apolloClient, queryClient]);

        // Mutation
    const { mutate: setVehicleUser, isPending } = useMutation({
        mutationFn: async (input: any) => {
        const result = await apolloClient.mutate({
            mutation: SET_VEHICLE_USER,
            variables: { input },
        });
        return (result.data as any)?.setVehicleUser;
        },
        onSuccess: () => {
            notify('Succès', 'success');
        },
        onError: (err: any) => {
        notify((err?.message || 'Erreur') + (err?.stack ? '\n' + err.stack : ''), 'error');
        },
    });



  return (
    <Card sx={{ mb: 3, bgcolor: '#222', color: 'white', borderRadius: 2, boxShadow: 4 }}>
      <CardHeader
        title={
          <>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, display: 'inline-block', mr: 1 }}>
              {formatDisplayName(member)}
            </Typography>
            <Chip label={member.data.tabletUsername || ''} size="small" sx={{ ml: 1 }} />
            <Switch
              checked={!!switchValue}
              onChange={(_, checked) => {
                setSwitchValue(checked);
                updateUser.mutate({
                  id: member.id,
                  input: { data: { manageTablet: checked } },
                });
              }}
              color="primary"
              inputProps={{ 'aria-label': 'Gérer tablette' }}
              sx={{ ml: 2, verticalAlign: 'middle' }}
            />
          </>
        }
        sx={{ pb: 1 }}
      />
      <CardContent>
        <Autocomplete
          options={[{ id: '', name: 'Aucun' }, ...vehicles]}
          getOptionLabel={(option: any) => option?.name || ''}
          value={
            vu?.vehicle?.id
              ? vehicles.find((v: any) => v.id === vu.vehicle.id) || { id: '', name: 'Aucun' }
              : { id: '', name: 'Aucun' }
          }
          isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
          onChange={(_, newValue) => {
            if (!newValue || !newValue.id) {
              setVehicleUser({ userId: member.id, vehicleId: null });
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
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          variant={vu?.found ? 'contained' : 'outlined'}
          color={vu?.found ? 'success' : 'error'}
          onClick={() => setVehicleUser({ userId: member.id, vehicleId: vu?.vehicle?.id ?? null, found: !vu?.found })}
          sx={{ fontWeight: 700, fontSize: 16, px: 3, borderRadius: 2 }}
        >
          {vu?.found ? 'Trouvé' : 'Non-Trouvé'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default VehiclesUserItem;
