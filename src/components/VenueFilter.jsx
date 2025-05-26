// Filtreringskomponenet til venues
import { useState } from "react";

const VenueFilter = ({ onFilter }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleFilter = () => {
    onFilter({ checkIn, checkOut, guests: parseInt(guests) });
  };

  return (
    <div className="bg-white shadow-md p-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className="border p-2"
        placeholder="Check-in"
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className="border p-2"
        placeholder="Check-out"
      />
      <input
        type="number"
        min={1}
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        className="border p-2 w-20"
        placeholder="Guests"
      />
      <button
        onClick={handleFilter}
        className="bg-green text-white px-4 py-2"
      >
        Apply
      </button>
    </div>
  );
};

export default VenueFilter;
