import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css"; // Ensure this file is imported for custom styles

function Navbar() {
  return (
    <nav className="navbar navbar-expand-md fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">Itahari LifeBank</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mx-auto gap-4"> {/* Increased spacing */}
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blood-donations">Blood Donation History</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/request-donations">Blood Request History</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/donate-blood">Donate Blood</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/request-blood">Request Blood</Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link className="btn btn-custom me-2" to="/signin">Sign In</Link>
            <Link className="btn btn-custom" to="/login">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
