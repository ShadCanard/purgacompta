import { Paper } from '@mui/material';
import VehicleTabletList from './VehicleTabletList';
import { useState } from 'react';
import ViewImageModal from '../layout/ViewImageModal';
import { useQueryClient } from '@tanstack/react-query';
import { getApolloClient } from '@/lib/apolloClient';

const VehicleTablet: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  

  const handleOpenModal = (img: string) => {
    setModalImg(img);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalImg(null);
  };

  
  return (
    <>
      <Paper elevation={0} sx={{ bgcolor: '#6a0000', p: 2, width: '98%', height: '96%', mx: 'auto', overflowY: 'auto', boxShadow: 'none' }}>
        <VehicleTabletList onImageClick={handleOpenModal} />
      </Paper>
      <ViewImageModal open={modalOpen} imageUrl={modalImg} onClose={handleCloseModal} />
    </>
  );
};

export default VehicleTablet;
