import { formatDateTime, getContrastTextColor, getDateStatus, formatDollar } from "@/lib/utils";
import { Box, Typography, CardProps, Divider, Button, Grid, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import ContentCard from "../cards/ContentCard";


interface EventCardProps extends CardProps {
	event: { 
		id: string; 
		name: string; 
		startDate: string;
		participating: boolean;
		winner: { id: string; name: string; color: string } | null;
		bets: { id: string; amount: number; status: "PENDING"|"APPROVED"|"DENIED" }[];
	};
	groupId?: string;
	groupColor?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, groupId, groupColor = "primary.main", ...cardProps }) => {
	const dateStatus = getDateStatus(event.startDate);
	const router = useRouter();

	const totalPool = event.bets.reduce((sum, bet) => sum + (bet.status !== "DENIED" ? bet.amount : 0), 0);

  return (
	<ContentCard {...cardProps} color={groupColor} border borderColor={groupColor}>
			<Typography variant="h5" fontWeight={700} gutterBottom>
			{event.name}
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Grid container spacing={1} sx={{ mb: 1 }}>
			<Grid size={{ xs: 4 }}>
				<Tooltip title="Date de début de l'évènement">
				<Box>
					<Typography variant="caption" color="text.secondary">DATE</Typography>
					<Typography variant="h6">{formatDateTime(event.startDate)}</Typography>
				</Box>
				</Tooltip>
			</Grid>
			<Grid size={{ xs: 4 }}>
				<Typography variant="caption" color="text.secondary">MISES</Typography>
				<Typography variant="h6">{formatDollar(totalPool)}</Typography>
			</Grid>
			{event.winner && (
				<Grid size={{ xs: 4 }}>
					<Typography variant="caption" color="text.secondary">VAINQUEUR</Typography>
					<Typography variant="h6">{event.winner.name}</Typography>
				</Grid>
			)}
			</Grid>
			<Button fullWidth variant="contained" sx={{ mt: 2, fontWeight: 700, backgroundColor: groupColor, color: getContrastTextColor(groupColor) }} onClick={() => router.push(`/events/${groupId}/${event.id}`)}>
				Voir l'event
			</Button>
	</ContentCard>
  );
};

export default EventCard;