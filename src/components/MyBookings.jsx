// For og vise bookingene til en bruker
import { useNavigate } from "react-router-dom";

const MyBookings = ({ bookings, onUnbook }) => {
  const navigate = useNavigate();

  if (bookings.length === 0) {
    return <p className="text-gray-500">Ingen kommende bookinger funnet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {bookings.map((booking) => {
        const venue = booking.venue;
        return (
          <div key={booking.id} className="bg-white shadow overflow-hidden">
            <img
              src={venue?.media?.[0]?.url || "https://via.placeholder.com/600x400"}
              alt={venue?.media?.[0]?.alt || "Venue image"}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="text-lg font-semibold text-[#4e392f] mb-2">
                {venue?.name || "Ukjent sted"}
              </h3>
              <div className="text-sm text-gray-600 mb-2 flex items-center justify-between">
                <span>{new Date(booking.dateFrom).toLocaleDateString()}</span>
                <span className="mx-1">→</span>
                <span>{new Date(booking.dateTo).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/venues/${venue.id}`)}
                  className="bg-[#00473E] text-white text-sm px-3 py-1 hover:bg-[#033b33] transition"
                >
                  Se details
                </button>
                <button
                  onClick={() => onUnbook(booking.id)}
                  className="bg-red-600 text-white text-sm px-3 py-1 hover:bg-red-700 transition"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;

