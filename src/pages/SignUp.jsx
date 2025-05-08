import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.endsWith("@stud.noroff.no")) {
      setErrorMessage("E-posten må slutte med @stud.noroff.no");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Passord må være minst 8 tegn");
      return;
    }

    const userData = {
      name,
      email,
      password,
      ...(venueManager && { venueManager: true }), // legg kun med hvis true
    };

    console.log("Registrerer bruker med data:", userData);

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
        console.error("Feil fra API:", errorData);
        console.log("Detaljerte feil:", errorData.errors);
        setErrorMessage(errorData.errors?.[0]?.message || "Registrering feilet");
      }
    } catch (err) {
      console.error("Uventet feil:", err);
      setErrorMessage("Noe gikk galt. Prøv igjen senere.");
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-semibold text-center text-green">Lag en konto</h2>

        <div className="flex flex-col">
          <label className="text-sm text-textGray mb-1">Brukernavn</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-textGray mb-1">E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-textGray mb-1">Passord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={venueManager}
            onChange={() => setVenueManager(!venueManager)}
            className="focus:ring-2 focus:ring-green"
          />
          <label className="text-sm text-textGray">Jeg ønsker å opprette venues</label>
        </div>

        <button type="submit" className="w-full bg-green text-white py-2 rounded-md hover:bg-opacity-90">
          Registrer deg
        </button>

        {errorMessage && (
          <p className="text-sm text-red-600 text-center">{errorMessage}</p>
        )}

        <p className="text-sm text-center text-textGray">
          Har du allerede en konto?{" "}
          <a href="/login" className="text-orange hover:underline">
            Logg inn
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
