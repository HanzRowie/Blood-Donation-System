import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/donate/ViewAllRequests/";
const ACCEPT_URL = "http://127.0.0.1:8000/donateacceptrequest/";

const DonorAcceptRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(null);

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

  const handleAccept = async (id) => {
    setAccepting(id);
    try {
      const res = await fetch(`${ACCEPT_URL}${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to accept request");
      fetchRequests();
      alert("Request accepted!");
    } catch (err) {
      alert(err.message);
    }
    setAccepting(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>Accept Requests</h1>
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
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.first_name}</td>
                <td>{req.last_name}</td>
                <td>{req.phone}</td>
                <td>{req.blood_group}</td>
                <td>{req.address}</td>
                <td>{req.gender}</td>
                <td>{req.note}</td>
                <td>{req.accepted_by ? "Accepted" : "Not Accepted"}</td>
                <td>{req.is_approved ? "Yes" : "No"}</td>
                <td>
                  {!req.accepted_by ? (
                    <button
                      onClick={() => handleAccept(req.id)}
                      disabled={!!accepting}
                    >
                      {accepting === req.id ? "Accepting..." : "Accept"}
                    </button>
                  ) : (
                    <span>Accepted</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DonorAcceptRequests; 