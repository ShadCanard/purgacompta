
import React from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import VehicleTablet from '@/components/vehicles/VehicleTablet';
import VehicleTabletFake from '@/components/vehicle/VehicleTabletFake';
import { getApolloClient } from '@/lib/apolloClient';


const VehicleTabletPage: React.FC = () => {
  const router = useRouter();
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();

  const accessKey = typeof window !== 'undefined' ? (router.query.AccessKey as string || '') : '';

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
        {accessKey !== 'PURGAT0R' ? <VehicleTabletFake /> : <VehicleTablet />}
      </Box>
    </Box>
  );
};

export default VehicleTabletPage;
