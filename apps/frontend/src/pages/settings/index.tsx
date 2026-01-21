
import React from 'react';
import { MainLayout } from '@/components/layout';
import { Box, Typography } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Paramètres
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérer les paramètres de l'application et les autorisations des membres.
        </Typography>
      </Box>
      {/* Ajoutez ici d'autres paramètres ou liens vers les sous-pages */}
    </MainLayout>
  );
};

export default SettingsPage;
