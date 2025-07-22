import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/donate/ViewAllRequests/";
const ACCEPT_URL = "http://127.0.0.1:8000/donateacceptrequest/";

const DonorAcceptRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(null);
  const navigate = useNavigate();

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

  const handleChat = async (username) => {
    console.log("Attempting to chat with username:", username);
    if (!username || username === 'undefined') {
      alert("Cannot start chat: Username not available for this requester");
      return;
    }
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
                  {/* Chat with Requester button */}
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      console.log("Request object:", req);
                      const username = req.username || (req.user && req.user.username);
                      console.log("Extracted username:", username);
                      handleChat(username);
                    }}
                    disabled={!req.username && (!req.user || !req.user.username)}
                    title={!req.username && (!req.user || !req.user.username) ? "No username available for requester" : "Chat with Requester"}
                  >
                    Chat with Requester
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

export default DonorAcceptRequests; 