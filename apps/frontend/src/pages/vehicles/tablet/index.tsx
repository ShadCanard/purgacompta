
import React from 'react';
import { useRouter } from 'next/router';
import { Box, Chip, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { GET_VEHICLE_USERS } from '../../../lib/queries';
import apolloClient from '@/lib/apolloClient';
import VehicleTablet from '@/components/vehicles/VehicleTablet';
import VehicleTabletFake from '@/components/vehicle/VehicleTabletFake';


const VehicleTabletPage: React.FC = () => {
  const router = useRouter();
  const accessKey = typeof window !== 'undefined' ? (router.query.AccessKey as string || '') : '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicleUsers-tablet'],
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_VEHICLE_USERS });
      return (data as any).vehicleUsers;
    },
    staleTime: 1000 * 60,
  });

  const getStatusChip = (found: boolean) => (
    <Chip
      label={found ? 'Trouvé !' : 'Pas trouvé.'}
      sx={{
        bgcolor: found ? 'success.main' : 'warning.main',
        color: found ? 'common.white' : 'common.black',
        fontWeight: 700,
        fontSize: 16,
        px: 2,
        borderRadius: 1,
        minWidth: 110,
      }}
    />
  );

  if (isLoading) {
    return <Box sx={{ minHeight: '100vh', bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress color="secondary" /></Box>;
  }
  if (error) {
    return <Box sx={{ minHeight: '100vh', bgcolor: 'black', color: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Erreur de chargement des véhicules</Box>;
  }

  // Regrouper par véhicule
  const vehiclesMap: Record<string, { name: string; front: string; back: string; found: boolean }[]> = {};
  data?.forEach((vu: any) => {
    const v = vu.vehicle;
    if (!vehiclesMap[v.id]) vehiclesMap[v.id] = [];
    vehiclesMap[v.id].push({ name: v.name, front: v.front, back: v.back, found: vu.found });
  });
  const vehicles = Object.values(vehiclesMap).map(arr => arr[0]); // Un seul par véhicule (statut global)

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 0,
      px: 0,
    }}>  
    <Box
        sx={{
        width: { xs: '100vw', sm: 1100, md: 1400 },
        height: { xs: '100vh', sm: 700, md: 800 },
        bgcolor: '#222',
        borderRadius: 8,
        boxShadow: '0 0 40px 10px #000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '8px solid #333',
        }}
    >
        {accessKey !== 'PURGAT0R' ? <VehicleTabletFake /> : <VehicleTablet vehicles={vehicles} getStatusChip={getStatusChip} />}
      </Box>
    </Box>
  );
};

export default VehicleTabletPage;
