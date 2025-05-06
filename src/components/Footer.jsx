// src/components/Footer.jsx

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12 py-6 text-center text-sm text-textGray">
      <div className="max-w-6xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
