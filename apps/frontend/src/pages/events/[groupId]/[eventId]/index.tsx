
import React from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_EVENT } from "@/lib/queries/events";
import {
	Box,
	Typography,
	CircularProgress,
	Grid,
	Card,
	CardContent,
	Chip,
	Alert,
	AppBar,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import { getApolloClient } from "@/lib/apolloClient";
import { BET_UPDATED_SUBSCRIPTION, EVENT_UPDATED_SUBSCRIPTION } from '@/lib/subscriptions/events';
import { GET_BETS_BY_EVENT } from "@/lib/queries/bets";
import { formatDollar, getDateStatus } from "@/lib/utils";
import ContestantCard from "@/components/events/ContestantCard";
import EventStatCard from "@/components/events/EventStatCard";
import { CurrencyExchange, ExpandMore, Paid, People, Wallet, ArrowBack } from "@mui/icons-material";
import WinnerCard from "@/components/events/WinnerCard";

const EventPage: React.FC = () => {
	const apolloClient = getApolloClient();
	const queryClient = useQueryClient();
	const router = useRouter();
	const { groupId, eventId } = router.query;

	// Souscriptions pour invalidation automatique
	apolloClient.subscribe({
		query: BET_UPDATED_SUBSCRIPTION,
		variables: {},
	}).subscribe({
		next: () => {
			if (eventId) {
				queryClient.invalidateQueries({ queryKey: ['bets', eventId] });
			}
		},
	});
	apolloClient.subscribe({
		query: EVENT_UPDATED_SUBSCRIPTION,
		variables: {},
	}).subscribe({
		next: () => {
			if (eventId) {
				queryClient.invalidateQueries({ queryKey: ['event', eventId] });
			}
		},
	});

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const { data } = await apolloClient.query({
        query: GET_EVENT,
        variables: { id: eventId as string },
      });
      return (data as any).event;
    },
    enabled: !!eventId,
  });

	const {data: bets, isLoading: betsLoading} = useQuery({
		queryKey: ['bets', eventId],
		queryFn: async () => {
				if (!eventId) return null;
				const { data } = await apolloClient.query({
						query: GET_BETS_BY_EVENT,
						variables: { eventId: eventId },
				});
				// Filtrer les bets pour exclure ceux avec le statut 'DENIED'
				return ((data as any).betsByEvent || []).filter((b: any) => b.status !== 'DENIED');
		},
		enabled: !!eventId,
	});

  // Calculs pool et stats (mock pour l'instant)
  const totalPool = bets?.reduce((sum: number, b: any) => sum + (b.amount || 0), 0) || 0;
  const totalBets = bets?.length || 0;
	const avgBet = totalBets > 0 ? Math.round((totalPool / totalBets) / 500) * 500 : null;

  if (isLoading) return <CircularProgress sx={{ mt: 8, mx: 'auto', display: 'block' }} />;
  if (error) return <Typography color="error">Erreur lors du chargement de l'évènement.</Typography>;
  if (!data) return <Typography>Aucun évènement trouvé.</Typography>;

	return (
		<Box>
			<AppBar position="static" sx={{ mb: 3, bgcolor: '#221313' }}>
				<Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
					<ArrowBack
						sx={{ cursor: 'pointer', mr: 2 }}
						onClick={() => window.history.back()}
					/>
					<Typography variant="h4" fontWeight={700}>
						🔥 {data.name}
					</Typography>
					{getDateStatus(data.startDate) === 'upcoming' && (
						<Chip label="A venir" color="info" size="medium" sx={{ fontWeight: 700 }} />
					)}
					{getDateStatus(data.startDate) === 'ongoing' && (
						<Chip label="En cours" color="success" size="medium" sx={{ fontWeight: 700 }} />
					)}
					{getDateStatus(data.startDate) === 'past' && (
						<Chip label="Terminé" color="error" size="medium" sx={{ fontWeight: 700 }} />
					)}

					{data.betsOpened && (
						<Chip label="Paris ouverts" color="success" size="medium" sx={{ fontWeight: 700 }} />
					)}
					{!data.betsOpened && (
						<Chip label="Paris fermés" color="error" size="medium" sx={{ fontWeight: 700 }} />
					)}
				</Box>
			</AppBar>

			<Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1200, mx: 'auto' }}>

				{/* Affichage du gagnant */}
				{data.winner && (
					<Box sx={{ position: 'relative', mb: 3 }}>
						<WinnerCard winnerName={data.winner.name} color1={data.winner.color} />
					</Box>
				)}

				{/* Système Pari Mutuel */}
				{data.betsOpened && (
					<Alert severity="success" sx={{ mb: 3, fontSize: 16 }}>
						Les paris sont ouverts !
					</Alert>
				)}
				{!data.betsOpened && (
					<Alert severity="error" sx={{ mb: 3, fontSize: 16 }}>
						Les paris sont fermés.
					</Alert>
				)}

				{/* Stats */}
				<Grid container spacing={2} sx={{ mb: 2 }}>
					<Grid size={{ xs: 6, md: 3 }}>
						<EventStatCard color="#66bb6a" title="POOL TOTAL" value={formatDollar(totalPool)} valueColor="warning.main" icon={<Paid />} />
					</Grid>
					<Grid size={{ xs: 6, md: 3 }}>
						<EventStatCard color="#ffa726" title="PARIS PLACÉS" value={totalBets} valueColor="warning.main" icon={<Wallet />} />
					</Grid>
					<Grid size={{ xs: 6, md: 3 }}>
						<EventStatCard color="#29b6f6" title="ÉQUIPES" value={data.participants?.length || 0} valueColor="warning.main" icon={<People />} />
					</Grid>
					<Grid size={{ xs: 6, md: 3 }}>
						<EventStatCard color="#66bb6a" title="MISE MOYENNE" value={formatDollar(avgBet)} valueColor="warning.main" icon={<CurrencyExchange />} />
					</Grid>
				</Grid>

			{/* Système Pari Mutuel */}
			<Accordion sx={{ mb: 3 }}>
				<AccordionSummary expandIcon={<ExpandMore />}>
					<Typography variant="h6" fontWeight={700}>Informations</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Card variant="outlined" sx={{ mb: 3, fontSize: 16, bgcolor: 'warning.main', color: 'warning.contrastText', borderColor: 'warning.dark' }}>
						<CardContent>
							<b>Attention</b> — Les paris seront à régler directement à l'évènement. Les valeurs finales des paris seront automatiquement mises à jour à la fermeture des paris. <br />
							10% du Pool seront prélevés comme frais de gestion. <br />
							Les paris se font en petites coupures de $1.
						</CardContent>
					</Card>
				</AccordionDetails>
			</Accordion>
			

			{/* Équipes */}
			<Grid container spacing={3}>
				{data.participants?.length === 0 && (
				<Grid size={{ xs : 12 }}>
					<Card>
						<CardContent>
							Aucune équipe inscrite.
						</CardContent>
					</Card>
				</Grid>
				)}
				{data.participants?.map((p: {name: string, id: string, color: string, notes: string}) => (
				<Grid size={{ xs: 12, md: 4 }} key={p.id}>
					<ContestantCard betsOpened={data.betsOpened} contestant={{ id: p.id, name: p.name, color: p.color }} bets={bets || []} color={p.color} gamblerId={groupId as string} eventId={eventId as string} />
				</Grid>
				))}
			</Grid>
		</Box>
	</Box>
  );
};

export default EventPage;
