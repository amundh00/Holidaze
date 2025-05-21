// AllVenues.jsx with SearchBar and MetaFilter as components
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVenues } from "../utils/fetchData";
import SearchBar from "../components/SearchBar";
import MetaFilter from "../components/MetaFilter";

const PAGE_LIMIT = 12;

const AllVenues = () => {
  const [allVenues, setAllVenues] = useState([]);
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ wifi: false, parking: false, breakfast: false, pets: false });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loadMoreRef = useRef(null);
  const navigate = useNavigate();

  const isSearchOrFilterActive = searchTerm.trim() !== "" || Object.values(filters).some(Boolean);

  useEffect(() => {
    const controller = new AbortController();

    async function loadVenues() {
      let tempPage = 1;
      let fetchedAll = false;
      const collected = [];

      while (!fetchedAll) {
        try {
          const query = `sort=created&sortOrder=desc&page=${tempPage}&limit=100`;
          const data = await fetchVenues(query, { signal: controller.signal });

          if (!Array.isArray(data?.data) || data.data.length === 0) {
            fetchedAll = true;
            break;
          }

          collected.push(...data.data);

          if (data.data.length < 100) {
            fetchedAll = true;
          } else {
            tempPage++;
            await new Promise((r) => setTimeout(r, 300));
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error loading venues:", error);
          }
          fetchedAll = true;
        }
      }

      setAllVenues(collected);
      setInitialLoading(false);
    }

    loadVenues();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const filtered = allVenues.filter((v) =>
      (searchTerm.trim() === "" || v.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      Object.entries(filters).every(([k, active]) => !active || v.meta?.[k])
    );
    setVenues(filtered);
  }, [searchTerm, filters, allVenues]);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <h2 className="text-3xl font-heading text-center text-green mb-8">All Venues</h2>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <MetaFilter filters={filters} toggleFilter={toggleFilter} />

        {initialLoading ? (
          <p className="text-center text-gray-600 mt-10">Loading venues...</p>
        ) : !venues.length ? (
          <p className="text-center text-textGray mt-10">No venues found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {venues.map((v) => (
              <div key={v.id} className="bg-white shadow-md overflow-hidden rounded-xl">
                <img src={v.media?.[0]?.url || "/default-image.jpg"} alt={v.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-heading text-green mb-2">{v.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-yellow-500 font-semibold">{v.rating} ★</p>
                    <p className="text-green font-bold">{v.price ? `${v.price} Euro/Night` : "Price Unavailable"}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/venues/${v.id}`)}
                    className="w-full bg-green text-white py-2 hover:bg-opacity-90 mt-4"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && !isSearchOrFilterActive && (
          <div ref={loadMoreRef} className="text-center mt-10">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-green text-white px-6 py-2 rounded hover:bg-opacity-90"
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllVenues;
