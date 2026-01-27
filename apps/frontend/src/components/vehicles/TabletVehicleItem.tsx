import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Typography, Stack, Button } from '@mui/material';
import ProxiedImage from '@/components/layout/ProxiedImage';

interface TabletVehicleItemProps {
  vehicle: { name: string; front: string; back: string; found: boolean };
  onImageClick: (img: string) => void;
}

const TabletVehicleItem: React.FC<TabletVehicleItemProps> = ({ vehicle, onImageClick }) => {
    const [found, setFound] = useState<boolean>(vehicle.found || false);
    
    const handleToggleFound = () => {
        setFound(!found);
    };

    useEffect(() => {
      vehicle.found = found;
    }, [found]);

  return(
  <Card sx={{ mb: 3, bgcolor: found ? '#1a3d1a' : '#2d0a0a', color: 'white', borderRadius: 3, boxShadow: 4 }}>
    <CardHeader
      title={<Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>{vehicle.name}</Typography>}
      sx={{ bgcolor: found ? '#1a3d1a' : '#2d0a0a', borderTopLeftRadius: 12, borderTopRightRadius: 12, pb: 1 }}
    />
    <CardContent sx={{ px: 3, py: 2 }}>
      <Stack direction="row" spacing={2} justifyContent="center">
        {[vehicle.front, vehicle.back].map((img, i) => (
          <ProxiedImage
            key={i}
            src={img}
            alt={vehicle.name}
            sx={{
              width: 180,
              height: 120,
              objectFit: 'cover',
              borderRadius: 2,
              border: found ? '2px solid #004d00' : '2px solid #6a0000',
              bgcolor: found ? '#1a3d1a' : '#2d0a0a',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => onImageClick(img)}
          />
        ))}
      </Stack>
    </CardContent>
    <CardActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
      <Button
        variant="contained"
        sx={{
          px: 3,
          py: 1,
          borderRadius: 2,
          bgcolor: found ? 'success.main' : 'error.main',
          color: found ? 'common.black' : 'common.white',
          fontWeight: 700,
          fontSize: 16,
          boxShadow: 2,
          '&:hover': {
            bgcolor: found ? 'success.dark' : 'error.dark',
            color: found ? 'common.white' : 'common.white',
          },
        }}
        onClick={() => handleToggleFound()}
      >
        {found ? 'Trouvé' : 'Pas trouvé'}
      </Button>
    </CardActions>
  </Card>
  )
};

export default TabletVehicleItem;   