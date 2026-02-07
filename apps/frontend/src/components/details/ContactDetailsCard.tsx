import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getApolloClient } from '@/lib/apolloClient';
import { GET_CONTACT_BY_ID } from '@/lib/queries/contacts';

interface ContactDetailsCardProps {
  contactId: string;
}

const ContactDetailsCard: React.FC<ContactDetailsCardProps> = ({ contactId }) => {
  const apolloClient = getApolloClient();
  const { data: contactData, isLoading } = useQuery({
    queryKey: ['contact-by-id', contactId],
    enabled: !!contactId,
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_CONTACT_BY_ID, variables: { id: contactId } });
      return (data as any).contactById;
    },
  });

  if (isLoading || !contactData) return null;

  return (
    <Card sx={{ mb: 3, maxWidth: 500 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>{contactData.name}</Typography>
        <Typography variant="body1">Téléphone : {contactData.phone}</Typography>
      </CardContent>
    </Card>
  );
};

export default ContactDetailsCard;
