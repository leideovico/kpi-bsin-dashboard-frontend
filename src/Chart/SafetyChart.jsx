// source code ini digunakan untuk memvisualisasikan SEQCD chart secara kseluruhan

import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import '../Styles/chart.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { registerables } from 'chart.js';

function ChartComponent({ chartSize }) {
  const [chartData, setChartData] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState('S'); // State untuk item yang dipilih
  const [selectedYears, setSelectedYears] = useState([]); // State untuk tahun yang dipilih
  const [availableYears, setAvailableYears] = useState([]); // State untuk menyimpan tahun yang tersedia
  const [dropdownOpen, setDropdownOpen] = useState(false); // State untuk dropdown
  const [showLabels, setShowLabels] = useState(true); // State to control label visibility
  
  const toggleLabels = () => {
    setShowLabels(!showLabels);
  };


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

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleYearChange = (year) => {
    setSelectedYears((prevSelectedYears) =>
      prevSelectedYears.includes(year)
        ? prevSelectedYears.filter((y) => y !== year)
        : [...prevSelectedYears, year]
    );
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
        const years = new Set();
  
        data.data.forEach(item => {
          years.add(item.Year); // Menambahkan tahun ke set tahun
          if (item.Name === selectedItem) { // Filter berdasarkan item yang dipilih
            item.Results.forEach(result => {
              result.Factors.forEach(factor => {
                const plannedMonthly = factor.Planned?.Monthly[0] || {};
                const actualMonthly = factor.Actual?.Monthly[0] || {};
                const plannedYtd = plannedMonthly.YTD || 0; // Ambil nilai YTD untuk planned
                const actualYtd = actualMonthly.YTD || 0; // Ambil nilai YTD untuk actual

                
  
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
                    ytd: plannedYtd // Tambahkan nilai YTD ke objek planned
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
                    ytd: actualYtd // Tambahkan nilai YTD ke objek actual
                  },
                  year: item.Year // Tambahkan informasi tahun
                });
              });
            });
          }
        });
  

        setAvailableYears(Array.from(years)); // Set tahun yang tersedia
        setChartData(formattedChartData);
        setFilteredChartData(formattedChartData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [selectedItem]); // Menambahkan selectedItem sebagai dependency agar fetch ulang saat item berubah

  useEffect(() => {
    let filteredData = chartData;
    if (activeSearchTerm !== '') {
      filteredData = filteredData.filter(data =>
        data.kpiResult.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        data.kpiFactorName.toLowerCase().includes(activeSearchTerm.toLowerCase())
      );
    }
    if (selectedYears.length > 0) {
      filteredData = filteredData.filter(data => selectedYears.includes(data.year));
    }
    setFilteredChartData(filteredData);
  }, [activeSearchTerm, selectedYears, chartData]);

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: `Grafik Data Tahun ${selectedYears.join(', ')}`, // Menampilkan tahun yang dipilih
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
      <div style={{ textAlign: 'left', marginBottom: '0px', marginTop: '60px', marginLeft: '140px', marginBottom:"50px" }}>
         <div style={{marginTop:"0px", width:"calc(100% - 18px)", marginLeft:"1px", marginBottom:"10px" }} className="filter-containers">
          
        <select 
          id="item-select"

          onChange={handleItemChange} value={selectedItem}>
          <option value="S">Safety</option>
          <option value="E">Environment</option>
          <option value="Q">Quality</option>
          <option value="C">Cost</option>
          <option value="D">Delivery</option>
        </select>

        <div className="dropdown">
          <button onClick={toggleDropdown} className="dropdown-button">
            Pilih Tahun
          </button>
          {dropdownOpen && (
            <div className="dropdown-content">
              {availableYears.map((year, index) => (
                <label key={index} className="dropdown-item">
                  <input
                    type="checkbox"
                    value={year}
                    checked={selectedYears.includes(year)}
                    onChange={() => handleYearChange(year)}
                  />
                  {year}
                </label>
              ))}
            </div>
          )}
        </div>
        </div>
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
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: `Grafik Data Tahun ${data.year}` } } }} // Set judul chart sesuai dengan tahun
                size={chartSize}
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
  const [showLabels, setShowLabels] = useState(true); // State to control label visibility

  const toggleLabels = () => {
    setShowLabels(!showLabels);
  };

  // Prepare chart data
  const chartData = {
    labels: Object.keys(planned).filter(key => key !== 'ytd'),
    datasets: [
      {
        label: 'Planned',
        data: Object.values(planned).filter((_, index) => Object.keys(planned)[index] !== 'ytd'),
        borderColor: gradientColor,
        backgroundColor: Object.keys(planned).map((month, index) => {
          const plannedValue = planned[month];
          const actualValue = actual[month];
          return plannedValue > actualValue ? '#a60b0b' : '#1FC216'; // Green if planned >= actual, red otherwise
        }),
        fill: false,
        type: 'line',
        borderWidth: 2, // Lebar batas target
        pointStyle: 'circle', // Gaya marker titik
        pointRadius: 5, // Ukuran marker titik
        pointHoverRadius: 8, // Ukuran marker titik saat dihover
        datalabels: {
          display: showLabels, // Use showLabels state to control visibility
          color: '#a60b0b', // Warna teks
          size: 10, // Ukuran font
          align: 'end', // Arahkan ke ujung
          anchor: 'end', // Ancor di ujung
          offset: 0.5 // Offset spesifik untuk line chart
        }
      },
      {
        label: 'Actual',
        data: Object.values(actual).filter((_, index) => Object.keys(planned)[index] !== 'ytd'),
        backgroundColor: Object.keys(planned).map((month, index) => {
          const plannedValue = planned[month];
          const actualValue = actual[month];
          return plannedValue > actualValue ? '#a60b0b' : '#1FC216'; // Green if planned >= actual, red otherwise
        }),
        borderWidth: 1,
        type: 'bar',
        pointStyle: 'circle', // Gaya marker titik
        pointRadius: 5, // Ukuran marker titik
        pointHoverRadius: 8, // Ukuran marker titik saat dihover
        datalabels: {
          display: showLabels, // Use showLabels state to control visibility
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
      <div className='delete'>
        <button style={{ marginleft: "0px" }} onClick={toggleLabels}>
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
      </div>
      <Line data={chartData} options={options} />
      <div style={{marginTop:"0px", marginBottom:"20px"}}  className="chart-description">
        <ul>
          <li>KPI Result: {kpiResult}</li>
          <li>KPI Factor Name: {kpiFactorName}</li>
          <li>Unit: {unit}</li>
          <li>Target: {target}</li>
          <li>Planned YTD: {planned.ytd}</li>
          <li>Actual YTD: {actual.ytd}</li>
        </ul>
      </div>
    </div>
  );
};


export default ChartComponent;
