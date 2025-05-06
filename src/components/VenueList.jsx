// src/components/VenueList.jsx

import React from "react";
import VenueCard from "./VenueCard";

const VenueList = ({ venues = [], layout = "default" }) => {
  if (!venues.length) {
    return <p className="text-center text-textGray">No venues found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 mt-12 space-y-8">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} layout={layout} />
      ))}
    </div>
  );
};

export default VenueList;
