import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BookingModal = ({ isOpen, onClose, venue }) => {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [disabledRanges, setDisabledRanges] = useState([]);

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  // Hent bookinger for og lage en liste over datoer som er opptatt
  useEffect(() => {
    if (!isOpen || !venue?.id) {
      setDisabledRanges([]);
      return;
    }
    
    // Reset utilgjengelige datoer når en ny booking modal åpnes
    setDisabledRanges([]);
    
    fetch(`${API}/holidaze/venues/${venue.id}?_bookings=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        // Gjør om bookinger til utilgengelige datoer
        const bookings = json.data?.bookings || [];
        console.log(`Fetched ${bookings.length} bookings for venue ${venue.id}:`, venue.name);
        
        // LKag en liste over alle utilgjengelige datoer
        const disabledDatesArray = [];
        
        bookings.forEach((booking, index) => {
          const fromDate = new Date(booking.dateFrom);
          const toDate = new Date(booking.dateTo);
          
          console.log(`  Booking ${index + 1}:`, {
            from: booking.dateFrom,
            to: booking.dateTo,
            fromDate: fromDate.toDateString(),
            toDate: toDate.toDateString(),
          });
          
          // Generer en liste over alle datoer i bookingperioden
          let current = new Date(fromDate);
          current.setHours(0, 0, 0, 0); 
          
          const end = new Date(toDate);
          end.setHours(0, 0, 0, 0); 
          
          while (current <= end) {
            disabledDatesArray.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        
        console.log('Total disabled dates:', disabledDatesArray.length);
        console.log('Disabled dates:', disabledDatesArray.map(d => d.toDateString()));
        
        setDisabledRanges(disabledDatesArray);
      })
      .catch(err => {
        console.error('Failed to fetch venue bookings:', err);
        setDisabledRanges([]);
      });
  }, [isOpen, venue?.id, API, API_KEY, accessToken]);

  // Bruk useCallBack for og forhindere at funksjonen blir opprettet på nytt ved hver render
  const handleDateChange = useCallback((item) => {
    setRange(item.selection);
    setError(""); // Clear error when date changes
  }, []);

  const handleGuestsChange = useCallback((e) => {
    setGuests(Number(e.target.value));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { startDate, endDate } = range;
    if (!startDate || !endDate || endDate <= startDate) {
      setError("Vennligst velg en gyldig periode.");
      return;
    }

    if (guests < 1 || guests > venue.maxGuests) {
      setError(`Antall gjester må være mellom 1 og ${venue.maxGuests}.`);
      return;
    }

    const payload = {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
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
      setTimeout(() => {
        onClose();
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const dateRangeProps = useMemo(() => ({
    ranges: [range],
    onChange: handleDateChange,
    minDate: new Date(),
    disabledDates: disabledRanges, 
    moveRangeOnFirstSelection: false,
    showSelectionPreview: true,
    editableDateInputs: false,
    showDateDisplay: false,
  }), [range, handleDateChange, disabledRanges]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-[1000] inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-4">Book {venue?.name}</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Velg datoer</label>
              <DateRange {...dateRangeProps} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Antall gjester (maks {venue?.maxGuests})
              </label>
              <input
                type="number"
                min="1"
                max={venue?.maxGuests}
                value={guests}
                onChange={handleGuestsChange}
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