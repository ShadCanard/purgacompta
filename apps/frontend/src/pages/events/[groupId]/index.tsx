import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import { getApolloClient } from "@/lib/apolloClient";
import { getDateStatus } from "@/lib/utils";
import { GET_EVENTS_BY_GROUP } from "@/lib/queries/events";
import EventCard from "@/components/events/EventCard";

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

  if (isLoading) return <CircularProgress sx={{ mt: 8, mx: "auto", display: "block" }} />;
  if (error) return <Typography color="error">Erreur lors du chargement des évènements.</Typography>;

  // Sépare les events à venir et passés
  const upcomingEvents = (data || []).filter((event: any) => getDateStatus(event.startDate) === 'upcoming');
  const ongoingEvents = (data || []).filter((event: any) => getDateStatus(event.startDate) === 'ongoing');
  const pastEvents = (data || []).filter((event: any) => getDateStatus(event.startDate) === 'past');

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Évènements du groupe
      </Typography>
	  
      {/* Events en cours */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2, mt: 2 }}>En cours</Typography>
      <Grid container spacing={3}>
        {ongoingEvents.length === 0 && (
          <Grid size={{ xs : 12 }}>
            <Typography color="text.secondary">Aucun évènement en cours.</Typography>
          </Grid>
        )}
          {ongoingEvents.map((event: any) => (
            <Grid size={{ xs : 12, md : 6 }} key={event.id}>
				<EventCard event={event} groupId={groupId as string} />
            </Grid>
          ))}
      </Grid>
	  
      {/* Events à venir */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2, mt: 2 }}>À venir</Typography>
      <Grid container spacing={3}>
        {upcomingEvents.length === 0 && (
          <Grid size={{ xs : 12 }}>
            <Typography color="text.secondary">Aucun évènement à venir.</Typography>
          </Grid>
        )}
          {upcomingEvents.map((event: any) => (
            <Grid size={{ xs : 12 }} key={event.id}>
				<EventCard event={event} groupId={groupId as string} />
            </Grid>
          ))}
      </Grid>

      {/* Events passés */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2, mt: 4 }}>Passés</Typography>
      <Grid container spacing={3}>
        {pastEvents.length === 0 && (
          <Grid size={{ xs : 12 }}>
            <Typography color="text.secondary">Aucun évènement passé.</Typography>
          </Grid>
        )}
          {pastEvents.map((event: any) => (
            <Grid size={{ xs : 12, md : 6 }} key={event.id}>
                <EventCard event={event} groupId={groupId as string} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default EventsByGroupPage;
