import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SET_VEHICLE_USER } from '@/lib/mutations';
import { getApolloClient } from '@/lib/apolloClient';
import { Card, CardHeader, CardContent, CardActions, Typography, Stack, Button } from '@mui/material';
import ConfirmModal from '@/components/layout/ConfirmModal';
import ProxiedImage from '@/components/layout/ProxiedImage';

interface TabletVehicleItemProps {
  vehicle?: { id?: string; user?: { id: string }; vehicle?: {id: string; name: string; front: string; back: string;}; found: boolean };
  onImageClick: (img: string) => void;
}

const VehicleTabletItem: React.FC<TabletVehicleItemProps> = ({ vehicle, onImageClick }) => {
    console.log('VehicleTabletItem vehicle:', vehicle);

    const { mutate: setVehicleUser, isPending } = useMutation({
      mutationFn: async () => {
        await getApolloClient().mutate({
          mutation: SET_VEHICLE_USER,
          variables: { input: { userId: vehicle?.user?.id, vehicleId: vehicle?.vehicle?.id, found: !vehicle?.found } },
        });
      },
      onSuccess: () => {},
    });

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleToggleFound = () => {
      if(vehicle?.found) setVehicleUser();
      else setConfirmOpen(true);
    };

    const handleConfirm = () => {
      setConfirmOpen(false);
      setVehicleUser();
    };

  return(
  <>
  <Card sx={{ mb: 3, bgcolor: vehicle?.found ? '#1a3d1a' : '#2d0a0a', color: 'white', borderRadius: 3, boxShadow: 4 }}>
    <CardHeader
      title={<Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>{vehicle?.vehicle?.name || ''}</Typography>}
      sx={{ bgcolor: vehicle?.found ? '#1a3d1a' : '#2d0a0a', borderTopLeftRadius: 12, borderTopRightRadius: 12, pb: 1 }}
    />
    <CardContent sx={{ px: 3, py: 2 }}>
      <Stack direction="row" spacing={2} justifyContent="center">
          <ProxiedImage
            key={`${vehicle?.id}-front`}
            src={vehicle?.vehicle?.front || ''}
            alt={vehicle?.vehicle?.name || ''}
            sx={{
              width: 180,
              height: 120,
              objectFit: 'cover',
              borderRadius: 2,
              border: vehicle?.found ? '2px solid #004d00' : '2px solid #6a0000',
              bgcolor: vehicle?.found ? '#1a3d1a' : '#2d0a0a',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => onImageClick(vehicle?.vehicle?.front || '')}
          />          
          <ProxiedImage
            key={`${vehicle?.id}-back`}
            src={vehicle?.vehicle?.back || ''}
            alt={vehicle?.vehicle?.name || ''}
            sx={{
              width: 180,
              height: 120,
              objectFit: 'cover',
              borderRadius: 2,
              border: vehicle?.found ? '2px solid #004d00' : '2px solid #6a0000',
              bgcolor: vehicle?.found ? '#1a3d1a' : '#2d0a0a',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => onImageClick(vehicle?.vehicle?.back || '')}
          />
      </Stack>
    </CardContent>
    <CardActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
      <Button
        variant="contained"
        sx={{
          px: 3,
          py: 1,
          borderRadius: 2,
          bgcolor: vehicle?.found ? 'success.main' : 'error.main',
          color: vehicle?.found ? 'common.black' : 'common.white',
          fontWeight: 700,
          fontSize: 16,
          boxShadow: 2,
          '&:hover': {
            bgcolor: vehicle?.found ? 'success.dark' : 'error.dark',
            color: vehicle?.found ? 'common.white' : 'common.white',
          },
        }}
        onClick={handleToggleFound}
        disabled={isPending}
      >
        {vehicle?.found ? 'Trouvé' : 'Pas trouvé'}
      </Button>
    </CardActions>
  </Card>
  <ConfirmModal
    open={confirmOpen}
    title={vehicle?.found ? 'Marquer comme non trouvé ?' : 'Marquer comme trouvé ?'}
    content={vehicle?.found ? 'Voulez-vous vraiment marquer ce véhicule comme non trouvé ?' : 'Voulez-vous vraiment marquer ce véhicule comme trouvé ?'}
    confirmLabel={vehicle?.found ? 'Non trouvé' : 'Trouvé'}
    cancelLabel="Annuler"
    loading={isPending}
    onConfirm={handleConfirm}
    onCancel={() => setConfirmOpen(false)}
  />
  </>)
};

export default VehicleTabletItem;   