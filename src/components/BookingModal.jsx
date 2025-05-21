import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingModal = ({ isOpen, onClose, venue }) => {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!dateFrom || !dateTo) {
      setError("Vennligst velg både start- og sluttdato.");
      return;
    }

    const payload = {
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      guests,
      venueId: venue.id,
    };

    try {
      const res = await fetch(`${API}/holidaze/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.[0]?.message || "Booking feilet.");
      }

      setSuccess(true);
      onClose();
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-[1000] inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-4">Book {venue.name}</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fra dato</label>
              <DatePicker
                selected={dateFrom}
                onChange={(date) => setDateFrom(date)}
                selectsStart
                startDate={dateFrom}
                endDate={dateTo}
                minDate={new Date()}
                placeholderText="Velg startdato"
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Til dato</label>
              <DatePicker
                selected={dateTo}
                onChange={(date) => setDateTo(date)}
                selectsEnd
                startDate={dateFrom}
                endDate={dateTo}
                minDate={dateFrom || new Date()}
                placeholderText="Velg sluttdato"
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Antall gjester (maks {venue.maxGuests})</label>
              <input
                type="number"
                min="1"
                max={venue.maxGuests}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Booking vellykket!</p>}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00473E] text-white rounded hover:bg-[#033b33]"
              >
                Bekreft booking
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal;
