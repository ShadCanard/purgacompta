import React from 'react';
import { Box, Typography, Button, ButtonGroup } from '@mui/material';
import { MainLayout } from '@/components';
import { useSnackbar } from '@/providers';
import { Launch } from '@mui/icons-material';
import VehiclesUserList from '@/components/vehicles/VehiclesUserList';
const VehiclesPage: React.FC = () => {
  const { notify} = useSnackbar()!;

  return (
    <MainLayout>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'white', mr: 2 }}>Gestion des véhicules par membre</Typography>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button
              variant="contained"
              color="primary"
              endIcon={<Launch />}
              onClick={() => window.open('/vehicles/tablet?AccessKey=PURGAT0R', '_blank', 'noopener,noreferrer')}
            >
              Tablette
            </Button>
            <Button
              variant="contained"
              color="success"
              endIcon={<Launch />}
              onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/vehicles/tablet?AccessKey=PURGAT0R`); notify("Lien copié dans le presse-papier","success");}}
            >
              Presse-Papier
            </Button>
          </ButtonGroup>
        </Box>
        <VehiclesUserList />
      </Box>
    </MainLayout>
  );
};

export default VehiclesPage;
