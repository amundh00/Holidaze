import React from "react";
import { Link } from "react-router-dom";

const VenueCard = ({ venue, layout = "default" }) => {
  const image = venue.media?.[0];

  return (
    <div
      className={`bg-white shadow-md overflow-hidden ${
        layout === "default" ? "flex flex-col md:flex-row" : "p-4"
      }`}
    >
      {layout === "default" && (
        <div className="md:w-1/2 h-64 bg-gray-200">
          {image ? (
            <img
              src={image.url}
              alt={image.alt || venue.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-textGray italic">
              No image available
            </div>
          )}
        </div>
      )}

      <div className={`p-6 ${layout === "default" ? "md:w-1/2" : ""}`}>
        <h3 className="text-xl font-heading text-green mb-2">{venue.name}</h3>
        <p className="text-sm text-textGray line-clamp-4">
          {venue.description || "No description available."}
        </p>
        <Link to={`/venues/${venue.id}`}>
          <button className="mt-4 w-max bg-green text-white px-4 py-2 hover:bg-opacity-90">
            See more
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VenueCard;
