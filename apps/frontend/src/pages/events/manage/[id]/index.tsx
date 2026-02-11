import React, { useEffect, useState } from "react";
import { BET_UPDATED_SUBSCRIPTION, EVENT_UPDATED_SUBSCRIPTION, CONTESTANT_UPDATED_SUBSCRIPTION } from '@/lib/subscriptions/events';
import { useRouter } from "next/router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
	Box,
	Typography,
	Button,
	CircularProgress,
	MenuItem,
	Chip,
	TextField,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, useGridApiRef } from "@mui/x-data-grid";
import { getApolloClient } from "@/lib/apolloClient";
import { GET_CONTESTANTS_BY_EVENT, GET_EVENT, GET_GROUPS_BY_EVENT } from "@/lib/queries/events";
import { TOGGLE_BETS, UPDATE_BET, UPDATE_CONTESTANT, UPDATE_EVENT } from "@/lib/mutations/events";
import { DELETE_BET } from "@/lib/mutations/events";
import AddBetModal from "@/components/events/AddBetModal";
import AddOrCreateContestantModal from "@/components/events/AddOrCreateContestantModal";
import { formatDateTime, formatDollar, parseDateTime } from "@/lib/utils";
import { Event } from "@purgacompta/common/types/events";
import { MainLayout } from "@/components";
import RichTextNotes from "@/components/layout/RichTextNotes";
import { useSnackbar } from '@/providers';
import ActionsMenu from "@/components/layout/ActionsMenu";
import InviteGroupsModal from "@/components/events/InviteGroupModal";
import { Add, ExpandMore, Launch, EmojiEvents } from "@mui/icons-material";
import DeclareWinnerModal from "@/components/events/DeclareWinnerModal";
import { GET_BETS_BY_EVENT } from "@/lib/queries/bets";
import WinnerCard from "@/components/events/WinnerCard";

const ManageEventPage: React.FC = () => {
      const [openDeclareWinner, setOpenDeclareWinner] = useState(false);
    // État pour ouverture/fermeture des paris
    const [betsOpen, setBetsOpen] = useState(true);

	const router = useRouter();
	const { id } = router.query;
	const apolloClient = getApolloClient();
	const queryClient = useQueryClient();
    const { notify } = useSnackbar()!;
	const apiRefContestant = useGridApiRef();
	const apiRefBet = useGridApiRef();
	const apiRefInviteGroup = useGridApiRef();
	const [openInviteGroup, setOpenInviteGroup] = useState(false);
	const [openContestant, setOpenContestant] = useState(false);
	const [openBet, setOpenBet] = useState(false);
	const [notes, setNotes] = useState<string>('');
    const [lastEditedRowId, setLastEditedRowId] = useState<string | null>(null);
	const [winnerId, setWinnerId] = useState<string | null>(null);

	// Souscriptions pour invalidation automatique
	apolloClient.subscribe({
		query: BET_UPDATED_SUBSCRIPTION,
		variables: {},
	}).subscribe({
		next: () => {
			if (id) {
				queryClient.invalidateQueries({ queryKey: ['bets', id] });
			}
		},
	});
	apolloClient.subscribe({
		query: EVENT_UPDATED_SUBSCRIPTION,
		variables: {},
	}).subscribe({
		next: () => {
			if (id) {
				queryClient.invalidateQueries({ queryKey: ['event', id] });
			}
		},
	});

	apolloClient.subscribe({
		query: CONTESTANT_UPDATED_SUBSCRIPTION,
		variables: {},
	}).subscribe({
		next: () => {
			if (id) {
				queryClient.invalidateQueries({ queryKey: ['contestants', id] });
			}
		},
	});
	
	

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

	
	// Query unique event
	const { data : bets, isLoading: betsLoading, error: betsError } = useQuery({
		queryKey: ["bets", id],
		enabled: !!id,
		queryFn: async () => {
		const { data } = await apolloClient.query({
			query: GET_BETS_BY_EVENT,
			variables: { eventId: id },
		});
		return (data as any).betsByEvent;
		},
	});

	const { data: invitedGroupsData, refetch: refetchInvited, isLoading: invitedGroupsLoading } = useQuery({
		queryKey: ['invitedGroups', id],
		enabled: !!id,
		queryFn: async () => {
			const { data } = await apolloClient.query({
				query: GET_GROUPS_BY_EVENT,
				variables: { eventId: id },
			});
			return (data as any).groupsByEvent;
		}	
	});

  const updateEventMutation = useMutation({
    mutationFn: async (options: { notes?: string; winnerId?: string }) => {
      await apolloClient.mutate({
        mutation: UPDATE_EVENT,
        variables: { id, ...options },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      notify('Modification enregistrée', 'success', 1000);
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

  const updateBet = useMutation({
    mutationFn: async ({ betId, status }: { betId: string, status: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_BET,
        variables: { id: betId, status },
      });
      return (data as any)?.updateBet;
    },
  });



  const handleNotesChange = (newNotes: string) => {
    if(notes === newNotes) return;
    setNotes(newNotes);
    updateEventMutation.mutate({ notes: newNotes });
  }

  const handleContestantDelete = (contestantId: string) => {
     notify('Suppression du participant non implémentée', 'info');
  }

  const handleBetEdit = (betId: string) => {
    notify("Edition du pari non implémentée", "info");
  }

  const toggleBets = useMutation({
    mutationFn: async () => {
      const { data } = await apolloClient.mutate({
        mutation: TOGGLE_BETS,
        variables: { eventId: id },
      });
      return (data as any)?.toggleBets;
    },
    onSuccess: (toggleBetsResult) => {
      // Met à jour le cache de la query event pour un toggle instantané
      queryClient.setQueryData(["event", id], (old: any) => {
        if (!old) return old;
        return { ...old, betsOpened: toggleBetsResult?.betsOpened };
      });
      notify(toggleBetsResult?.betsOpened ? 'Paris ouverts' : 'Paris fermés', 'success', 1000);
    },
    onError: () => {
      notify("Erreur lors de la mise à jour de l'état des paris", "error");
    }
  });


  const deleteBet = useMutation({
    mutationFn: async (betId: string) => {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_BET,
        variables: { id: betId },
      });
      return (data as any)?.deleteBet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bets", id] });
      notify("Pari supprimé avec succès", "success");
    },
    onError: () => {
      notify("Erreur lors de la suppression du pari", "error");
    }
  });

  // États de recherche
  const [searchContestant, setSearchContestant] = useState("");
  const [searchBet, setSearchBet] = useState("");
  const [searchGroup, setSearchGroup] = useState("");

  // Filtrage local
  const filteredContestants = (contestantData || []).filter((row: any) =>
    row.name?.toLowerCase().includes(searchContestant.toLowerCase())
  );
  const filteredBets = (bets || [])
    .filter((row: any) => {
      const gambler = row.gambler?.name || "";
      const contestant = row.contestant?.name || "";
      return (
        gambler.toLowerCase().includes(searchBet.toLowerCase()) ||
        contestant.toLowerCase().includes(searchBet.toLowerCase())
      );
    });
  const filteredGroups = (invitedGroupsData || []).filter((row: any) =>
    row.name?.toLowerCase().includes(searchGroup.toLowerCase())
  );

  const handleBetValidate = async (betId: string) => {
	await updateBet.mutateAsync({ betId, status: 'APPROVED' });
	queryClient.invalidateQueries({ queryKey: ["bets", id] });
  }

  const handleBetDeny = async (betId: string) => {
	await updateBet.mutateAsync({ betId, status: 'DENIED' });
	queryClient.invalidateQueries({ queryKey: ["bets", id] });
  }

  const handleBetDelete = async (betId: string) => {
	await deleteBet.mutateAsync(betId);
	queryClient.invalidateQueries({ queryKey: ["bets", id] });
  }

  const handleGroupInviteDelete = (groupId: string) => {
	notify("Suppression de l'invitation du groupe non implémentée", "info");
  }

  const handleBetToggle = async () => {
    toggleBets.mutate();
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
    { field: "name", headerName: "Nom", flex: 1, },
    { field: "notes", headerName: "Notes", flex: 1, editable: true },
    { field: "actions", headerName: "Actions", renderCell: (params) => (
        <ActionsMenu row={params?.row} onDelete={handleContestantDelete} canEdit={false} />
    )},
  ];

  // Colonnes Bets
  const betsColumns: GridColDef[] = [
    { field: "gambler", headerName: "Joueur", flex: 1, valueFormatter: (params: any) => params.name || '—' },
    { field: "amount", headerName: "Montant", flex: 1, valueFormatter: (params) => formatDollar(params) },
    { field: "contestant", headerName: "Pari sur", flex: 1, valueFormatter: (params: any) => params.name || '—' },
    { field: "status", headerName: "Statut", flex: 1, renderCell: (params) => (
			<Chip
				label={params.value === "PENDING" ? "En attente" : params.value === "APPROVED" ? "Validé" : "Rejeté"}
				color={params.value === "PENDING" ? "info" : params.value === "APPROVED" ? "success" : "error"}
				size="small"
				sx={{ fontWeight: 700 }}
			/>
		)
	},
    { field: "actions", headerName: "Actions", renderCell: (params) => (
        <ActionsMenu 
          row={params?.row} 
          onDelete={row => handleBetDelete(row.id)} 
          onEdit={handleBetEdit}
          moreActions={ params?.row?.status === "PENDING" ? [
            <MenuItem key="approve" onClick={() => handleBetValidate(params.row.id)}>Valider le pari</MenuItem>,
            <MenuItem key="deny" onClick={() => handleBetDeny(params.row.id)}>Rejeter le pari</MenuItem>,
          ] : []}
        />
    )},
  ];

  const invitedGroupsColumns: GridColDef[] = [
	{ field: "name", headerName: "Groupe invité", flex: 1 },
	{ field: "groupPage", headerName: "Lien", flex: 1, renderCell: (params) => (
		<Button endIcon={<Launch />} variant="contained" size="small" color="warning" onClick={() => window.open(`/events/${params.row.id}`, '_blank', 'noopener,noreferrer')}>
			Page d'invitations
		</Button>
	) },
	{ field: "actions", headerName: "Actions", renderCell: (params) => (
        <ActionsMenu row={params?.row} onDelete={handleGroupInviteDelete} canEdit={false} />
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

        {/* Actions principales */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Button
            variant={data.betsOpened ? 'contained' : 'outlined'}
            color={data.betsOpened ? 'success' : 'error'}
            onClick={handleBetToggle}
            sx={{ fontWeight: 700 }}
          >
            {data.betsOpened ? 'Paris ouverts' : 'Paris fermés'}
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<EmojiEvents />}
            disabled={new Date(data.startDate) > new Date() || !!data.winner}
            onClick={() => setOpenDeclareWinner(true)}
            sx={{ fontWeight: 700 }}
          >
            Déclarer un gagnant
          </Button>
        </Box>
        {/* Modale déclaration gagnant */}
        <DeclareWinnerModal
          open={openDeclareWinner}
          onClose={() => setOpenDeclareWinner(false)}
          contestants={contestantData || []}
          eventId={id as string}
          updateEvent={async (winnerId: string) => {
            await updateEventMutation.mutateAsync({ winnerId });
          }}
        />
		<Box sx={{ my: 3 }}>
			<WinnerCard winnerName={data.winner?.name || '—'} color1={data.winner?.color || '#f35050'} enableConfetti={false} />
		</Box>
        <Box sx={{ my: 3 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" gutterBottom>Notes de l'évènement</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RichTextNotes value={notes} onChange={handleNotesChange} />
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ flex: 1, minWidth: 350 }}>
          <Typography variant="h6">Groupes invités</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <TextField
              placeholder="Rechercher un groupe..."
              value={searchGroup}
              onChange={e => setSearchGroup(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenInviteGroup(true)}>Inviter un groupe</Button>
          </Box>
          <DataGrid
            apiRef={apiRefInviteGroup}
            rows={filteredGroups}
            columns={invitedGroupsColumns}
            getRowId={(row) => row.id}
            autoHeight
            loading={invitedGroupsLoading}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } }, sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
            localeText={{ noRowsLabel: 'Aucun groupe invité' }}
            sx={{ background: '#181a20', borderRadius: 2 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 4 }}>
          <Box sx={{ flex: 1, minWidth: 350 }}>
            <Typography variant="h6">Participants</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <TextField
                placeholder="Rechercher un participant..."
                value={searchContestant}
                onChange={e => setSearchContestant(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button variant="contained" startIcon={<Add />} onClick={() => setOpenContestant(true)}>Ajouter un participant</Button>
            </Box>
            <DataGrid
              apiRef={apiRefContestant}
              rows={filteredContestants}
              columns={contestantsColumns}
              getRowId={(row) => row.id}
              autoHeight
              processRowUpdate={handleProcessContestantRowUpdate}
              onProcessRowUpdateError={(error) => notify(error?.message || 'Erreur lors de la sauvegarde', 'error')}
              pagination
              pageSizeOptions={[5, 10, 25]}
              initialState={{ pagination: { paginationModel: { pageSize: 5 } }, sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
              loading={contestantLoading}
              localeText={{ noRowsLabel: 'Aucun participant' }}
              sx={{ background: '#181a20', borderRadius: 2 }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 350 }}>
            <Typography variant="h6">Paris enregistrés</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <TextField
                placeholder="Rechercher un pari..."
                value={searchBet}
                onChange={e => setSearchBet(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button variant="contained" startIcon={<Add />} onClick={() => setOpenBet(true)}>Ajouter un pari</Button>
            </Box>
            <DataGrid
              apiRef={apiRefBet}
              rows={filteredBets}
              columns={betsColumns}
              getRowId={(row) => row.id}
              autoHeight
			  loading={betsLoading}
			  pagination
              pageSizeOptions={[5, 10, 25]}
              initialState={{ pagination: { paginationModel: { pageSize: 5 } }, sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
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
		<InviteGroupsModal
		  open={openInviteGroup}
		  eventId={id as string}
		  groups={invitedGroupsData || []}
		  onClose={() => setOpenInviteGroup(false)}
		  onSuccess={() => refetchInvited()}
		/>
	  </Box>
	</MainLayout>
  );
}

export default ManageEventPage;
