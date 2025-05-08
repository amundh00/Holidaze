import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      localStorage.setItem("user", email);
      navigate("/venues");
    }
  };

  return (
    <div className="bg-[#EFEAE2] min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-md p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-[#00473E] mb-2">
          Welcome back!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Login or register user to be able to book your next escape!
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-gray-300 py-2 pl-10 focus:outline-none focus:border-[#00473E]"
              />
              <FaUser className="absolute left-2 top-2.5 text-orange" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-gray-300 py-2 pl-10 focus:outline-none focus:border-[#00473E]"
              />
              <FaLock className="absolute left-2 top-2.5 text-orange text-xl z-10" />
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-[#00473E] text-white py-2 rounded-md hover:bg-opacity-90"
          >
            Login
          </button>

          {/* Links */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Don’t have an account?{" "}
              <a href="/signup" className="text-orange hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
