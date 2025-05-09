import React, { useEffect, useState } from "react";
import { fetchVenues } from "../utils/fetchData";
import SearchBar from "../components/SearchBar.jsx";
import MetaFilter from "../components/MetaFilter.jsx";

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await fetchVenues(24, offset);
        if (data && Array.isArray(data.data)) {
          const ids = new Set(venues.map((v) => v.id));
          const newUnique = data.data.filter((v) => !ids.has(v.id));
          setVenues((prev) => [...prev, ...newUnique]);
          setHasMore(data.data.length === 24);
        }
      } catch (error) {
        console.error("Failed to load venues:", error);
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, [offset]);

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = venue.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([key, active]) => {
      if (!active) return true;
      return venue.meta?.[key] === true;
    });

    return matchesSearch && matchesFilters;
  });

  const displayedVenues = searchTerm || Object.values(filters).some(Boolean)
    ? filteredVenues
    : venues;

  if (loading && offset === 0) {
    return <p className="text-center text-gray-600 mt-10">Loading venues...</p>;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <h2 className="text-3xl font-heading text-center text-green mb-8">All Venues</h2>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <MetaFilter filters={filters} setFilters={setFilters} />

        {displayedVenues.length === 0 ? (
          <p className="text-center text-textGray">No venues found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedVenues.map((venue) => (
                <div key={venue.id} className="bg-white shadow-md overflow-hidden">
                  <img
                    src={venue.media?.[0]?.url || "/default-image.jpg"}
                    alt={venue.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-heading text-green mb-2">{venue.name}</h3>
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

            {hasMore && !searchTerm && Object.values(filters).every((v) => !v) && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setOffset((prev) => prev + 24)}
                  className="bg-green text-white px-6 py-2 rounded hover:bg-opacity-90"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllVenues;
