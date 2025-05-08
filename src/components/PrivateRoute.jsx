import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  // Check if user exists in localStorage
  const user = localStorage.getItem("user");

  // If no user is logged in, redirect to Login page
  if (!user) {
    return <Navigate to="/login" />; // Redirects to login page
  }

  // If user is logged in, render the protected element (AllVenues)
  return element;
};

export default PrivateRoute;
