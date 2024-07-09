import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import '../Styles/chart.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { registerables } from 'chart.js';

function ChartComponent5({ chartSize5 }) {
  const [chartData, setChartData] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  Chart.register(...registerables, ChartDataLabels);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleRemoveFilter = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/kpi/item');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response JSON (item):', data);

        const formattedChartData = [];

        data.data.forEach(item => {
          if (item.Name === 'C') {
            item.Results.forEach(result => {
              result.Factors.forEach(factor => {
                const plannedMonthly = factor.Planned?.Monthly[0] || {};
                const actualMonthly = factor.Actual?.Monthly[0] || {};
        
                formattedChartData.push({
                  kpiResult: result.Name,
                  kpiFactorName: factor.Title,
                  unit: factor.Unit,
                  target: factor.Target,
                  planned: {
                    January: plannedMonthly.January,
                    February: plannedMonthly.February,
                    March: plannedMonthly.March,
                    April: plannedMonthly.April,
                    May: plannedMonthly.May,
                    June: plannedMonthly.June,
                    July: plannedMonthly.July,
                    August: plannedMonthly.August,
                    September: plannedMonthly.September,
                    October: plannedMonthly.October,
                    November: plannedMonthly.November,
                    December: plannedMonthly.December,
                  },
                  actual: {
                    January: actualMonthly.January,
                    February: actualMonthly.February,
                    March: actualMonthly.March,
                    April: actualMonthly.April,
                    May: actualMonthly.May,
                    June: actualMonthly.June,
                    July: actualMonthly.July,
                    August: actualMonthly.August,
                    September: actualMonthly.September,
                    October: actualMonthly.October,
                    November: actualMonthly.November,
                    December: actualMonthly.December,
                  },
                  year: item.Year // Tambahkan informasi tahun
                });
              });
            });
          }
        });
        

        setChartData(formattedChartData);
        setFilteredChartData(formattedChartData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeSearchTerm === '') {
      setFilteredChartData(chartData);
    } else {
      const filteredData = chartData.filter(data =>
        data.kpiResult.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        data.kpiFactorName.toLowerCase().includes(activeSearchTerm.toLowerCase())
      );
      setFilteredChartData(filteredData);
    }
  }, [activeSearchTerm, chartData]);

const chartOptions = {
  plugins: {
    title: {
      display: true,
      text: `Tabel Data Tahun `, // Menambahkan string tambahan "Tabel Data Tahun"
      padding: {
        top: 0,
        bottom: 5
      },
      font: {
        size: 18,
        weight: 'bold'
      }
    },
    datalabels: {
      display: true,
      formatter: function (value) {
        return value;
      },
      color: 'white' // Mengatur warna angka menjadi putih
    }
  },
  scales: {
    x: {
      type: 'category',
    },
    y: {
      beginAtZero: false, // Mulai dari 0
      min:0.0, // Nilai minimum
       barPercentage: 0.8,
      categoryPercentage: 0.9,
    },
  },
};

  
  
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

  return (
    <div className='chart'>
      <div style={{ textAlign: 'left', marginBottom: '0px', marginTop: '60px', marginLeft: '140px' }}>
      <hr /> 
      <h2>Cost Chart</h2>
        <input type="text" placeholder="Search KPI Result or Factor..." onChange={handleSearchChange} />
        <div className='search'>
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleRemoveFilter} style={{ marginLeft: '7px' }}>Remove Filter</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {filteredChartData.length === 0 ? (
          <p style={{ backgroundColor: '#8b0000', borderRadius: '5px', color: 'white', padding: '10px' }}>Data not available for this item!</p>
        ) : (
            filteredChartData.map((data, index) => (
              <ChartContainer
                key={index}
                data={data}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: `Tabel Data Tahun ${data.year}` } } }} // Set judul chart sesuai dengan tahun
                size={chartSize5}
                gradientColor={gradientColor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
  
}

const ChartContainer = ({ data, options, size, gradientColor }) => {
  const { kpiResult, kpiFactorName, unit, target, planned, actual, year } = data;

  // Prepare chart data
  const chartData = {
    labels: Object.keys(planned),
    datasets: [
      {
        label: 'Planned',
        data: Object.values(planned),
        borderColor: gradientColor,
        fill: false,
        type: 'line',
        borderWidth: 2, // Lebar batas target
      type: 'line', // Jenis chart (line)
      fill: false, // Tidak diisi dengan warna
      pointStyle: 'circle', // Gaya marker titik
      pointRadius: 5, // Ukuran marker titik
      pointHoverRadius: 8, // Ukuran marker titik saat dihover
      datalabels: {
        display: true, // Selalu tampilkan datalabels untuk dataset ini
        color: 'black', // Warna teks
        size: 10, // Ukuran font
        align: 'end', // Arahkan ke ujung
        anchor: 'end', // Ancor di ujung
        offset: 0.5 // Offset spesifik untuk line chart
      }
      },
      {
        label: 'Actual',
        data: Object.values(actual),
        backgroundColor: gradientColor,
        borderWidth: 1,
        type: 'bar', pointStyle: 'circle', // Gaya marker titik
        pointRadius: 5, // Ukuran marker titik
        pointHoverRadius: 8, // Ukuran marker titik saat dihover
        datalabels: {
          display: true, // Selalu tampilkan datalabels untuk dataset ini
          offset: -21, // Menggeser label 10 piksel ke bawah dari pusat batang
          anchor: 'end', // Anchor pada akhir bar sehingga muncul di atas bar
          align: 'top', // Arahkan ke atas
          color: 'white', // Warna teks
          font: {
            size: 10 // Ukuran font
          }
        }
       }
    ]
  };

  return (
    <div style={{
      width: size.width,
      height: size.height,
      paddingLeft: size.paddingLeft,
      paddingTop: size.paddingTop,
      marginTop: size.marginTop,
      paddingBottom: size.paddingBottom,
      marginLeft: '5px',
      marginRight: '5px',
      border: '2px solid #8b0000',
      boxShadow: '5px 5px 10px rgba(139, 0, 0.5)',
      borderRadius: '10px',
      }}>
      <Line data={chartData} options={options} />
      <div className="chart-description">
      <ul>
      <li>KPI Result: {kpiResult}</li>
      <li>KPI Factor Name: {kpiFactorName}</li>
      <li>Unit: {unit}</li>
      <li>Target: {target}</li>
      </ul>
      </div>
      </div>
      );
      };
      
      export default ChartComponent5;
