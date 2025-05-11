import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import AllVenues from "./pages/AllVenues";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import VenueDetails from "./pages/VenueDetails"; // 👈 Importer denne

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "venues", element: <AllVenues /> },
      { path: "venues/:id", element: <VenueDetails /> }, // 👈 Ny detaljside
      { path: "login", element: <Login /> },
      { path: "profile", element: <Profile /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
