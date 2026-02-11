import { Box } from "@mui/material";
import ContentCard, { ContentCardProps } from "./ContentCard";


export interface IconCardProps extends ContentCardProps {
	icon: React.ReactNode;
  	children?: React.ReactNode;
	iconOnRight?: boolean;
}


const IconCard: React.FC<IconCardProps> = ({ icon, children, iconOnRight = true, ...cardProps }) => {
	
  return (
	<ContentCard {...cardProps} color={cardProps.color}>
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
		{!iconOnRight && (<Box
			sx={{
			  p: 1.5,
			  borderRadius: 2,
			  backgroundColor: `${cardProps.color}22`,
			  color: cardProps.color,
			  ml: 2,
			}}
		  >
			{icon}
		  </Box>
		  )}
		  {children}
		  {iconOnRight && (<Box
			sx={{
			  p: 1.5,
			  borderRadius: 2,
			  backgroundColor: `${cardProps.color}22`,
			  color: cardProps.color,
			  ml: 2,
			}}
		  >
			{icon}
		  </Box>
		  )}
		</Box>
	  </ContentCard>
  );
};

export default IconCard;