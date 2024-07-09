import React, { useState } from "react";
import "../Styles/table.css";

const SafetyTable = () => {
  const [lastRowId, setLastRowId] = useState(1);
  const [lastFactorId, setLastFactorId] = useState(1);

  const handleDeleteClick = (rowIndex) => {
    if (rows.length === 1) {
      alert('Anda harus memiliki setidaknya satu baris!');
      return;
    }
  
    const newRows = rows.filter((_, index) => index !== rowIndex);
    setRows(newRows);
  };
  

  const handleDeleteFactorClick = (rowIndex, factorIndex) => {
    if (rows[rowIndex].factors.length === 1) {
      alert('Setiap baris harus memiliki setidaknya satu faktor!');
      return;
    }
  
    const newRows = [...rows];
    newRows[rowIndex].factors = newRows[rowIndex].factors.filter((_, index) => index !== factorIndex);
    setRows(newRows);
  };
  
  const [rows, setRows] = useState([
    {
      id: 1,
      result: "",
      factors: [
        {
          id: 1,
          name: "",
          statuses: [{ plan: "", actual: "", id: 1 }],
        },
      ],
      unit: "",
      target: "",
      Plan: {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      },
      Actual: {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      },
    },
  ]);

  const handleAddRowClick = () => {
    const newRowId = lastRowId + 1;
    setLastRowId(newRowId);

    const newRow = {
      id: newRowId,
      result: "",
      factors: [
        {
          id: 1,
          name: "",
          statuses: [{ plan: "", actual: "", id: 1 }],
        },
      ],
      unit: "",
      target: "",
      Plan: {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      },
      Actual: {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      },
    };
    setRows([...rows, newRow]);
  };

  const handleInputChange = (rowIndex, field, value) => {
    const newRows = [...rows];
    newRows[rowIndex][field] = value;
    setRows(newRows);
  };

  const handleUnitChange = (rowIndex, factorIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex].factors[factorIndex].unit = value;
    setRows(newRows);
  };
  
  const handleTargetChange = (rowIndex, factorIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex].factors[factorIndex].target = value;
    setRows(newRows);
  };
  

  const handleFactorChange = (rowIndex, factorIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex].factors[factorIndex].name = value;
    setRows(newRows);
  };

const handlePlanChange = (rowIndex, factorIndex, month, value) => {
  const newRows = [...rows];
  if (!newRows[rowIndex].factors[factorIndex].Plan) {
    newRows[rowIndex].factors[factorIndex].Plan = {}; // Inisialisasi objek Plan jika belum ada
  }
  newRows[rowIndex].factors[factorIndex].Plan[month] = parseFloat(value); // Menggunakan parseFloat untuk angka float
  setRows(newRows);
};

  
  const handleActualChange = (rowIndex, factorIndex, month, value) => {
    const newRows = [...rows];
    if (!newRows[rowIndex].factors[factorIndex].Actual) {
      newRows[rowIndex].factors[factorIndex].Actual = {}; // Inisialisasi objek Actual jika belum ada
    }
    newRows[rowIndex].factors[factorIndex].Actual[month] = parseFloat(value, 10);
    setRows(newRows);
  };
  
  
  

  const handleSaveData = () => {
    const year = prompt("Simpan Table Data Untuk Tahun Berapa?");
    const itemName = prompt("Simpan data untuk item apa? Pilih antara 'S', 'E', 'Q', 'C', atau 'D'.", "S");
    const validItems = ["S", "E", "Q", "C", "D"];
  
    if (!validItems.includes(itemName)) {
      alert("Pilihan item tidak valid. Harus salah satu dari 'S', 'E', 'Q', 'C', atau 'D'.");
      return;
    }
  
    if (year && itemName) {
      const itemData = {
        Name: itemName,
        results: rows.map((row) => ({
          Name: row.result,
          factors: row.factors.map((factor) => ({
            Title: factor.name,
            Unit: factor.unit,
            Target: factor.target,
            planned: {
              Monthly: [
                {
                  January: parseFloat(factor.Plan?.January || 0, 10),
                  February: parseFloat(factor.Plan?.February || 0, 10),
                  March: parseFloat(factor.Plan?.March || 0, 10),
                  April: parseFloat(factor.Plan?.April || 0, 10),
                  May: parseFloat(factor.Plan?.May || 0, 10),
                  June: parseFloat(factor.Plan?.June || 0, 10),
                  July: parseFloat(factor.Plan?.July || 0, 10),
                  August: parseFloat(factor.Plan?.August || 0, 10),
                  September: parseFloat(factor.Plan?.September || 0, 10),
                  October: parseFloat(factor.Plan?.October || 0, 10),
                  November: parseFloat(factor.Plan?.November || 0, 10),
                  December: parseFloat(factor.Plan?.December || 0, 10),
                }
              ]
            },
            actual: {
              Monthly: [
                {
                  January: parseFloat(factor.Actual?.January || 0, 10),
                  February: parseFloat(factor.Actual?.February || 0, 10),
                  March: parseFloat(factor.Actual?.March || 0, 10),
                  April: parseFloat(factor.Actual?.April || 0, 10),
                  May: parseFloat(factor.Actual?.May || 0, 10),
                  June: parseFloat(factor.Actual?.June || 0, 10),
                  July: parseFloat(factor.Actual?.July || 0, 10),
                  August: parseFloat(factor.Actual?.August || 0, 10),
                  September: parseFloat(factor.Actual?.September || 0, 10),
                  October: parseFloat(factor.Actual?.October || 0, 10),
                  November: parseFloat(factor.Actual?.November || 0, 10),
                  December: parseFloat(factor.Actual?.December || 0, 10),
                }
              ]
            },
          })),
        })),
        Year: parseFloat(year, 10),
      };
    
    



    console.log("Data tabel pada tahun yang diinput secara keseluruhan:", itemData);

    const authToken = localStorage.getItem("authToken");

    fetch("http://localhost:8080/kpi/item/entire", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(itemData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to save yearly data");
        }
        return response.json();
      })
      .then(data => {
        console.log("Yearly data saved successfully:", data);
        alert(`Data tabel disimpan untuk item ${itemName} tahun ${year}`);
      })
      .catch(error => {
        console.error("Error saving yearly data:", error);
        alert("Tolong login kembali");
      });
  }
};

const handleAddFactorClick = (rowIndex) => {
  const newFactorId = lastFactorId + 1;
  setLastFactorId(newFactorId);

  const newFactor = {
    id: newFactorId,
    name: "",
    statuses: [{ plan: "", actual: "", id: 1 }],
    unit: "", // Nilai unit default
    target: "", // Nilai target default
    Plan: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    },
    Actual: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    },
  };

  const newRows = [...rows];
  newRows[rowIndex].factors.push(newFactor); // Tambahkan faktor baru ke baris yang sesuai

  // Setel nilai unit dan target faktor baru menjadi string kosong
  newRows[rowIndex].factors[newRows[rowIndex].factors.length - 1].unit = "";
  newRows[rowIndex].factors[newRows[rowIndex].factors.length - 1].target = "";

  setRows(newRows);
};
  
  
  return (
    <div className="table-container">
      <table className="safety-table">
        <caption>Input All Data Table</caption>
        <thead>
          <tr>
            <th rowSpan="3">
              KPI Result
              <div className="add">
                <button className="add-result-button" onClick={handleAddRowClick}>
                  +
                </button>
              </div>
            </th>
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
            <React.Fragment key={row.id}>
              {row.factors.map((factor, factorIndex) => (
                <React.Fragment key={`${row.id}-${factor.id}`}>
                  {factor.statuses.map((status, statusIndex) => (
                    <React.Fragment key={`${row.id}-${factor.id}-${status.id}`}>
                      <tr>
                        {factorIndex === 0 && statusIndex === 0 && (
                          <td rowSpan={row.factors.reduce((total, current) => total + current.statuses.length * 2, 0)}>
                            <textarea
                              id={`result${row.id}`}
                              name={`result${row.id}`}
                              className="custominput"
                              rows="6"
                              cols="20"
                              placeholder={`Result ${rowIndex + 1}`}
                              onChange={(e) => handleInputChange(rowIndex, "result", e.target.value)}
                            ></textarea>
                            <div className="add">
                              <button className="add-factor-button" onClick={() => handleDeleteClick(rowIndex)}>
                                - Result
                              </button>
                            </div>
                            <div className="add">
                              <button className="add-factor-button" onClick={() => handleAddFactorClick(rowIndex)}>
                                + Factor
                              </button>
                            </div>
                          </td>
                        )}
                        {statusIndex === 0 && (
                          <td rowSpan={factor.statuses.length * 2}>
                            <textarea
                              id={`factor${factor.id}`}
                              name={`factor${factor.id}`}
                              className="custominput"
                              rows="6"
                              cols="20"
                              placeholder={`Factor ${factorIndex + 1}`}
                              onChange={(e) => handleFactorChange(rowIndex, factorIndex, e.target.value)}
                            ></textarea>
                            <div className="add">
                              <button className="add-factor-button" onClick={() => handleDeleteFactorClick(rowIndex, factorIndex)}>
                                - Factor
                              </button>
                            </div>
                          </td>
                        )}
                        <td colSpan={2}>Plan</td>
                        <td rowSpan={2}>
                        <input
                            type="text"
                            value={factor.unit} // Menyesuaikan dengan struktur data
                            onChange={(e) => handleUnitChange(rowIndex, factorIndex, e.target.value)} // Memanggil fungsi handleUnitChange dengan index faktor yang sesuai
                            style={{ width: '50px' }} // Atur lebar input field di sini

                          />
                    </td>
                    <td rowSpan={2}>
                    <input
                            type="text"
                            value={factor.target} // Menyesuaikan dengan struktur data
                            onChange={(e) => handleTargetChange(rowIndex, factorIndex, e.target.value)} // Memanggil fungsi handleTargetChange dengan index faktor yang sesuai
                            style={{ width: '50px' }} // Atur lebar input field di sini

                          />
                    </td>
                     <td>
                     <input
                        type="number"
                        step="0.01" // Allows input of float numbers
                        value={row.factors[factorIndex]?.Plan?.January || 0}
                        onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'January', e.target.value)}
                        style={{ width: '50px' }} // Atur lebar input field di sini

                      />
                    </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.February || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'February', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                          />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.March || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'March', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.April || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'April', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.May || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'May', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.June || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'June', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.July || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'July', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.August || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'August', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.September || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'September', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.October || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'October', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.November || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'November', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.factors[factorIndex]?.Plan?.December || 0}
                          onChange={(e) => handlePlanChange(rowIndex, factorIndex, 'December', e.target.value)}
                          style={{ width: '50px' }} // Atur lebar input field di sini

                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>Actual</td>
                      <td>
                      <input
                        type="number"
                        value={row.factors[factorIndex]?.Actual?.January || 0}
                        onChange={(e) => handleActualChange(rowIndex, factorIndex, 'January', e.target.value)}
                        style={{ width: '50px' }} // Atur lebar input field di sini

                      />
                      </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.February || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'February', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.March || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'March', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            
                            />
                        </td>
                        <td>
                        <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.April || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'April', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini
                          />

                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.May || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'May', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.June || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'June', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.July || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'July', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.August || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'August', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.September || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'September', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.October || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'October', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.November || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'November', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.factors[factorIndex]?.Actual?.December || 0}
                            onChange={(e) => handleActualChange(rowIndex, factorIndex, 'December', e.target.value)}
                            style={{ width: '50px' }} // Atur lebar input field di sini

                            />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="save">
        <button onClick={handleSaveData}>Save Table Data</button>
      </div>
    </div>
  );
};

export default SafetyTable;


         
