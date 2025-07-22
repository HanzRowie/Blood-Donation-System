import React, { useEffect, useState, useRef } from "react";
import "./profile.css";
import ChangePassword from "../changePassword/ChangePassword";

const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    console.log("fetchProfile called");
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://127.0.0.1:8000/donate/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setForm({
        phone: data.phone || "",
        address: data.address || "",
        blood_group: data.blood_group || "",
        date_of_birth: data.date_of_birth || "",
        profile_picture: data.profile_picture || null,
      });
      setProfilePicPreview(data.profile_picture ? data.profile_picture : null);
    } catch (err) {
      setError("Could not load profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture" && files.length > 0) {
      setForm({ ...form, profile_picture: files[0] });
      setProfilePicPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = () => {
    console.log("Edit clicked");
    setEditMode(true);
    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      phone: profile.phone || "",
      address: profile.address || "",
      blood_group: profile.blood_group || "",
      date_of_birth: profile.date_of_birth || "",
      profile_picture: profile.profile_picture || null,
    });
    setProfilePicPreview(profile.profile_picture);
    setMessage("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");
    setError("");
    setMessage("");
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "profile_picture") {
        if (value instanceof File) {
          formData.append(key, value);
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    try {
      const res = await fetch("http://127.0.0.1:8000/donate/profile/", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMessage("Profile updated successfully.");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError(err.message || "Could not update profile.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) return;
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://127.0.0.1:8000/donate/profile/", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setMessage("Profile deleted successfully.");
      setProfile(null);
    } catch (err) {
      setError("Could not delete profile.");
    }
  };

  if (!profile) {
    if (!token) {
      console.warn("No access token found in localStorage. Check token name.");
    }
    return (
      <div className="profile-container">
        <div className="auth-info">
          {token ? (
            <>
              <p style={{ color: "green" }}>✅ Token is present. You are logged in.</p>
              {user ? (
                <p>👤 Logged-in as: <strong>{user.username}</strong> ({user.email})</p>
              ) : (
                <p>⚠️ User info not found in localStorage.</p>
              )}
            </>
          ) : (
            <p style={{ color: "red" }}>❌ No token found. You are not logged in.</p>
          )}
        </div>
        {error ? <div className="error">{error}</div> : <div>Loading profile...</div>}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="auth-info">
        {token ? (
          <>
            <p style={{ color: "green" }}>✅ Token is present. You are logged in.</p>
            {user ? (
              <p>👤 Logged-in as: <strong>{user.username}</strong> ({user.email})</p>
            ) : (
              <p>⚠️ User info not found in localStorage.</p>
            )}
          </>
        ) : (
          <p style={{ color: "red" }}>❌ No token found. You are not logged in.</p>
        )}
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <form className="profile-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="profile-pic-section">
          <img
            src={profilePicPreview || "https://via.placeholder.com/120x120?text=No+Image"}
            alt="Profile"
            className="profile-pic"
          />
          {editMode && (
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
            />
          )}
        </div>
        <div className="profile-fields">
          <label>Username: <span>{user?.username}</span></label>
          <label>Email: <span>{user?.email}</span></label>
          <label>Phone:
            {editMode ? (
              <input type="text" name="phone" value={form.phone || ""} onChange={handleChange} />
            ) : (
              <span>{profile.phone || "-"}</span>
            )}
          </label>
          <label>Address:
            {editMode ? (
              <input type="text" name="address" value={form.address || ""} onChange={handleChange} />
            ) : (
              <span>{profile.address || "-"}</span>
            )}
          </label>
          <label>Blood Group:
            {editMode ? (
              <select name="blood_group" value={form.blood_group || ""} onChange={handleChange}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            ) : (
              <span>{profile.blood_group || "-"}</span>
            )}
          </label>
          <label>Date of Birth:
            {editMode ? (
              <input type="date" name="date_of_birth" value={form.date_of_birth || ""} onChange={handleChange} />
            ) : (
              <span>{profile.date_of_birth || "-"}</span>
            )}
          </label>
        </div>
        {editMode && (
          <div className="profile-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </form>
      {!editMode && (
        <div className="profile-actions">
          <button type="button" className="edit-btn" onClick={handleEdit}>Edit Profile</button>
          <button type="button" className="delete-btn" onClick={handleDelete}>Delete Profile</button>
          <button type="button" className="change-password-btn" onClick={() => setShowChangePassword(!showChangePassword)}>
            {showChangePassword ? "Hide Change Password" : "Change Password"}
          </button>
        </div>
      )}
      {showChangePassword && <ChangePassword />}
    </div>
  );
};

export default Profile;
