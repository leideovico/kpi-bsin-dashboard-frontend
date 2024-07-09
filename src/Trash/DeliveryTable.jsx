import React, { useState } from "react";
import "../Styles/table.css";

const DeliveryTable = () => {
  // State untuk menyimpan array baris tabel
  const [lastRowId, setLastRowId] = useState(1);
  const [lastFactorId, setLastFactorId] = useState(1);
  const [lastStatusId, setLastStatusId] = useState(1);

  const [rows, setRows] = useState([
    {
      result: <textarea id={1} className="custominput" rows="6" cols="20" placeholder="Result 1"></textarea>,
      factors: [
        {
          name: <textarea id={1} className="custominput" rows="6" cols="20" placeholder="Factor 1"></textarea>,
          id: 1,
          statuses: [{ name: <input type="text" placeholder={`Status 1`} />, id: 1 }],
        },
      ],      
      unit: <input type="text" />,
      target: <input type="text" />,
      dataJan: <input type="number" />,
      dataFeb: <input type="number" />,
      dataMaret: <input type="number" />,
      dataApril: <input type="number" />,
      dataMei: <input type="number" />,
      dataJune: <input type="number" />,
      dataJul: <input type="number" />,
      dataAgs: <input type="number" />,
      dataSept: <input type="number" />,
      dataOct: <input type="number" />,
      dataNov: <input type="number" />,
      dataDec: <input type="number" />,
    },
  ]);
  
// Fungsi untuk menangani penghapusan baris
const handleDeleteClick = (index) => {
  // Periksa apakah ada lebih dari satu baris
  if (rows.length === 1) {
    alert("You must have at least one result!");
    return;
  }
  // Konfirmasi penghapusan
  const isConfirmed = window.confirm("Are you sure you want to delete this row?");
  if (isConfirmed) {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  }
};

// Fungsi untuk menangani penghapusan status
const handleDeleteStatusClick = (rowIndex, factorIndex, statusIndex) => {
  // Periksa apakah ada lebih dari satu status
  if (rows[rowIndex].factors[factorIndex].statuses.length === 1) {
    alert("You must have at least one status!");
    return;
  }
  // Konfirmasi penghapusan
  const isConfirmed = window.confirm("Are you sure you want to delete this status?");
  if (isConfirmed) {
    const newRows = [...rows];
    newRows[rowIndex].factors[factorIndex].statuses.splice(statusIndex, 1);
    setRows(newRows);
  }
};

// Fungsi untuk menangani penghapusan faktor
const handleDeleteFactorClick = (rowIndex, factorIndex) => {
  // Periksa apakah ada lebih dari satu faktor
  if (rows[rowIndex].factors.length === 1) {
    alert("You must have at least one factor!");
    return;
  }
  // Konfirmasi penghapusan
  const isConfirmed = window.confirm("Are you sure you want to delete this factor?");
  if (isConfirmed) {
    const newRows = [...rows];
    newRows[rowIndex].factors.splice(factorIndex, 1);
    setRows(newRows);
  }
};


 // Fungsi untuk menangani penambahan faktor baru
const handleAddFactorClick = (index) => {
  const newRows = [...rows];
  const newRowId = lastFactorId + 1;
  setLastFactorId(newRowId); // Update ID terakhir untuk faktor
  newRows[index].factors.push({ 
    name: (
      <textarea
        id={`factor${newRowId}`}
        name={`factor${newRowId}`}
        className="custominput"
        rows="6"
        cols="20"
        placeholder={`Factor ${newRowId}`}
      ></textarea>
    ),
    id: newRowId, // Menggunakan ID terakhir untuk faktor baru
    statuses: [{ name: <input type="text" placeholder={`Status 1`} />, id: 1 }],
  });
  setRows(newRows);
};


// Fungsi untuk menangani penambahan status baru
const handleAddStatusClick = (rowIndex, factorIndex) => {
  const newRows = [...rows];
  const newRowId = lastRowId + 1;
  setLastRowId(newRowId); // Update lastRowId
  newRows[rowIndex].factors[factorIndex].statuses.push({ 
    name: <input type="text" placeholder={`Status ${newRowId}`} />
  });
  setRows(newRows);
};


  const handleSaveData = () => {
    const year = prompt("Simpan Table Data Untuk Tahun Berapa?");
    if (year) {
      alert(`Data tabel disimpan untuk tahun ${year}`);
    }
  };

// Fungsi untuk menangani penambahan baris baru
const handleAddRowClick = () => {
  const newRowId = lastRowId + 1;
  setLastRowId(newRowId); // Update ID terakhir
  
  const newRow = {
    result: (
      <textarea
        id={`result${newRowId}`}
        name={`result${newRowId}`}
        className="custominput"
        rows="6"
        cols="20"
        placeholder={`Result ${newRowId}`}
      ></textarea>
    ),
    factors: [
      {
        name: (
          <textarea
            id={`factor${newRowId}-1`}
            name={`factor${newRowId}-1`}
            className="custominput"
            rows="6"
            cols="20"
            placeholder={`Factor 1`}
          ></textarea>
        ),
        id: 1,
        statuses: [{ name: <input type="text" placeholder={`Status 1`} />, id: 1 }],
      },
    ],
    unit: <input type="text" />,
    target: <input type="text" />,
    dataJan: <input type="number" />,
    dataFeb: <input type="number" />,
    dataMaret: <input type="number" />,
    dataApril: <input type="number" />,
    dataMei: <input type="number" />,
    dataJune: <input type="number" />,
    dataJul: <input type="number" />,
    dataAgs: <input type="number" />,
    dataSept: <input type="number" />,
    dataOct: <input type="number" />,
    dataNov: <input type="number" />,
    dataDec: <input type="number" />,
  };
  setRows([...rows, newRow]);
};


  return (
    <div className="table-container">
      <table className="safety-table">
        <caption>Delivery Table</caption> {/* Judul tabel */}
        <thead>
          <tr>
            <th rowSpan="2">
              KPI Result
              <div className="add">
              <button className="add-result-button" onClick={handleAddRowClick}>+</button>
              </div>
            </th>
            <th colSpan="2">KPI Factor</th>
            <th rowSpan="2">Unit</th>
            <th rowSpan="2">Target</th>
            <th colSpan="12">Bulan</th>
          </tr>
          <tr>
            <th>KPI Factor Name</th>
            <th>Status</th>
            <th>Jan</th>
            <th>Feb</th>
            <th>Mar</th>
            <th>Apr</th>
            <th>Mei</th>
            <th>Jun</th>
            <th>Jul</th>
            <th>Ags</th>
            <th>Sept</th>
            <th>Oct</th>
            <th>Nov</th>
            <th>Dec</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.factors.map((factor, factorIndex) => (
                <React.Fragment key={`${rowIndex}-${factorIndex}`}>
                  {factor.statuses.map((status, statusIndex) => (
                    <tr key={`${rowIndex}-${factorIndex}-${statusIndex}`}>
                      {factorIndex === 0 && statusIndex === 0 && (
                        <td rowSpan={row.factors.reduce((total, current) => total + current.statuses.length, 0)}>
                          {row.result}
                          <div className="add">
                          <button className="add-factor-button" onClick={() => handleDeleteClick(rowIndex)}>- Result</button>
                          </div>
                          <div className="add">
                          <button className="add-factor-button" onClick={() => handleAddFactorClick(rowIndex)}>+ Factor</button>
                          </div>
                        </td>
                      )}
                      {statusIndex === 0 && (
                        <td rowSpan={factor.statuses.length}>
                            {factor.name}
                            <div className="add">
                            <button className="add-factor-button" onClick={() => handleDeleteFactorClick(rowIndex, factorIndex)}> - Factor </button>
                            </div>
                            <button className="add-factor-button" onClick={() => handleAddStatusClick(rowIndex, factorIndex)}> + Status </button>
                        </td>
                        )}
                        <td>{status.name}
                        <div className="add">
                        <button className="add-factor-button" onClick={() => handleDeleteStatusClick(rowIndex, factorIndex, statusIndex)}> - Status </button>
                        </div>
                        </td>
                      <td>{row.unit}</td>
                      <td>{row.target}</td>
                      <td>{row.dataJan}</td>
                      <td>{row.dataFeb}</td>
                      <td>{row.dataMaret}</td>
                      <td>{row.dataApril}</td>
                      <td>{row.dataMei}</td>
                      <td>{row.dataJune}</td>
                      <td>{row.dataJul}</td>
                      <td>{row.dataAgs}</td>
                      <td>{row.dataSept}</td>
                      <td>{row.dataOct}</td>
                      <td>{row.dataNov}</td>
                      <td>{row.dataDec}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
        <div className="save">
        <button onClick={handleSaveData}>Save Table Data</button>
          </div>
      </table>
    </div>
  );
};

export default DeliveryTable;
