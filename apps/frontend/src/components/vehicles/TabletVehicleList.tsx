import React from 'react';
import { Grid } from '@mui/material';
import TabletVehicleItem from './TabletVehicleItem';

interface TabletVehicleListProps {
  vehicles: { name: string; front: string; back: string; found: boolean }[];
  getStatusChip: (found: boolean) => React.ReactNode;
  onImageClick: (img: string) => void;
}

const TabletVehicleList: React.FC<TabletVehicleListProps> = ({ vehicles, getStatusChip, onImageClick }) => (
  <Grid container spacing={3}>
    {vehicles.map((vehicle) => (
      <Grid item xs={12} sm={6} md={3} key={vehicle.name}>
        <TabletVehicleItem
          vehicle={vehicle}
          onImageClick={onImageClick}
        />
      </Grid>
    ))}
  </Grid>
);

export default TabletVehicleList;
