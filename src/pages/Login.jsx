import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add useNavigate for redirection

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock login logic: Check if user is logged in (in a real-world scenario, you'll use an API)
    if (email && password) {
      localStorage.setItem("user", email); // Mock user login
      navigate("/venues"); // Redirect to the venues page after successful login
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-heading text-green text-center mb-6">
          Welcome back!
        </h2>
        <p className="text-center text-textGray mb-6">
          Login or register user to be able to book your next escape!
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-textGray text-sm mb-2"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-textGray text-sm mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green text-white py-2 rounded hover:bg-opacity-90 mb-4"
          >
            Login
          </button>

          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
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
