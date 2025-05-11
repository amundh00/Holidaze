import React, { useEffect, useState } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const BookingModal = ({ isOpen, onClose, venue }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedRange, setSelectedRange] = useState();
  const [status, setStatus] = useState("");

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");
  const customerName = localStorage.getItem("user");

  // Normalize a date to midnight
  const normalize = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Fetch booked dates
  useEffect(() => {
    if (!venue?.id) return;

    const url = `${API}/holidaze/venues/${venue.id}/bookings`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        const dates = data.flatMap((booking) =>
          eachDayOfInterval({
            start: normalize(booking.dateFrom),
            end: normalize(booking.dateTo),
          })
        );
        setBookedDates(dates);
      })
      .catch((err) => console.error("❌ Failed to load bookings", err));
  }, [venue]);

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedRange?.from || !selectedRange?.to) {
      setStatus("❌ Velg gyldige datoer.");
      return;
    }

    const booking = {
      dateFrom: selectedRange.from.toISOString(),
      dateTo: selectedRange.to.toISOString(),
      guests: 1,
      venueId: venue.id,
      customerName,
    };

    try {
      const res = await fetch(`${API}/holidaze/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(booking),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Booking failed.");
      }

      setStatus("✅ Booking successful!");
      setSelectedRange(undefined);
    } catch (err) {
      setStatus("❌ " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#00473E] mb-4">Book {venue.name}</h2>

        <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={(range) => {
                if (!range) return;
                const normalize = (date) => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d;
                };
                setSelectedRange({
                from: range.from ? normalize(range.from) : undefined,
                to: range.to ? normalize(range.to) : undefined,
                });
            }}
            modifiers={{ booked: bookedDates, disabled: bookedDates }}
            classNames={{
                day: "rdp-day", // required
                day_booked: "bg-gray-300 text-gray-500 cursor-not-allowed", // ✅ your style
                day_disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
            }}
            />

        {selectedRange?.from && selectedRange?.to && (
          <p className="text-sm text-gray-700 mt-2">
            Fra: {format(selectedRange.from, "PPP")} → Til: {format(selectedRange.to, "PPP")}
          </p>
        )}

        <button
          className="mt-6 w-full bg-[#00473E] text-white px-4 py-2 rounded hover:bg-[#033b33] transition"
          onClick={handleBooking}
        >
          Book now
        </button>

        {status && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">{status}</p>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
