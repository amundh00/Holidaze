import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const user = localStorage.getItem("user");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleVenuesClick = () => {
    // Navigering til all venues side
    navigate("/venues");
  };

  const handleLoginLogout = () => {
    if (user) {
      // Log ut brukeren
      localStorage.removeItem("user");
      window.location.reload(); // last siden på nytt for å oppdatere brukerstatus
    } else {
      // Navigering til innloggingssiden hvis brukeren ikke er logget inn
      navigate("/login");
    }
  };

  return (
    <header className="bg-white border-b shadow-sm px-4 py-4">
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center">
        <div>
          {user && (
            <Link to="/profile">
              <FaUser className="text-brown text-xl md:hidden" />
            </Link>
          )}
        </div>

        <div className="text-center">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <h1 className="text-3xl font-heading text-brown md:text-4xl pt-2">
              Holidaze
            </h1>
          </Link>
        </div>

        <div className="flex justify-end items-center gap-2">
          {/* Mobil Meny */}
          <button
            className="text-brown text-xl md:hidden p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          
        </div>
      </div>

      {/* Desktop navigasjon */}
      <nav className="hidden md:flex justify-center gap-8 mt-2 text-textGray text-base font-medium">
        <Link to="/">Home</Link>
        <button onClick={handleVenuesClick} className="text-base font-medium text-textGray">
          Venues
        </button>
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile">Profile</Link>
            <button onClick={handleLoginLogout} className="text-sm underline text-textGray">
              Log Out
            </button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      {/* Mobile navigasjon */}
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
