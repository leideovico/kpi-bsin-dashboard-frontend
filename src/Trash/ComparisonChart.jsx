import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const ComparisonChart = ({ comparisonData }) => {
  const chartRef = useRef();

  useEffect(() => {
    const labels = comparisonData.map(data => data.category);
    const datasets = comparisonData[0].data.map((_, index) => {
      const data = comparisonData.map(item => item.data[index]);
      return {
        label: data[0], // Assuming the first data point is the name of the item
        data: data.slice(1), // Assuming the first data point is the name of the item
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // You can customize colors as needed
        borderColor: 'rgba(75, 192, 192, 1)', // You can customize colors as needed
        borderWidth: 1,
      };
    });

    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    const myChart = new Chart(chartRef.current, chartConfig);

    return () => {
      myChart.destroy();
    };
  }, [comparisonData]);

  return <canvas ref={chartRef} />;
};

export default ComparisonChart;
