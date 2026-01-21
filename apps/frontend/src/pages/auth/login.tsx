import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
} from '@mui/material';
import Image from 'next/image';

const LoginPage: React.FC = () => {
  const handleDiscordLogin = () => {
    signIn('discord', { callbackUrl: '/' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(156, 39, 176, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 87, 34, 0.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            background: 'rgba(30, 30, 46, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(156, 39, 176, 0.3)',
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #9c27b0, #ff5722)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                🔥 Purgatory
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                Compta
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Système de comptabilité pour organisation criminelle
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Connectez-vous avec votre compte Discord pour accéder au système.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleDiscordLogin}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: '#5865F2',
                  '&:hover': {
                    background: '#4752C4',
                  },
                  borderRadius: 2,
                }}
                startIcon={
                  <svg width="24" height="24" viewBox="0 0 71 55" fill="currentColor">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5765 44.3433C53.8381 44.6363 54.2104 44.9293 54.5765 45.2082C54.7052 45.304 54.6968 45.5041 54.5569 45.5858C52.7882 46.6197 50.9495 47.4931 49.0157 48.2228C48.8898 48.2707 48.8338 48.4172 48.8954 48.5383C49.9617 50.6035 51.1791 52.57 52.5765 54.435C52.6325 54.5139 52.7332 54.5477 52.8256 54.5195C58.6247 52.7249 64.5073 50.0174 70.5802 45.5576C70.6334 45.5182 70.667 45.459 70.6726 45.3942C72.1668 30.0791 68.2085 16.7757 60.1997 4.9823C60.1802 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1099 30.1693C30.1099 34.1136 27.2792 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.768 23.0133 47.3178 23.0133C50.8999 23.0133 53.8545 26.2532 53.8017 30.1693C53.8017 34.1136 50.8999 37.3253 47.3178 37.3253Z"/>
                  </svg>
                }
              >
                Se connecter avec Discord
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
                En vous connectant, vous acceptez les conditions d'utilisation de Purgatory Compta.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 4 }}
        >
          © 2026 Purgatory Organization - GTA RP
        </Typography>
      </Container>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // Rediriger vers l'accueil si déjà connecté
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
