import React, { useState } from 'react';
import { Box, Typography, Button, ButtonGroup } from '@mui/material';
import { MainLayout } from '@/components';
import { useSnackbar } from '@/providers';
import { Launch } from '@mui/icons-material';
import VehiclesUserList from '@/components/vehicles/VehiclesUserList';
import { useUser, useUpdateUser } from '@/providers/UserProvider';
import TextField from '@mui/material/TextField';

const VehiclesPage: React.FC = () => {
  const { notify} = useSnackbar()!;

  const { user } = useUser();
  const updateUser = useUpdateUser();
  const [tabletUserName, setTabletUserName] = useState<string>(user?.data?.tabletUsername || '');

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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            label="Surnom tablette"
            value={tabletUserName}
            onChange={e => setTabletUserName(e.target.value)}
            size="small"
            sx={{ mr: 2 }}
            placeholder='Surnom tablette'
          />
          <Button variant="contained" color="secondary" 
            onClick={() => {
              updateUser.mutate({
                id: user?.id as string,
                input: { data: { tabletUsername: tabletUserName } },
              });
              notify('Nom de la tablette mis à jour', 'success');}}
            >
            Mettre à jour
          </Button>
        </Box>
        <VehiclesUserList />
      </Box>
    </MainLayout>
  );
};

export default VehiclesPage;
