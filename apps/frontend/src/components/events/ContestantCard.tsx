import { getContrastTextColor } from "@/lib/utils";
import { Card, CardContent, Box, Typography, CardProps, Divider, Button, Grid, Tooltip } from "@mui/material";
import AddBetModal from "./AddBetModal";
import { useState } from "react";


interface ContestantCardProps extends CardProps {
	contestant: { 
		id: string; 
		name: string; 
		color: string;
	};
	gamblerId?: string;
	eventId?: string;
}

const ContestantCard: React.FC<ContestantCardProps> = ({ contestant, gamblerId, eventId, ...cardProps }) => {

	const [openBetModal, setOpenBetModal] = useState(false);

	console.dir({contestant, gamblerId, eventId});
  return <>
	<Card
	  sx={{
		background: 'rgba(30, 30, 46, 0.8)',
		border: `1px solid ${contestant.color}80`,
		borderRadius: 3,
		transition: 'transform 0.2s, box-shadow 0.2s',
		'&:hover': {
		  transform: 'translateY(-4px)',
		  boxShadow: `0 8px 24px ${contestant.color}33`,
		},
	  }}
	  {...cardProps}
	>
	  <CardContent sx={{ p: 3 }}>
			<Typography variant="h5" fontWeight={700} gutterBottom>
			{contestant.name}
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Grid container spacing={1} sx={{ mb: 1 }}>
			<Grid size={{ xs: 4 }}>
				<Tooltip title="Cote calculée dynamiquement">
				<Box>
					<Typography variant="caption" color="text.secondary">COTE</Typography>
					<Typography variant="h6">—</Typography>
				</Box>
				</Tooltip>
			</Grid>
			<Grid size={{ xs: 4 }}>
				<Typography variant="caption" color="text.secondary">MISES</Typography>
				<Typography variant="h6">—</Typography>
			</Grid>
			</Grid>
			<Typography variant="caption" color="text.secondary">Part du pool</Typography>
			<Button 
				fullWidth 
				variant="contained" 
				sx={{ mt: 2, bgcolor: contestant.color, color: getContrastTextColor(contestant.color), fontWeight: 700 }}
				onClick={() => setOpenBetModal(true)}
				>
			🔥 PARIER
			</Button>
	  </CardContent>
	</Card>
	<AddBetModal open={openBetModal} eventId={eventId || ""} gamblerId={gamblerId} contestantId={contestant.id} onClose={() => setOpenBetModal(false)} />
	</>;
};

export default ContestantCard;