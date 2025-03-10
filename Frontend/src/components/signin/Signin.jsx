import React, { useState } from "react";
import logo from '../../assets/logo.jpg'
import "./Signin.css";

function Signin() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
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
    };

    try {
      const response = await fetch("http://localhost:8000/donate/signin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.status === 201) {
        setSuccess(result.success);
        setError("");
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
          <button type="submit" className="signin-button">
            Sign Up
          </button>
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
