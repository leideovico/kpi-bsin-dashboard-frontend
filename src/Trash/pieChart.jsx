import React from 'react';
import { Pie } from 'react-chartjs-2';

function PieChart({ data }) {
  return (
    <div className="pie-chart">
      <Pie data={data} options={{ maintainAspectRatio: false }} />
    </div>
  );
}

export default PieChart;
