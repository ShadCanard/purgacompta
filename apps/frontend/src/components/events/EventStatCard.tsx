import { Box, Typography } from "@mui/material";
import IconCard, { IconCardProps } from "../cards/IconCard";


export interface EventStatCardProps extends IconCardProps {
  title: string;
  value: number | string;
  valueColor: string;
  icon: React.ReactElement;
}

const EventStatCard: React.FC<EventStatCardProps> = ({ title, value, icon, valueColor, ...props }) => {
  return (
    <IconCard {...props} icon={icon} iconOnRight={false}>
		<Box>
			<Typography variant="subtitle2" fontWeight={700} gutterBottom>{title}</Typography>
			<Typography variant="h5" color={valueColor}>{value}</Typography>
		</Box>
    </IconCard>
  );
};

export default EventStatCard;