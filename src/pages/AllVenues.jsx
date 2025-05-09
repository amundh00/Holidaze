import React, { useState, useEffect, useCallback } from "react";
import { fetchVenues } from "../utils/fetchData";
import { FaWifi, FaParking, FaCoffee, FaPaw } from "react-icons/fa";

const PAGE_SIZE = 24;
const SEARCH_DEBOUNCE_MS = 500;

// SearchBar component
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

// MetaFilter component
const icons = { wifi: <FaWifi />, parking: <FaParking />, breakfast: <FaCoffee />, pets: <FaPaw /> };
const MetaFilter = ({ filters, setFilters }) => {
  const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  return (
    <div className="flex flex-col items-center mb-6">
      <p className="text-gray-700 font-medium mb-2">Toggle facilities:</p>
      <div className="flex space-x-6">
        {Object.keys(filters).map(key => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`text-3xl transition-colors duration-200 ${filters[key] ? "text-green" : "text-gray-400"}`}
            title={key}
          >
            {icons[key]}
          </button>
        ))}
      </div>
    </div>
  );
};

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ wifi: false, parking: false, breakfast: false, pets: false });

  // debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVenues(PAGE_SIZE, offset);
      const list = Array.isArray(data.data) ? data.data : [];
      setVenues(prev => offset === 0 ? list : [...prev, ...list]);
      setHasMore(list.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load venues");
    } finally {
      setLoading(false);
    }
  }, [offset]);

  // fetch on mount/offset
  useEffect(() => { loadVenues(); }, [loadVenues]);
  // reset offset when base query changes
  useEffect(() => setOffset(0), [debouncedSearch, filters]);

  // apply client-side filtering
  const filteredVenues = venues.filter(v => {
    const matchesSearch = debouncedSearch === "" || v.name?.toLowerCase().includes(debouncedSearch);
    const matchesFilters = Object.entries(filters).every(([key, active]) => !active || v.meta?.[key]);
    return matchesSearch && matchesFilters;
  });

  // decide list and load more visibility
  const isFiltering = debouncedSearch !== "" || Object.values(filters).some(Boolean);
  const displayed = isFiltering ? filteredVenues : venues;

  if (loading && offset === 0) return <p className="text-center mt-10 text-gray-600">Loading venues...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <h2 className="text-3xl font-heading text-center text-green mb-8">All Venues</h2>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <MetaFilter filters={filters} setFilters={setFilters} />

        {!displayed.length ? (
          <p className="text-center text-textGray">No venues found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayed.map(v => (
              <div key={v.id} className="bg-white shadow-md overflow-hidden">
                <img src={v.media?.[0]?.url || "/default-image.jpg"} alt={v.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-heading text-green mb-2">{v.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-yellow-500 font-semibold">{v.rating} ★</p>
                    <p className="text-green font-bold">{v.price ? `${v.price} Euro/Night` : "Price Unavailable"}</p>
                  </div>
                  <button className="w-full bg-green text-white py-2 hover:bg-opacity-90 mt-4">Book</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && !isFiltering && (
          <div className="text-center mt-10">
            <button onClick={() => setOffset(prev => prev + PAGE_SIZE)} className="bg-green text-white px-6 py-2 rounded hover:bg-opacity-90">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllVenues;