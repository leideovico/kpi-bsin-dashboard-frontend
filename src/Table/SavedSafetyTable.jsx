import React, { useState, useEffect } from 'react';
import "../Styles/saved-table.css";
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/LoadingScreen'; // Sesuaikan path sesuai dengan struktur proyek Anda




const SavedSafetyTable = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [lastRowId, setLastRowId] = useState(0);
  const [isEditingRows, setIsEditingRows] = useState([]);
  const [editingTableIndex, setEditingTableIndex] = useState(null); // State baru untuk menyimpan indeks tabel yang sedang dalam mode pengeditan
  const [file, setFile] = useState(null); // State untuk menyimpan file yang diupload
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading message
  const navigate = useNavigate();



  // Fungsi untuk menambahkan faktor baru
const handleNewFactor = (resultIndex, year) => {
  const newFactor = {
  Factor_ID: null, // or generate an id if necessary
  Title: "",
  Unit: "",
  Target: "",
  Planned: {
  Monthly: [{ January: 0, February: 0, March: 0, April: 0, May: 0, June: 0, July: 0, August: 0, September: 0, October: 0, November: 0, December: 0 }]
  },
  Actual: {
  Monthly: [{ January: 0, February: 0, March: 0, April: 0, May: 0, June: 0, July: 0, August: 0, September: 0, October: 0, November: 0, December: 0 }]
  }
  };
  
  // Menambahkan faktor baru ke data yang sedang diedit
  setEditedData(prevData => {
  const newData = JSON.parse(JSON.stringify(prevData)); // Deep clone to avoid direct state mutation
  if (newData.Year === year) {
  newData.Results[resultIndex].Factors.push(newFactor); // Add new factor to the specific result
  }
  return newData;
  });
  
  // Update the filteredItems to show the new factor in the UI immediately
  setFilteredItems(prevFilteredItems => {
  return prevFilteredItems.map(item => {
  if (item.Year === year) {
  const updatedResults = item.Results.map((result, idx) => {
  if (idx === resultIndex) {
  return {
  ...result,
  Factors: [...result.Factors, newFactor]
  };
  }
  return result;
  });
  return {
  ...item,
  Results: updatedResults
  };
  }
  return item;
  });
  });
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
        alert('File sedang diproses, harap menunggu hingga terdapat pop up selanjutnya!');

        const formData = new FormData();
        formData.append('file', selectedFile); // Append the actual file to FormData

        const response = await fetch('http://172.30.16.249: 8081/kpi/file/kpi', {
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
          alert('Anda sudah mengupload data pada tahun tersebut, tolong lakukan update data apabila ingin mengelola data pada tahun tersebut!');
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

  useEffect(() => {
    // Initialize isEditingRows state based on the number of items
    setIsEditingRows(new Array(items.length).fill(false));
  }, [items]);

  const handleSaveData = async (item_id) => {
    setIsLoading(true); // Set loading to true
    const authToken = localStorage.getItem('authToken');
  
    try {
      const formattedData = {
        Item_ID: item_id,
        Name: editedData.Name,
        Results: editedData.Results.map(result => ({
          Name: result.Name,
          Result_ID: result.Result_ID,
          Factors: result.Factors.map(factor => ({
            Factor_ID: factor.Factor_ID,
            Title: factor.Title,
            Unit: factor.Unit,
            Target: factor.Target,
            Planned: factor.Planned,
            Actual: factor.Actual
          }))
        })),
        Year: editedData.Year
      };
  
      const isNewData = !items.some(item => item.Item_ID === item_id);
      const method = isNewData ? 'POST' : 'PUT';
      const url = isNewData
        ? `http://172.30.16.249: 8081/kpi/item`
        : `http://172.30.16.249: 8081/kpi/item/entire/${item_id}`;
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(formattedData)
      });
  
      if (response.ok) {
        setIsLoading(false); // Set loading to false
        alert('Data updated successfully');
        setIsEditing(false);
        const updatedItems = isNewData
          ? [...items, formattedData]
          : items.map(item => item.Item_ID === item_id ? formattedData : item);
        setItems(updatedItems);
      } else {
        const errorText = await response.text();
        setIsLoading(false); // Set loading to false
        console.error('Failed to update data:', errorText);
        alert('Please log in again.');
        navigate('/login'); // Redirect to login page        
        // alert(`Failed to update data: ${errorText}`);
      }
  
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Mohon login kembali untuk mengelola data atau update sesuai format, pastikan tidak menginput data pada tahun yang sama!')
    }
  };

  const handleAddRowClick = (year) => {
    const newRowId = lastRowId + 1;
    setLastRowId(newRowId);
  
    // Membuat baris baru dengan data default
    const newRow = {
      Result_ID: newRowId,
      Name: "",
      Factors: [
        {
          Title: "",
          Unit: "",
          Target: "",
          Planned: {
            Monthly: [{ January: 0, February: 0, March: 0, April: 0, May: 0, June: 0, July: 0, August: 0, September: 0, October: 0, November: 0, December: 0 }]
          },
          Actual: {
            Monthly: [{ January: 0, February: 0, March: 0, April: 0, May: 0, June: 0, July: 0, August: 0, September: 0, October: 0, November: 0, December: 0 }]
          }
        }
      ],
      Year: year
    };
  
    // Menambahkan baris baru ke data yang sedang diedit, hanya jika tahunnya cocok
    setEditedData(prevData => {
      // Mengecek apakah tahun pada data yang sedang diedit sama dengan tahun yang dipilih
      if (prevData.Year === year) {
        return {
          ...prevData,
          Results: [...prevData.Results, newRow]
        };
      } else {
        // Jika tahunnya tidak cocok, tidak ada perubahan yang dibuat
        return prevData;
      }
    });
  
    // Juga tambahkan baris baru ke filteredItems
    setFilteredItems(prevFilteredItems => {
      return prevFilteredItems.map(item => {
        if (item.Year === year) {
          return {
            ...item,
            Results: [...item.Results, newRow]
          };
        }
        return item;
      });
    });
  };

  const handleChange = (e, resultIndex, factorIndex, type, month) => {
    const { value } = e.target;
    const numericValue = parseFloat(value);
  
    if (!isNaN(numericValue)) {
      setEditedData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        if (!newData.Results[resultIndex].Factors[factorIndex][type]) {
          newData.Results[resultIndex].Factors[factorIndex][type] = { Monthly: [{}] };
        } else if (!newData.Results[resultIndex].Factors[factorIndex][type].Monthly) {
          newData.Results[resultIndex].Factors[factorIndex][type].Monthly = [{}];
        }
        newData.Results[resultIndex].Factors[factorIndex][type].Monthly[0][month] = numericValue;
        return newData;
      });
    }
  };
  
  const handleNameChange = (e) => {
    setSearchName(e.target.value);
  };

  useEffect(() => {
    var responseClone;
  
    fetch('http://172.30.16.249: 8081/kpi/item')
      .then(function(response) {
        responseClone = response.clone();
        return response.json();
      })
      .then(function(data) {
        console.log('Response JSON (item):', data);
  
        if (data) {
          setItems(data.data);
          if (data.data.length > 0) {
            setSelectedItem(data.data[0].Name);
            const years = Array.from(new Set(data.data.map(item => item.Year)));
            setAvailableYears(years);
          }
        } else {
          console.error('Empty data received');
        }
      })
      .catch(function(error) {
        console.error('Error fetching item data:', error);
        responseClone.text().then(function(bodyText) {
          console.log('Received the following instead of valid JSON:', bodyText);
        });
      });
  }, []);

  const [selectedYear, setSelectedYear] = useState('');

  const handleDeleteAllDataPerYear = async () => {
    if (!selectedYear) {
      console.error('Please select a year to delete data');
      return;
    }
  
    if (window.confirm(`Are you sure you want to delete all data for the year ${selectedYear}?`)) {
      try {
        setIsLoading(true); // Aktifkan loading screen
        
        const authToken = localStorage.getItem('authToken');
  
        // Inform user that data deletion process is starting
        alert('Harap menunggu data sedang dihapus...');
  
        const response = await fetch(`http://172.30.16.249: 8081/kpi/yearly/entire/${selectedYear}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (response.ok) {
          console.log(`All data for year ${selectedYear} deletion process started`);
          alert(`All data for year ${selectedYear} deleted successfully`);
          
          // Refresh the page after deletion
          window.location.reload();
        } else {
          throw new Error('Failed to start deletion process');
        }
      } catch (error) {
        console.error('Error starting deletion process:', error.message);
        alert('Error occurred while deleting data');
      } finally {
        setIsLoading(false); // Nonaktifkan loading screen setelah selesai
      }
    }
  };
  
  
  
  useEffect(() => {
    const filtered = items.filter(item =>
      item.Name === selectedItem &&
      (isEditing ? item.Year === editedData.Year : selectedYears.length === 0 || selectedYears.includes(item.Year)) &&
      (item.Results.some(result => result.Name.toLowerCase().includes(searchName.toLowerCase())))
    );
    setFilteredItems(filtered);
  }, [selectedItem, selectedYears, items, searchName, isEditing, editedData.Year]);
  

  // Fungsi untuk menentukan apakah tahun tertentu terpilih atau tidak
  const isYearSelected = (year) => {
    return selectedYears.includes(year);
  };

  const handleYearChange = (year) => {
    setSelectedYears(prevSelectedYears =>
      prevSelectedYears.includes(year)
        ? prevSelectedYears.filter(y => y !== year)
        : [...prevSelectedYears, year]
    );
  };

  const handleResetFilters = () => {
    setSelectedYears([]);
    setSearchName('');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleUpdateData = (itemIndex) => {
    // Cek apakah ada tabel lain yang sedang dalam mode pengeditan
    const isAnyTableEditing = isEditingRows.some((editingStatus, index) => editingStatus && index !== itemIndex);
  
    // Jika ada tabel lain yang sedang dalam mode pengeditan, munculkan prompt
    if (isAnyTableEditing) {
      alert("Anda hanya bisa mengedit 1 tabel!");
    } else {
      // Set isEditing status for the clicked row
      setIsEditingRows(prevIsEditingRows => {
        const updatedIsEditingRows = [...prevIsEditingRows];
        updatedIsEditingRows[itemIndex] = true;
        return updatedIsEditingRows;
      });
  
      // Set edited data for the clicked row
      const dataToEdit = filteredItems[itemIndex];
      console.log('Data to be updated:', dataToEdit);
      if (dataToEdit) {
        setEditedData({ ...dataToEdit });
        setEditingTableIndex(itemIndex); // Set indeks tabel yang sedang dalam mode pengeditan
      } else {
        console.error('No data available for the selected item');
      }
    }
  };
  

  
// Dalam komponen SavedSafetyTable
const handleDeleteRowClick = async (item_id) => {
  const userConfirmed = window.confirm("Apakah anda yakin ingin menghapus seluruh data pada tahun ini?");
  if (!userConfirmed) {
    return; // Exit the function if the user cancels the deletion
  }
  const authToken = localStorage.getItem('authToken');
  alert('Seluruh data pada tahun ini sedang dalam proses penghapusan, mohon menunggu!')

  try {
    const response = await fetch(`http://172.30.16.249: 8081/kpi/item/entire/${item_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      alert('Row deleted successfully');
      // Hapus baris dari state filteredItems
      setFilteredItems(prevFilteredItems => prevFilteredItems.filter(item => item.Item_ID !== item_id));
      // Hapus baris dari state items
      setItems(prevItems => prevItems.filter(item => item.Item_ID !== item_id));
    } else {
      const errorText = await response.text();
      console.error('Failed to delete row:', errorText);
      alert(`Failed to delete row: ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting row:', error);
  }
};

const handleDeletePerResult = async (result_id) => {
  const userConfirmed = window.confirm("Apakah anda yakin ingin menghapus result ini? Seluruh factor yang terhubung dengan result ini juga akan terhapus!");
  if (!userConfirmed) {
    return; // Exit the function if the user cancels the deletion
  }
  const authToken = localStorage.getItem('authToken');

  try {
    const response = await fetch(`http://172.30.16.249: 8081/kpi/result/entire/${result_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      alert('Result deleted successfully');
      setFilteredItems(prevFilteredItems => {
        return prevFilteredItems.map(item => ({
          ...item,
          Results: item.Results.filter(result => result.Result_ID !== result_id)
        }));
      });
      setItems(prevItems => {
        return prevItems.map(item => ({
          ...item,
          Results: item.Results.filter(result => result.Result_ID !== result_id)
        }));
      });
    } else {
      const errorText = await response.text();
      console.error('Failed to delete result:', errorText);
      alert(`Failed to delete result: ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting result:', error);
  }
};

const handleDeletePerFactor = async (factor_id) => {
  const userConfirmed = window.confirm("Apakah anda yakin ingin menghapus seluruh data pada tahun ini?");
  if (!userConfirmed) {
    return; // Exit the function if the user cancels the deletion
  }
  const authToken = localStorage.getItem('authToken');

  try {
    const response = await fetch(`http://172.30.16.249: 8081/kpi/factor/entire/${factor_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      alert('Factor deleted successfully');
      setFilteredItems(prevFilteredItems => {
        return prevFilteredItems.map(item => ({
          ...item,
          Results: item.Results.map(result => ({
            ...result,
            Factors: result.Factors?.filter(factor => factor.Factor_ID !== factor_id) || []
          }))
        }));
      });
      setItems(prevItems => {
        return prevItems.map(item => ({
          ...item,
          Results: item.Results.map(result => ({
            ...result,
            Factors: result.Factors?.filter(factor => factor.Factor_ID !== factor_id) || []
          }))
        }));
      });
    } else {
      const errorText = await response.text();
      console.error('Failed to delete factor:', errorText);
      alert(`Failed to delete factor: ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting factor:', error);
  }
};

  

  return (
    <div className="table-container">
      <div style={{marginBottom:"10px"}}  className="filter-container">
        <label htmlFor="item-select"></label>
        <select
          id="item-select"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
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

        <button onClick={handleResetFilters} className="dropdown-button" style={{marginRight:"800px"}}> Hapus Semua Filter </button>
        <div>
      <button className='dropdown-button' onClick={handleDeleteAllDataPerYear}>Delete All Data Per Year</button>
      <select
        value={selectedYear}
        onChange={e => setSelectedYear(e.target.value)}
      >
        <option value="">Select Year</option>
        {availableYears.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>

         
      </div>

           <input 
            type="text"
            placeholder="Filter Result..."
            value={searchName}
            onChange={handleNameChange}
            style={{ width: 'calc(100% - 14px)', marginBottom:"10px" }}
          />
 
       <div className='inputfile' style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="file" onChange={handleFileChange} style={{ marginRight: '10px', padding: '5px 10px', borderRadius: '5px'}} />
      <button onClick={handleFileUpload} style={{ padding: '5px 10px', borderRadius: '5px', backgroundImage: 'linear-gradient(to right, rgb(26, 171, 0), rgb(12, 217, 29))', color: 'white', border: 'none' }}>Upload Data</button>
    
</div>
<div>
{isLoading && <LoadingScreen />}
     
      </div>
      {filteredItems.length > 0 ? (
        filteredItems.map((item, itemIndex) => (
          <div key={itemIndex}>
            {item.Results.length > 0 ? (
              <table key={`${itemIndex}-${item.Year}`} className="saved-safety-table">
                <caption>{`Tahun ${item.Year}`}</caption>
                <thead>
                  <tr>
                    <th rowSpan="2">KPI Result</th>
                    <th colSpan="1">KPI Factor</th>
                    <th colSpan="2" rowSpan="2">Status</th>
                    <th rowSpan="3">Unit</th>
                    <th rowSpan="3">Target</th>
                    <th colSpan="12">Bulan</th>
                   </tr>
                  <tr>
                    <th>KPI Factor Name</th>
                    <th>Jan</th>
                    <th>Feb</th>
                    <th>Mar</th>
                    <th>Apr</th>
                    <th>May</th>
                    <th>Jun</th>
                    <th>Jul</th>
                    <th>Aug</th>
                    <th>Sep</th>
                    <th>Oct</th>
                    <th>Nov</th>
                    <th>Dec</th>
              </tr>
            </thead>
            <tbody>
              {item.Results.map((result, resultIndex) => (
                result.Factors.length > 0 ? (
                  result.Factors.map((factor, factorIndex) => (
                    <React.Fragment key={`${itemIndex}-${resultIndex}-${factorIndex}`}>
                      {/* Render baris dengan kolom Name, Title, Unit, Target */}
                      <tr>
                      <td rowSpan={2}>
                        <div style={{display:"inline-block"}} className='delete'>
                        {isEditingRows[itemIndex] ? (
                    <>
                      <textarea
                        value={editedData.Results[resultIndex].Name}
                        onChange={(e) => {
                          const updatedData = { ...editedData };
                          updatedData.Results[resultIndex].Name = e.target.value;
                          setEditedData(updatedData);
                        }}
                        style={{ width: '100px', height: '50px' }}
                      />
                      <div>
                        <button style={{marginBottom:"5px", marginRight:"5px"}} onClick={() => handleDeletePerResult(result.Result_ID)}>Delete Result</button>
                        <button onClick={() => handleDeletePerFactor(factor.Factor_ID)}>Delete Factor</button>
                      </div>

                      <div className='savechanges'>
                        <button
                          onClick={() => handleNewFactor(resultIndex, item.Year)}
                          style={{ width: '100%' }}
                        >
                          Add New Factor
                        </button>
                      </div>
                    </>
                  ) : (
                    <>{result.Name}</>
                  )}
                      </div>
                    </td>

                        <td rowSpan={2}>
                        {isEditingRows[itemIndex] ? (
                            <textarea
                              value={editedData.Results[resultIndex].Factors[factorIndex].Title}
                              onChange={(e) => {
                                const updatedData = { ...editedData };
                                updatedData.Results[resultIndex].Factors[factorIndex].Title = e.target.value;
                                setEditedData(updatedData);
                              }}
                              style={{ width: '100px', height: '50px' }} // Anda dapat menyesuaikan nilai width dan height sesuai kebutuhan

                            />
                          ) : (
                            factor.Title
                          )}
                        </td>
                        <td colSpan={2}>Plan</td>
                        <td rowSpan={2}>
                        {isEditingRows[itemIndex] ? (
                            <textarea
                              value={editedData.Results[resultIndex].Factors[factorIndex].Unit}
                              onChange={(e) => {
                                const updatedData = { ...editedData };
                                updatedData.Results[resultIndex].Factors[factorIndex].Unit = e.target.value;
                                setEditedData(updatedData);
                              }}
                              style={{ width: '100px', height: '50px' }} // Anda dapat menyesuaikan nilai width dan height sesuai kebutuhan

                            />
                          ) : (
                            factor.Unit
                          )}
                        </td>
                        <td rowSpan={2}>
                        {isEditingRows[itemIndex] ? (
                            <textarea
                              value={editedData.Results[resultIndex].Factors[factorIndex].Target}
                              onChange={(e) => {
                                const updatedData = { ...editedData };
                                updatedData.Results[resultIndex].Factors[factorIndex].Target = e.target.value;
                                setEditedData(updatedData);
                              }}
                              style={{ width: '100px', height: '50px' }} // Anda dapat menyesuaikan nilai width dan height sesuai kebutuhan

                            />
                          ) : (
                            factor.Target
                          )}
                        </td>
                        {/* Render kolom bulan untuk Planned */}
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, monthIndex) => (
                          <td key={monthIndex}>
  {isEditingRows[itemIndex] ? (
                              <input
                                type="number"
                                value={(editedData.Results[resultIndex].Factors[factorIndex]['Planned']?.Monthly[0]?.[month]) || ''}
                                onChange={(e) => handleChange(e, resultIndex, factorIndex, 'Planned', month)}
                              />
                            ) : (
                              (factor['Planned'] && factor['Planned'].Monthly[0][month]) || 0
                            )}
                          </td>
                        ))}
               
                      </tr>
                      {/* Render baris untuk Actual */}
                      <tr>
                        <td colSpan={2}>Actual</td>
                        {/* Render kolom bulan untuk Actual */}
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, monthIndex) => (
                          <td key={monthIndex}>
  {isEditingRows[itemIndex] ? (
                              <input
                                type="number"
                                value={(editedData.Results[resultIndex].Factors[factorIndex]['Actual']?.Monthly[0]?.[month]) || ''}
                                onChange={(e) => handleChange(e, resultIndex, factorIndex, 'Actual', month)}
                              />
                            ) : (
                              (factor['Actual'] && factor['Actual'].Monthly[0][month]) || 0
                            )}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr key={`${itemIndex}-${resultIndex}-no-factors`}>
                    <td colSpan="18">Data factors telah dihapus</td>
                  </tr>
                )
              ))}

            </tbody>

            <div className="buttonsum" style={{ display: 'flex' }}>
   {isEditingRows[itemIndex] ? (
      <>
      <div className='delete'>
        <button
          onClick={() => handleDeleteRowClick(item.Item_ID)}
          style={{
            marginRight: '5px',
             color: 'white',
            display: 'inline-block',
            marginBottom: '5px',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            padding: '10px 20px'
,
            marginTop: '10px'

          }}
        >
          Delete All Data Per Category
        </button>
        </div>
        <div className='savechanges'>

        <button
          onClick={() => handleAddRowClick(item.Year)}
          style={{
              color: 'white',
            marginTop:"10px",
            width:"100%",
            display: 'inline-block',
            marginRight:'10px',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Add New Result
        </button>
        </div>
        <div className='savechanges'>
        <button
        onClick={() => handleSaveData(item.Item_ID)}
        style={{
          marginRight: '5px',
          color: 'white',
          marginTop:"10px",
          marginBottom: '5px',
          padding: '5px 10px',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          marginLeft:"5px"
,
    cursor: 'pointer'
  }}
>
  Save Table Data
</button>
</div>

        {/* <div className='savechanges'>
        <button
          onClick={() => handleNewFactor(itemIndex, item.Year)}
          style={{
            marginRight: '5px',
            color: 'white',
            marginTop: "10px",
            width: "100%",
            display: 'inline-block',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Add New Factor
        </button>
      </div> */}
      </>
    ) : (
      <>
        <button
  onClick={() => handleUpdateData(itemIndex)}
  style={{
    marginRight: '5px',
    background: 'linear-gradient(to right, #1aab00, #0cd91d)',
    color: 'white',
    display: 'inline-block',
    marginBottom: '10px',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    padding: '10px 20px'
  }}
>
  Update Data
</button>

      </>
    )}
  </div>

          </table>
          
        ) : (
          <p key={`${itemIndex}-no-results`}>Data results tidak tersedia</p>
        )}
      </div>
    ))
  ) : (
    <p>Data items tidak tersedia</p>
  )}
</div>
);
};

export default SavedSafetyTable;
