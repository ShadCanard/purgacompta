import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import VehiclesUserItem from './VehiclesUserItem';
import { useQuery } from '@tanstack/react-query';
import { GET_MEMBERS } from '@/lib/queries';
import { getApolloClient } from '@/lib/apolloClient';

const VehiclesUserList: React.FC = () => {
    const apolloClient = getApolloClient();

  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['members-list'],
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_MEMBERS });
      return (data as any).users;
    },
  });

  if(loadingMembers) {
    return <Box sx={{ minHeight: '100vh', bgcolor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</Box>;
  }

  return (
    <Paper sx={{ mx: 'auto', p: 3 }}>
      <Box>
        <Box>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Véhicules par membre</Typography>
        </Box>
        <Box>
          {/* Liste des membres et véhicules */}
          <Grid container spacing={3}>
            {members.map((member: any) => (
              <Grid item xs={12} sm={6} md={3} key={member.id}>
                <VehiclesUserItem
                  member={member}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        </Box>
    </Paper>
    );
};
export default VehiclesUserList;
