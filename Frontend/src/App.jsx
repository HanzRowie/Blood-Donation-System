import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Signin from "./components/signin/Signin";
import Login from "./components/login/Login";
import DonateBlood from "./components/donateBlood/DonateBlood";
import RequestBlood from "./components/requestBlood/RequestBlood";
import BloodHistory from "./components/bloodHistory/BloodHistory";
import RequestHistory from "./components/requestHistory/RequestHistory";
import Navbar from "./components/navbar/Navbar";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />  
 
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donate-blood" element={<DonateBlood />} />
          <Route path="/request-blood" element={<RequestBlood />} />
          <Route path="/blood-donations" element={<BloodHistory />} />
          <Route path="/request-donations" element={<RequestHistory />} />
        </Routes>
      </div>
    
    </Router>
  );
}

export default App;
