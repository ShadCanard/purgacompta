import { Paper } from '@mui/material';
import TabletVehicleList from './TabletVehicleList';
import { useState } from 'react';
import ViewImageModal from '../layout/ViewImageModal';

interface VehicleTabletProps {
  vehicles: { name: string; front: string; back: string; found: boolean }[];
  getStatusChip: (found: boolean) => React.ReactNode;
}


const VehicleTablet: React.FC<VehicleTabletProps> = ({ vehicles, getStatusChip }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);

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
        <TabletVehicleList vehicles={vehicles} getStatusChip={getStatusChip} onImageClick={handleOpenModal} />
      </Paper>
      <ViewImageModal open={modalOpen} imageUrl={modalImg} onClose={handleCloseModal} />
    </>
  );
};

export default VehicleTablet;
