import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import VehicleTabletItem from './VehicleTabletItem';
import { GET_VEHICLE_USERS } from '@/lib/queries/vehicles';
import { TABLET_UPDATED } from '@/lib/subscriptions/vehicles';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApolloClient } from '@/lib/apolloClient';

interface TabletVehicleListProps {
  onImageClick: (img: string) => void;
}

const VehicleTabletList: React.FC<TabletVehicleListProps> = ({ onImageClick }) => {

    const apolloClient = getApolloClient();
    const queryClient = useQueryClient();
    
  
    // Subscription manuelle pour rafraîchir la liste à chaque update
    useEffect(() => {
      if (!apolloClient) return;
      const observable = apolloClient.subscribe({ query: TABLET_UPDATED });
      const sub = observable.subscribe({
        next: (event: any) => {
          queryClient.invalidateQueries({ queryKey: ['vehicleUsers-tablet'] });
        },
        error: (err: any) => { console.error('Erreur de subscription tablette', err);
        },
      });
      return () => sub.unsubscribe();
    }, [apolloClient, queryClient]);
    
  const { data : vehicles } = useQuery({
    queryKey: ['vehicleUsers-tablet'],
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_VEHICLE_USERS });
      console.dir((data as any).vehicleUsers);
      return (data as any).vehicleUsers;
    },
    staleTime: 1000 * 60,
  });

  return (
    <Grid container spacing={3}>
      {vehicles?.map((vehicle: any) => <>
        {vehicle.vehicle && 
          <Grid item xs={12} sm={6} md={3} key={vehicle.vehicle.name}>
            <VehicleTabletItem
              vehicle={vehicle}
              onImageClick={onImageClick}
            />
          </Grid>
        }
      </>)}
    </Grid>
  );
}
export default VehicleTabletList;
