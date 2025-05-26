import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const SignUp = () => {
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate                      = useNavigate();

  const API_URL = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.endsWith("@stud.noroff.no")) {
      setErrorMessage("E-Mail must end with @stud.noroff.no");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMessage("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setErrorMessage("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setErrorMessage("Password must contain at least one number.");
      return;
    }

    const userData = {
      name,
      email,
      password,
      ...(venueManager && { venueManager: true }),
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.errors?.[0]?.message || "Registrering feilet");
      }
    } catch (err) {
      setErrorMessage("Noe gikk galt. Prøv igjen senere.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFEAE2]">
      <form onSubmit={handleSubmit} className="bg-white p-10 shadow max-w-lg w-full space-y-6">
        <h2 className="text-3xl font-bold text-[#00473E] text-center mb-2">Lag en konto</h2>

        {errorMessage && (
          <p className="text-red-600 text-center mb-2 text-sm">{errorMessage}</p>
        )}

        {/* Velg om man skal være venuemanger eller ikke */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-700 font-medium">
            Planlegger du å liste venues?
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={venueManager}
              onChange={() => setVenueManager(!venueManager)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF8358] dark:bg-gray-300 
            peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
            after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8358]" />
          </label>
        </div>

        {/* Navn felt */}
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Brukernavn"
            required
            className="w-full border-b border-gray-300 py-2 pl-10"
          />
          <FaUser className="absolute left-2 top-2.5 text-orange" />
        </div>

        {/* E-post felt */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-post"
            required
            className="w-full border-b border-gray-300 py-2 pl-10"
          />
          <FaEnvelope className="absolute left-2 top-2.5 text-orange" />
        </div>

        {/* Passord felt */}
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            required
            className="w-full border-b border-gray-300 py-2 pl-10"
          />
          <FaLock className="absolute left-2 top-2.5 text-orange text-lg" />
        </div>

        {/* Lagre knapp */}
        <button type="submit" className="w-full bg-[#00473E] text-white py-2">
          Registrer deg
        </button>

        {/* Omdirigering til login side */}
        <p className="text-sm text-center">
          Har du allerede en konto?{" "}
          <a href="/login" className="text-orange underline">Logg inn</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
