import { Card, CardContent, CardProps } from "@mui/material";


export interface ContentCardProps extends CardProps {
  	color: string;
  	cursor?: string;
	children?: React.ReactNode;
	border?: boolean;
	borderColor?: string;
}


const ContentCard: React.FC<ContentCardProps> = ({ color, children, border, borderColor, ...cardProps }) => {

  return (
	<Card
	  sx={{
		background: 'rgba(30, 30, 46, 0.8)',
		border: `${border ? `1px solid ${borderColor || color}` : `1px solid rgba(156, 39, 176, 0.2)`}`,
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
		{children}
	  </CardContent>
	</Card>
  );
};

export default ContentCard;