import React, { useState, useEffect } from "react";
import "./BloodHistory.css";

const BloodDonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/donate/DonateBloodView/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDonations(Array.isArray(data) ? data : data.donations || []);
      } else if (response.status === 401) {
        setError("You are not authorized. Please log in.");
      } else {
        setError("Failed to fetch donations.");
      }
    } catch (err) {
      setError("An error occurred while fetching donations.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = editingId
      ? `http://127.0.0.1:8000/donate/DonateBloodView/${editingId}/`
      : "http://127.0.0.1:8000/donate/add/";

    const method = "POST";
    const scrollY = window.scrollY; // Save current scroll position

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          date_of_birth: "",
          gender: "",
          blood_group: "",
          address: "",
        });
        setEditingId(null);
        fetchDonations();
        setFormVisible(false);

        setTimeout(() => {
          window.scrollTo(0, scrollY); // Restore scroll position
        }, 0);
      } else if (response.status === 401) {
        setError("You are not authorized. Please log in.");
      } else {
        setError("Failed to submit data.");
      }
    } catch (err) {
      setError("An error occurred while submitting data.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/donate/DonateBloodView/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setEditingId(id);
        setFormVisible(true);
      } else if (response.status === 401) {
        setError("You are not authorized. Please log in.");
      } else {
        setError("Failed to fetch data for edit.");
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
        const response = await fetch(`http://127.0.0.1:8000/donate/DonateBloodView/${confirmDelete}/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        if (response.ok) {
          fetchDonations();
        } else if (response.status === 401) {
          setError("You are not authorized. Please log in.");
        } else {
          setError("Failed to delete the record.");
        }
      } catch (err) {
        setError("An error occurred while deleting the record.");
      } finally {
        setConfirmDelete(null);
      }
    }
  };

  return (
    <div className="container-blood">
      <div className="header-blood">
        <h1>Blood Donation History</h1>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button className="btn-add" onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? "Close Form" : "Add Donation"}
      </button>

      {formVisible && (
        <div className="modal-overlay">
          <div className="modal-contentd">
            <form className="donhistory">
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
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
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
              <button type="button" onClick={handleSubmit}>
                {editingId ? "Save" : "Add"}
              </button>
              <button type="button" onClick={() => setFormVisible(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="donatehistorytable">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.id}</td>
                <td>{donation.first_name}</td>
                <td>{donation.last_name}</td>
                <td>{donation.phone}</td>
                <td>{donation.email}</td>
                <td>{donation.date_of_birth}</td>
                <td>{donation.gender}</td>
                <td>{donation.blood_group}</td>
                <td>{donation.address}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(donation.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(donation.id)}>Delete</button>
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
            <p>Are you sure you want to delete this donation record?</p>
            <button className="confirm-btn" onClick={confirmDeletion}>Yes, Delete</button>
            <button className="cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodDonationHistory;
