import { TrendingDown, TrendingFlat, TrendingUp } from "@mui/icons-material";
import { Card, CardContent, Box, Typography, CardProps } from "@mui/material";


interface StatCardProps extends CardProps {
  title: string;
  value: string;
  previousValue?: string;
  icon: React.ReactNode;
  color: string;
  cursor: string;
}


const StatCard: React.FC<StatCardProps> = ({ title, value, previousValue, icon, color, ...cardProps }) => {
  // Détection de variation (supporte $ ou % en début)
  let diff = 0;
  let isNumber = false;
  if (previousValue !== undefined) {
    const parse = (v: string) => Number((v || '').replace(/[^\d.-]+/g, ''));
    const curr = parse(value);
    const prev = parse(previousValue);
    if (!isNaN(curr) && !isNaN(prev)) {
      diff = curr - prev;
      isNumber = true;
    }
  }
  let diffColor = 'text.secondary';
  if (isNumber && diff > 0) diffColor = 'success.main';
  if (isNumber && diff < 0) diffColor = 'error.main';

  let trendingIcon = <TrendingFlat fontSize="small" sx={{ verticalAlign: 'middle', m: 0.5 }} />
  if (isNumber && diff > 0) trendingIcon = <TrendingUp color="success" fontSize="small" sx={{ verticalAlign: 'middle', m: 0.5 }} />;
  if (isNumber && diff < 0) trendingIcon = <TrendingDown color="error" fontSize="small" sx={{ verticalAlign: 'middle', m: 0.5 }} />;
  return (
    <Card
      sx={{
        background: 'rgba(30, 30, 46, 0.8)',
        border: '1px solid rgba(156, 39, 176, 0.2)',
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${color}33`,
        },
        cursor: cardProps.cursor,
      }}
      {...cardProps}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            {previousValue !== undefined && (
              <Typography variant="body2" sx={{ mt: 0.5 }} color={diffColor}>
                {trendingIcon}
                {isNumber && diff !== 0 ? (
                  <>
                    {diff > 0 ? '+' : ''}{diff}
                    {value.trim().startsWith('$') ? ' $' : ''}
                  </>
                ) : previousValue}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}22`,
              color: color,
              ml: 2,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;