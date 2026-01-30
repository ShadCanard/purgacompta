import { Paper, Typography } from '@mui/material';
import VehicleTabletList from './VehicleTabletList';
import { useEffect, useState } from 'react';
import ViewImageModal from '../layout/ViewImageModal';
import { useQueryClient } from '@tanstack/react-query';
import { getApolloClient } from '@/lib/apolloClient';
import { User, UserData } from '@/purgacompta/common';
import { useMembers } from '@/providers/UserProvider';
import { useSubscription } from '@/lib/useSubscription';
import { USER_UPDATED } from '@/lib/subscriptions/user';

const VehicleTablet: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  const members = useMembers();
  const userUpdated = useSubscription(USER_UPDATED);

  const handleOpenModal = (img: string) => {
    setModalImg(img);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalImg(null);
  };


  // Subscription USER_UPDATED pour rafraîchir la liste en temps réel
  useEffect(() => {
    if(userUpdated)
      queryClient.invalidateQueries({ queryKey: ['members-list'] });
  }, [userUpdated]);

  // Filtre les membres ayant manageTablet:true et extrait TabletUserName
  const managingTabletMembers = members.data?.filter((u: User) => {
    let userData = u.data;
    if (typeof userData === 'string') {
      try { userData = JSON.parse(userData); } catch { userData = { manageTablet: false }; }
    }
    return userData?.manageTablet === true;
  });

  // Récupère le premier TabletUserName trouvé (ou null)
  let tabletUserName: string | null = null;
  for (const u of managingTabletMembers || []) {
    let userData : UserData = u.data;
    if (typeof userData === 'string') {
      try { userData = JSON.parse(userData); } catch { userData = { manageTablet: false }; }
    }
    if (userData?.tabletUsername) {
      tabletUserName = userData.tabletUsername;
      break;
    }
  }
  console.dir(managingTabletMembers);

  return (
    <>
      <Paper elevation={0} sx={{ bgcolor: '#6a0000', p: 2, width: '98%', height: '96%', mx: 'auto', overflowY: 'auto', boxShadow: 'none' }}>
        <Typography variant="h4" align="center" sx={{ color: 'white', fontWeight: 700, mb: 1.5 }}>
          Tablette Purgatory
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ color: 'white', fontWeight: 400, mb: 2 }}>
          Vos contacts du jour :{' '}
          {managingTabletMembers?.length === 0
            ? <span style={{ color: '#fff' }}>Aucun contact disponible</span>
            : managingTabletMembers?.map((u: any, idx: number) => (
                <span key={u.id} style={{ color: '#fff' }}>
                  {u.data.tabletUsername} <span style={{ color: '#aaa', fontSize: 14 }}>({u.data.phone || 'N/A'})</span>{idx < managingTabletMembers.length - 1 ? ', ' : ''}
                </span>
              ))
          }
        </Typography>
        <VehicleTabletList onImageClick={handleOpenModal} />
      </Paper>
      <ViewImageModal open={modalOpen} imageUrl={modalImg} onClose={handleCloseModal} />
    </>
  );
};

export default VehicleTablet;
