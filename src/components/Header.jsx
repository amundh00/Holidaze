import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const user = localStorage.getItem("user");

  return (
    <header className="bg-white border-b shadow-sm px-8 pt-4 pb-2">
      <div className="max-w-6xl mx-auto flex items-start justify-between">
        {/* Left spacer */}
        <div className="w-1/3" />

        {/* Center: logo and nav */}
        <div className="text-center w-1/3 leading-tight">
          <h1 className="text-4xl font-heading text-brown">Holidaze</h1>
          <nav className="mt-1 flex justify-center gap-8 text-textGray text-base font-medium">
            <Link to="/">Home</Link>
            <Link to="/venues">Venues</Link>
            {!user && <Link to="/login">Login</Link>}
          </nav>
        </div>

        {/* Right: user icon and logout */}
        <div className="w-1/3 flex justify-end items-center gap-2">
          {user && (
            <>
              <FaUser className="text-brown text-xl" />
              <button
                className="text-sm text-textGray underline"
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
