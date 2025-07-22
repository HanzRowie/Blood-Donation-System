import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const WS_BASE = "ws://127.0.0.1:8000/ws/chatroom/";
const API_BASE = "http://127.0.0.1:8000/chat/api/chatroom/";

const ChatRoom = () => {
  const { chatroomName } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch past messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}${chatroomName}/messages/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data.reverse());
      } catch (err) {
        setError("Failed to load chat history: " + err.message);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [chatroomName]);

  // Connect WebSocket
  useEffect(() => {
    const token = localStorage.getItem("access");
    const wsUrl = `${WS_BASE}${chatroomName}/?token=${encodeURIComponent(token)}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("📩 Message received:", data);

      if (data.type === "chat.message") {
        setMessages((prev) => {
          // Remove optimistic message if it matches body and author
          const filtered = prev.filter(
            (msg) =>
              !(msg.pending && msg.body === data.message.body &&
                new Date(msg.created_at).getTime() === new Date(data.message.created_at).getTime())
          );
          return [...filtered, data.message];
        });
      }
    };

    ws.current.onerror = (e) => {
      console.error("❌ WebSocket error:", e);
      setError("WebSocket error — check backend logs and routing.");
    };

    ws.current.onclose = (e) => {
      console.warn("⚠️ WebSocket closed:", e.code, e.reason);
      if (!e.wasClean) {
        setError("WebSocket connection closed unexpectedly.");
      }
    };

    return () => {
      ws.current && ws.current.close();
    };
  }, [chatroomName]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // Optimistically add the message
      const optimisticMsg = {
        id: Date.now(), // Temporary ID
        body: input,
        author: "You", // Or your username if available
        created_at: new Date().toISOString(),
        group: chatroomName,
        pending: true,
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      ws.current.send(JSON.stringify({ body: input }));
      setInput("");
    } else {
      console.warn("WebSocket not ready to send");
      setError("WebSocket is not connected. Cannot send message.");
    }
  };

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: "32px auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #ccc", padding: 24 }}>
      <h2>Chat Room: {chatroomName}</h2>
      <div style={{ minHeight: 300, maxHeight: 400, overflowY: "auto", border: "1px solid #eee", padding: 12, marginBottom: 16 }}>
        {messages.length === 0 ? (
          <div style={{ color: "#888" }}>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: 8, opacity: msg.pending ? 0.5 : 1 }}>
              <b>{typeof msg.author === 'object' && msg.author !== null ? msg.author.username : msg.author}:</b> {msg.body}{" "}
              <span style={{ color: "#888", fontSize: 12 }}>
                ({new Date(msg.created_at).toLocaleString()})
                {msg.pending && " (sending...)"}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: 8 }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
