import { useEffect, useState } from "react";
import { format } from "date-fns";

const SeeBookingsModal = ({ venue, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!venue?.bookings) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const sorted = [...venue.bookings].sort(
      (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
    );
    setBookings(sorted);
    setLoading(false);
  }, [venue]);

  const handleCancel = async (bookingId) => {
    const confirmed = confirm("Er du sikker på at du vil avbestille denne bookingen?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API}/holidaze/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!res.ok) throw new Error("Kunne ikke avbestille booking");

      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      alert("Feil ved avbestilling: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-[#00473E] mb-4">
          Bookinger for {venue.name}
        </h2>

        {loading ? (
          <p>Laster bookinger...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">Ingen bookinger enda.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <p><strong>Gjest:</strong> {booking.customer?.name || "Ukjent"}</p>
                <p>
                  <strong>Fra:</strong> {format(new Date(booking.dateFrom), "PPP")} →{" "}
                  <strong>Til:</strong> {format(new Date(booking.dateTo), "PPP")}
                </p>
                <p><strong>Gjester:</strong> {booking.guests}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SeeBookingsModal;
