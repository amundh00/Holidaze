// Vise alle venuene som en VenueManger har laget
import { useState } from "react";
import EditVenueModal from "./EditVenueModal";
import SeeBookingsModal from "./SeeBookingsModal";

const MyVenues = ({ venues }) => {
  const [editingVenue, setEditingVenue] = useState(null);
  const [selectedVenueForBookings, setSelectedVenueForBookings] = useState(null);

  if (venues.length === 0) {
    return <p className="text-gray-500">Du har ikke lagt ut noen venues enda.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white shadow overflow-hidden">
            <img
              src={venue?.media?.[0]?.url || "https://via.placeholder.com/600x400"}
              alt={venue?.media?.[0]?.alt || "Venue image"}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="text-lg font-semibold text-[#4e392f] mb-2">{venue.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{venue.description}</p>
              <p className="text-sm text-gray-700 mb-2">
               {venue.price} EURO/Night — Max guests: {venue.maxGuests}
              </p>
              <button
                onClick={() => setEditingVenue(venue)}
                className="bg-[#00473E] text-white text-sm px-3 py-1 hover:bg-[#033b33] transition"
              >
                Rediger
              </button>
              <button
                onClick={() => setSelectedVenueForBookings(venue)}
                className="bg-orange text-white text-sm px-3 py-1 hover:bg-opacity-90 transition ml-2"
              >
                Se bookinger
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingVenue && (
        <EditVenueModal
          venue={editingVenue}
          onClose={() => setEditingVenue(null)}
          onSave={async (updatedData, id) => {
            try {
              const res = await fetch(`${import.meta.env.VITE_NOROFF_API_URL}/holidaze/venues/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
                },
                body: JSON.stringify(updatedData),
              });

              if (!res.ok) throw new Error("Kunne ikke oppdatere venue");

              alert("Venue oppdatert!");
              setEditingVenue(null);
            } catch (err) {
              alert("Feil: " + err.message);
            }
          }}
        />
      )}

      {selectedVenueForBookings && (
        <SeeBookingsModal
          venue={selectedVenueForBookings}
          onClose={() => setSelectedVenueForBookings(null)}
        />
      )}
    </>
  );
};

export default MyVenues;
