import React from 'react';
import { Modal, Box } from '@mui/material';
import ProxiedImage from './ProxiedImage';

interface ViewImageModalProps {
  open: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ViewImageModal: React.FC<ViewImageModalProps> = ({ open, imageUrl, onClose }) => {
  // Empêche la fermeture si clic sur l'image ou le bouton
  const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si clic sur l'image ou le bouton, ne rien faire
    if ((e.target as HTMLElement).closest('.image-modal-content, .image-modal-close')) return;
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box onClick={handleBoxClick} sx={{ position: 'relative', width: '80vw', height: '80vh', bgcolor: 'black', borderRadius: 4, boxShadow: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        {/* Bouton de fermeture */}
        <Box className="image-modal-close" onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2, cursor: 'pointer', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '50%', p: 1 }}>
          <svg width="32" height="32" viewBox="0 0 32 32"><line x1="8" y1="8" x2="24" y2="24" stroke="white" strokeWidth="3"/><line x1="24" y1="8" x2="8" y2="24" stroke="white" strokeWidth="3"/></svg>
        </Box>
        {imageUrl && (
          <ProxiedImage onClick={onClose} className="image-modal-content" src={imageUrl} alt="Aperçu véhicule" sx={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 2, boxShadow: 4, transition: 'opacity 0.3s', opacity: open ? 1 : 0, cursor: 'pointer' }} />
        )}
      </Box>
    </Modal>
  );
};

export default ViewImageModal;
