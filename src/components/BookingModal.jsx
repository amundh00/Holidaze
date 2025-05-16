import React, { useEffect, useState } from "react";
import { format, eachDayOfInterval } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./custom-datepicker.css";

const BookingModal = ({ isOpen, onClose, venue }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("");

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");
  const currentUser = localStorage.getItem("user")?.toLowerCase();

  const normalize = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  useEffect(() => {
    if (!venue?.id) return;

    const fetchBookings = async () => {
      if (!venue?.id) return;

      const url = `${API}/holidaze/venues/${venue.id}/bookings`;

      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.message || "Could not fetch bookings");
        }

        const { data } = await res.json();

        const dates = data.flatMap((booking) =>
          eachDayOfInterval({
            start: normalize(booking.dateFrom),
            end: normalize(booking.dateTo),
          })
        );

        setBookedDates(dates);
      } catch (err) {
        setBookedDates([]);
      }
    };

    fetchBookings();
  }, [venue?.id]);

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setStatus("❌ Velg gyldige datoer.");
      return;
    }

    if (venue.owner?.name?.toLowerCase() === currentUser) {
      setStatus("❌ Du kan ikke booke ditt eget venue.");
      return;
    }

    const selectedDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const isOverlap = selectedDays.some((day) =>
      bookedDates.some((booked) => booked.toDateString() === day.toDateString())
    );

    if (isOverlap) {
      setStatus("❌ Valgte datoer er allerede booket. Prøv et annet intervall.");
      return;
    }

    const booking = {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests: 1,
      venueId: venue.id,
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
        const errorData = await res.json();
        throw new Error(errorData?.message || "Booking failed.");
      }

      setStatus("✅ Booking successful!");
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      setStatus("❌ " + err.message);
    }
  };

  const isDateDisabled = (date) =>
    bookedDates.some((booked) => booked.toDateString() === normalize(date).toDateString());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#00473E] mb-4">Book {venue.name}</h2>

        <div className="mb-4">
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            excludeDates={bookedDates}
            dayClassName={(date) => {
              const isBooked = bookedDates.some(
                (d) => d.toDateString() === date.toDateString()
              );
              if (isBooked) console.log("📌 Marked as booked:", date.toDateString());
              return isBooked ? "booked-date" : undefined;
            }}
          />
        </div>

        {startDate && endDate && (
          <p className="text-sm text-gray-700 mt-2">
            Fra: {format(startDate, "PPP")} → Til: {format(endDate, "PPP")}
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
