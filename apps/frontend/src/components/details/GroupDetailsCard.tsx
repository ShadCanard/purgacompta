import React from 'react';
import { Card, CardContent, Avatar, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery } from '@tanstack/react-query';
import { getApolloClient } from '@/lib/apolloClient';
import { GET_GROUP_BY_ID } from '@/lib/queries/groups';

interface GroupDetailsCardProps {
  groupId: string;
}

const GroupDetailsCard: React.FC<GroupDetailsCardProps> = ({ groupId }) => {
  const apolloClient = getApolloClient();
  const { data: groupData, isLoading } = useQuery({
    queryKey: ['group-by-id', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_GROUP_BY_ID, variables: { groupByIdId: groupId } });
      return (data as any).groupById;
    },
  });

  if (isLoading || !groupData) return null;

  return (
    <Card sx={{ mb: 3, maxWidth: 500 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: groupData.color1 || '#333', width: 48, height: 48, mr: 2, border: `3px solid ${groupData.color2 || '#666'}` }} />
          <Typography variant="h5">{groupData.name}</Typography>
        </Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Contacts du groupe</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {groupData.contacts?.length ? groupData.contacts.map((c: any) => (
                <ListItem key={c.id}>
                  <ListItemText
                    primary={
                      <span>
                        {c.name} <span style={{ fontStyle: 'italic', color: '#888' }}>({c.phone})</span>
                      </span>
                    }
                  />
                </ListItem>
              )) : <Typography>Aucun contact</Typography>}
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default GroupDetailsCard;
