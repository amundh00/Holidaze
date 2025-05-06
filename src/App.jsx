import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* This renders the child route component */}
      </main>
      <Footer />
    </>
  );
};

export default App;
