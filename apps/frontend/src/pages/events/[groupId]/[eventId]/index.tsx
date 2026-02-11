
import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
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
} from "@mui/material";
import { getApolloClient } from "@/lib/apolloClient";
import { GET_BETS_BY_EVENT } from "@/lib/queries/bets";
import { formatDollar, getDateStatus } from "@/lib/utils";
import ContestantCard from "@/components/events/ContestantCard";

const EventPage: React.FC = () => {
  const apolloClient = getApolloClient();
  const router = useRouter();
  const { groupId, eventId } = router.query;

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
		return (data as any).betsByEvent;
	},
	enabled: !!eventId,
  });

  // Calculs pool et stats (mock pour l'instant)
  const totalPool = bets?.reduce((sum: number, b: any) => sum + (b.amount || 0), 0) || 0;
  const totalBets = bets?.length || 0;
  const avgBet = totalBets > 0 ? (totalPool / totalBets) : null;

  if (isLoading) return <CircularProgress sx={{ mt: 8, mx: 'auto', display: 'block' }} />;
  if (error) return <Typography color="error">Erreur lors du chargement de l'évènement.</Typography>;
  if (!data) return <Typography>Aucun évènement trouvé.</Typography>;

  return (
	<Box>
		<AppBar position="static" sx={{ mb: 3, bgcolor: '#221313' }}>
			<Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
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

				<Chip label="Paris ouverts" color="success" size="medium" sx={{ fontWeight: 700 }} />
			</Box>
		</AppBar>
		
		<Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
			
			{/* Système Pari Mutuel */}
			<Alert severity="success" sx={{ mb: 3, fontSize: 16 }}>
				Les paris sont ouverts !
			</Alert>
			
			{/* Stats */}
			<Grid container spacing={2} sx={{ mb: 2 }}>
				<Grid size={{xs: 6, md: 3}}>
				<Card sx={{ bgcolor: '#221313', textAlign: 'center' }}>
					<CardContent>
					<Typography variant="subtitle2" color="text.secondary">POOL TOTAL</Typography>
					<Typography variant="h5" fontWeight={700} color="warning.main">{formatDollar(totalPool)}</Typography>
					</CardContent>
				</Card>
				</Grid>
				<Grid size={{xs: 6, md: 3}}>
				<Card sx={{ bgcolor: '#221313', textAlign: 'center' }}>
					<CardContent>
					<Typography variant="subtitle2" color="text.secondary">PARIS PLACÉS</Typography>
					<Typography variant="h5" fontWeight={700}>{totalBets}</Typography>
					</CardContent>
				</Card>
				</Grid>
				<Grid size={{xs: 6, md: 3}}>
				<Card sx={{ bgcolor: '#221313', textAlign: 'center' }}>
					<CardContent>
					<Typography variant="subtitle2" color="text.secondary">ÉQUIPES</Typography>
					<Typography variant="h5" fontWeight={700} color="success.main">{data.participants?.length || 0}</Typography>
					</CardContent>
				</Card>
				</Grid>
				<Grid size={{ xs: 6, md: 3 }}>
				<Card sx={{ bgcolor: '#221313', textAlign: 'center' }}>
					<CardContent>
					<Typography variant="subtitle2" color="text.secondary">MISE MOYENNE</Typography>
					<Typography variant="h5" fontWeight={700}>{formatDollar(avgBet)}</Typography>
					</CardContent>
				</Card>
				</Grid>
			</Grid>

			{/* Système Pari Mutuel */}
			<Card variant="outlined" sx={{ mb: 3, fontSize: 16, bgcolor: 'warning.main', color: 'warning.contrastText', borderColor: 'warning.dark' }}>
				<CardContent>
				<b>Attention</b> — Les paris seront à régler directement à l'évènement. Les valeurs finales des paris seront automatiquement mises à jour à la fermeture des paris.
				</CardContent>
			</Card>

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
					<ContestantCard contestant={{ id: p.id, name: p.name, color: p.color }} gamblerId={groupId as string} eventId={eventId as string} />
				</Grid>
				))}
			</Grid>
		</Box>
	</Box>
  );
};

export default EventPage;
