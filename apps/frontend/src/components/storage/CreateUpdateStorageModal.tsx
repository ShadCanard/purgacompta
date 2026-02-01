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
import { GET_STORAGE_BY_ID } from '../../lib/queries/storages';
import { CREATE_STORAGE, UPDATE_STORAGE } from '../../lib/mutations/storages';
import { Autocomplete } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  storageLocationId?: string | null;
  storageId?: string | null;
}

const STORAGE_TYPES = [
  { label: 'Armurerie', value: 'ARMORY' },
  { label: 'Stockage', value: 'STORAGE' },
  { label: 'Frigo', value: 'FRIDGE' },
];

const CreateUpdateStorageModal: React.FC<Props> = ({ open, onClose, storageLocationId, storageId }) => {
  const queryClient = useQueryClient();
  const apolloClient = getApolloClient();
  const isEdit = Boolean(storageId);
  const [name, setName] = useState("");
  const [type, setType] = useState(STORAGE_TYPES[1]); // Par défaut "STORAGE"
  const [maxWeight, setMaxWeight] = useState("");

  // Récupération des données en mode édition
  const { data, isLoading } = useQuery({
    queryKey: ["storage", storageId],
    queryFn: async () => {
      if (!storageId) return null;
      const { data } = await apolloClient.query({
        query: GET_STORAGE_BY_ID,
        variables: { id: storageId },
      });
      return (data as any).storageById;
    },
    enabled: isEdit && !!storageId,
  });

  useEffect(() => {
    if (data && isEdit) {
      setName(data.name || "");
      setType(STORAGE_TYPES.find(t => t.value === data.type) || STORAGE_TYPES[1]);
      setMaxWeight(data.maxWeight || "");
    }
    if (!isEdit) {
      setName("");
      setType(STORAGE_TYPES[1]);
      setMaxWeight("");
    }
  }, [data, isEdit, open]);

  const mutation = useMutation({
    mutationFn: async (variables: any) => {
      const input = { ...variables, type: type.value };
      if (isEdit && storageId) {
        const { data } = await apolloClient.mutate({
          mutation: UPDATE_STORAGE,
          variables: { input: { name, type: type.value, maxWeight: maxWeight ? parseFloat(maxWeight) : null, storageId } },
        });
        return (data as any).updateStorage;
      } else {
        const { data } = await apolloClient.mutate({
          mutation: CREATE_STORAGE,
          variables: { input: { ...input, storageLocationId } },
        });
        return (data as any).createStorage;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storages"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, maxWeight: maxWeight ? parseFloat(maxWeight) : null });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? "Modifier le stockage" : "Créer un stockage"}</DialogTitle>
        <DialogContent>
          {isEdit && isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Nom du stockage"
                type="text"
                fullWidth
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <label style={{ fontSize: 14, color: '#888' }}>Type de stockage</label>
                <br />
                <Autocomplete
                  options={STORAGE_TYPES}
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  value={type}
                  onChange={(_, value) => setType(value || STORAGE_TYPES[1])}
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" label="Type de stockage" fullWidth required />
                  )}
                />
              </div>
              <TextField
                margin="dense"
                label="Poids max (kg)"
                type="number"
                fullWidth
                value={maxWeight}
                onChange={e => setMaxWeight(e.target.value)}
              />
            </>
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

export default CreateUpdateStorageModal;
