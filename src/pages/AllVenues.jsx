import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MetaFilter from "../components/MetaFilter";
import { fetchVenues } from "../utils/fetchData";

const PAGE_SIZE = 24;
const SEARCH_DEBOUNCE_MS = 500;

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ wifi: false, parking: false, breakfast: false, pets: false });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch venues only on offset change (initial load and pagination)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchVenues({ limit: PAGE_SIZE, offset });
        const list = Array.isArray(data.data) ? data.data : [];
        setVenues(prev => (offset === 0 ? list : [...prev, ...list]));
        setHasMore(list.length === PAGE_SIZE);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load venues");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [offset]);

  // Client-side filtering based on debouncedSearch and filters
  const filtered = venues.filter(v =>
    (debouncedSearch === "" || v.name.toLowerCase().includes(debouncedSearch)) &&
    Object.entries(filters).every(([k, active]) => !active || v.meta?.[k])
  );
  const isFiltering = debouncedSearch !== "" || Object.values(filters).some(Boolean);
  const displayed = isFiltering ? filtered : venues;

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
