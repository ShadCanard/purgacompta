import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, CircularProgress, Grid, AppBar, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { getApolloClient } from "@/lib/apolloClient";
import { getDateStatus } from "@/lib/utils";
import { GET_EVENTS_BY_GROUP } from "@/lib/queries/events";
import EventCard from "@/components/events/EventCard";
import { GET_GROUP_BY_ID } from "@/lib/queries/groups";

const EventsByGroupPage: React.FC = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const apolloClient = getApolloClient();

	const { data, isLoading, error } = useQuery({
		queryKey: ["eventsByGroup", groupId],
		enabled: !!groupId,
		queryFn: async () => {
			const { data } = await apolloClient.query({
				query: GET_EVENTS_BY_GROUP,
				variables: { groupId },
			});
			return (data as any).eventsByGroup;
		},
	});

	const {data: groupData, isLoading: groupLoading} = useQuery({
		queryKey: ['group', groupId],
		enabled: !!groupId,
		queryFn: async () => {
			const { data } = await apolloClient.query({
				query: GET_GROUP_BY_ID,
				variables: { groupByIdId: groupId },
			});
			return (data as any).groupById;
		},
	});

	// Sépare les events à venir et passés
	const upcomingEvents = (data || []).filter((event: any) => getDateStatus(event.startDate) === 'upcoming');
	const ongoingEvents = (data || []).filter((event: any) => getDateStatus(event.startDate) === 'ongoing');
	const pastEvents = (data || []).filter((event: any) => getDateStatus(event.startDate) === 'past');


	// Gestion de l'ouverture d'un seul Accordion à la fois
	const [expanded, setExpanded] = React.useState<string | false>('');

	React.useEffect(() => {
		if (ongoingEvents.length > 0) setExpanded('ongoing');
		else if (upcomingEvents.length > 0) setExpanded('upcoming');
		else setExpanded('past');
	}, [ongoingEvents.length, upcomingEvents.length, pastEvents.length]);

	const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false);
	};

	if (isLoading || groupLoading) return <CircularProgress sx={{ mt: 8, mx: "auto", display: "block" }} />;
	if (error) return <Typography color="error">Erreur lors du chargement des évènements.</Typography>;

	console.log(expanded);
	return (
		<Box>
			<AppBar position="static" sx={{ mb: 3, bgcolor: '#221313' }}>
				<Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography variant="h4" fontWeight={700}>
						📅 Evènements
					</Typography>
				</Box>
			</AppBar>
			<Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1000, mx: "auto" }}>
				<Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
					Évènements du groupe
				</Typography>

				{/* Events en cours */}
				<Accordion expanded={expanded === 'ongoing'} onChange={handleAccordionChange('ongoing')} sx={{ mb: 2 }}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h5" fontWeight={600}>En cours</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							{ongoingEvents.length === 0 && (
								<Grid size={{ xs : 12 }}>
									<Typography color="text.secondary">Aucun évènement en cours.</Typography>
								</Grid>
							)}
							{ongoingEvents.map((event: any) => (
								<Grid size={{ xs : 12, md : 6 }} key={event.id}>
									<EventCard event={event} groupId={groupId as string} groupColor={groupData?.color1} />
								</Grid>
							))}
						</Grid>
					</AccordionDetails>
				</Accordion>

				{/* Events à venir */}
				<Accordion expanded={expanded === 'upcoming'} onChange={handleAccordionChange('upcoming')} sx={{ mb: 2 }}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h5" fontWeight={600}>À venir</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							{upcomingEvents.length === 0 && (
								<Grid size={{ xs : 12 }}>
									<Typography color="text.secondary">Aucun évènement à venir.</Typography>
								</Grid>
							)}
							{upcomingEvents.map((event: any) => (
								<Grid size={{ xs : 12 }} key={event.id}>
									<EventCard event={event} groupId={groupId as string} groupColor={groupData?.color1} />
								</Grid>
							))}
						</Grid>
					</AccordionDetails>
				</Accordion>

				{/* Events passés */}
				<Accordion expanded={expanded === 'past'} onChange={handleAccordionChange('past')} sx={{ mb: 2 }}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="h5" fontWeight={600}>Passés</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={3}>
							{pastEvents.length === 0 && (
								<Grid size={{ xs : 12 }}>
									<Typography color="text.secondary">Aucun évènement passé.</Typography>
								</Grid>
							)}
							{pastEvents.map((event: any) => (
								<Grid size={{ xs : 12, md : 6 }} key={event.id}>
									<EventCard event={event} groupId={groupId as string} groupColor={groupData?.color1} />
								</Grid>
							))}
						</Grid>
					</AccordionDetails>
				</Accordion>
			</Box>
		</Box>
	);
};

export default EventsByGroupPage;
