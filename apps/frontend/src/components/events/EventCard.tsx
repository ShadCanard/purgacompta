import { formatDateTime, getDateStatus } from "@/lib/utils";
import { Card, CardContent, Box, Typography, CardProps, Divider, Button, Grid, Tooltip } from "@mui/material";
import { useRouter } from "next/router";


interface EventCardProps extends CardProps {
	event: { 
		id: string; 
		name: string; 
		startDate: string;
		participating: boolean;
	};
	groupId?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, groupId, ...cardProps }) => {
	const dateStatus = getDateStatus(event.startDate);
	const router = useRouter();

  return (
	<Card
	  sx={{
		background: 'rgba(30, 30, 46, 0.8)',
		border: `1px solid ${(dateStatus === "upcoming" ? "info.main" : dateStatus === "ongoing" ? "success.main" : "error.main")}`,
		borderRadius: 3,
		transition: 'transform 0.2s, box-shadow 0.2s',
		'&:hover': {
		  transform: 'translateY(-4px)',
		  boxShadow: `0 8px 24px ${(dateStatus === "upcoming" ? "info.main" : dateStatus === "ongoing" ? "success.main" : "error.main")}`,
		},
	  }}
	  {...cardProps}
	>
	  <CardContent sx={{ p: 3 }}>
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
				<Typography variant="h6">—</Typography>
			</Grid>
			</Grid>
			<Typography variant="caption" color="text.secondary">Part du pool</Typography>
			<Button fullWidth variant="contained" sx={{ mt: 2, fontWeight: 700 }} onClick={() => router.push(`/events/${groupId}/${event.id}`)}>
			Voir l'event
			</Button>
	  </CardContent>
	</Card>
  );
};

export default EventCard;