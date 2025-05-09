// src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search venues..." }) => (
  <div className="w-full max-w-md mx-auto mb-6">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green focus:border-green text-gray-700"
    />
  </div>
);

export default SearchBar;
