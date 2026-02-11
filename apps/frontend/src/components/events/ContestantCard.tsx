import { getContrastTextColor } from "@/lib/utils";
import { Box, Typography, Divider, Button, Grid, Tooltip } from "@mui/material";
import AddBetModal from "./AddBetModal";
import { useState } from "react";
import ContentCard, { ContentCardProps } from "../cards/ContentCard";


interface ContestantCardProps extends ContentCardProps {
	contestant: { 
		id: string; 
		name: string; 
		color: string;
	};
	gamblerId?: string;
	eventId?: string;
	bets?: {
		id: string;
		eventId: string;
		contestantId: string;
		gamblerId: string;
		amount: number;
		status: string;
	}[];
	betsOpened: boolean;
}

const ContestantCard: React.FC<ContestantCardProps> = ({ contestant, gamblerId, eventId, bets = [], betsOpened, ...cardProps }) => {
	const [openBetModal, setOpenBetModal] = useState(false);

	// Montant total des paris sur ce contestant
	const totalBetsOnContestant = bets.filter(b => b.contestantId === contestant.id).reduce((sum, b) => sum + (b.amount || 0), 0);
	// Montant total du pool
	const totalPool = bets.reduce((sum, b) => sum + (b.amount || 0), 0);
	// Cote (pourcentage du pool)
	const odds = totalPool > 0 ? (totalBetsOnContestant / totalPool) * 100 : 0;
	// Gains potentiels : 90% du pool global, puis part du pool pour le participant
	const poolAfterFee = totalPool * 0.9;
	// Montant parié par le gambler sur ce contestant
	const gamblerBetsOnContestant = bets.filter(b => b.contestantId === contestant.id && b.gamblerId === gamblerId);
	const gamblerAmountOnContestant = gamblerBetsOnContestant.reduce((sum, b) => sum + (b.amount || 0), 0);
	// Pourcentage du pari du gambler sur l'ensemble des paris sur ce participant
	const gamblerPercentOnContestant = totalBetsOnContestant > 0 ? (gamblerAmountOnContestant / totalBetsOnContestant) * 100 : 0;
	const potentialGain = poolAfterFee > 0 ? Math.floor((gamblerPercentOnContestant / 100) * poolAfterFee) : 0;

	const hasPendingBet = bets.some(b => b.gamblerId === gamblerId && b.contestantId === contestant.id && b.status === 'PENDING');
	const pendingBet = bets.find(b => b.gamblerId === gamblerId && b.contestantId === contestant.id && b.status === 'PENDING')?.amount || null;
	console.log(bets);
	console.log(hasPendingBet);

	return <>
		<ContentCard {...cardProps} color={contestant.color} border borderColor={contestant.color}>
			<Typography variant="h5" fontWeight={700} gutterBottom>
				{contestant.name}
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Grid container spacing={1} sx={{ mb: 1 }}>
				<Grid size={{ xs: 6 }}>
					<Tooltip title="Cote calculée dynamiquement">
						<Box>
							<Typography variant="caption" color="text.secondary">PART DU POOL</Typography>
							<Typography variant="h6">{odds.toFixed(1)}%</Typography>
						</Box>
					</Tooltip>
				</Grid>
				<Grid size={{ xs: 6 }}>
					<Typography variant="caption" color="text.secondary">MISES</Typography>
					<Typography variant="h6">{totalBetsOnContestant.toLocaleString()} $</Typography>
				</Grid>
			</Grid>
			<Grid container sx={{ mb: 2 }}>
				<Typography variant="caption" color="text.secondary">Votre pari : {gamblerAmountOnContestant.toLocaleString()} $ ({gamblerPercentOnContestant.toFixed(1)})%</Typography>
				<Typography variant="caption" color="text.secondary">Gains potentiels : {potentialGain.toLocaleString()} $</Typography>
			</Grid>
			<Button 
				fullWidth 
				variant="contained" 
				sx={{ mt: 2, bgcolor: contestant.color, color: getContrastTextColor(contestant.color), fontWeight: 700 }}
				onClick={() => setOpenBetModal(true)}
				disabled={!betsOpened}
			>
				{hasPendingBet ? "✏️ MODIFIER" : "🔥 PARIER"}
			</Button>
		</ContentCard>
		<AddBetModal open={openBetModal} amount={pendingBet ? pendingBet : null} eventId={eventId || ""} gamblerId={gamblerId} contestantId={contestant.id} onClose={() => setOpenBetModal(false)} />
	</>;
};

export default ContestantCard;