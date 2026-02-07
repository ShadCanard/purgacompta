import React from 'react';
import { Box, Typography, Paper, Button, Divider, Alert, Modal } from '@mui/material';
import ProxiedImage from './layout/ProxiedImage';

const BlogPage: React.FC = () => {

        const [modalOpen, setModalOpen] = React.useState(false);
        const handleJoinClick = () => setModalOpen(true);
        const handleClose = () => setModalOpen(false);


        return (
  <Box sx={{ mx: 'auto' }}>
    <Paper elevation={4} sx={{ bgcolor: '#222', color: '#eee' }}>
      <Box display="flex" alignItems="center">
        <ProxiedImage 
        src="https://lh6.googleusercontent.com/F22UME4mNk3WNcnQkoiiKyUYUCo11KziX4r8Jhh8afJ5aSeVZNosMGBlAvybjPFPv4YE_39UNtD-Mbn11CS-d26gTdMrbi3o_ofiAT-Ui4G0u9bO2TN5D7K7-vTIfcZHxQMLJpGLP9PIdknen0NqK_F_Y9gH9djYkyI_ExQ0PYLT5prBrk8Rmfai8BCHUw" 
        alt="Dignity Village"
        sx={{ maxHeight: '400px', objectFit: 'cover', width: '100%', borderRadius: 2, mb: 3 }}
        />
      </Box>
      <Typography variant="h1" sx={{textAlign:"center"}} fontWeight={700} gutterBottom>
        Bienvenue à Dignity Village
      </Typography>
        <Alert severity="info" sx={{ m: 3, bgcolor: '#e3f2fd', color: '#1976d2', borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom color="#1976d2">
            Assemblée Générale 2026
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Le 4 février à 14h30</strong> sous le pont de Paleto Bay, Blaine County.<br />
            Venez rencontrer la communauté, partager vos idées et découvrir les nouveautés du camp !
        </Typography>
        </Alert>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
        Dignity Village en quelques mots
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
        Je vis ici, à Dignity Village, avec d'autres habitants de San Andreas qui ont trouvé refuge sous ce pont. On partage nos histoires, nos galères et nos rêves. On s'entraide pour rester debout, pour garder la dignité qui nous reste, et pour profiter des petits plaisirs de la vie, même quand elle est rude.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Notre objectif :</strong> Permettre à chacun de trouver sa place, lutter contre l'isolement, et vivre ensemble malgré les difficultés de Blaine County.
        </Typography>
        <Button variant="contained" color="success" sx={{ mt: 2, mb: 3 }} onClick={handleJoinClick}>
        Je veux rejoindre le camp
        </Button>
        <Modal open={modalOpen} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-desc">
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4, minWidth: 320 }}>
            <Typography id="modal-title" variant="h6" fontWeight={700} gutterBottom>
            Inscriptions fermées
            </Typography>
            <Typography id="modal-desc" variant="body1" sx={{ mb: 2 }}>
            Les inscriptions à Dignity Village sont actuellement fermées.<br />
            Merci de votre compréhension.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClose}>
            Fermer
            </Button>
        </Box>
        </Modal>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
        Activités
        </Typography>
        <ul style={{ fontSize: '1.1em', marginBottom: 24 }}>
        <li>Feux de camp et musique chaque soir</li>
        <li>Jeux de société et cartes</li>
        <li>Marché improvisé : troc, objets trouvés</li>
        <li>Conférences et histoires de vie</li>
        <li>Protection du camp et entraide</li>
        </ul>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
        Cotisations
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>20$ / an</strong> pour soutenir le camp (assurance, matériel, événements).<br />
        Tarif réduit pour les couples : <strong>15$</strong> pour la deuxième personne.<br />
        Inscription après le 30 juin : <strong>10$</strong>.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
        Certaines activités (gym, danse, sorties) peuvent demander un supplément.
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
            Témoignages des habitants
        </Typography>
        <Box sx={{ mb: 2 }}>
            <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#e0e0e0', color: '#222', }}>
            <Typography variant="body1" fontStyle="italic">
                « Ici, on n’a pas grand-chose, mais on partage tout. Le feu de camp, c’est notre salon, et les histoires, notre trésor. »
            </Typography>
            <Typography variant="caption" color="#555">
                — Martha, 62 ans, habitante depuis 3 ans
            </Typography>
            </Paper>
            <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#e0e0e0', color: '#222', }}>
            <Typography variant="body1" fontStyle="italic">
                « J’ai trouvé ici une vraie famille. Même quand la vie est dure à Blaine County, on se serre les coudes. »
            </Typography>
            <Typography variant="caption">
                — Luis, 41 ans, ancien routier
            </Typography>
            </Paper>
            <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#e0e0e0', color: '#222', }}>
            <Typography variant="body1" fontStyle="italic">
                « Dignity Village m’a redonné espoir. Ici, personne ne te juge, tout le monde t’écoute. »
            </Typography>
            <Typography variant="caption">
                — Samir, 29 ans, arrivé il y a 6 mois
            </Typography>
            </Paper>
        </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
                    <Typography variant="caption" color="#888">
                        <em>"La dignité, c'est tout ce qu'il nous reste. Et c'est déjà beaucoup."</em>
                    </Typography>
                    <Typography variant="caption" color="#888">
                        Dignity Village, San Andreas © 2026
                    </Typography>
                    <Box>
                        <Button variant="text" color="secondary" href="/auth/login" sx={{ fontSize: '0.9em', textTransform: 'none' }}>
                            admin
                        </Button>
                    </Box>
                </Box>
    </Paper>
    </Box>
);
};

export default BlogPage;