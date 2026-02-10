import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_CONTESTANT } from "@/lib/mutations/events";
import { getApolloClient } from "@/lib/apolloClient";
import { GET_CONTACTS_OR_GROUPS_TRANSACTION } from "@/lib/queries/transactions";
import { Group } from "@/lib/types";

interface AddOrCreateContestantModalProps {
  open: boolean;
  eventId: string;
  contestants?: {id: string, name: string, notes?: string, color?: string}[]; // Liste des contestants actuels pour filtrer dans l'autocomplete
  onClose: () => void;
  onSuccess?: () => void;
}

const AddOrCreateContestantModal: React.FC<AddOrCreateContestantModalProps> = ({ open, eventId, contestants, onClose, onSuccess }) => {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  const [groupOrContact, setGroupOrContact] = useState<any>(null);

  // Queries
  const { data: selectionData, refetch: refetchContactsOrGroups, isLoading: groupsOrContactsLoading } = useQuery({
    queryKey: ['contactsGroups', eventId], // Clé de cache spécifique à l'événement pour éviter les conflits
    queryFn: async () => {
      const result = await apolloClient.query({ query: GET_CONTACTS_OR_GROUPS_TRANSACTION });
	  const rawData = [(result.data as any).groups.map((g: Group) => ({id: g.id, name: g.name})), ...(result.data as any).contactsWithoutGroup.map((c: any) => ({id: c.id, name: c.name}))];

	  // Filtrer les contacts/groupes déjà participants à l'événement
	  const existingIds = contestants?.map(c => c.id) || [];
	  return rawData.flat().filter((item: any) => !existingIds.includes(item.id));
	  
    },
  });

  const createContestantMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_CONTESTANT,
        variables: { contestantId: groupOrContact.id, eventId },
      });
      return (data as any).createContestant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['contactsGroups', eventId]});
      queryClient.invalidateQueries({queryKey: ['contestants', eventId]});
      setGroupOrContact(null);
      onClose();
      if (onSuccess) onSuccess();
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un participant</DialogTitle>
      <DialogContent>
        <Autocomplete
            options={selectionData || []}
            getOptionLabel={option => `${option.name}` || ''}
            value={groupOrContact}
            onChange={async (_, v) => setGroupOrContact(v)}
            renderInput={params => <TextField {...params} label="Groupe ou contact" fullWidth />}
            sx={{ minWidth: 220, flex: 1 }}
            loading={groupsOrContactsLoading}
                  />
        {createContestantMutation.isError && (
          <div style={{ color: 'red', marginTop: 8 }}>{(createContestantMutation.error as Error)?.message}</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={() => createContestantMutation.mutate()}
          disabled={!groupOrContact || createContestantMutation.isPending}
          variant="contained"
          color="primary"
        >
          {createContestantMutation.isPending ? <CircularProgress size={20} /> : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrCreateContestantModal;
