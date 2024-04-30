import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto'; // Import Chart.js auto for version 3+
import '../Styles/chart.css';

function ChartComponent({ chartSize }) {
  const [firstTargetData, setFirstTargetData] = useState([]);
  const [firstActualData, setFirstActualData] = useState([]);
  const [secondTargetData, setSecondTargetData] = useState([]);
  const [secondActualData, setSecondActualData] = useState([]);
  const [thirdTargetData, setThirdTargetData] = useState([]);
  const [thirdActualData, setThirdActualData] = useState([]);

  useEffect(() => {

    // Data manual chart menggunakan angka
    // const loadThirdChartData = async () => {
    //   const exampleThirdTargetData = [120, 150, 120, 200, 300, 100, 150, 200, 250, 250, 200, 210];
    //   const exampleThirdActualData = [90, 100, 80, 170, 100, 80, 120, 90, 220, 120,90, 80];
    //   setThirdTargetData(exampleThirdTargetData);
    //   setThirdActualData(exampleThirdActualData);
    // };
    
    const loadFirstChartData = async () => {
      let exampleFirstActualData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 31) + 10);
      let exampleFirstTargetData = exampleFirstActualData.map(actual => actual + Math.floor(Math.random() * (41 - actual)) + 1);
    
      // Pastikan minimal 2 angka yang melebihi atau sama dengan target
      let countExceed = 0;
      for (let i = 0; i < 12; i++) {
        if (exampleFirstActualData[i] >= exampleFirstTargetData[i]) {
          countExceed++;
        }
        if (countExceed >= 2) {
          break;
        }
      }
    
      // Jika tidak ada minimal 2 angka yang melebihi atau sama dengan target, ubah 2 nilai pertama
      if (countExceed < 2) {
        exampleFirstActualData[0] += 2;
        exampleFirstActualData[1] += 1;
      }
    
      setFirstActualData(exampleFirstActualData);
      setFirstTargetData(exampleFirstTargetData);
    };
    
    const loadSecondChartData = async () => {
      let exampleSecondActualData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 31) + 10);
      let exampleSecondTargetData = exampleSecondActualData.map(actual => actual + Math.floor(Math.random() * (41 - actual)) + 1);
    
      // Pastikan minimal 2 angka yang melebihi atau sama dengan target
      let countExceed = 0;
      for (let i = 0; i < 12; i++) {
        if (exampleSecondActualData[i] >= exampleSecondTargetData[i]) {
          countExceed++;
        }
        if (countExceed >= 2) {
          break;
        }
      }
    
      // Jika tidak ada minimal 2 angka yang melebihi atau sama dengan target, ubah 2 nilai pertama
      if (countExceed < 2) {
        exampleSecondActualData[0] += 2;
        exampleSecondActualData[1] += 1;
      }
    
      setSecondActualData(exampleSecondActualData);
      setSecondTargetData(exampleSecondTargetData);
    };
    
    const loadThirdChartData = async () => {
      let exampleThirdActualData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 31) + 10);
      let exampleThirdTargetData = exampleThirdActualData.map(actual => actual + Math.floor(Math.random() * (41 - actual)) + 1);
    
      // Pastikan minimal 2 angka yang melebihi atau sama dengan target
      let countExceed = 0;
      for (let i = 0; i < 12; i++) {
        if (exampleThirdActualData[i] >= exampleThirdTargetData[i]) {
          countExceed++;
        }
        if (countExceed >= 2) {
          break;
        }
      }
    
      // Jika tidak ada minimal 2 angka yang melebihi atau sama dengan target, ubah 2 nilai pertama
      if (countExceed < 2) {
        exampleThirdActualData[0] += 2;
        exampleThirdActualData[1] += 1;
      }
    
      setThirdActualData(exampleThirdActualData);
      setThirdTargetData(exampleThirdTargetData);
    };
    
    

    loadFirstChartData();
    loadSecondChartData();
    loadThirdChartData();
  }, []);

  const gradientColor = (context, isExceedTarget = true) => {
    const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 300);
    if (isExceedTarget) {
      gradient.addColorStop(0, '#FF0000'); // Warna merah
      gradient.addColorStop(1, '#8b0000'); // Warna merah tua

    } else {
      gradient.addColorStop(0, '#00FF00'); // Warna hijau
      gradient.addColorStop(1, '#FFFF00'); // Warna kuning
    }
    return gradient;
  };
  
  const chartData = (actualData, targetData) => {
    const ctx = document.createElement('canvas').getContext('2d'); // Buat konteks canvas sementara
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct','Nov', 'Dec'],
      datasets: [
        {
          label: 'Actual Data',
          data: actualData,
          backgroundColor: actualData.map((value, index) => (value >= targetData[index] ? gradientColor({ chart: { ctx } }, false) : gradientColor({ chart: { ctx } }))),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 8,

        },
        {
          label: 'Target Data',
          data: targetData,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: gradientColor({ chart: { ctx } }),
          borderWidth: 2,
          type: 'line',
          fill: false,
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    };
  };
  
  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: `Tahun ${""}`, // Menggunakan template literal
        padding: {
          top: 0,
          bottom: 5
        },
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      subtitle: {
        display: true,
        text: `KPI Result ${""}`, // Menggunakan template literal
        padding: {
          top: 1,
          bottom: 5
        },
        font: {
          size: 14
        }
      }
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
        min: 1, // Menetapkan nilai minimum sumbu y
        max: 50, // Menetapkan nilai maksimum sumbu y
        barPercentage: 0.8, // Menetapkan lebar batang data aktual menjadi 80% dari lebar kategori
        categoryPercentage: 0.9, // Menetapkan lebar kategori menjadi 90% dari lebar sumbu x
      },
    },
  };
  

  return (
    <div className='chart'>
    <div style={{ textAlign: 'left', marginBottom: '0px', marginTop: '60px', marginLeft: '140px' }}>
  <h2>Safety Chart</h2>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginLeft: '0px' }}>
    <div style={{
      width: chartSize.width,
      height: chartSize.height,
      paddingLeft: chartSize.paddingLeft,
      paddingTop: chartSize.paddingTop,
      marginTop: chartSize.marginTop,
      paddingBottom: chartSize.paddingBottom,
      marginLeft: '0', // Tidak ada jarak tambahan dari sisi kiri untuk chart pertama
      marginRight: '5px', // Jarak minimal antar chart
      border: '2px solid #8b0000',
      boxShadow: '5px 5px 10px rgba(139, 0, 0, 0.5)',
      borderRadius: '10px',
    }}>
      <Bar data={chartData(firstActualData, firstTargetData)} options={chartOptions} />
      <div className="chart-description">
            <ul>
               <li>KPI Factor Name: Factor 1</li>
              <li>Unit: Unit 1</li>
               <li>Target: Target 1</li>
            </ul>
          </div>
    </div>
    <div style={{
      width: chartSize.width,
      height: chartSize.height,
      paddingLeft: chartSize.paddingLeft,
      paddingTop: chartSize.paddingTop,
      marginTop: chartSize.marginTop,
      paddingBottom: chartSize.paddingBottom,
      marginLeft: '5px', // Jarak minimal antar chart
      marginRight: '5px',
      border: '2px solid #8b0000',
      boxShadow: '5px 5px 10px rgba(139, 0, 0, 0.5)',
      borderRadius: '10px',
    }}>
      <Bar data={chartData(secondActualData, secondTargetData)} options={chartOptions} />
      <div className="chart-description">
            <ul>
               <li>KPI Factor Name: Factor 1</li>
              <li>Unit: Unit 1</li>
              <li>Target: Target 1</li>
             </ul>
          </div>
    </div>
    <div style={{
      width: chartSize.width,
      height: chartSize.height,
      paddingLeft: chartSize.paddingLeft,
      paddingTop: chartSize.paddingTop,
      marginTop: chartSize.marginTop,
      paddingBottom: chartSize.paddingBottom,
      marginLeft: '5px', // Jarak minimal antar chart
      marginRight: '0', // Sesuaikan ini jika perlu untuk penyelarasan
      border: '2px solid #8b0000',
      boxShadow: '5px 5px 10px rgba(139, 0, 0, 0.5)',
      borderRadius: '10px',
    }}>
      <Bar data={chartData(thirdActualData, thirdTargetData)} options={chartOptions} />
      <div className="chart-description">
            <ul>
               <li>KPI Factor Name: Factor 1</li>
              <li>Unit: Unit 1</li>
              <li>Target: Target 1</li>
            </ul>
          </div>
    </div>
  </div>
  <div className="chart-divider"></div> {/* Garis pembatas di bawah ketiga grafik */}
</div>
</div>

  );
}

export default ChartComponent;
