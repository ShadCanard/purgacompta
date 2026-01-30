import { getApolloClient } from '@/lib/apolloClient';
import React, { useEffect } from 'react';
import { USER_UPDATED } from '@/lib/subscriptions/user';
import { useQueryClient, useQuery as useTanstackQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Box, Typography, Card, Grid, Stack, Button } from '@mui/material';
import { UpdateUserInfoModal } from '@/components/users';
import { MainLayout } from '@/components/layout';
import { useUser } from '@/providers/UserProvider';
import {
  AccountBalance as AccountBalanceIcon,
  Edit,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import MembersGrid from '@/components/dashboard/MembersGrid';
import CurrentUserCard from '@/components/dashboard/CurrentUserCard';
import StatCard from '@/components/layout/StatCard';
import { GET_MEMBERS } from '@/lib/queries/users';

const HomePage: React.FC = () => {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  const { user, loading } = useUser();

  // Souscription USER_UPDATED (effet visuel simple)
  // Ajout d'un état local pour forcer le refresh
  const [refresh, setRefresh] = React.useState(0);
  useEffect(() => {
    const sub = apolloClient.subscribe({ query: USER_UPDATED }).subscribe({
      next: async (result: any) => {
        const { data } = result;
        if (data?.userUpdated) {
          // Invalider explicitement le cache Apollo pour la liste des membres
          apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'users' });
          apolloClient.cache.gc();
          setRefresh((r) => r + 1); // Incrémente pour forcer le refetch
        } else {
        }
      },
      error: (err: any) => {
        if (err && err.message) {
          alert('Erreur subscription USER_UPDATED : ' + err.message);
        }
      },
    });
    return () => sub.unsubscribe();
  }, [apolloClient, queryClient]);

  // Récupération des membres pour compter les online
  const { data: membersData } = useTanstackQuery({
    queryKey: ['dashboard-members', refresh],
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_MEMBERS, fetchPolicy: 'network-only' });
      const users = (result.data as { users: any[] }).users;
      // Affiche MEMBER ou supérieur, sans l'utilisateur courant
      const hierarchy = ['GUEST', 'MEMBER', 'MANAGER', 'ADMIN', 'OWNER'];
      return users.filter(u => hierarchy.indexOf(u.role) >= hierarchy.indexOf('MEMBER'));
    },
  });
  const onlineCount = (membersData || []).filter((u: any) => u.data.isOnline).length;


  const [openEditModal, setOpenEditModal] = React.useState(false);

  if(loading) {
    return (
      <MainLayout>
        <Typography>Chargement...</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Edit />}
              onClick={() => setOpenEditModal(true)}
            >
              Éditer
            </Button>
            <UpdateUserInfoModal open={openEditModal} onClose={() => setOpenEditModal(false)} />
          </Box>
        </Stack>
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
        <MembersGrid refresh={refresh} />
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
