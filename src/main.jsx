import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import AllVenues from "./pages/AllVenues";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp"; // Add this import for the SignUp page

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> }, // Home route
      { path: "venues", element: <AllVenues /> }, // Venues route for all users
      { path: "login", element: <Login /> }, // Login page route
      { path: "profile", element: <Profile /> }, // Profile route for logged-in users
      { path: "signup", element: <SignUp /> }, // Add this route for the SignUp page
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
