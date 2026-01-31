import React from 'react';
import { Chart as ChartJS, ChartOptions, ChartType, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(...registerables);

export interface ChartWrapperProps {
  type: ChartType;
  data: any;
  options?: ChartOptions;
  height?: number;
  width?: number;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ type, data, options, height = 300, width = 600 }) => {
  return (
    <div style={{ width, height }}>
      <Chart type={type} data={data} options={options} height={height} width={width} />
    </div>
  );
};

export default ChartWrapper;
