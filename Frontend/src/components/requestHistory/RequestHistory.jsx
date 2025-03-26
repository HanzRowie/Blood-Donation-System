import React, { useState, useEffect } from "react";
import "./RequestHistory.css";

const BloodRequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    blood_group: "",
    address: "",
    gender: "",
    note: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/donate/getRequestHistory/");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requested);
      } else {
        setError("Failed to fetch requests.");
      }
    } catch (err) {
      setError("An error occurred while fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = editingId
      ? `http://127.0.0.1:8000/donate/saveRequestHistory/${editingId}/`
      : "http://127.0.0.1:8000/donate/addRequest/";

    const scrollY = window.scrollY; // Save scroll position before submitting

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
          blood_group: "",
          address: "",
          gender: "",
          note: "",
        });
        setEditingId(null);
        setFormVisible(false);

        // Ensure UI updates before restoring scroll position
        setTimeout(() => {
          fetchRequests();
          window.scrollTo({ top: scrollY, behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      setError("An error occurred while submitting data.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/donate/editRequestHistory/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setEditingId(id);
        setFormVisible(true);
      }
    } catch (err) {
      setError("An error occurred while fetching data for edit.");
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeletion = async () => {
    if (confirmDelete) {
      try {
        await fetch(`http://127.0.0.1:8000/donate/deleteRequestHistory/${confirmDelete}/`, { method: "POST" });
        fetchRequests();
      } catch (err) {
        setError("An error occurred while deleting the record.");
      } finally {
        setConfirmDelete(null);
      }
    }
  };

  return (
    <div className="container-blood">
      <div class="bloodnew">
        <h1> Blood Request History</h1>
    
    </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button className="btn-add" onClick={() => setFormVisible(true)}>
        Add New Request
      </button>

      {formVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form className="history">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} required>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                required
              />
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Note"
                required
              ></textarea>
              <button className="requestadd" type="button" onClick={handleSubmit}>
                {editingId ? "Save" : "Add"}
              </button>
              <button type="button" className="requestclose" onClick={() => setFormVisible(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="reqtable" border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Blood Group</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.first_name}</td>
                <td>{request.last_name}</td>
                <td>{request.phone}</td>
                <td>{request.blood_group}</td>
                <td>{request.address}</td>
                <td>{request.gender}</td>
                <td>{request.note}</td>
                <td>
                  <button className="reqtableedit" onClick={() => handleEdit(request.id)}>Edit</button>
                  <button className="reqtabledelete" onClick={() => handleDelete(request.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this request record?</p>
            <button className="confirm-btn" onClick={confirmDeletion}>Yes, Delete</button>
            <button className="cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequestHistory;
