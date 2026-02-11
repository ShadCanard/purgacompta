import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete, CircularProgress } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ADD_GROUP_TO_EVENT } from "@/lib/mutations/events";
import { getApolloClient } from "@/lib/apolloClient";
import { Group } from "@/lib/types";
import { GET_CONTACTS_OR_GROUPS_TRANSACTION } from "@/lib/queries/transactions";

interface InviteGroupsModalProps {
  open: boolean;
  eventId: string;
  groups?: {id: string, name: string, notes?: string, color?: string}[]; // Liste des contestants actuels pour filtrer dans l'autocomplete
  onClose: () => void;
  onSuccess?: () => void;
}

const InviteGroupsModal: React.FC<InviteGroupsModalProps> = ({ open, eventId, groups, onClose, onSuccess }) => {
  const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  const [groupOrContact, setGroupOrContact] = useState<any>(null);

  // Queries
  const { data: selectionData, refetch: refetchGroups, isLoading: groupsLoading } = useQuery({
	queryKey: ['inviteGroupsOrContacts', eventId], // Clé de cache spécifique à l'événement pour éviter les conflits
	queryFn: async () => {
	  const result = await apolloClient.query({ query: GET_CONTACTS_OR_GROUPS_TRANSACTION });
	  const rawData = [(result.data as any).groups.map((g: Group) => ({id: g.id, name: g.name})), ...(result.data as any).contactsWithoutGroup.map((c: any) => ({id: c.id, name: c.name}))];

	  // Filtrer les contacts/groupes déjà participants à l'événement
	  const existingIds = groups?.map(c => c.id) || [];
	  return rawData.flat().filter((item: any) => !existingIds.includes(item.id));
	  
	},
  });

  const inviteGroupMutation = useMutation({
	mutationFn: async () => {
	  const { data } = await apolloClient.mutate({
		mutation: ADD_GROUP_TO_EVENT,
		variables: { groupId: groupOrContact.id, eventId },
	  });
	  return (data as any).addGroupToEvent;
	},
	onSuccess: () => {
	  queryClient.invalidateQueries({queryKey: ['groups', eventId]});
	  setGroupOrContact(null);
	  onClose();
	  if (onSuccess) onSuccess();
	},
  });

  return (
	<Dialog open={open} onClose={onClose}>
	  <DialogTitle>Inviter un groupe</DialogTitle>
	  <DialogContent>
		<Autocomplete
			options={selectionData || []}
			getOptionLabel={option => `${option.name}` || ''}
			value={groupOrContact}
			onChange={async (_, v) => setGroupOrContact(v)}
			renderInput={params => <TextField {...params} label="Groupe à inviter" fullWidth />}
			sx={{ minWidth: 220, flex: 1 }}
			loading={groupsLoading}
				  />
		{inviteGroupMutation.isError && (
		  <div style={{ color: 'red', marginTop: 8 }}>{inviteGroupMutation.error?.message}</div>
		)}
	  </DialogContent>
	  <DialogActions>
		<Button onClick={onClose}>Annuler</Button>
		<Button
		  onClick={() => inviteGroupMutation.mutate()}
		  disabled={!groupOrContact || inviteGroupMutation.isPending}
		  variant="contained"
		  color="primary"
		>
		  {inviteGroupMutation.isPending ? <CircularProgress size={20} /> : 'Ajouter'}
		</Button>
	  </DialogActions>
	</Dialog>
  );
};

export default InviteGroupsModal;
