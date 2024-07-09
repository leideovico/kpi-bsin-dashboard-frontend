import React, { useState } from "react";
import "../Styles/tablesummary.css";
import { useNavigate } from 'react-router-dom';


const SummaryTable = () => {
  const [projectNameId, setProjectNameId] = useState(1);
  const [columns, setColumns] = useState([{ id: 1, item: "Item 1", quantity: "Quantity 1" }]);
  const [rows, setRows] = useState([
    {
      projectName: "", 
      category: "",
      status: [{ name: "", quantity: "", id: 1, statuses: [{ name: "", id: 1 }] }],
      remarks: ""
    }
  ]);

  const handleDeleteClick = (index) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this row?");
    if (isConfirmed) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };
  const navigate = useNavigate();


  const handleInputChange = (e, rowIndex, statIndex, type) => {
    const { value } = e.target;
    const updatedRows = [...rows];
    if (type === "name") {
      updatedRows[rowIndex].status[statIndex].name = value || "";
    } else if (type === "quantity") {
      updatedRows[rowIndex].status[statIndex].statuses[0].name = value || "";
    }
    setRows(updatedRows);
  };

  const handleAddRowClick = () => {
    const newRow = {
      projectName: "",
      category: "",
      status: columns.map((col) => ({
        name: "",
        quantity: "",
        id: col.id,
        statuses: [{ name: "", id: col.id }],
      })),
      remarks: "",
    };
  
    const newProjectNameId = rows.length === 0 ? projectNameId : projectNameId + 1;
  
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => ({
        ...row,
        status: row.status.map((stat, statIndex) => ({
          ...stat,
          name: "",
          statuses: [{ ...stat.statuses[0], name: "" }],
          id: columns[statIndex].id, // Set id kolom sesuai dengan urutan kolom
        })),
      }));
      return [...updatedRows, newRow];
    });
    setProjectNameId(newProjectNameId);
  };
  
  
  const handleAddColumnClick = () => {
    const maxColumnId = Math.max(...columns.map((col) => col.id));
    const newColumnId = maxColumnId + 1;
    
    // Menambahkan kolom baru ke state columns
    setColumns((prevColumns) => [
      ...prevColumns,
      { id: newColumnId, item: `Item ${newColumnId}`, quantity: `Quantity ${newColumnId}` }
    ]);
  
    // Menambahkan status baru untuk kolom baru ke setiap baris dalam state rows
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        status: [
          ...row.status,
          { name: "", quantity: "", id: newColumnId, statuses: [{ name: "", id: newColumnId }] }
        ]
      }))
    );
  };
  
   // Fungsi untuk menghandle perubahan input item number pada kolom status
const handleInputItemNumberChange = (e, rowIndex, columnIndex) => {
  const { value } = e.target;
  const updatedRows = rows.map((row, index) => {
    if (index === rowIndex) {
      return {
        ...row,
        status: row.status.map((stat) => {
          if (stat.id === columnIndex) {
            return { ...stat, name: value };
          }
          return stat;
        })
      };
    }
    return row;
  });
  setRows(updatedRows);
};

// Fungsi untuk menghandle perubahan input quantity number pada kolom status
const handleInputQtyNumberChange = (e, rowIndex, columnIndex) => {
  const { value } = e.target;
  const updatedRows = rows.map((row, index) => {
    if (index === rowIndex) {
      return {
        ...row,
        status: row.status.map((stat) => {
          if (stat.id === columnIndex) {
            return { ...stat, statuses: [{ ...stat.statuses[0], name: value }] };
          }
          return stat;
        })
      };
    }
    return row;
  });
  setRows(updatedRows);
};
  

const handlePostProject = () => {
  
  const authToken = localStorage.getItem("authToken");
  const issuedDateInput = document.querySelector("#issuedDateInput");
  const issuedDate = issuedDateInput ? issuedDateInput.value : null;

  if (!issuedDate) {
    alert("Tolong input tanggal terlebih dahulu sebelum menyimpan data!");
    return; // Berhenti menjalankan fungsi jika issuedDate kosong
  }


  const summaryData = {
    Status: rows.map((row) => row.projectName), // Ini benar, mengambil projectName dari setiap baris
    Projects: columns.map((col) => ({
      Name: document.querySelector(`#status-input-${col.id}`).value, // Mengambil dari input kolom
      Item: rows.map((row) => parseInt(row.status.find(stat => stat.id === col.id).name)), // Item dari setiap baris untuk kolom tertentu
      Quantity: rows.map((row) => parseInt(row.status.find(stat => stat.id === col.id).statuses[0].name)), // Quantity dari setiap baris untuk kolom tertentu
    })),
    IssuedDate: new Date(issuedDate).toISOString(),
    Remarks: rows.map((row) => row.remarks)

  };

  console.log("Posting summary data:", JSON.stringify(summaryData));
  fetch("http://172.30.16.249: 8081/kpi/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(summaryData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to post summary data");
      }
    })
    .then((data) => {
      console.log("Summary data posted successfully:", data);
      alert("Data berhasil disimpan!");
    })
    .catch((error) => {
      console.error("Error posting summary data:", error.message);
      alert('Please log in again.');
      navigate('/login'); // Redirect to login page   
    });
};

  const handleRemoveColumnClick = (colId) => {
    // Temukan status category dengan ID yang akan dihapus
    const statusItemCount = rows[0].status.length;
    if (statusItemCount === 1) {
      alert("At least you should have 1 Status Item and no less!");
      return;
    }
  
    // Hapus kolom dengan ID yang sesuai
    const updatedColumns = columns.filter(col => col.id !== colId);
    setColumns(updatedColumns);
    
    // Loop melalui setiap baris dan hapus sel <td> yang sesuai dengan ID kolom yang dihapus
    const updatedRows = rows.map(row => {
      const updatedStatus = row.status.filter(stat => stat.id !== colId);
      return { ...row, status: updatedStatus };
    });
    setRows(updatedRows);
  };
  return (
    <div className="table-container">
      <div className="filter-containerss">
        <h2 style={{color:"white"}}>Pilih tanggal penyimpanan project summary</h2>
      <input id="issuedDateInput" type="datetime-local" />
    </div>
      <table className="safety-summaries">
        <caption>Summary Table</caption>
        <thead>
          <tr>
            <th rowSpan="2">
              Item Category Project
              <div className="add">
                <button className="add-result-button" onClick={handleAddRowClick}>
                  +
                </button>
              </div>
            </th>
            {columns.map((col) => (
              <th colSpan="2" key={col.id}>
                <input id={`status-input-${col.id}`} type="text" placeholder={`Status Item ${col.id}`} />
                <div className="removecol">
                <button className="remove-column-button" onClick={() => handleRemoveColumnClick(col.id)}>-</button>
              </div>
              </th>
            ))}
            <th rowSpan="2">Remarks</th>
          </tr>
          <tr>
            {columns.map((col) => (
              <>
                <th key={`item-${col.id}`}>{col.item}</th>
                <th key={`quantity-${col.id}`}>{col.quantity}</th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <input
                  type="text"
                  placeholder={`Project Name ${rowIndex + 1}`}
                  value={row.projectName}
                  onChange={(e) => {
                    const updatedRows = [...rows];
                    updatedRows[rowIndex].projectName = e.target.value;
                    setRows(updatedRows);
                  }}
                />
                <div className="add">
                  <button className="add-factor-button" onClick={() => handleDeleteClick(rowIndex)}>
                    - category
                  </button>
                </div>
              </td>
              {row.status.map((stat, statIndex) => (
  <>
   <td key={`status-name-${stat.id}`}>
  <input
    type="number"
    placeholder={`Item ${stat.id}`}
    value={stat.name}
    onChange={(e) => handleInputItemNumberChange(e, rowIndex, stat.id)}
  />
</td>
<td key={`status-quantity-${stat.id}`}>
  <input
    type="number"
    placeholder={`Quantity ${stat.id}`}
    value={stat.statuses[0].name}
    onChange={(e) => handleInputQtyNumberChange(e, rowIndex, stat.id)}
  />
</td>
  </>
))}

              <td>
                <textarea
                  className="custominput"
                  rows="8"
                  cols="30"
                  placeholder="Remarks"
                  value={row.remarks}
                  onChange={(e) => {
                    const updatedRows = [...rows];
                    updatedRows[rowIndex].remarks = e.target.value;
                    setRows(updatedRows);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttonsum" style={{ display: 'inline-block'}}>
        <div className="save">
          <button onClick={handlePostProject} style={{ marginRight:'5px'}} >Save Data</button>
        </div>
        <div className="additem">
          <button onClick={handleAddColumnClick} style={{ marginLeft:'5px'}} >Add Status Item</button> 
        </div>
      </div>
    </div>
  );
};

export default SummaryTable;

