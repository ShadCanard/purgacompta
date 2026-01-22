import React, { useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert } from '@mui/material';

interface ImportContactModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (contacts: any[]) => void;
}

const ImportContactModal: React.FC<ImportContactModalProps> = ({ open, onClose, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);    
    const text = await file.text();
    setFileContent(text);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onValidate = async () => {
        try {
            let data;
            try {
                data = JSON.parse(fileContent);
            } catch (err) {
                throw new Error('Le fichier n\'est pas un JSON valide');
            }
            if (!Array.isArray(data)) throw new Error('Le fichier JSON doit contenir un tableau');
            if (data.length === 0) throw new Error('Aucun contact trouvé dans le fichier');
            // Validation stricte de la structure
            const invalid = data.find(
                (c: any) => typeof c.display !== 'string' || typeof c.number !== 'string' || !c.display.trim() || !c.number.trim()
            );
            if (invalid) throw new Error('Chaque contact doit contenir les champs "display" (string) et "number" (string)');
            onImport(data);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la lecture du fichier');
        } finally {
            setLoading(false);
        }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Importer des contacts (JSON)</DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={2}>
          Importez le fichier téléchargé depuis l'intra 21JumpClick ("Personnel" &rbrack; "Mes contacts") au format JSON.<br/>
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={loading}
        />
        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="outlined" onClick={handleButtonClick} disabled={loading}>
            Choisir un fichier
          </Button>
          <Typography variant="body2">{fileName}</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onValidate} disabled={loading || !fileName} variant="contained" color="primary">Importer</Button>
        <Button onClick={onClose} disabled={loading}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportContactModal;
