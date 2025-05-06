import { useEffect, useState } from "react";
import { fetchVenues } from "../utils/fetchData";
import VenueList from "../components/VenueList";
import heroImage from "../assets/images/HeroHotel.png";

function Home() {
    const [allVenues, setAllVenues] = useState([]);
    const [venues, setVenues] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [filtersActive, setFiltersActive] = useState(false);
    const limit = 12;

    useEffect(() => {
        const controller = new AbortController();

        async function loadVenues() {
            try {
                const data = await fetchVenues(
                    `sort=created&sortOrder=desc&page=${page}&limit=${limit}`,
                    { signal: controller.signal }
                );

                if (!Array.isArray(data?.data)) {
                    setHasMore(false);
                    return;
                }

                setAllVenues((prev) => {
                    const newIds = new Set(prev.map((v) => v.id));
                    const uniqueNew = data.data.filter((v) => !newIds.has(v.id));
                    return [...prev, ...uniqueNew];
                });

                if (!filtersActive) {
                    setVenues((prev) => {
                        const newIds = new Set(prev.map((v) => v.id));
                        const uniqueNew = data.data.filter((v) => !newIds.has(v.id));
                        return [...prev, ...uniqueNew];
                    });
                }

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

    const handleCheckAvailability = () => {
        if (!checkIn || !checkOut) return;

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        const filtered = allVenues.filter((venue) => {
            if (guests > venue.maxGuests) return false;
            if (!Array.isArray(venue.bookings) || venue.bookings.length === 0) return true;

            const hasConflict = venue.bookings.some((booking) => {
                const bookedFrom = new Date(booking.dateFrom);
                const bookedTo = new Date(booking.dateTo);
                return (
                    (checkInDate >= bookedFrom && checkInDate < bookedTo) ||
                    (checkOutDate > bookedFrom && checkOutDate <= bookedTo) ||
                    (checkInDate <= bookedFrom && checkOutDate >= bookedTo)
                );
            });

            return !hasConflict;
        });

        setVenues(filtered);
        setFiltersActive(true);
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
                    <section className="max-w-4xl mx-auto bg-white p-6 shadow-lg text-center">
                        <h2 className="text-3xl font-heading mb-2 text-green font-bold">Dream, Book, Escape.</h2>
                        <p className="text-textGray mb-6">Check to see if your dream venue is available!</p>
                        <div className="flex flex-wrap justify-center gap-6 items-end">
                            <div className="relative">
                                <label className="block text-sm mb-1 text-left">Check-in</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="border-b border-gray-400 py-1 px-2 w-40"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm mb-1 text-left">Check-out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="border-b border-gray-400 py-1 px-2 w-40"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 text-left">Guests</label>
                                <input
                                    type="number"
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    min={1}
                                    className="border-b border-gray-400 py-1 px-2 w-24"
                                />
                            </div>
                            <button
                                onClick={handleCheckAvailability}
                                className="bg-green text-white px-6 py-2 hover:bg-opacity-90 text-base"
                            >
                                Check availability
                            </button>
                        </div>
                    </section>
                </div>
            </section>

            {/* Spacer after overlap */}
            <div className="bg-background pt-32 pb-48 min-h-[80vh]">
                <VenueList venues={venues} layout="default" />

                {hasMore && !filtersActive && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleLoadMore}
                            className="bg-green text-white px-6 py-2 hover:bg-opacity-90 border-2 border-orange"
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
