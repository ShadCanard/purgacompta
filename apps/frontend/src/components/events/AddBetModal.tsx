import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_BET } from "@/lib/mutations/events";
import { getApolloClient } from "@/lib/apolloClient";

interface AddBetModalProps {
  open: boolean;
  eventId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddBetModal: React.FC<AddBetModalProps> = ({ open, eventId, onClose, onSuccess }) => {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  const [betAmount, setBetAmount] = useState("");
  const [betGamblerId, setBetGamblerId] = useState("");

  const createBetMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_BET,
        variables: { eventId, gamblerId: betGamblerId, amount: Number(betAmount) },
      });
      return (data as any).createBet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      setBetAmount("");
      setBetGamblerId("");
      onClose();
      if (onSuccess) onSuccess();
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un pari</DialogTitle>
      <DialogContent>
        <TextField label="ID du joueur" value={betGamblerId} onChange={e => setBetGamblerId(e.target.value)} fullWidth margin="normal" />
        <TextField label="Montant" type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} fullWidth margin="normal" />
        {createBetMutation.isError && (
          <div style={{ color: 'red', marginTop: 8 }}>{(createBetMutation.error as Error)?.message}</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={() => createBetMutation.mutate()}
          disabled={!betGamblerId || !betAmount || createBetMutation.isPending}
          variant="contained"
          color="primary"
        >
          {createBetMutation.isPending ? <CircularProgress size={20} /> : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBetModal;
