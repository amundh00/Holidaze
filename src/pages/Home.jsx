import { useEffect, useState } from "react";
import { fetchVenues } from "../utils/fetchData";
import VenueList from "../components/VenueList";
import heroImage from "../assets/images/HeroHotel.png";

function Home() {
    console.log("✅ Home component rendering");
    const [venues, setVenues] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 12;    

    useEffect(() => {
        const controller = new AbortController();
      
        async function loadVenues() {
          try {
            const data = await fetchVenues(
              `sort=created&sortOrder=desc&page=${page}&limit=${limit}`,
              { signal: controller.signal }
            );
      
            console.log("📥 raw API response:", data);
            console.log("📦 data.data:", data?.data);
      
            if (!Array.isArray(data?.data)) {
              console.warn("No valid venue data returned");
              setHasMore(false);
              return;
            }
      
            console.log("Fetched:", data.data.length, "Page:", page);
            console.log("Page:", page);

            setVenues((prev) => {
            console.log("Prev IDs:", prev.map((v) => v.id));
            console.log("New batch IDs:", data.data.map((v) => v.id));
            
            const newIds = new Set(prev.map((v) => v.id));
            const uniqueNew = data.data.filter((v) => !newIds.has(v.id));

            console.log("✅ Unique new venues:", uniqueNew.length);
            return [...prev, ...uniqueNew];
            });

              
      
            if (data.data.length < limit) {
              setHasMore(false);
            }
          } catch (error) {
            if (error.name !== "AbortError") {
              console.error("Error loading venues:", error);
            }
          }
        }
      
        loadVenues();
      
        return () => {
          controller.abort();
        };
      }, [page]);                          

      const handleLoadMore = () => {
        setPage((prev) => prev + 1);
      };      
      

  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[600px]">
        <img
            src={heroImage}
            alt="Hotel"
            className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Booking box positioned inside hero */}
        <div className="absolute left-1/2 bottom-[-64px] transform -translate-x-1/2 w-full px-4">
            <section className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-md text-center">
            <h2 className="text-2xl font-heading mb-2">Dream, Book, Escape.</h2>
            <p className="text-textGray">
                Check to see if your dream venue is available!
            </p>
            <div className="mt-4 bg-background py-10 text-textGray italic">
                Booking availability component placeholder
            </div>
            </section>
        </div>
        </section>


        {/* Spacer after overlap */}
        <div className="bg-background pt-32 pb-48 min-h-[80vh]">
        <VenueList venues={venues} layout="default" />

        {hasMore && (
            <div className="flex justify-center mt-8">
            <button
                onClick={handleLoadMore}
                className="bg-green text-white px-6 py-2 rounded hover:bg-opacity-90 border-2 border-orange"
                >
                Load More
                </button>

            </div>
        )}
        </div>
    </>
  );
}

export default Home;
