import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Box, Typography, Button, CircularProgress, Card } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, useGridApiRef } from "@mui/x-data-grid";
import { getApolloClient } from "@/lib/apolloClient";
import { GET_CONTESTANTS_BY_EVENT, GET_EVENT } from "@/lib/queries/events";
import { UPDATE_CONTESTANT, UPDATE_EVENT } from "@/lib/mutations/events";
import AddBetModal from "@/components/events/AddBetModal";
import AddOrCreateContestantModal from "@/components/events/AddOrCreateContestantModal";
import { formatDateTime, parseDateTime } from "@/lib/utils";
import { Event } from "@purgacompta/common/types/events";
import { MainLayout } from "@/components";
import RichTextNotes from "@/components/layout/RichTextNotes";
import { useSnackbar } from '@/providers';
import ActionsMenu from "@/components/layout/ActionsMenu";

const ManageEventPage: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const apolloClient = getApolloClient();
	const queryClient = useQueryClient();
    const { notify } = useSnackbar()!;
	const apiRefContestant = useGridApiRef();
	const apiRefBet = useGridApiRef();
	const [openContestant, setOpenContestant] = useState(false);
	const [openBet, setOpenBet] = useState(false);
	const [notes, setNotes] = useState<string>('');
    const [lastEditedRowId, setLastEditedRowId] = useState<string | null>(null);

	
	const { data: contestantData, isLoading: contestantLoading } = useQuery({
	  queryKey: ['contestants', id],
	  enabled: !!id,
	  queryFn: async () => {
		  const { data } = await apolloClient.query({
			  query: GET_CONTESTANTS_BY_EVENT,
			  variables: { eventId: id },
		  });
		  return (data as any).contestantsByEvent;
	  },
	});

	// Effet pour sortir du mode édition et garder la ligne sélectionnée après édition
    useEffect(() => {
      if (lastEditedRowId && apiRefContestant.current) {
        const mode = apiRefContestant.current.getRowMode(lastEditedRowId);
        if (mode === 'edit') {
          apiRefContestant.current.stopRowEditMode({ id: lastEditedRowId });
        }
        apiRefContestant.current.selectRow(lastEditedRowId, true, true);
        setLastEditedRowId(null);
      }
    }, [contestantData, lastEditedRowId, apiRefContestant]);

  // Query unique event
  const { data, isLoading, error } = useQuery({
    queryKey: ["event", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_EVENT,
        variables: { id },
      });
      setNotes((data as any).event.notes || '');
      return (data as any).event as Event;
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (notes: string) => {
      await apolloClient.mutate({
        mutation: UPDATE_EVENT,
        variables: { id, notes },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      notify('Notes sauvegardées', 'success', 1000);
    },
    onError: () => {
      notify('Erreur lors de la sauvegarde', 'error');
    }
  });

  const updateContestant = useMutation({
    mutationFn: async ({ eventId, contestantId, notes }: { eventId: string, contestantId: string, notes: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_CONTESTANT,
        variables: { eventId, contestantId, notes },
      });
      return (data as any)?.updateContestant;
    },
  });



  const handleNotesChange = (newNotes: string) => {
    if(notes === newNotes) return;
    setNotes(newNotes);
    updateEventMutation.mutate(newNotes);
  }

  const handleContestantDelete = (contestantId: string) => {
     notify('Suppression du participant non implémentée', 'info');
  }

  const handleBetEdit = (betId: string) => {
    notify("Edition du pari non implémentée", "info");
  }

  const handleBetDelete = (betId: string) => {
    notify("Suppression du pari non implémentée", "info");

  }

  if (isLoading) return <MainLayout><CircularProgress /></MainLayout>;
  if (error || !data) return <MainLayout><Typography color="error">Erreur lors du chargement de l'évènement. {error?.message}</Typography></MainLayout>;

  // Colonnes Contestants
  const contestantsColumns: GridColDef[] = [
	{
		  field: 'colors',
		  headerName: 'Couleurs',
		  width: 70,
		  sortable: false,
		  filterable: false,
		  renderCell: (params: GridRenderCellParams) => {
			const color1 = params.row.color || '#f35050';
			const color2 = params.row.color || '#f35050';
			return (
			  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
				  <svg width={36} height={36} style={{ display: 'block' }}>
					<defs>
					  <linearGradient id={`split-diag-${params.row.id}`} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor={color1} />
						<stop offset="49%" stopColor={color1} />
						<stop offset="51%" stopColor={color2} />
						<stop offset="100%" stopColor={color2} />
					  </linearGradient>
					</defs>
					<circle cx={18} cy={18} r={16} fill={`url(#split-diag-${params.row.id})`} />
				  </svg>
			  </Box>
			);
		  },
		},
    { field: "name", headerName: "Nom", flex: 1 },
    { field: "notes", headerName: "Notes", flex: 1, editable: true },
    { field: "actions", headerName: "Actions", renderCell: (params) => (
        <ActionsMenu row={params?.row} onDelete={handleContestantDelete} canEdit={false} />
    )},
  ];

  // Colonnes Bets
  const betsColumns: GridColDef[] = [
    { field: "gambler", headerName: "Joueur", flex: 1 },
    { field: "amount", headerName: "Montant", flex: 1 },
    { field: "contestant", headerName: "Pari sur", flex: 1 },
    { field: "actions", headerName: "Actions", renderCell: (params) => (
        <ActionsMenu row={params?.row} onDelete={handleBetDelete} onEdit={handleBetEdit} />
    )},
  ];

  
    // Déclenche la mutation lors de l'édition de la quantité
    const handleProcessContestantRowUpdate = async (newRow: any, oldRow: any) => {
      if (oldRow.notes !== newRow.notes) {
        await updateContestant.mutateAsync({
          eventId: id as string,
          contestantId: newRow.id,
          notes: newRow.notes,
        });
        setLastEditedRowId(newRow.id);
      }
      return { ...newRow };
    };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Gestion de l'évènement : {data.name}</Typography>
        <Typography variant="subtitle1" gutterBottom>Date de début : {formatDateTime(parseDateTime(data.startDate))}</Typography>
        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>Notes de l'évènement</Typography>
          <Card variant="outlined" sx={{ p: 2 }}>
            <RichTextNotes value={notes} onChange={handleNotesChange} />
            </Card>
        </Box>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 350 }}>
            <Typography variant="h6">Participants</Typography>
            <Button variant="outlined" onClick={() => setOpenContestant(true)} sx={{ mb: 1 }}>Ajouter un participant</Button>
            <DataGrid
              apiRef={apiRefContestant}
              rows={contestantData || []}
              columns={contestantsColumns}
              getRowId={(row) => row.id}
              autoHeight
              processRowUpdate={handleProcessContestantRowUpdate}
              onProcessRowUpdateError={(error) => notify(error?.message || 'Erreur lors de la sauvegarde', 'error')}
              pageSizeOptions={[5, 10, 25]}
			  loading={contestantLoading}
              localeText={{ noRowsLabel: 'Aucun participant' }}
              sx={{ background: '#181a20', borderRadius: 2 }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 350 }}>
            <Typography variant="h6">Paris enregistrés</Typography>
            <Button variant="outlined" onClick={() => setOpenBet(true)} sx={{ mb: 1 }}>Ajouter un pari</Button>
            <DataGrid
              apiRef={apiRefBet}
              rows={data.bets || []}
              columns={betsColumns}
              getRowId={(row) => row.id}
              autoHeight
              pageSizeOptions={[5, 10, 25]}
              localeText={{ noRowsLabel: 'Aucun pari' }}
              sx={{ background: '#181a20', borderRadius: 2 }}
            />
          </Box>
        </Box>

        {/* Modal ajout participant */}
        <AddOrCreateContestantModal
          open={openContestant}
          eventId={id as string}
		  contestants={contestantData || []}
          onClose={() => setOpenContestant(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["event", id] })}
        />

        {/* Modal ajout pari */}
        <AddBetModal
          open={openBet}
          eventId={id as string}
          onClose={() => setOpenBet(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["event", id] })}
        />
      </Box>
    </MainLayout>
  );
};

export default ManageEventPage;
