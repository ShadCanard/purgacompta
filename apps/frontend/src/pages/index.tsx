import { getApolloClient } from '@/lib/apolloClient';
import React, { useEffect, useState } from 'react';
import { USER_UPDATED } from '@/lib/subscriptions/user';
import { useQueryClient, useQuery as useTanstackQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { Box, Typography, Button } from '@mui/material';
import { UpdateUserInfoModal } from '@/components/users';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import UserAccountUpdateModal from '@/components/accounts/UserAccountUpdateModal';
import { MainLayout } from '@/components/layout';
import { useUser } from '@/providers/UserProvider';
import BlogPage from '@/components/BlogPage';
import {
  Edit
} from '@mui/icons-material';
import MembersCard from '@/components/dashboard/MembersCard';
import CurrentUserCard from '@/components/dashboard/CurrentUserCard';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { GET_MEMBERS } from '@/lib/queries/users';
import { UserRole } from '@purgacompta/common/types/user';

const HomePage: React.FC = () => {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  const { user, loading } = useUser();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [showBlog, setShowBlog] = useState(true);

  // Souscription USER_UPDATED (effet visuel simple)
  // Ajout d'un état local pour forcer le refresh
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
  const roleHierarchy = { GUEST: 0, MEMBER: 1, MANAGER: 2, ADMIN: 3, OWNER: 4 };
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

  useEffect(() => {
    if (user && user.role !== UserRole.GUEST) {
      setShowBlog(false)
    }
  }, [user]);


  if(loading) {
    return (
      <MainLayout>
        <Typography>Chargement...</Typography>
      </MainLayout>
    );
  }

  if (showBlog) {
    return (
        <BlogPage />
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
  return {
    props: {},
  };
};

export default HomePage;
