import { useEffect, useState } from "react";
import { format } from "date-fns";

// Komponent for å vise bookingene til et spesifikt venue
const SeeBookingsModal = ({ venue, onClose }) => {
  const [bookings, setBookings] = useState([]);        // Bookinger til venue
  const [loading, setLoading] = useState(true);        // Lastestatus

  // Miljøvariabler og tilgangstoken
  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");

  // Når venue endres, last inn bookingene
  useEffect(() => {
    // Hvis ingen bookinger finnes, sett tom liste og avslutt lasting
    if (!venue?.bookings) {
      setBookings([]);
      setLoading(false);
      return;
    }

    // Sorter bookingene etter startdato (eldst først)
    const sorted = [...venue.bookings].sort(
      (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
    );
    setBookings(sorted);    // Oppdater state
    setLoading(false);      // Ferdig lastet
  }, [venue]);

  // Funksjon for å slette (avbestille) en booking
  const handleCancel = async (bookingId) => {
    const confirmed = confirm("Are you sure you want to cancel the booking?");
    if (!confirmed) return;

    try {
      // Send DELETE-forespørsel til API for å slette bookingen
      const res = await fetch(`${API}/holidaze/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!res.ok) throw new Error("Could not cancel booking");

      // Fjern den slettede bookingen fra state
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      alert("Error with cancellation: " + err.message);
    }
  };

  return (
    // Modal-lag med bakgrunn og innhold
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        {/* Lukkeknapp */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        {/* Overskrift */}
        <h2 className="text-2xl font-bold text-[#00473E] mb-4">
          Bookinger for {venue.name}
        </h2>

        {/* Lasteindikator eller visning av bookinger */}
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <p><strong>Guest:</strong> {booking.customer?.name || "Unknown"}</p>
                <p>
                  <strong>From:</strong> {format(new Date(booking.dateFrom), "PPP")} →{" "}
                  <strong>To:</strong> {format(new Date(booking.dateTo), "PPP")}
                </p>
                <p><strong>Guests:</strong> {booking.guests}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SeeBookingsModal;
