import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home/Home";
import Signin from "./components/signin/Signin";
import Login from "./components/login/Login";
import DonateBlood from "./components/donateBlood/DonateBlood";
import RequestBlood from "./components/requestBlood/RequestBlood";
import BloodHistory from "./components/bloodHistory/BloodHistory";
import RequestHistory from "./components/requestHistory/RequestHistory";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Contact from "./components/contact/Contact";

import "./App.css";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if the user is logged in
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

          {/* Protected Routes */}
          <Route path="/donate-blood" element={<ProtectedRoute element={<DonateBlood />} />} />
          <Route path="/request-blood" element={<ProtectedRoute element={<RequestBlood />} />} />
          <Route path="/blood-donations" element={<ProtectedRoute element={<BloodHistory />} />} />
          <Route path="/request-donations" element={<ProtectedRoute element={<RequestHistory />} />} />
          <Route path="/contact" element={<ProtectedRoute element={<Contact />} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
