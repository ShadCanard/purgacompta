import React from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import StatCard from '@/components/layout/StatCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import { USER_UPDATED } from '@/lib/subscriptions/user';
import { TABLET_UPDATED } from '@/lib/subscriptions/vehicles';
import { getApolloClient } from '@/lib/apolloClient';
import { formatDollar } from '@/lib/utils';
import { DirectionsCar } from '@mui/icons-material';

const DASHBOARD_STATS_QUERY = gql`
  query DashboardStats {
    userAccountHistoryStats {
      transactionsCount
      transactionsCountLastWeek
      totalBalance
      totalBalanceLastWeek
      totalAmount
      totalAmountLastWeek
      totalIncoming
      totalIncomingLastWeek
      totalOutgoing
      totalOutgoingLastWeek
      vehicleTransactionsCount
      vehicleTransactionsCountLastWeek
    }
  }
`;

const DashboardStats: React.FC = () => {


  const queryClient = useQueryClient();
  const apolloClient = getApolloClient();
    
const fetchDashboardStats = async () => {
  const { data } = await apolloClient.query({ query: DASHBOARD_STATS_QUERY });
  return (data as any).userAccountHistoryStats;
};

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  // Subscription pour rafraîchir les stats en temps réel
  React.useEffect(() => {
    const subUser = apolloClient.subscribe({ query: USER_UPDATED }).subscribe({
      next: () => queryClient.invalidateQueries({queryKey: ['dashboard-stats']}),
      error: () => {},
    });
    const subTablet = apolloClient.subscribe({ query: TABLET_UPDATED }).subscribe({
      next: () => queryClient.invalidateQueries({queryKey: ['dashboard-stats']}),
      error: () => {},
    });
    return () => {
      subUser.unsubscribe();
      subTablet.unsubscribe();
    };
  }, [apolloClient, queryClient]);

  if (isLoading) return <Card sx={{ mb: 2 }}><CardContent>Chargement...</CardContent></Card>;
  if (error) return <Card sx={{ mb: 2 }}><CardContent>Erreur lors du chargement des stats.</CardContent></Card>;
  if (!data) return null;

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Transactions"
          value={`${data.transactionsCount}`}
          previousValue={`${data.transactionsCountLastWeek}`}
          icon={<TrendingUpIcon fontSize="large" />}
          color="#7c3aed"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Solde"
          value={formatDollar(data.totalBalance)}
          previousValue={formatDollar(data.totalBalanceLastWeek)}
          icon={<AccountBalanceWalletIcon fontSize="large" />}
          color="#00b894"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Transactions (montant)"
          value={formatDollar(data.totalAmount)}
          previousValue={formatDollar(data.totalAmountLastWeek)}
          icon={<PaidIcon fontSize="large" />}
          color="#ff9800"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Entrées"
          value={formatDollar(data.totalIncoming)}
          previousValue={formatDollar(data.totalIncomingLastWeek)}
          icon={<NorthIcon fontSize="large" />}
          color="#4caf50"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Sorties"
          value={formatDollar(Math.abs(data.totalOutgoing))}
          previousValue={formatDollar(Math.abs(data.totalOutgoingLastWeek))}
          icon={<SouthIcon fontSize="large" />}
          color="#e53935"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Véhicules"
          value={`${data.vehicleTransactionsCount}`}
          previousValue={`${data.vehicleTransactionsCountLastWeek}`}
          icon={<DirectionsCar fontSize="large" />}
          color="#1976d2"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
