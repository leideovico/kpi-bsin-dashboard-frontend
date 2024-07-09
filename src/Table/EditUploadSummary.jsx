import React, { useState, useEffect } from "react";
import "../Styles/savedsummary.css";
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/LoadingScreen'; // Sesuaikan path sesuai dengan struktur proyek Anda




const SavedSummaryTable = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [tablesData, setTablesData] = useState({});
  const [comparisonData, setComparisonData] = useState({});
  const [warningMessage, setWarningMessage] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectNameDropdownOpen, setProjectNameDropdownOpen] = useState(false);

  const [editMode, setEditMode] = useState(false); // state untuk mode edit
  const [editTableData, setEditTableData] = useState({}); // state untuk data yang diubah
  const [issuedDates, setIssuedDates] = useState([]);
  const [selectedIssuedDates, setSelectedIssuedDates] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [projectCharts, setProjectCharts] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");
const [selectedIssuedDate, setSelectedIssuedDate] = useState("");
 const [fileData, setFileData] = useState(null);

 const [selectedProjectNames, setSelectedProjectNames] = useState([]);

 const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(false); // State for loading message


 const handleProjectNameCheckboxChange = (projectName) => {
  setSelectedProjectNames((prevSelectedProjectNames) => {
    if (prevSelectedProjectNames.includes(projectName)) {
      return prevSelectedProjectNames.filter((name) => name !== projectName);
    } else {
      return [...prevSelectedProjectNames, projectName];
    }
  });
};

const toggleProjectNameDropdown = () => {
  setProjectNameDropdownOpen((prev) => !prev);
};



// This function handles file selection
const handleFileChange = (event) => {
  const file = event.target.files[0];
  console.log('File selected:', file); // Log the selected file
  setSelectedFile(file); // Set the selected file to the state

  // Read the file data for preview purposes (optional)
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setFileData(data); // Store parsed data for preview
    };
    reader.readAsBinaryString(file);
  }
};

// This function handles file upload
const handleFileUpload = async () => {
  if (selectedFile) { // Check if a file is selected
    try {
      setIsLoading(true); // Aktifkan loading screen

      console.log('Preparing to upload file:', selectedFile); // Log before uploading

      const formData = new FormData();
      formData.append('file', selectedFile); // Append the actual file to FormData

      const response = await fetch('http://172.30.16.249: 8081/kpi/file/summary', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          // 'Content-Type' is not needed; 'fetch' sets it automatically when FormData is used.
        },
        body: formData // Send the FormData containing the file
      });

      if (response.ok) {
        console.log('File uploaded successfully'); // Log success
        alert('File berhasil diunggah dan data diproses');
        window.location.reload(); // Refresh the page after successful upload
        // Handle further actions if necessary
      } else {
        const errorText = await response.text();
        console.error('Failed to upload file:', errorText); // Log the error message
        alert('Pastikan anda tidak mengupload data tahun yang sama dan pastikan juga format data tabel sesuai ketentuan!')
        // alert(`Gagal mengunggah file: ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error); // Log the error
      alert('Error uploading file: ' + error.message);
      alert('Please log in again.');
      navigate('/login'); // Redirect to login page   
    } finally {
      setIsLoading(false); // Nonaktifkan loading screen setelah selesai
    }
  } else {
    alert('Harap pilih file terlebih dahulu');
  }
};

const handleIssuedDateChange = (issuedDate) => {
  setSelectedIssuedDates((prevSelectedIssuedDates) => {
    if (prevSelectedIssuedDates.includes(issuedDate)) {
      // Jika tanggal sudah dipilih sebelumnya, hapus dari daftar yang dipilih
      return prevSelectedIssuedDates.filter((date) => date !== issuedDate);
    } else {
      // Jika tanggal belum dipilih sebelumnya, tambahkan ke daftar yang dipilih
      return [...prevSelectedIssuedDates, issuedDate];
    }
  });
};



  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCompareData = (issuedDate) => {
    const currentTable = tablesData[issuedDate];
    if (!currentTable || currentTable.columns.length < 2) {
      alert("To perform a comparison, at least two projects are needed.");
      return;
    }
  
    const comparisonResult = {
      columns: currentTable.columns
        .map((col1, index1) =>
          currentTable.columns.slice(index1 + 1).map((col2) => ({
            id: `${col1.id}-${col2.id}`,
            name: `${col1.name} vs ${col2.name}`,
            item: `Item diff between ${col1.name} and ${col2.name}`,
            quantity: `Quantity diff between ${col1.name} and ${col2.name}`,
          }))
        )
        .flat(),
      rows: currentTable.rows.map((row) => ({
        projectName: row.projectName,
        status: row.status
          .map((stat1, index1) =>
            row.status.slice(index1 + 1).map((stat2) => ({
              id: `${stat1.id}-${stat2.id}`,
              name: Math.abs(stat1.name - stat2.name),
              quantity: Math.abs(stat1.quantity - stat2.quantity),
            }))
          )
          .flat(),
        remarks: row.remarks,
      })),
    };
  
    setComparisonData((prevComparisonData) => ({
      ...prevComparisonData,
      [issuedDate]: comparisonResult,
      itemComparison: comparisonResult.columns.map((col, index) => ({
        name: col.name,
        value: comparisonResult.rows.map((row) => row.status[index].name),
      })),
      quantityComparison: comparisonResult.columns.map((col, index) => ({
        name: col.name,
        value: comparisonResult.rows.map((row) => row.status[index].quantity),
      })),
    }));
  };
  

 
  const handleDeleteRow = (issuedDate, projectName) => {

    const userConfirmed = window.confirm("Apakah anda yakin ingin menghapus row ini?");
    if (!userConfirmed) {
      return; // Exit the function if the user cancels the deletion
    }

    const updatedTableData = { ...editTableData };
    updatedTableData[issuedDate].rows = updatedTableData[issuedDate].rows.filter(
      (row) => row.projectName !== projectName
    );
    setEditTableData(updatedTableData);
  };

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const summaryResponse = await fetch("http://172.30.16.249: 8081/kpi/summary", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!summaryResponse.ok) {
        throw new Error("Failed to fetch summary data");
      }

      const summaryData = await summaryResponse.json();
      console.log("Fetched summary data:", summaryData);

      if (summaryData && summaryData.data && Array.isArray(summaryData.data)) {
        const tablesDataByIssuedDate = {};
        const issuedDatesSet = new Set();
        summaryData.data.forEach((entry) => {
          if (!entry || !entry.IssuedDate || !entry.Projects || !entry.Status) {
            console.error("Invalid data entry found:", entry);
            return;
          }

          const issuedDate = new Date(entry.IssuedDate).toLocaleDateString();
          issuedDatesSet.add(issuedDate);
          if (!tablesDataByIssuedDate[issuedDate]) {
            tablesDataByIssuedDate[issuedDate] = {
              summary_id: entry.Summary_ID,
              columns: [],
              rows: []
            };
          }

          if (tablesDataByIssuedDate[issuedDate].columns.length === 0) {
            tablesDataByIssuedDate[issuedDate].columns = entry.Projects.map((project, index) => ({
              id: index + 1,
              name: project.Name,
              item: `Item ${index + 1}`,
              quantity: `Quantity ${index + 1}`
            }));
          }

          const processedRows = entry.Status.map((status, statusIndex) => ({
            projectName: status,
             status: entry.Projects.map((project, colIndex) => ({
              name: parseInt(project.Item[statusIndex], 10),
              quantity: parseInt(project.Quantity[statusIndex], 10),
              id: colIndex + 1,
              statuses: [{ name: parseInt(project.Quantity[statusIndex], 10), id: colIndex + 1 }]
            })),
            remarks: entry.Remarks && entry.Remarks[statusIndex] ? entry.Remarks[statusIndex] : "No remarks available"
          }));

          tablesDataByIssuedDate[issuedDate].rows.push(...processedRows);
        });

        setIssuedDates(Array.from(issuedDatesSet));
        setSelectedIssuedDates(Array.from(issuedDatesSet));
        setTablesData(tablesDataByIssuedDate);
        setEditTableData(tablesDataByIssuedDate);

        // Create project charts
        const projectChartsData = [];
        Object.entries(tablesDataByIssuedDate).forEach(([issuedDate, tableData]) => {
          const projectNames = [...new Set(tableData.rows.map(row => row.projectName))];

          projectNames.forEach((projectName) => {
            const chartData = {
              labels: tableData.columns.map(col => col.name),
              datasets: [
                {
                  label: 'Item',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
                  hoverBorderColor: 'rgba(255, 99, 132, 1)',
                  data: [],
                },
                {
                  label: 'Quantity',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
                  hoverBorderColor: 'rgba(54, 162, 235, 1)',
                  data: [],
                },
              ],
            };

            tableData.columns.forEach((col) => {
              const row = tableData.rows.find(r => r.projectName === projectName);
              const status = row ? row.status.find(stat => stat.id === col.id) : null;
              if (status) {
                chartData.datasets[0].data.push(status.name);
                chartData.datasets[1].data.push(status.quantity);
              } else {
                chartData.datasets[0].data.push(0);
                chartData.datasets[1].data.push(0);
              }
            });

            projectChartsData.push({
              projectName: projectName,
              issuedDate: issuedDate,
              chartData: chartData,
            });
          });
        });

        setProjectCharts(projectChartsData);
      }

    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };



  useEffect(() => {
    fetchData();
    setSelectedIssuedDates((prevSelectedIssuedDates) => {
      // Pastikan setidaknya satu item yang dipilih, jika tidak, pertahankan item pertama
      if (prevSelectedIssuedDates.length === 0 && issuedDates.length > 0) {
        return [issuedDates[0]];
      }
      return prevSelectedIssuedDates;
    });
  }, []);
  

  const handleYearChange = (year) => {
    setSelectedYears((prevSelectedYears) =>
      prevSelectedYears.includes(year)
        ? prevSelectedYears.filter((y) => y !== year)
        : [...prevSelectedYears, year]
    );
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    setEditMode(false);
    try {
      setIsLoading(true); // Set loading to true

      const authToken = localStorage.getItem("authToken");
  
      for (const [issuedDate, tableData] of Object.entries(editTableData)) {
        const summaryId = tableData.summary_id;
  
        // Construct data for the PUT request
        const dataToUpdate = {
          Summary_ID: summaryId,
          IssuedDate: new Date(issuedDate).toISOString(),
          Projects: tableData.columns.map((col) => {
            const projectData = {
              Project_ID: col.id,
              Name: col.name,
              Summary_ID: summaryId,
              Item: [],
              Quantity: []
            };
  
            // Match row status to columns
            tableData.rows.forEach((row) => {
              const status = row.status.find((status) => status.id === col.id);
              projectData.Item.push(status ? parseInt(status.name) : 0);
              projectData.Quantity.push(status ? parseInt(status.quantity) : 0);
            });
  
            return projectData;
          }),
          Status: tableData.rows.map(row => row.projectName),
          Remarks: tableData.rows.map(row => row.remarks)
        };
  
        // Execute the PUT request
        let response = await fetch(`http://172.30.16.249: 8081/kpi/summary/entire/${summaryId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToUpdate)
        });
  
        if (!response.ok) {
          const responseData = await response.json();
          console.log(responseData); // Log the error message from the server
          throw new Error("Failed to update summary data");
        }
  
        // Construct and execute POST requests for new rows
        const newRows = tableData.rows.filter(row => row.isNew);
        for (const newRow of newRows) {
          const projectsData = tableData.columns.map((col) => ({
            Project_ID: col.id,
            Name: newRow.projectName,
            Item: newRow.status.find(s => s.id === col.id) ? parseInt(newRow.status.find(s => s.id === col.id).name) : 0,
            Quantity: newRow.status.find(s => s.id === col.id) ? parseInt(newRow.status.find(s => s.id === col.id).quantity) : 0,
            Summary_ID: summaryId
          }));
  
          const postData = {
            Summary_ID: summaryId,
            IssuedDate: new Date(issuedDate).toISOString(),
            Projects: projectsData,
            Status: newRow.projectName,
            Remarks: newRow.remarks
          };
  
          response = await fetch(`http://172.30.16.249: 8081/kpi/summary/entire`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
          });
  
          if (!response.ok) {
            const responseData = await response.json();
            console.log(responseData); // Log the error message from the server
            throw new Error("Failed to add new row data");
          }
        }
      }
      setIsLoading(false); // Set loading to false
      fetchData(); // Refresh data after updates
      alert("Anda telah mengubah data summary, tolong refresh halaman untuk melihat data perbandingan yang baru!");

    } catch (error) {
      console.error("Error updating data:", error.message);
      alert('Please log in again.');
      navigate('/login'); // Redirect to login page   
    }
  };

  
  const handleAddColumnClick = (issuedDate) => {
    const newColumn = {
 
      name: "", // Empty name initially
      item: `Item ${editTableData[issuedDate].columns.length + 1}`,
      quantity: `Quantity ${editTableData[issuedDate].columns.length + 1}`
    };
  
    const updatedTableData = { ...editTableData };
    updatedTableData[issuedDate].columns.push(newColumn);
  
    // Update Projects with the new column name
    updatedTableData[issuedDate].rows.forEach(row => {
      row.status.push({
        name: "", // Empty name initially
        quantity: "",
         statuses: []
      });
    });
  
    setEditTableData(updatedTableData);
  };
  
  const handleAddRowClick = (issuedDate) => {
    const newRow = {
      projectName: "",
      status: editTableData[issuedDate].columns.map((col) => ({
        name: "", // Empty name initially
        quantity: "",
        id: col.id,
        statuses: []
      })),
      remarks: ""
    };
  
    const updatedTableData = { ...editTableData };
    updatedTableData[issuedDate].rows.push(newRow);
    setEditTableData(updatedTableData);
  };
  
  const handleColumnChange = (issuedDate, colIndex, field, value) => {
    const updatedTableData = { ...editTableData };
    updatedTableData[issuedDate].columns[colIndex][field] = value;
    setEditTableData(updatedTableData);
  };
  
  const handleChange = (issuedDate, rowIndex, field, value, statIndex = null) => {
    const updatedTableData = { ...editTableData };
    if (statIndex === null) {
      updatedTableData[issuedDate].rows[rowIndex][field] = value;
    } else {
      updatedTableData[issuedDate].rows[rowIndex].status[statIndex][field] = value;
    }
    setEditTableData(updatedTableData);
  };
  
  const handleDeleteProject = (issuedDate, projectId) => {
    const userConfirmed = window.confirm("Apakah anda yakin ingin menghapus kolom ini?");
    if (!userConfirmed) {
      return; // Exit the function if the user cancels the deletion
    }
    const updatedTableData = { ...editTableData };
    updatedTableData[issuedDate].columns = updatedTableData[issuedDate].columns.filter(col => col.id !== projectId);
    updatedTableData[issuedDate].rows.forEach(row => {
      row.status = row.status.filter(stat => stat.id !== projectId);
    });
    setEditTableData(updatedTableData);
  };

  const handleDeleteAllData = async (issuedDate) => {
    // Menampilkan konfirmasi sebelum menghapus semua data
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus seluruh data pada tanggal ini?");
    if (!confirmDelete) {
      return; // Batalkan penghapusan jika pengguna membatalkan konfirmasi
    }
  
    try {
      setIsLoading(true); // Aktifkan loading screen

      const authToken = localStorage.getItem("authToken");
      const summaryId = editTableData[issuedDate].summary_id;
  
      // Execute the DELETE request
      const response = await fetch(`http://172.30.16.249: 8081/kpi/summary/entire/${summaryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        console.log('All data deleted successfully');
        fetchData(); // Refresh data after deletion
      } else {
        throw new Error("Failed to delete all data");
      }
    } catch (error) {
      console.error("Error deleting all data:", error.message);
    } finally {
      setIsLoading(false); // Nonaktifkan loading screen setelah selesai
    }
  };
  
  const handleSelectAllProjectNamesChange = (event) => {
    if (event.target.checked) {
      setSelectedProjectNames(Array.from(new Set(projectCharts.map((chart) => chart.projectName))));
    } else {
      setSelectedProjectNames([]);
    }
  };
  
  return (
    <div>
      {isLoading && <LoadingScreen />}
      {warningMessage && <div className="warning">{warningMessage}</div>}
      <div style={{marginBottom:"10px"}} className="filter-containers">
        <div className="dropdown">
          <button onClick={toggleDropdown} className="dropdown-button">
            Filter Tanggal 
          </button>
          {dropdownOpen && (
            <div className="dropdown-content">
               {issuedDates.map((issuedDate, index) => (
                <label key={index} className="dropdown-item">
                  <input
                    type="checkbox"
                    value={issuedDate}
                    checked={selectedIssuedDates.includes(issuedDate)}
                    onChange={() => handleIssuedDateChange(issuedDate)}
                  />
                  {issuedDate}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="savechanges">
      
              <button onClick={handleEditClick} className="dropdown-button">Update Data</button>
         
        </div>
      </div>

      <div className='inputfile' style={{ marginLeft:"22px", display: 'flex', alignItems: 'center', marginBottom: '5px',  width: 'calc(100% - 43px)' }}>
        <input type="file" onChange={handleFileChange} style={{ marginRight: '10px' }} />
        <button onClick={handleFileUpload} style={{ padding: '5px 10px', borderRadius: '5px', backgroundImage: 'linear-gradient(to right, rgb(26, 171, 0), rgb(12, 217, 29))', color: 'white', border: 'none' }}>Upload Data</button>
      </div>
  
      {Object.entries(tablesData)
        .filter(([issuedDate]) => selectedIssuedDates.includes(issuedDate)) // Menggunakan selectedIssuedDates untuk filter
        .map(([issuedDate, tableData]) => (
                  <div key={issuedDate} className="table-container">
            <table className="dropdowns-safety-sum">
              <caption>Summary Table {issuedDate}</caption>
              <thead>
                <tr>
                  <th rowSpan="2">
                    Item Category Project
                    <div>
                    {editMode && (
                      <React.Fragment>
                        <div className="savechanges">
                        <button
                          style={{ marginTop: "10px" }}
                          onClick={() => handleAddRowClick(issuedDate)}
                        >
                          Add Status
                        </button>
                        <button
                          style={{ marginTop: "5px", marginLeft: "5px" }}
                          onClick={() => handleAddColumnClick(issuedDate)}
                        >
                          Add Project
                        </button>
                        </div>
                      </React.Fragment>
                      
                    )}
                    </div>
                  </th>
                  {tableData.columns.map((col, colIndex) => (
                    <th colSpan="2" key={col.id}>
                      <div className="delete">
                      {editMode ? (
                        <textarea
                          value={editTableData[issuedDate].columns[colIndex].name}
                          onChange={(e) =>
                            handleColumnChange(
                              issuedDate,
                              colIndex,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        col.name
                      )}
                      <div>
                      {editMode && (
                        <button
                          style={{ marginLeft: "10px" }}
                          onClick={() => handleDeleteProject(issuedDate, col.id)}
                        >
                          Delete
                        </button>
                      )}
                      </div>
                      </div>
                    </th>
                  ))}
                  <th rowSpan="2">Remarks</th>
                </tr>
                <tr>
                  {tableData.columns.map((col) => (
                    <React.Fragment key={col.id}>
                      <th>{col.item}</th>
                      <th>{col.quantity}</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                
                {tableData.rows.map((row, rowIndex) => (

                  <tr key={rowIndex}>
                     <td>
                      
                     <div className="delete">

                      {editMode ? (
                        <input
                          type="text"
                          value={editTableData[issuedDate].rows[rowIndex].projectName}
                          onChange={(e) =>
                            handleChange(
                              issuedDate,
                              rowIndex,
                              "projectName",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        row.projectName
                      )}
                         {editMode && (
                        <button style={{marginTop:"10px"}} onClick={() => handleDeleteRow(issuedDate, row.projectName)}>
                          Delete
                        </button>
                        
                      )}
                      </div>
 
                    </td>

                    {row.status.map((stat, statIndex) => (
                      <React.Fragment key={stat.id}>
                        <td>
                          {editMode ? (
                            <input
                              type="number"
                              value={editTableData[issuedDate].rows[rowIndex].status[statIndex].name}
                              onChange={(e) =>
                                handleChange(
                                  issuedDate,
                                  rowIndex,
                                  "name",
                                  e.target.value,
                                  statIndex
                                )
                              }
                            />
                          ) : (
                            stat.name
                          )}
                        </td>
                        <td>
                          {editMode ? (
                            <input
                              type="number"
                              value={editTableData[issuedDate].rows[rowIndex].status[statIndex].quantity}
                              onChange={(e) =>
                                handleChange(
                                  issuedDate,
                                  rowIndex,
                                  "quantity",
                                  e.target.value,
                                  statIndex
                                )
                              }
                            />
                          ) : (
                            stat.quantity
                          )}
                        </td>
                      </React.Fragment>
                    ))}
                    <td>
                      {editMode ? (
                        <input
                          type="text"
                          value={editTableData[issuedDate].rows[rowIndex].remarks}
                          onChange={(e) =>
                            handleChange(
                              issuedDate,
                              rowIndex,
                              "remarks",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        row.remarks
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                
            <div style={{display:"inline-block"}}>
                <div style={{marginRight:"10px", marginTop:"10px"}} className="savechanges">
             
                <div style={{marginRight:"10px"}} className="compare">
                {editMode && (
                    <div className="delete">
                      <button
                        style={{ marginRight: "10px" }}
                        onClick={() => handleDeleteAllData(issuedDate)}
                      >
                        Delete All Data
                      </button>
                    </div>
                    
                  )}
                                  <button onClick={() => handleCompareData(issuedDate)}>Compare Data</button>

                </div>
                {editMode && (
                  <button style={{marginRight:"10px"}} onClick={handleSaveClick}>Save Changes</button>
                )}
                </div>      
          </div>
          </div>
        ))}
    {Object.entries(comparisonData)
  .filter(([issuedDate]) => selectedIssuedDates.includes(issuedDate)) // Menggunakan selectedIssuedDates untuk filter
  .map(([issuedDate, compData]) => (
          <div key={issuedDate} className="table-container">
            <hr /> {/* Section line above the comparison table */}
            <h2
            style={{
            
                     fontFamily:"Calibri, sans-serif",
          fontSize: "30px",
          color: "#333",
          textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",
          marginBottom:"10px"
            }}
            
            
            >Data Compared</h2>
            <table className="dropdowns-safety-sum">
              <caption>Comparison Table for {issuedDate}</caption>
              <thead>
                <tr>
                  <th rowSpan="2">Item Category Project</th>
                  {compData.columns.map((col) => (
                    <th colSpan="2" key={col.id}>
                      {col.name}
                    </th>
                  ))}
                  <th rowSpan="2">Remarks</th>
                </tr>
                <tr>
                  {compData.columns.map((col) => (
                    <React.Fragment key={col.id}>
                      <th>{col.item}</th>
                      <th>{col.quantity}</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{row.projectName}</td>
                    {row.status.map((stat) => (
                      <React.Fragment key={stat.id}>
                        <td>{stat.name}</td>
                        <td>{stat.quantity}</td>
                      </React.Fragment>
                    ))}
                    <td>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

<div style={{ color: "white", marginTop: "10px" }} className="filter-containers">
   <div className="dropdown">
    <button onClick={toggleDropdown} className="dropdown-button" style={{ marginLeft: "10px" }}>
      Filter Tanggal
    </button>
    {dropdownOpen && (
      <div className="dropdown-content" style={{ backgroundColor: "#a10909", color: "white", padding: "10px", borderRadius: "5px", border: "1px solid white" }}>
        {issuedDates.map((issuedDate, index) => (
          <label key={index} className="dropdown-item">
            <input
              type="checkbox"
              value={issuedDate}
              checked={selectedIssuedDates.includes(issuedDate)}
              onChange={() => handleIssuedDateChange(issuedDate)}
              style={{ marginRight: "5px" }}
            />
            {issuedDate}
          </label>
        ))}
      </div>
    )}
  </div>
  <div className="dropdown" >
        <button onClick={toggleProjectNameDropdown} className="dropdown-button"  >
          Filter Project Name
        </button>
        {projectNameDropdownOpen && (
          <div className="dropdown-content" style={{ backgroundColor: "#a10909", color: "white", padding: "10px", borderRadius: "5px", border: "1px solid white", maxHeight: "200px", overflowY: "auto"}}>
            <label className="dropdown-item" style={{ display: "flex", alignItems: "center", marginBottom: "5px", justifyContent: "flex-start", padding: "5px 0" }}>
              <input
                type="checkbox"
                onChange={handleSelectAllProjectNamesChange}
                checked={selectedProjectNames.length === Array.from(new Set(projectCharts.map((chart) => chart.projectName))).length}
                style={{ marginRight: "10px" }}
              />
              <span style={{ color: "white", textAlign: "left", width: "100%", marginRight:"100%" }}>Select All</span>
            </label>
            {Array.from(new Set(projectCharts.map((chart) => chart.projectName))).map((projectName) => (
              <label key={projectName} className="dropdown-item" style={{ display: "flex", alignItems: "center", marginBottom: "5px", justifyContent: "flex-start"}}>
                <input
                  type="checkbox"
                  value={projectName}
                  checked={selectedProjectNames.includes(projectName)}
                  onChange={() => handleProjectNameCheckboxChange(projectName)}
                 />
<span style={{ color: "white", textAlign: "left", width: "100%", marginRight:"100%" }}>{projectName}</span>
</label>
            ))}
          </div>
        )}
      </div>
</div>

    
<div style={{ 
  display: 'flex',
  flexWrap: 'wrap',
  padding: '10px',
  justifyContent:"space-evenly"
}}>
  {projectCharts
    .filter(chart => 
      (selectedIssuedDates.length === 0 || selectedIssuedDates.includes(chart.issuedDate)) &&
      (selectedProjectNames.length === 0 || selectedProjectNames.includes(chart.projectName))
    )
    .map((chart) => (
      <div 
        style={{ 
          flexBasis: '48%', // Approximately half of the container width
          marginBottom: '20px',
          borderRadius: '15px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
          overflow: 'hidden', 
          maxWidth: '600px', 
        }} 
        key={`${chart.projectName}-${chart.issuedDate}`}
      >
        <h2 style={{
          fontFamily: 'Calibri, sans-serif',
          fontSize: '30px',
          color: '#333',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          marginBottom: '10px',
          textAlign: 'center' // Center align the heading
        }}    
        >{chart.projectName} Chart for {chart.issuedDate}</h2>
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '15px' }}>
          <Bar
            data={chart.chartData}
            options={{
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    suggestedMax: 100,
                  },
                }],
              },
            }}
          />
        </div>
      </div>
    ))}
</div>


   </div>
  );
};

export default SavedSummaryTable;
