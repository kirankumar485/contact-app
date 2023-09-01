import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../src/App.css";

const EditableCell = ({ value, onChange, onBlur }) => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onBlur={(e) => {
        setIsEditing(false);
        onBlur(e);
      }}
    />
  ) : (
    <span onClick={() => setIsEditing(true)}>{value}</span>
  );
};

const ContactTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleEditSave = async (rowindex) => {
    const editedRow = visibleData[rowindex];
    try {
      await axios.put(
        `http://localhost:3001/api/data/${editedRow._id}`,
        editedRow
      );
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const columnNames = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address1",
    "address2",
    "city",
    "zipCode",
    "gender",
  ];

  const handleEditChange = (newValue, rowindex, columnName) => {
    const updatedData = visibleData.map((row, index) =>
      index === rowindex
        ? {
            ...row,
            [columnName]:
              columnName === "address1" ? { city: newValue } : newValue,
          }
        : row
    );
    setData(updatedData);
  };
  const handleDeleteSelected = async () => {
    try {
      const rowsToDelete = selectedRows.map((index) => visibleData[index]._id);
      await Promise.all(
        rowsToDelete.map((id) =>
          axios.delete(`http://localhost:3001/api/data/${id}`)
        )
      );

      fetchData();
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  return (
    <div className="DataTable">
      <h1>Contact Table</h1>
      <table>
        <thead>
          <tr>
            {columnNames.map((columnName) => (
              <th key={columnName}>{columnName}</th>
            ))}
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {visibleData.map((row, rowindex) => (
            <tr key={row._id}>
              {columnNames.map((columnName) => {
                if (columnName === "address1") {
                  return (
                    <td key={columnName}>
                      <EditableCell
                        value={row.address.line1}
                        onChange={(e) =>
                          handleEditChange(e.target.value, rowindex, columnName)
                        }
                        onBlur={() => handleEditSave(rowindex)}
                      />
                    </td>
                  );
                } else if (columnName === "address2") {
                  return (
                    <td key={columnName}>
                      <EditableCell
                        value={row.address.line2}
                        onChange={(e) =>
                          handleEditChange(e.target.value, rowindex, columnName)
                        }
                        onBlur={() => handleEditSave(rowindex)}
                      />
                    </td>
                  );
                } else if (columnName === "city") {
                  return <td key={columnName}>{row.address.city}</td>;
                } else if (columnName === "country") {
                  return <td key={columnName}>{row.address.country}</td>;
                } else if (columnName === "zipCode") {
                  return <td key={columnName}>{row.address.zipCode}</td>;
                } else {
                  return (
                    <td key={columnName}>
                      <EditableCell
                        value={row[columnName]}
                        onChange={(e) =>
                          handleEditChange(e.target.value, rowindex, columnName)
                        }
                        onBlur={() => handleEditSave(rowindex)}
                      />
                    </td>
                  );
                }
              })}
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(rowindex)}
                  onChange={() => {
                    if (selectedRows.includes(rowindex)) {
                      setSelectedRows(
                        selectedRows.filter((index) => index !== rowindex)
                      );
                    } else {
                      setSelectedRows([...selectedRows, rowindex]);
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRows.length > 0 && (
        <div className="delete">
          <button onClick={handleDeleteSelected}>Delete Selected</button>
        </div>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactTable;
