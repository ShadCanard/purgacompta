import React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET_EVENTS } from "../../lib/queries/events";
import { Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getApolloClient } from "@/lib/apolloClient";
import { CREATE_EVENT } from "@/lib/mutations/events";
import { MainLayout } from "@/components";
import { formatDateTime, parseDateTime } from "@/lib/utils";
import { Event } from "@purgacompta/common/types/events";

const EventsPage: React.FC = () => {
    const apolloClient = getApolloClient();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_EVENTS,
      });
      // Prétraitement : injecte les valeurs formatées directement
      return (data as any).events.map((event: any) => ({
        ...event,
        startDateFormatted: formatDateTime(parseDateTime(event.startDate)),
        createdAtFormatted: formatDateTime(parseDateTime(event.createdAt)),
      }));
    },
  });

  // Gestion modale création
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [eventId, setEventId] = React.useState("");
  const [startDate, setStartDate] = React.useState("");

  const createEventMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_EVENT,
        variables: { name, startDate },
      });
      return (data as any).createEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setOpen(false);
      setName("");
      setStartDate("");
    },
  });

  if (isLoading) return <MainLayout><CircularProgress /></MainLayout>;
  if (error) return <MainLayout><Typography color="error">Erreur lors du chargement des évènements.</Typography></MainLayout>;

  // Séparation events à venir / passés (robuste : timestamp ou ISO)
  const now = Date.now();
  const eventsAVenir = (data || []).filter((event: Event) => {
    const eventTime = parseDateTime(event.startDate);
    return !isNaN(eventTime) && eventTime > now;
  });
  const eventsPasses = (data || []).filter((event: Event) => {
    const eventTime = parseDateTime(event.startDate);
    return !isNaN(eventTime) && eventTime <= now;
  });

      const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nom', flex: 1, minWidth: 180 },
        { field: 'startDateFormatted', headerName: 'Début', flex: 1, minWidth: 180 },
        { field: 'createdAtFormatted', headerName: 'Créé le', flex: 1, minWidth: 180 },
      ];

    const router = useRouter();

    const handleRowClick = (params: any) => {
      router.push(`/events/manage/${params.id}`);
    };

    return (
      <MainLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Gestion des évènements</Typography>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Créer un évènement</Button>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Events à venir</Typography>
            <DataGrid
              rows={eventsAVenir}
              columns={columns}
              getRowId={(row) => row.id}
              autoHeight
              pageSizeOptions={[5, 10, 25]}
              localeText={{ noRowsLabel: 'Aucun évènement à venir' }}
              sx={{ mb: 3, background: '#181a20', borderRadius: 2 }}
              onRowClick={handleRowClick}
              style={{ cursor: 'pointer' }}
            />
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>Events passés</Typography>
            <DataGrid
              rows={eventsPasses}
              columns={columns}
              getRowId={(row) => row.id}
              autoHeight
              pageSizeOptions={[5, 10, 25]}
              localeText={{ noRowsLabel: 'Aucun évènement passé' }}
              sx={{ background: '#181a20', borderRadius: 2 }}
              onRowClick={handleRowClick}
              style={{ cursor: 'pointer' }}
            />
          </Box>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Créer un évènement</DialogTitle>
            <DialogContent>
              <TextField label="Nom" value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" />
              <TextField label="Date de début" type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} fullWidth margin="normal" />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={() => createEventMutation.mutate()} disabled={!name || !startDate || createEventMutation.isPending} variant="contained" color="primary">
                Créer
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </MainLayout>
    );
  };

export default EventsPage;