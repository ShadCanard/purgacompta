import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const AuthErrorPage: React.FC = () => {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (errorCode: string | string[] | undefined): string => {
    switch (errorCode) {
      case 'Configuration':
        return 'Il y a un problème de configuration du serveur.';
      case 'AccessDenied':
        return 'Accès refusé. Vous n\'êtes pas autorisé à vous connecter.';
      case 'Verification':
        return 'Le lien de vérification a expiré ou a déjà été utilisé.';
      case 'OAuthSignin':
        return 'Erreur lors de la connexion OAuth.';
      case 'OAuthCallback':
        return 'Erreur lors du callback OAuth.';
      case 'OAuthCreateAccount':
        return 'Impossible de créer un compte OAuth.';
      case 'EmailCreateAccount':
        return 'Impossible de créer un compte avec cet email.';
      case 'Callback':
        return 'Erreur lors du callback d\'authentification.';
      case 'OAuthAccountNotLinked':
        return 'Cet email est déjà associé à un autre compte.';
      case 'EmailSignin':
        return 'Erreur lors de l\'envoi de l\'email de connexion.';
      case 'CredentialsSignin':
        return 'Identifiants invalides.';
      case 'SessionRequired':
        return 'Veuillez vous connecter pour accéder à cette page.';
      default:
        return 'Une erreur inattendue s\'est produite.';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            background: 'rgba(30, 30, 46, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Erreur d'authentification
            </Typography>
            
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              {getErrorMessage(error)}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/auth/login')}
            >
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AuthErrorPage;
