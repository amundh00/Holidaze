import React from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header />
      <main className="p-4">
        <Outlet />
        <div className="bg-green text-white p-4">Now Tailwind should fully work ✅</div>

      </main>
    </>
  );
};

export default App;
