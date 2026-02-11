import React, { useState } from "react";
import { formatDollar } from "@/lib/utils";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Autocomplete } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CREATE_BET } from "@/lib/mutations/events";
import { getApolloClient } from "@/lib/apolloClient";
import { GET_CONTACTS_OR_GROUPS_TRANSACTION } from "@/lib/queries/transactions";
import { Group } from "@/lib/types";
import { GET_CONTESTANTS_BY_EVENT } from "@/lib/queries/events";

interface AddBetModalProps {
  open: boolean;
  eventId: string;
  gamblerId?: string;
  contestantId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddBetModal: React.FC<AddBetModalProps> = ({ open, eventId, gamblerId, contestantId, onClose, onSuccess }) => {
  	const apolloClient = getApolloClient();
  	const queryClient = useQueryClient();
  	const [betAmount, setBetAmount] = useState("");
  	const [betGamblerId, setBetGamblerId] = useState(gamblerId || "");
  	const [betContestantId, setBetContestantId] = useState(contestantId || "");

	console.dir({eventId, gamblerId, contestantId});
	console.dir({betGamblerId, betContestantId, betAmount});

  	const {data: gamblerData, isLoading: gamblerLoading} = useQuery({
	queryKey: ['gamblers'],
	queryFn: async () => {
			const result = await apolloClient.query({ query: GET_CONTACTS_OR_GROUPS_TRANSACTION });
			const rawData = [(result.data as any).groups.map((g: Group) => ({id: g.id, name: g.name})), ...(result.data as any).contactsWithoutGroup.map((c: any) => ({id: c.id, name: c.name}))];
			return rawData;
		}
	});

	const {data: contestantData, isLoading: contestantLoading} = useQuery({
	queryKey: ['contestants', eventId],
	queryFn: async () => {
			const result = await apolloClient.query({ query: GET_CONTESTANTS_BY_EVENT, variables: { eventId } });
			const data = (result.data as any).contestantsByEvent;
			return data;
		}
	});

  const createBetMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_BET,
        variables: { eventId, gamblerId: betGamblerId, contestantId: betContestantId, amount: Number(betAmount) },
      });
      return (data as any).createBet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      setBetAmount("");
      setBetGamblerId("");
      setBetContestantId("");
      onClose();
      if (onSuccess) onSuccess();
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un pari</DialogTitle>
      <DialogContent>
        {!betGamblerId && (<Autocomplete
          options={gamblerData ? gamblerData.flat() : []}
          getOptionLabel={(option: any) => option.name || ''}
          value={gamblerData ? gamblerData.flat().find((g: any) => g.id === betGamblerId) || null : null}
          onChange={(_, newValue) => setBetGamblerId(newValue ? newValue.id : '')}
          loading={gamblerLoading}
          renderInput={(params) => (
            <TextField {...params} label="Joueur" margin="normal" fullWidth />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        /> )}
        {!betContestantId && (
			<Autocomplete
        		options={contestantData || []}
        		getOptionLabel={(option: any) => option.name || ''}
        		value={contestantData ? contestantData.find((c: any) => c.id === betContestantId) || null : null}
        		onChange={(_, newValue) => setBetContestantId(newValue ? newValue.id : '')}
        		loading={contestantLoading}
        		renderInput={(params) => (
        			<TextField {...params} label="Concurrent" margin="normal" fullWidth />
        		)}
        		isOptionEqualToValue={(option, value) => option.id === value.id}
        />
		)}

		<TextField
			label="Montant"
			type="text"
			value={formatDollar(betAmount === '' ? 0 : parseFloat(betAmount.replace(/\s/g, '').replace(',', '.')))}
			onChange={e => {
			// Autorise chiffres, point, virgule et un seul signe moins au début
			let val = e.target.value
				.replace(/(?!^)-/g, '') // supprime tous les - sauf le premier caractère
				.replace(/[^\d.,-]/g, '');
			setBetAmount(val);
			}}
			required
			fullWidth
			sx={{mt: 2}}
			inputProps={{ inputMode: 'numeric', pattern: '^-?[0-9]*' }}
			helperText="Les paris seront validés par le Purgatory."
		/>
        {createBetMutation.isError && (
          <div style={{ color: 'red', marginTop: 8 }}>{(createBetMutation.error as Error)?.message}</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={() => createBetMutation.mutate()}
          disabled={!betGamblerId || !betContestantId || !betAmount || createBetMutation.isPending}
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
