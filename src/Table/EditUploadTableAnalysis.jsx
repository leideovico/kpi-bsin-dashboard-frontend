import React, { useState, useEffect } from "react";
import "../Styles/dropdowns.css";
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/LoadingScreen'; // Sesuaikan path sesuai dengan struktur proyek Anda




const EditUploadTableAnalysis = () => {
  const [problemsByYear, setProblemsByYear] = useState({});
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalValues, setOriginalValues] = useState({});
  const [newRows, setNewRows] = useState([]); // State untuk menyimpan baris-baris data baru
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State for loading message


  useEffect(() => {
    fetchMasalahData();
  }, []);

  const fetchMasalahData = async () => {
    try {
      const response = await fetch("http://localhost:8080/kpi/masalah");
      if (response.ok) {
        const responseData = await response.json();
        const data = responseData.data;
        console.log("Received data:", data);

        // Group problems by year
        const groupedProblems = {};
        data.forEach(problem => {
          if (!groupedProblems[problem.Year]) {
            groupedProblems[problem.Year] = [];
          }
          groupedProblems[problem.Year].push(problem);
        });

        setProblemsByYear(groupedProblems);

        // Extract available years
        const years = Object.keys(groupedProblems);
        setAvailableYears(years);
        setSelectedYears(years); // Initially select all years
      } else {
        console.error("Failed to fetch masalah data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching masalah data:", error);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);

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
  
          const response = await fetch('http://localhost:8080/kpi/file/analisa', {
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
            // If you want to redirect to a specific URL, you can use:
            // window.location.href = 'your-target-url';
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleYearChange = (year) => {
    const updatedSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter(selectedYear => selectedYear !== year)
      : [...selectedYears, year];
    setSelectedYears(updatedSelectedYears);
  };

  // Definisi fetchData
const fetchData = async () => {
  try {
    // Lakukan permintaan fetch data yang diperlukan dari server
    const response = await fetch("http://localhost:8080/kpi/masalah");
    if (response.ok) {
      const responseData = await response.json();
      const data = responseData.data;
      console.log("Received data:", data);

      // Group problems by year
      const groupedProblems = {};
      data.forEach(problem => {
        if (!groupedProblems[problem.Year]) {
          groupedProblems[problem.Year] = [];
        }
        groupedProblems[problem.Year].push(problem);
      });

      // Setel state dengan data yang baru didapat
      setProblemsByYear(groupedProblems);

      // Extract available years
      const years = Object.keys(groupedProblems);
      setAvailableYears(years);
      setSelectedYears(years); // Initially select all years
    } else {
      console.error("Failed to fetch masalah data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching masalah data:", error);
  }
};


const handleDeleteAllData = async (year) => {
  if (window.confirm(`Apakah Anda yakin ingin menghapus semua data pada tahun ${year}?`)) {
    try {
      setIsLoading(true); // Aktifkan loading screen

      const authToken = localStorage.getItem("authToken");
  
      // Endpoint untuk menghapus seluruh data masalah pada tahun tertentu
      const response = await fetch(`http://localhost:8080/kpi/analisa/entire/${year}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        console.log('All data deleted successfully');
        fetchData(); // Refresh data after deletion
      } else {
        alert('Please log in again.');
        navigate('/login'); // Redirect to login page  
      }
    } catch (error) {
      console.error('Error starting deletion process:', error.message);
      alert('Error occurred while deleting data');
    } finally {
      setIsLoading(false); // Nonaktifkan loading screen setelah selesai
    }
  }
};

  

  const handleDeleteRowClick = async (year, index, masalahID) => {
    const userConfirmed = window.confirm("Apakah anda yakin ingin menghapus row ini?");
    if (!userConfirmed) {
      return; // Exit the function if the user cancels the deletion
    }
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8080/kpi/masalah/${masalahID}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const updatedProblems = [...problemsByYear[year]];
        updatedProblems.splice(index, 1);
        setProblemsByYear({
          ...problemsByYear,
          [year]: updatedProblems
        });
        console.log("Row deleted successfully");
      } else {
        console.error("Failed to delete row:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  

  const handleDeleteNewRowClick = (year, index) => {
    const userConfirmed = window.confirm("Apakah anda yakin ingin menghapus row ini?");
    if (!userConfirmed) {
      return; // Exit the function if the user cancels the deletion
    }
    setNewRows(prevState => ({
      ...prevState,
      [year]: prevState[year].filter((_, idx) => idx !== index)
    }));
  };

  const handleEditClick = () => {
    setEditMode(true);
    const originalValuesCopy = {};
    selectedYears.forEach(year => {
      originalValuesCopy[year] = [...problemsByYear[year]];
    });
    setOriginalValues(originalValuesCopy);

    // Inisialisasi objek baris baru untuk setiap tahun yang dipilih
    const newRowsCopy = {};
    selectedYears.forEach(year => {
      newRowsCopy[year] = [];
    });
    setNewRows(newRowsCopy);
  };

  const handleAddRowClick = (year) => {
    const newRow = {
      Masalah: "",
      Why: ["", "", "", "", ""],
      Tindakan: "",
      Pic: "",
      Target: "",
      FolDate: "",
      Status: "",
      Year: year
    };

    setNewRows(prevState => ({
      ...prevState,
      [year]: [...(prevState[year] || []), newRow]
    }));
  };

  const handleSaveClick = async () => {
    const authToken = localStorage.getItem('authToken');
  
    try {
      const promises = [];
  
      selectedYears.forEach(year => {
        const updatedProblems = problemsByYear[year];
        updatedProblems.forEach(problem => {
          const formData = {
            Masalah_ID: problem.Masalah_ID,
            Masalah: problem.Masalah,
            Why: problem.Why,
            tindakan: problem.Tindakan,
            pic: problem.Pic,
            target: problem.Target,
            status: problem.Status,
            Year: problem.Year
          };
  
          // Add folDate only if it is present
          if (problem.FolDate) {
            formData.folDate = problem.FolDate; // Keep folDate as string
          }
  
          console.log("Data yang dikirim ke server:", formData); // Tambahkan console log untuk body JSON
  
          promises.push(fetch(`http://localhost:8080/kpi/masalah/${problem.Masalah_ID}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
          }));
        });
  
        // Tambahkan data baru ke promises untuk dikirim ke server
        const newRowsForYear = newRows[year] || [];
        newRowsForYear.forEach(newRow => {
          const { Masalah_ID, ...formDataWithoutID } = newRow; // Destructure and remove Masalah_ID
          const formData = {
            ...formDataWithoutID,
            Why: [
              newRow.Why[0],
              newRow.Why[1],
              newRow.Why[2],
              newRow.Why[3],
              newRow.Why[4],
            ],
            Year: parseInt(newRow.Year) // Ensure Year is sent as an integer
          };
  
          // Add FolDate only if it is present
          if (newRow.FolDate) {
            formData.FolDate = newRow.FolDate; // Keep FolDate as string
          }
  
          console.log("Data yang dikirim ke server:", formData); // Tambahkan console log untuk body JSON
  
          promises.push(fetch(`http://localhost:8080/kpi/masalah`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
          }));
        });
  
      });
  
      await Promise.all(promises);
      setEditMode(false);
      console.log("Data saved successfully.");
      alert('Data berhasil disimpan!');
      fetchMasalahData(); // Refresh data setelah penyimpanan
      setProblemsByYear({});
      setNewRows({});
    } catch (error) {
      console.error("Failed to save data:", error);
      alert("Tolong login kembali! Apabila setelah login masih error, pastikan update tanggal follow up setiap kali melakukan perubahan data!");
    }
  };
  

  
  

        return (
          <div>
            <div className="container">
               <div style={{marginBottom:"10px"}} className="filter-containers">
              <div className="dropdown">
            <button onClick={toggleDropdown} className="dropdown-button">
              Filter Tahun
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
          {isLoading && <LoadingScreen />}

          
          
          <div className="savechanges">
            {!editMode && (
              <button onClick={handleEditClick}>Update Data Table</button>
            )}
          
            {editMode && (
              <button onClick={handleSaveClick}>Save Changes</button>
            )}
            </div>
    
           </div>

          
       </div>

       
       <div className='inputfile' style={{ marginLeft:"22px", display: 'flex', alignItems: 'center', marginBottom: '5px',  width: 'calc(100% - 43px)'}}>
  <input type="file" onChange={handleFileChange} style={{ marginRight: '13px' }} />
  <button onClick={handleFileUpload} style={{ padding: '5px 10px', borderRadius: '5px', backgroundImage: 'linear-gradient(to right, rgb(26, 171, 0), rgb(12, 217, 29))', color: 'white', border: 'none',  marginRight:"3px" }}>Upload Data</button>
</div>



      {selectedYears.map(year => (
        <div key={year} className="table-containers">
          <table className="dropdowns-safety">
            <caption>Saved Analysis Table for {year}</caption>
            <thead>
              <tr>
                <th rowSpan="2">Problem
                <div className="savechanges">

                <div>
                  {editMode && (
                    <button onClick={() => handleAddRowClick(year)}>Add</button>
                  )}
                  </div>
                  </div>

                </th>
                <th colSpan="5">Causes Analysis</th>
                <th rowSpan="2">Corrective Action</th>
                <th rowSpan="2">PIC</th>
                <th rowSpan="2">Target</th>
                <th colSpan="2">Follow Up</th>
              </tr>
              <tr>
                <th>Why 1</th>
                <th>Why 2</th>
                <th>Why 3</th>
                <th>Why 4</th>
                <th>Why 5</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(problemsByYear[year] || []).map((problem, index) => (
                <tr key={`${year}_${index}_${problem.Masalah_ID || ''}`}>
                  <td>
                  <div className="delete">

                    {editMode ? (
                      <textarea
                        value={problem.Masalah || ""}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          const updatedProblem = { ...problem };
                          updatedProblem.Masalah = e.target.value;
                          updatedProblems[index] = updatedProblem;

                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Masalah}
                      />
                    ) : (
                      problem.Masalah
                    )}
                    <div>
                 {editMode && (
                    <button onClick={() => handleDeleteRowClick(year, index, problem.Masalah_ID)}>Delete</button>
                  )}
                  </div>
                  </div>
                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Why[0]}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Why[0] = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                          
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Why[0]}
                      />
                      
                    ) : (
                      problem.Why[0]
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Why[1]}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Why[1] = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Why[1]}
                      />
                    ) : (
                      problem.Why[1]
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Why[2]}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Why[2] = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Why[2]}
                      />
                    ) : (
                      problem.Why[2]
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Why[3]}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Why[3] = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Why[3]}
                      />
                    ) : (
                      problem.Why[3]
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Why[4]}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Why[4] = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Why[4]}
                      />
                    ) : (
                      problem.Why[4]
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Tindakan}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Tindakan = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Tindakan}
                      />
                    ) : (
                      problem.Tindakan
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Pic}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Pic = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Pic}
                      />
                    ) : (
                      problem.Pic
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Target}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Target = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Target}
                      />
                    ) : (
                      problem.Target
                    )}
                  </td>
                  <td>
                  {editMode ? (
                      <textarea
                         value={problem.FolDate}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].FolDate = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        className="custominput"
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      />
                    ) : (
                      
                      <span>{problem.FolDate}</span>
                    )}


                  </td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={problem.Status}
                        onChange={e => {
                          const updatedProblems = [...problemsByYear[year]];
                          updatedProblems[index].Status = e.target.value;
                          setProblemsByYear({
                            ...problemsByYear,
                            [year]: updatedProblems
                          });
                        }}
                        style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                        placeholder={problem.Status}
                      />
                    ) : (
                      problem.Status
                    )}
                  </td>
                </tr>
              ))}
              {(newRows[year] || []).map((newRow, index) => (
                <tr key={`${year}_new_${index}`}>
                  <td>
                    <textarea
                      value={newRow.Masalah || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Masalah = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Masalah"
                    />
                    <div>
                    <div className="delete">
                <button onClick={() => handleDeleteNewRowClick(year, index)}>Delete</button>
                </div>
                </div>

                  </td>
                  <td>
                    <textarea
                      value={newRow.Why[0] || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Why[0] = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Why 1"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newRow.Why[1] || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Why[1] = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Why 2"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newRow.Why[2] || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Why[2] = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Why 3"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newRow.Why[3] || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Why[3] = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Why 4"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newRow.Why[4] || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Why[4] = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Why 5"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newRow.Tindakan || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Tindakan = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Tindakan"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newRow.Pic || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Pic = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="PIC"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newRow.Target || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Target = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Target"
                    />
                  </td>
                  <td>
                    <textarea
                      type="text"
                      value={newRow.FolDate || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].FolDate = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Date"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newRow.Status || ""}
                      onChange={e => {
                        const updatedNewRows = { ...newRows };
                        updatedNewRows[year][index].Status = e.target.value;
                        setNewRows(updatedNewRows);
                      }}
                      style={{ width: '100px', height: '50px' }} // Sesuaikan nilai width dan height sesuai kebutuhan

                      placeholder="Status"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           <div style={{display:"flex"}}>
                <div style={{marginRight:"20px"}} className="compare">
              {editMode && (
                            <button onClick={() => handleDeleteAllData(year)}>Delete All Data for {year}</button>

                )}
            </div>      
          </div>
            </div>
       ))}
    </div>
  );
};

export default EditUploadTableAnalysis;
