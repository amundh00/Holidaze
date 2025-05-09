import React from "react";
import { FaWifi, FaParking, FaCoffee, FaPaw } from "react-icons/fa";

const icons = {
  wifi: <FaWifi />,
  parking: <FaParking />,
  breakfast: <FaCoffee />,
  pets: <FaPaw />,
};

const MetaFilter = ({ filters, setFilters }) => {
  const toggleFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <p className="text-gray-700 font-medium mb-2">Toggle facilities:</p>
      <div className="flex space-x-6">
        {Object.keys(filters).map((key) => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`text-3xl transition-colors duration-200 ${
              filters[key] ? "text-orange" : "text-gray-400"
            }`}
            title={key}
          >
            {icons[key]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetaFilter;
