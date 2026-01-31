import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChartWrapper from '@/components/charts/ChartWrapper';
import { Box, Typography } from '@mui/material';
import { useAccountHistoriesByUser } from '@/lib/hooks/useUserAccountHistory';
import { formatDateTime } from '@/lib/utils';

interface GraphAccountsCardInputProps {
    userId?: string;
}

const GraphAccountsCard: React.FC<GraphAccountsCardInputProps> = ({ userId }) => {
  const { data: accountHistories = [], isLoading } = useAccountHistoriesByUser(userId ?? '');
  // Trie du plus récent au plus ancien
  const allData = React.useMemo(() => {
    const sorted = [...accountHistories].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const labels = sorted.map((h, idx) => {
      return `${formatDateTime(h.createdAt)} \n ${h.notes || ''}`;
    });
    const data = sorted.map(h => typeof h.amount === 'number' ? h.amount : Number(h.amount) || 0);
    return { labels, data };
  }, [accountHistories]);

  return (
    <Accordion sx={{ width: '100%', mb: 2 }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={700}>Évolution des soldes utilisateurs (30 jours)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ width: '100%' }}>
          <ChartWrapper
            type="bar"
            data={{
              labels: allData.labels,
              datasets: [
                {
                  label: 'Montant',
                  data: allData.data,
                  backgroundColor: '#a00000',
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
                  title: { display: true, text: 'Entrée chronologique' },
                  ticks: {
                    display: false,
                    autoSkip: false,
                    maxRotation: 60,
                    minRotation: 45,
                  },
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

export default GraphAccountsCard;
