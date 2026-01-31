import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChartWrapper from '@/components/charts/ChartWrapper';
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getApolloClient } from '@/lib/apolloClient';
import { useQuery } from '@tanstack/react-query';
import { GET_TRANSACTIONS_BY_ENTITY, GET_VEHICLE_TRANSACTIONS_BY_TARGET } from '@/lib/queries/transactions';
import { GET_GROUP_BY_ID } from '@/lib/queries/groups';

interface GraphDetailsCardProps {
  targetId: string;
}

const GraphDetailsCard: React.FC<GraphDetailsCardProps> = ({ targetId }) => {
  const apolloClient = getApolloClient();
  const [datasetColor, setDatasetColor] = React.useState<string>('#a00000');

  // Transactions standards
  const { data: standardTransactions = [] } = useQuery({
    queryKey: ['transactions-by-entity', targetId],
    enabled: !!targetId,
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_TRANSACTIONS_BY_ENTITY,
        variables: { entityId: targetId },
      });
      return (data as any).transactionsByEntity;
    },
  });

  // Récupération du groupe pour la couleur
  const { data: groupData } = useQuery({
    queryKey: ['group-by-id', targetId],
    enabled: !!targetId,
    queryFn: async () => {
      const { data } = await apolloClient.query({ query: GET_GROUP_BY_ID, variables: { groupByIdId: targetId } });
      return (data as any).groupById;
    },
  });



  // Transactions véhicules filtrées côté backend
  const { data: vehicleTransactions = [], isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['vehicle-transactions-by-target', targetId],
    enabled: !!targetId,
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_VEHICLE_TRANSACTIONS_BY_TARGET,
        variables: { targetId },
      });
      return (data as any).vehicleTransactionsByTarget;
    },
  });

  // Préparation des données pour le graphique (évolution semaine par semaine)
  const weeklyData = React.useMemo(() => {
    const all = [
      ...standardTransactions.map((t: any) => ({
        amount: t.totalFinal,
        createdAt: t.createdAt,
      })),
      ...vehicleTransactions.map((t: any) => ({
        amount: t.rewardAmount,
        createdAt: t.createdAt,
      })),
    ];
    // Générer les 8 dernières semaines (lundi à dimanche)
    const today = new Date();
    today.setHours(0,0,0,0);
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const weeks: { key: string, label: string, start: Date, end: Date }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(monday);
      start.setDate(monday.getDate() - i * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      weeks.push({
        key: `${start.getFullYear()}-S${String(getWeekNumber(start)).padStart(2, '0')}`,
        label: `du ${formatDateShort(start)} au ${formatDateShort(end)}`,
        start,
        end
      });
    }
    const byWeek: Record<string, number> = {};
    all.forEach(t => {
      let d: Date;
      if (typeof t.createdAt === 'number') {
        d = new Date(t.createdAt);
      } else if (/^\d+$/.test(t.createdAt)) {
        d = new Date(Number(t.createdAt));
      } else {
        d = new Date(t.createdAt);
      }
      if (Number.isNaN(d.getTime())) return;
      const weekKey = `${d.getFullYear()}-S${String(getWeekNumber(d)).padStart(2, '0')}`;
      byWeek[weekKey] = (byWeek[weekKey] || 0) + (typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0);
    });
    const labels = weeks.map(w => w.label);
    const data = weeks.map(w => byWeek[w.key] || 0);
    return { labels, data };
    function getWeekNumber(date: Date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    }
    function formatDateShort(date: Date) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()}`;
    }
  }, [standardTransactions, vehicleTransactions]);

  useEffect(() => {
    setDatasetColor(groupData?.color1 || '#a00000');
  }, [groupData]);

  return (
    <Accordion sx={{ width: '100%', mb: 2 }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={700}>Évolution des transactions (par jour)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ width: '100%' }}>
          <ChartWrapper
            type="bar"
            data={{
              labels: weeklyData.labels,
              datasets: [
                {
                  label: 'Montant total',
                  data: weeklyData.data,
                  backgroundColor: datasetColor,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  title: { display: true, text: 'Semaine' },
                  ticks: { display: false },
                },
                y: { title: { display: true, text: 'Montant (€)' } },
              },
            }}
            height={320}
            width={1200}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default GraphDetailsCard;
