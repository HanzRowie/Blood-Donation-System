import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/donate/MyDonationView/";

const DonorDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchDonations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch donations");
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete donation");
      setDonations(donations.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (donation) => {
    setEditId(donation.id);
    setEditData({ ...donation });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`${API_URL}${editId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update donation");
      setEditId(null);
      fetchDonations();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>My Donations</h1>
      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", background: "#fff" }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Address</th>
              <th>Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                {editId === donation.id ? (
                  <>
                    <td><input name="first_name" value={editData.first_name} onChange={handleEditChange} /></td>
                    <td><input name="last_name" value={editData.last_name} onChange={handleEditChange} /></td>
                    <td><input name="phone" value={editData.phone} onChange={handleEditChange} /></td>
                    <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
                    <td><input name="date_of_birth" value={editData.date_of_birth} onChange={handleEditChange} /></td>
                    <td><input name="gender" value={editData.gender} onChange={handleEditChange} /></td>
                    <td><input name="blood_group" value={editData.blood_group} onChange={handleEditChange} /></td>
                    <td><input name="address" value={editData.address} onChange={handleEditChange} /></td>
                    <td>{editData.is_approved ? "Yes" : "No"}</td>
                    <td>
                      <button onClick={handleEditSave}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{donation.first_name}</td>
                    <td>{donation.last_name}</td>
                    <td>{donation.phone}</td>
                    <td>{donation.email}</td>
                    <td>{donation.date_of_birth}</td>
                    <td>{donation.gender}</td>
                    <td>{donation.blood_group}</td>
                    <td>{donation.address}</td>
                    <td>{donation.is_approved ? "Yes" : "No"}</td>
                    <td>
                      <button onClick={() => handleEdit(donation)}>Edit</button>
                      <button onClick={() => handleDelete(donation.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DonorDonations; 