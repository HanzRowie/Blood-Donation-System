import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
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
import Profile from "./components/profile/Profile";
import ChangePassword from "./components/changePassword/ChangePassword";
import ResetPassword from "./components/resetPassword/ResetPassword";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import NotAuthorized from "./components/NotAuthorized";
import DonorDashboard from "./components/donorDashboard/DonorDashboard";
import RequesterDashboard from "./components/requesterDashboard/RequesterDashboard";
import DonorDonations from "./components/donorDashboard/DonorDonations";
import DonorAcceptRequests from "./components/donorDashboard/DonorAcceptRequests";
import RequesterRequests from "./components/requesterDashboard/RequesterRequests";
import AvailableDonors from "./components/requesterDashboard/AvailableDonors";
import ChatRoom from "./components/requesterDashboard/ChatRoom";
import DonorChatRooms from "./components/donorDashboard/DonorChatRooms";
import BloodStories from "./components/bloodStories/BloodStories";

import "./App.css";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("access"); // Check if the user is logged in with access token
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="/blood-stories" element={<BloodStories />} />

          {/* Donor-only routes */}
          <Route
            path="/donate-blood"
            element={
              <RoleProtectedRoute
                element={<DonateBlood />}
                allowedRoles={["donor"]}
              />
            }
          />
          <Route
            path="/blood-donations"
            element={
              <RoleProtectedRoute
                element={<BloodHistory />}
                allowedRoles={["donor"]}
              />
            }
          />
          <Route
            path="/my-donations"
            element={
              <RoleProtectedRoute
                element={<DonorDonations />}
                allowedRoles={["donor"]}
              />
            }
          />
          <Route
            path="/accept-requests"
            element={
              <RoleProtectedRoute
                element={<DonorAcceptRequests />}
                allowedRoles={["donor"]}
              />
            }
          />
          <Route
            path="/donor-chatrooms"
            element={<RoleProtectedRoute element={<DonorChatRooms />} allowedRoles={["donor"]} />}
          />

          {/* Requester-only routes */}
          <Route
            path="/request-blood"
            element={
              <RoleProtectedRoute
                element={<RequestBlood />}
                allowedRoles={["requester"]}
              />
            }
          />
          <Route
            path="/request-donations"
            element={
              <RoleProtectedRoute
                element={<RequestHistory />}
                allowedRoles={["requester"]}
              />
            }
          />
          <Route
            path="/my-requests"
            element={
              <RoleProtectedRoute
                element={<RequesterRequests />}
                allowedRoles={["requester"]}
              />
            }
          />
          <Route
            path="/available-donors"
            element={
              <RoleProtectedRoute
                element={<AvailableDonors />}
                allowedRoles={["requester"]}
              />
            }
          />
          <Route
            path="/chat/:chatroomName"
            element={<RoleProtectedRoute element={<ChatRoom />} allowedRoles={["requester", "donor"]} />}
          />

          {/* Both roles */}
          <Route
            path="/contact"
            element={
              <RoleProtectedRoute
                element={<Contact />}
                allowedRoles={["donor", "requester"]}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <RoleProtectedRoute
                element={<Profile />}
                allowedRoles={["donor", "requester"]}
              />
            }
          />

          {/* Donor Dashboard */}
          <Route
            path="/donor-dashboard"
            element={
              <RoleProtectedRoute
                element={<DonorDashboard />}
                allowedRoles={["donor"]}
              />
            }
          />
          {/* Requester Dashboard */}
          <Route
            path="/requester-dashboard"
            element={
              <RoleProtectedRoute
                element={<RequesterDashboard />}
                allowedRoles={["requester"]}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
