import React from 'react';
import { Box, Typography } from '@mui/material';

interface EnvBannerProps {
  env?: 'DEV' | 'RECETTE';
}

const colorMap = {
  DEV: '#43a047', // vert
  RECETTE: '#fbc02d', // jaune
};

const EnvBanner: React.FC<EnvBannerProps> = ({ env }) => {
  if (!env) return null;
  return (
    <Box
      sx={{
        position: 'fixed',
        top: (env === "RECETTE" ? 25 : 0),
        right: (env === "RECETTE" ? 25 : 10),
        zIndex: 3000,
        transform: 'translateY(0) translateX(40%) rotate(45deg)',
        bgcolor: colorMap[env],
        color: env === 'DEV' ? '#fff' : '#222',
        px: 10,
        py: 1.5,
        boxShadow: 6,
        borderRadius: 0,
        minWidth: 180,
        textAlign: 'center',
        fontWeight: 700,
        letterSpacing: 2,
        fontSize: '1.3rem',
        userSelect: 'none',
        pointerEvents: 'none',
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: 2, fontSize: '1.3rem' }}>
        {env}
      </Typography>
    </Box>
  );
};

export default EnvBanner;
