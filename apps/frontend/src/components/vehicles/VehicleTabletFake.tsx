import React from 'react';
import { Box, Typography } from '@mui/material';

const VehicleTabletFake: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      <Box
        sx={{
          bgcolor: 'black',
          borderRadius: 0,
          px: 0,
          py: 0,
          width: '100%',
          boxShadow: 'none',
        }}
      >
        <Typography
          component="pre"
          sx={{
            color: '#00FF00',
            fontFamily: 'monospace',
            fontSize: 20,
            whiteSpace: 'pre',
            mb: 0,
            width: '100%',
            p: 3,
            boxSizing: 'border-box',
            textAlign: 'left',
          }}
        >
{`[TABLET] Initializing...\n\n> Loading drivers .......... OK\n> Checking hardware ........ OK\n> Connecting to DB://192.168.666.666 ...\n> Authenticating ..........\n> Access denied: insufficient permissions.\n\n[ERREUR] Connexion à la base de données impossible : accès refusé.\n`}
        </Typography>
      </Box>
    </Box>
  );
};

export default VehicleTabletFake;
