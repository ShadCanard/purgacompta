import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GET_VEHICLES } from '../../../lib/queries';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import ActionsMenu from '@/components/layout/ActionsMenu';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DELETE_VEHICLE } from '@/lib/mutations';
import CreateUpdateVehicleModal from '@/components/vehicles/CreateUpdateVehicleModal';
import { MainLayout } from '@/components';
import apolloClient from '@/lib/apolloClient';

const VehiclesSettingsPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apolloClient.mutate({ mutation: DELETE_VEHICLE, variables: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      setConfirmOpen(false);
      setDeleteId(undefined);
    },
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_VEHICLES,
        fetchPolicy: 'network-only',
      });
      return (data as any).vehicles;
    },
  });

  return (
    <MainLayout>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5">Gestion des véhicules</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
            Nouveau
          </Button>
        </Stack>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Erreur lors du chargement des véhicules</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Image avant</TableCell>
                  <TableCell>Image arrière</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.length > 0 ? data.map((v: any) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>
                      {v.front ? (
                        <img src={v.front} alt="Avant" style={{ maxWidth: 80, maxHeight: 50, borderRadius: 4 }} />
                      ) : (
                        <Typography variant="caption" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {v.back ? (
                        <img src={v.back} alt="Arrière" style={{ maxWidth: 80, maxHeight: 50, borderRadius: 4 }} />
                      ) : (
                        <Typography variant="caption" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <ActionsMenu
                        row={v}
                        onEdit={() => { setEditId(v.id); setOpenModal(true); }}
                        onDelete={() => { setDeleteId(v.id); setConfirmOpen(true); }}
                        editLabel="Modifier"
                        deleteLabel="Supprimer"
                      />
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Aucun véhicule</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <CreateUpdateVehicleModal open={openModal} onClose={() => { setOpenModal(false); setEditId(undefined); }} vehicleId={editId} />
        <ConfirmModal
          open={confirmOpen}
          title="Supprimer le véhicule ?"
          description="Cette action est irréversible. Voulez-vous vraiment supprimer ce véhicule ?"
          onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
          onCancel={() => { setConfirmOpen(false); setDeleteId(undefined); }}
          loading={deleteMutation.isLoading}
        />
      </Paper>
    </MainLayout>
  );
};

export default VehiclesSettingsPage;
