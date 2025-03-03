import React, {useState} from "react";
import "./Login.css";
import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/donate/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      alert("Login successful!");
      console.log("Response data:", data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Section for Logo */}
        <div className="imglogin">
          <img src={logo} alt="Logo" />
        </div>

        {/* Right Section for Form */}
        <div className="form-section">
          <h1>Give Life</h1>
          <h2>Login</h2>
          <p>Sign in to your account</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
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
            <button type="submit" >
              Login
            </button>
          </form>

          <div className="links">
            <a className="link_forget"href="/reset-password">I forget my password. Click here to reset</a>
            <Link to="/signin" className="register-btn">
              Register New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

