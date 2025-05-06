import React, { useEffect, useState } from "react";
import { fetchVenues } from "../utils/fetchData"; // Import the fetchVenues function
import VenueCard from "../components/VenueCard"; // Import the VenueCard component

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await fetchVenues();
        if (data && Array.isArray(data.data)) {
          setVenues(data.data); // Store fetched venues in state
        }
      } catch (error) {
        console.error("Failed to load venues:", error);
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading venues...</p>;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <h2 className="text-3xl font-heading text-center text-green mb-8">
          All Venues
        </h2>
        {venues.length === 0 ? (
          <p className="text-center text-textGray">No venues found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white shadow-md overflow-hidden"
              >
                <img
                  src={venue.media?.[0]?.url || "/default-image.jpg"}
                  alt={venue.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-heading text-green mb-2">
                    {venue.name}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-yellow-500 font-semibold">
                      {venue.rating} ★
                    </p>
                    <p className="text-green font-bold">
                      {venue.price ? `${venue.price} Euro/Night` : "Price Unavailable"}
                    </p>
                  </div>
                  <button className="w-full bg-green text-white py-2 hover:bg-opacity-90 mt-4">
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllVenues;
