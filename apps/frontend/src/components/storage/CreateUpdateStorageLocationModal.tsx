import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApolloClient } from "../../lib/apolloClient";
import { GET_STORAGE_LOCATION_BY_ID } from '../../lib/queries/storages';
import { CREATE_STORAGE_LOCATION, UPDATE_STORAGE_LOCATION } from '../../lib/mutations/storages';

interface Props {
  open: boolean;
  onClose: () => void;
  storageLocationId?: string | null;
}

const CreateUpdateStorageLocationModal: React.FC<Props> = ({ open, onClose, storageLocationId }) => {
  const queryClient = useQueryClient();
  const apolloClient = getApolloClient();
  const isEdit = Boolean(storageLocationId);
  const [name, setName] = useState("");

  // Récupération des données en mode édition
  const { data, isLoading } = useQuery({
    queryKey: ["storageLocation", storageLocationId],
    queryFn: async () => {
      if (!storageLocationId) return null;
      const { data } = await apolloClient.query({
        query: GET_STORAGE_LOCATION_BY_ID,
        variables: { id: storageLocationId },
      });
      return (data as any).storageLocationById;
    },
    enabled: isEdit && !!storageLocationId,
  });

  useEffect(() => {
    if (data && isEdit) setName(data.name || "");
    if (!isEdit) setName("");
  }, [data, isEdit, open]);

  const mutation = useMutation({
    mutationFn: async (variables: any) => {
      if (isEdit && storageLocationId) {
        const { data } = await apolloClient.mutate({
          mutation: UPDATE_STORAGE_LOCATION,
          variables: { id: storageLocationId, input: { name: variables.name } },
        });
        return (data as any).updateStorageLocation;
      } else {
        const { data } = await apolloClient.mutate({
          mutation: CREATE_STORAGE_LOCATION,
          variables: { input: { name: variables.name } },
        });
        return (data as any).createStorageLocation;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storageLocations"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? "Modifier l'emplacement" : "Créer un emplacement"}</DialogTitle>
        <DialogContent>
          {isEdit && isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Nom de l'emplacement"
              type="text"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending || (isEdit && isLoading)}>
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUpdateStorageLocationModal;
