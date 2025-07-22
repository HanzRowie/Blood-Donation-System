import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/donate/ViewAllDonors/";

const AvailableDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchDonors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch donors");
      const data = await res.json();
      setDonors(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleChat = async (username) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/chat/get_or_create_private_chatroom/${username}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to start chat");
      navigate(`/chat/${data.group_name}`);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>Available Donors</h1>
      {donors.length === 0 ? (
        <p>No donors found.</p>
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
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => (
              <tr key={donor.id}>
                <td>{donor.first_name}</td>
                <td>{donor.last_name}</td>
                <td>{donor.phone}</td>
                <td>{donor.email}</td>
                <td>{donor.date_of_birth}</td>
                <td>{donor.gender}</td>
                <td>{donor.blood_group}</td>
                <td>{donor.address}</td>
                <td>{donor.is_approved ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleChat(donor.username)} disabled={!donor.is_approved}>
                    Chat with Donor
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AvailableDonors; 