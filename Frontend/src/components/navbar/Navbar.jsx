import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import iskologo from '../../assets/iskologo.jpg';
import  blood1 from '../../assets/blood1.jpeg'


const Navbar = () => {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-md fixed-top navbar-light bg-light">
      <div className="container-fluid">
      <Link className="navbar-brand" to="/home">
        <img src={blood1} alt="Itahari LifeBank Logo"  />
      </Link>


        {/* Navbar links */}
        <div className="navbarcon" id="navbarCollapse">
          <ul className="navbar-nav gap-4">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            {token && role === "donor" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/donor-dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-donations">My Donations</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/accept-requests">Accept Requests</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/blood-donations">Blood Donation History</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/donate-blood">Donate Blood</Link>
                </li>
              </>
            )}
            {token && role === "requester" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/requester-dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-requests">My Requests</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/available-donors">Available Donors</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/request-donations">Blood Request History</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/request-blood">Request Blood</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Align auth buttons to the right */}
        <div className="d-flex ms-auto">
          <div className="auth-buttons">
            {!token ? (
              <>
                <Link className="btn btn-outline-success me-2" to="/signin">Sign In</Link>
                <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-secondary me-2" to="/profile">Profile</Link>
                <button className="btn2" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
