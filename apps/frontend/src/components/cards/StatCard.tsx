import { TrendingDown, TrendingFlat, TrendingUp } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import IconCard, { IconCardProps } from "./IconCard";


interface StatCardProps extends IconCardProps {
  title: string;
  value: string;
  previousValue?: string;
}


const StatCard: React.FC<StatCardProps> = ({ title, value, previousValue, ...cardProps }) => {
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
    <IconCard {...cardProps}>
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
	</IconCard>
  );
};

export default StatCard;