import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import "./Signin.css";

function Signin({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      conpassword: conPassword,
      role,
    };

    try {
      const response = await fetch("http://localhost:8000/donate/RegisterView/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.status === 201) {
        localStorage.setItem("token", result.token); // Store token
        setIsAuthenticated(true); // Set authentication state
        navigate("/"); // Redirect to home
      } else {
        setError(result.error);
        setSuccess("");
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="imgsign">
          <img src={logo} alt="Logo" />
        </div>
        <h2>Sign Up</h2>
        <p>Create Your Account</p>
        <form className="signinform" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={conPassword}
              onChange={(e) => setConPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-select"
            >
              <option value="donor">Donor</option>
              <option value="requester">Requester</option>
            </select>
          </div>
          <button type="submit" className="signin-button">Sign Up</button>
        </form>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <p className="signin-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signin;
