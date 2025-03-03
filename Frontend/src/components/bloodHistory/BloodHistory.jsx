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

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/donate/bloodHistory/");
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations);
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
      ? `http://127.0.0.1:8000/donate/saveHistory/${editingId}/`
      : "http://127.0.0.1:8000/donate/add/";

    const method = "POST";
    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
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
      }
    } catch (err) {
      setError("An error occurred while submitting data.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/donate/editHistory/${id}/`);
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

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/donate/deleteHistory/${id}/`, { method: "POST" });
      fetchDonations();
    } catch (err) {
      setError("An error occurred while deleting the record.");
    }
  };

  return (
    <div className="container-blood">
      <h1>Blood Donation History</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button className="btn-add" onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? "Close Form" : "Add Donation"}
      </button>

      {formVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form className="donhistory">
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
              
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
              
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
              <button type="button" onClick={handleSubmit}>{editingId ? "Save" : "Add"}</button>
              <button type="button" onClick={() => setFormVisible(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      <table border="1">
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
                <button onClick={() => handleDelete(donation.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BloodDonationHistory;
