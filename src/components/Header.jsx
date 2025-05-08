import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Use navigate hook to programmatically navigate
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const user = localStorage.getItem("user");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleVenuesClick = () => {
    // Navigate to the venues page directly
    navigate("/venues");
  };

  const handleLoginLogout = () => {
    if (user) {
      // Log out the user
      localStorage.removeItem("user");
      window.location.reload(); // Reload the page to reflect the changes
    } else {
      // Navigate to the login page if the user is not logged in
      navigate("/login");
    }
  };

  return (
    <header className="bg-white border-b shadow-sm px-4 py-4">
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center">
        {/* Left */}
        <div>
          {user && <FaUser className="text-brown text-xl md:hidden" />}
        </div>

        {/* Center logo */}
        <div className="text-center">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <h1 className="text-3xl font-heading text-brown md:text-4xl pt-2">
              Holidaze
            </h1>
          </Link>
        </div>

        {/* Right */}
        <div className="flex justify-end items-center gap-2">
          {/* Mobile: Hamburger */}
          <button
            className="text-brown text-xl md:hidden p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop: Logout/Profile */}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <FaUser className="text-brown text-xl" />
              <button
                className="text-sm text-textGray underline"
                onClick={handleLoginLogout}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex justify-center gap-8 mt-2 text-textGray text-base font-medium">
        <Link to="/">Home</Link>
        <button onClick={handleVenuesClick} className="text-base font-medium text-textGray">
          Venues
        </button>
        {user ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="flex flex-col items-center gap-3 mt-3 text-textGray text-base font-medium md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <button onClick={handleVenuesClick} className="text-base font-medium text-textGray">
            Venues
          </button>
          {user ? (
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
          {user && (
            <button
              className="underline text-sm"
              onClick={handleLoginLogout}
            >
              Log Out
            </button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
