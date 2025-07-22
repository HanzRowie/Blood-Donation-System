import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/chat/api/user/";
const GROUPS_URL = "http://127.0.0.1:8000/chat/api/chatrooms/";

const DonorChatRooms = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatrooms = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all chatrooms for the current user
        const res = await fetch(GROUPS_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch chatrooms");
        const data = await res.json();
        setChatrooms(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchChatrooms();
  }, []);

  if (loading) return <div>Loading chatrooms...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>My Chatrooms</h1>
      {chatrooms.length === 0 ? (
        <p>No chatrooms found.</p>
      ) : (
        <ul>
          {chatrooms.map((room) => (
            <li key={room.group_name} style={{ marginBottom: 12 }}>
              <b>{room.group_name}</b> &nbsp;
              <button onClick={() => navigate(`/chat/${room.group_name}`)}>Open Chat</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DonorChatRooms; 