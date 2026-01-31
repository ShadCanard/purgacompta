import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/router';

import { Avatar, Box, Typography } from '@mui/material';
import GraphAccountsCard from '@/components/accounts/GraphAccountsCard';
import { formatFullName } from '@/lib/utils';
import { useUserById } from '@/providers/UserProvider';
import TableAccountsCard from '@/components/accounts/TableAccountsCard';

const AccountDetailsPage : React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const {data: user} = useUserById(id as string);

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={user?.avatar} alt={formatFullName(user)} sx={{ width: 128, height: 128, mr: 2 }} />
          <Typography variant="h4" gutterBottom>Compte de {formatFullName(user)}</Typography>
        </Box>
        <GraphAccountsCard userId={id as string} />
        <TableAccountsCard userId={id as string} />
      </Box>
    </MainLayout>
  );
}

export default AccountDetailsPage;