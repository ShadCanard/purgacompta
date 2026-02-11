import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";

interface Contestant {
  id: string;
  name: string;
}

interface DeclareWinnerModalProps {
  open: boolean;
  onClose: () => void;
  contestants: Contestant[];
  eventId: string;
  onSuccess?: () => void;
  updateEvent: (winnerId: string) => Promise<any>;
  loading?: boolean;
}

const DeclareWinnerModal: React.FC<DeclareWinnerModalProps> = ({
  open,
  onClose,
  contestants,
  eventId,
  onSuccess,
  updateEvent,
  loading = false,
}) => {
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedWinner) return;
    setSubmitting(true);
    try {
      await updateEvent(selectedWinner);
      setSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Déclarer un gagnant</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="winner-select-label">Participant gagnant</InputLabel>
          <Select
            labelId="winner-select-label"
            value={selectedWinner}
            label="Participant gagnant"
            onChange={e => setSelectedWinner(e.target.value)}
            disabled={submitting || loading}
          >
            {contestants.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting || loading}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
          disabled={!selectedWinner || submitting || loading}
          startIcon={submitting || loading ? <CircularProgress size={18} /> : null}
        >
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeclareWinnerModal;
