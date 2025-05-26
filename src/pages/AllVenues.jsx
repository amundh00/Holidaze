import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MetaFilter from "../components/MetaFilter";

// Antall venues som vises per side
const PAGE_SIZE = 12;

// Funksjon for å normalisere strenger (for bedre søkematching)
const normalizeString = (str) =>
  str?.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim() || "";

const AllVenuesUpdated = () => {
  // State for alle venues og filtrert visning
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);

  // Søkeord og aktive filtre
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ wifi: false, parking: false, breakfast: false, pets: false });

  // Lasteindikator og nåværende side for paginering
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  // Henter inn alle venues (paginert API, loop til alt er hentet)
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        let all = [];
        let currentPage = 1;

        while (true) {
          const res = await fetch(
            `${import.meta.env.VITE_NOROFF_API_URL}/holidaze/venues?page=${currentPage}&limit=100`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
              },
            }
          );
          const { data } = await res.json();

          // Stopp hvis ingen flere resultater
          if (!data?.length) break;

          all = all.concat(data);
          currentPage++;
        }

        // Oppdater state med alle venues
        setVenues(all);
        setFilteredVenues(all);
      } catch (err) {
        console.error("Error fetching venues:", err);
      } finally {
        setLoading(false); // Ferdig lastet
      }
    };
    fetchVenues();
  }, []);

  // Filtrerer venues basert på søk og aktive filtre
  const applyFilters = useCallback(() => {
    const filtered = venues.filter((v) => {
      // Søk basert på navn (med normalisering)
      const searchMatch = !searchTerm || normalizeString(v.name).includes(normalizeString(searchTerm));

      // Sjekk om alle aktiverte filtre er oppfylt i venue.meta
      const metaMatch = Object.entries(filters).every(([k, active]) => !active || v.meta?.[k]);

      return searchMatch && metaMatch;
    });

    setFilteredVenues(filtered);
    setPage(1); // Tilbake til første side
  }, [searchTerm, filters, venues]);

  // Kjør filtrering hver gang søk, filtre eller venues endres
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, venues]);

  // Toggle for å skru av/på individuelle filtre
  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Beregn venues som skal vises på nåværende side
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredVenues.slice(start, start + PAGE_SIZE);
  }, [filteredVenues, page]);

  // Beregn totalt antall sider
  const pageTotal = useMemo(() => Math.max(1, Math.ceil(filteredVenues.length / PAGE_SIZE)), [filteredVenues.length]);

  // Genererer en liste med sidetall for paginering (maks 5 synlige tall)
  const getPageNumbers = (currentPage, totalPages) => {
    const maxPageNumbers = 5;
    let startPage;

    if (totalPages <= maxPageNumbers || currentPage <= 3) {
      startPage = 1;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
    } else {
      startPage = currentPage - 2;
    }

    return Array.from({ length: Math.min(maxPageNumbers, totalPages) }, (_, i) => startPage + i);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        {/* Overskrift */}
        <h2 className="text-3xl font-heading text-center text-green mb-8">All Venues</h2>

        {/* Søke- og filterkomponenter */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <MetaFilter filters={filters} toggleFilter={toggleFilter} />

        {/* Visning under lasting / ingen resultater / liste med venues */}
        {loading ? (
          <p className="text-center text-gray-600 mt-10">Loading venues...</p>
        ) : !filteredVenues.length ? (
          <p className="text-center text-textGray mt-10">No venues found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {paginated.map((v) => (
              <div key={v.id} className="bg-white shadow-md overflow-hidden">
                <img src={v.media?.[0]?.url || "/default-image.jpg"} alt={v.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-heading text-green mb-2">{v.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-yellow-500 font-semibold">{v.rating} ★</p>
                    <p className="text-green font-bold">
                      {v.price ? `${v.price} Euro/Night` : "Price Unavailable"}
                    </p>
                  </div>
                  {/* Naviger til detaljer for valgt venue */}
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

        {/* Paginering nederst hvis mer enn én side */}
        {filteredVenues.length > PAGE_SIZE && (
          <div className="text-center mt-10 flex justify-center gap-2 flex-wrap">
            {/* Forrige side */}
            {page > 1 && (
              <button onClick={() => setPage(p => p - 1)} className="px-3 py-1 border">Prev</button>
            )}
            {/* Sidetall */}
            {getPageNumbers(page, pageTotal).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border ${p === page ? 'bg-green text-white' : ''}`}
              >
                {p}
              </button>
            ))}
            {/* Neste side */}
            {page < pageTotal && (
              <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 border">Next</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllVenuesUpdated;
