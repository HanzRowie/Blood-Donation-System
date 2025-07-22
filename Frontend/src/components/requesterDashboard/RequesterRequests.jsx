import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/donate/MyRequMyDonationView/";

const RequesterRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete request");
      setRequests(requests.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (request) => {
    setEditId(request.id);
    setEditData({ ...request });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`${API_URL}${editId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update request");
      setEditId(null);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>My Requests</h1>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", background: "#fff" }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Blood Group</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Note</th>
              <th>Accepted By</th>
              <th>Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                {editId === request.id ? (
                  <>
                    <td><input name="first_name" value={editData.first_name} onChange={handleEditChange} /></td>
                    <td><input name="last_name" value={editData.last_name} onChange={handleEditChange} /></td>
                    <td><input name="phone" value={editData.phone} onChange={handleEditChange} /></td>
                    <td><input name="blood_group" value={editData.blood_group} onChange={handleEditChange} /></td>
                    <td><input name="address" value={editData.address} onChange={handleEditChange} /></td>
                    <td><input name="gender" value={editData.gender} onChange={handleEditChange} /></td>
                    <td><input name="note" value={editData.note} onChange={handleEditChange} /></td>
                    <td>{editData.accepted_by ? "Accepted" : "Not Accepted"}</td>
                    <td>{editData.is_approved ? "Yes" : "No"}</td>
                    <td>
                      <button onClick={handleEditSave}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{request.first_name}</td>
                    <td>{request.last_name}</td>
                    <td>{request.phone}</td>
                    <td>{request.blood_group}</td>
                    <td>{request.address}</td>
                    <td>{request.gender}</td>
                    <td>{request.note}</td>
                    <td>{request.accepted_by ? "Accepted" : "Not Accepted"}</td>
                    <td>{request.is_approved ? "Yes" : "No"}</td>
                    <td>
                      <button onClick={() => handleEdit(request)}>Edit</button>
                      <button onClick={() => handleDelete(request.id)}>Delete</button>
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

export default RequesterRequests; 