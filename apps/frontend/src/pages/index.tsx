import { getApolloClient } from '@/lib/apolloClient';
import React, { useEffect } from 'react';
import { USER_UPDATED } from '@/lib/subscriptions/user';
import { useQueryClient, useQuery as useTanstackQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Box, Typography, Button } from '@mui/material';
import { UpdateUserInfoModal } from '@/components/users';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import UserAccountUpdateModal from '@/components/accounts/UserAccountUpdateModal';
import { MainLayout } from '@/components/layout';
import { useUser } from '@/providers/UserProvider';
import {
  Edit
} from '@mui/icons-material';
import MembersCard from '@/components/dashboard/MembersCard';
import CurrentUserCard from '@/components/dashboard/CurrentUserCard';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { GET_MEMBERS } from '@/lib/queries/users';

const HomePage: React.FC = () => {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  const { user, loading } = useUser();
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openAccountModal, setOpenAccountModal] = React.useState(false);

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
        }
      },
      error: (err: any) => {
        if (err?.message) {
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
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
      </Box>

      <DashboardStats />


      {/* Carte utilisateur courant */}
      <Box>
        {/* @ts-ignore */}
        {user && <CurrentUserCard />}
      </Box>

      {/* Boutons actions utilisateur */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<Edit />}
          onClick={() => setOpenEditModal(true)}
        >
          Éditer
        </Button>
        <Button
          variant="outlined"
          color="success"
          startIcon={<AttachMoneyIcon />}
          onClick={() => setOpenAccountModal(true)}
        >
          Mettre à jour mon compte
        </Button>
        <UpdateUserInfoModal open={openEditModal} onClose={() => setOpenEditModal(false)} />

        {user && (<UserAccountUpdateModal userId={user?.id} open={openAccountModal} onClose={() => setOpenAccountModal(false)} />)}
        
      </Box>

        <MembersCard refresh={refresh} online={true} sx={{ mb: 3, p: 2 }} />
        <MembersCard refresh={refresh} online={false} sx={{ mb: 3, p: 2 }} />
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
