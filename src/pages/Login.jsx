// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate                = useNavigate();
  const API                     = import.meta.env.VITE_NOROFF_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ LOGIN WITH HOLIDAZE SCOPE
      const res = await fetch("https://v2.api.noroff.dev/auth/login?_holidaze=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Login failed (${res.status}): ${err.name || "Unknown error"}`);
      }

      const { data } = await res.json();

      // ✅ Save correct token and profile name
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", data.name);

      console.log("✅ Login saved:", {
        user: data.name,
        token: data.accessToken,
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFEAE2]">
      <div className="bg-white p-10 rounded shadow max-w-lg w-full">
        <h2 className="text-3xl font-bold text-[#00473E] text-center mb-2">Welcome back!</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-gray-300 py-2 pl-10"
            />
            <FaUser className="absolute left-2 top-2.5 text-orange" />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-gray-300 py-2 pl-10"
            />
            <FaLock className="absolute left-2 top-2.5 text-orange text-xl" />
          </div>
          <button className="w-full bg-[#00473E] text-white py-2 rounded-md">Login</button>
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <a href="/signup" className="text-orange underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
