import React, { useState } from "react";
import "../Styles/table.css";
import { useNavigate } from 'react-router-dom';


const AnalysisTable = () => {
  const [rows, setRows] = useState([
    {
      problem: <textarea id="problem1" className="custominput" rows="6" cols="20" placeholder="Problem 1"></textarea>,
      why1: <textarea id="why1-1" className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      why2: <textarea id="why2-1" className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      why3: <textarea id="why3-1" className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      why4: <textarea id="why4-1" className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      why5: <textarea id="why5-1" className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      correction: <textarea id="correction-1" className="custominput" rows="6" cols="20" placeholder="How to overcome it?"></textarea>,
      pic: <textarea id="pic-1" className="custominput" rows="1" cols="5" placeholder="PIC"></textarea>,
      target: <textarea id="target-1" className="custominput" rows="1" cols="5" placeholder="Target"></textarea>,
      followup: [
        {
          name: <input id="followup-1" type="datetime-local" className="custominput" placeholder="Date" />,
          statuses: [{ name: <textarea id="status-1" className="custominput" rows="1" cols="5" placeholder="Status"></textarea> }],
        },
      ],
    },
  ]);

  const navigate = useNavigate();


  const authToken = localStorage.getItem('authToken');

  const handleDeleteClick = (index) => {
    if (rows.length === 1) {
      alert("You must have at least one problem!");
      return;
    }
    const isConfirmed = window.confirm("Are you sure you want to delete this row?");
    if (isConfirmed) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  const handleSaveData = () => {
    const year = prompt("Simpan Table Data Untuk Tahun Berapa?");
    if (!year) {
      return;
    }
  
    const yearInt = parseInt(year, 10);
    if (isNaN(yearInt)) {
      alert("Tahun harus berupa angka!");
      return;
    }
  
    const problems = rows.map((row, index) => {
      const problemText = document.getElementById(`problem${index + 1}`).value;
      const whyArray = [
        document.getElementById(`why1-${index + 1}`).value,
        document.getElementById(`why2-${index + 1}`).value,
        document.getElementById(`why3-${index + 1}`).value,
        document.getElementById(`why4-${index + 1}`).value,
        document.getElementById(`why5-${index + 1}`).value,
      ];
      return {
        Masalah: problemText,
        Why: whyArray,
        tindakan: document.getElementById(`correction-${index + 1}`).value,
        pic: document.getElementById(`pic-${index + 1}`).value,
        target: document.getElementById(`target-${index + 1}`).value,
        FolDate: new Date(document.getElementById(`followup-${index + 1}`).value).toISOString(), // Convert to ISO string format
        status: document.getElementById(`status-${index + 1}`).value,
        Year: yearInt, // Make sure year is sent as an integer
      };
    });
  
    console.log("Problems to be sent:", problems); // Log problems for debugging
  
    const problemPromises = problems.map(problem => {
      return fetch("http://localhost:8080/kpi/masalah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(problem),
      })
        .then(response => {
          return response.json().then(jsonResponse => {
            console.log("Response JSON:", jsonResponse);
  
            if (!response.ok) {
              throw new Error("Failed to save masalah data");
              alert("Tolong login kembali untuk proses input data");
            }
            return jsonResponse;
          });
        })
        .then(data => {
          console.log("Masalah data saved successfully:", data);
        })
        .catch(error => {
          console.error("Error saving masalah data:", error);
          throw error; // Rethrow the error to catch it in Promise.all
        });
    });
  
    Promise.all(problemPromises)
      .then(() => {
        alert(`Data tabel disimpan untuk tahun ${year}`);
      })
      .catch(error => {
        console.error("Error saving data:", error);
        alert('Please log in again.');
        navigate('/login'); // Redirect to login page 
     });
  };

  const handleAddRowClick = () => {
    const newRow = {
      problem: <textarea id={`problem${rows.length + 1}`} className="custominput" rows="6" cols="20" placeholder={`Problem ${rows.length + 1}`}></textarea>,
      why1: <textarea id={`why1-${rows.length + 1}`} className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      why2: <textarea id={`why2-${rows.length + 1}`} className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      why3: <textarea id={`why3-${rows.length + 1}`} className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      why4: <textarea id={`why4-${rows.length + 1}`} className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      why5: <textarea id={`why5-${rows.length + 1}`} className="custominput" rows="6" cols="20" placeholder="What causes the problem?"></textarea>,
      correction: <textarea id={`correction-${rows.length + 1}`} className="custominput" rows="6" cols="20" placeholder="How to overcome it?"></textarea>,
      pic: <textarea id={`pic-${rows.length + 1}`} className="custominput" rows="1" cols="5" placeholder="PIC"></textarea>,
      target: <textarea id={`target-${rows.length + 1}`} className="custominput" rows="1" cols="5" placeholder="Target"></textarea>,
      followup: [
        {
          name: <input id={`followup-${rows.length + 1}`} type="datetime-local" className="custominput" placeholder="Date" />,
          statuses: [{ name: <textarea id={`status-${rows.length + 1}`} className="custominput" rows="1" cols="5" placeholder="Status"></textarea> }],
        },
      ],
    };
    setRows([...rows, newRow]);
  };

  return (
    <div className="table-container">
      <table className="safety-table">
        <caption>Analysis Table</caption>
        <thead>
          <tr>
            <th rowSpan="2">
              Problem
              <div className="add">
                <button className="add-result-button" onClick={handleAddRowClick}>+</button>
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
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.followup.map((followup, followupIndex) => (
                <React.Fragment key={`${rowIndex}-${followupIndex}`}>
                  {followup.statuses.map((status, statusIndex) => (
                    <tr key={`${rowIndex}-${followupIndex}-${statusIndex}`}>
                      {followupIndex === 0 && statusIndex === 0 && (
                        <td rowSpan={row.followup.reduce((total, current) => total + current.statuses.length, 0)}>
                          {row.problem}
                          <div className="add">
                          <button className="add-factor-button" onClick={() => handleDeleteClick(rowIndex)}>- Problem</button>
                          </div>
                        </td>
                      )}
                      <td>{row.why1}</td>
                      <td>{row.why2}</td>
                      <td>{row.why3}</td>
                      <td>{row.why4}</td>
                      <td>{row.why5}</td>
                      <td>{row.correction}</td>
                      <td>{row.pic}</td>
                      <td>{row.target}</td>
                      {statusIndex === 0 && (
                        <td rowSpan={followup.statuses.length}>
                          {followup.name}
                        </td>
                      )}
                      <td>{status.name}</td>
                    </tr>
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

export default AnalysisTable;
