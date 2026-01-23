import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Box, Typography, Card, CardContent, Grid, Stack, Button } from '@mui/material';
import { MainLayout } from '@/components/layout';
import { useUser } from '@/providers/UserProvider';
import {
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  OnlinePrediction,
} from '@mui/icons-material';
import MembersGrid from '@/components/dashboard/MembersGrid';
import CurrentUserCard from '@/components/dashboard/CurrentUserCard';
import StatCard from '@/components/layout/StatCard';
import { GET_MEMBERS } from '@/lib/queries';

const HomePage: React.FC = () => {
  const { user, loading } = useUser();
  // Récupération des membres pour compter les online
  const { data: membersData } = useTanstackQuery({
    queryKey: ['dashboard-members'],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only' });
      const users = (result.data as { users: any[] }).users;
      // Affiche MEMBER ou supérieur, sans l'utilisateur courant
      const hierarchy = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      return users.filter(u => hierarchy.indexOf(u.role) >= hierarchy.indexOf('MEMBER'));
    },
  });
  const onlineCount = (membersData || []).filter((u: any) => u.isOnline).length;

  if(loading) {
    return 
    <MainLayout>
      <Typography>Chargement...</Typography>
    </MainLayout>;
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenue sur Purgatory Compta
          {user && `, ${user.name}`}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Solde Total"
            value="$0"
            icon={<AccountBalanceIcon sx={{ fontSize: 32 }} />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Transactions"
            value="0"
            icon={<ReceiptIcon sx={{ fontSize: 32 }} />}
            color="#ff5722"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenus"
            value="$0"
            icon={<TrendingUpIcon sx={{ fontSize: 32 }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Caisse Noire"
            value="0"
            icon={<AccountBalanceIcon sx={{ fontSize: 32 }} />}
            color="#2196f3"
          />
        </Grid>
      </Grid>

      {/* Carte utilisateur courant */}
      <Box>
        {/* @ts-ignore */}
        {user && <CurrentUserCard />}
      </Box>

      <Card
        sx={{
          background: 'rgba(30, 30, 46, 0.8)',
          border: '1px solid rgba(156, 39, 176, 0.2)',
          borderRadius: 3,
          p: 3,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Membres ({onlineCount} en ligne)
          </Typography>
        </Stack>
        <MembersGrid />
      </Card>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default HomePage;
