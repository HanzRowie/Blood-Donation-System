import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BloodStories.css";
const API_BASE = "http://localhost:8000/donate/BloodStoryView/"; // Note the trailing slash

const BloodStories = () => {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({ name: "", title: "", content: "", image: null });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch all blood stories
  useEffect(() => {
    axios
      .get(API_BASE)
      .then((res) => setStories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (form.image) formData.append("image", form.image);

    axios
      .post(API_BASE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setMsg(res.data.msg);
        // Refresh stories
        return axios.get(API_BASE);
      })
      .then((res) => setStories(res.data))
      .catch((err) => {
        setMsg("Error submitting story.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="blood-stories-container">
      <h2>Blood Stories</h2>
      <div className="stories-list">
        {stories.map((story) => (
          <div className="story-card" key={story.id}>
            <h3>{story.title}</h3>
            <p><strong>By:</strong> {story.name}</p>
            {story.image && (
              <img
                src={story.image}
                alt={story.title}
                style={{ maxWidth: "300px", maxHeight: "200px" }}
              />
            )}
            <p>{story.content}</p>
          </div>
        ))}
      </div>
      <hr />
      <h3>Share Your Blood Story</h3>
      <form onSubmit={handleSubmit} className="story-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Story Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Your Story"
          value={form.content}
          onChange={handleChange}
          required
        />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Story"}
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default BloodStories;