import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/donate/LoginView/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend error message if available
        const backendError = data && (data.message || data.data || data.detail || data.error);
        setError(backendError || "Invalid username or password");
        return;
      }

      // Store tokens and user info
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.role);
      setIsAuthenticated(true);
      if (data.role === "doner") {
        navigate("/donor-dashboard");
      } else if (data.role === "requester") {
        navigate("/requester-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="imglogin">
          <img src={logo} alt="Logo" />
        </div>

        <div className="form-section">
          <h1>Give Life</h1>
          <h2>Login</h2>
          <p>Sign in to your account</p>

          {error && <p className="error">{error}</p>}

          <form className="loginform" onSubmit={handleSubmit}>
            <div className="form-gp">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-gp">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="loginbtn" type="submit">Login</button>
          </form>

          <div className="links">
            <a className="link_forget" href="/reset-password">Forgot password? Click here to reset</a>
            <Link to="/signin" className="register-btn">Register New Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
