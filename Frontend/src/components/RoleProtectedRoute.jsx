import React from "react";
import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = !!localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return element;
};

export default RoleProtectedRoute; 