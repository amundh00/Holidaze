import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaWifi, FaParking, FaUtensils, FaPaw, FaStar } from "react-icons/fa";
import BookingModal from "../components/BookingModal";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { eachDayOfInterval } from "date-fns";

// Fikse leaflet ikonproblemer
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");

  const normalize = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [showModal]);

  useEffect(() => {
    const url = `${API}/holidaze/venues/${id}`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Venue fetch failed (HTTP ${res.status})`);
        return res.json();
      })
      .then(({ data }) => setVenue(data))
      .catch((err) => setError(err.message));
  }, [id, API, API_KEY, accessToken]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!id) return;
      const url = `${API}/holidaze/bookings?_venue=${id}`;

      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });

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
  }, [id]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!venue) return <div className="p-4">Laster sted...</div>;

  const image = venue.media?.[0]?.url || "https://placehold.co/1200x800?text=No+Image";
  const { lat, lng } = venue.location || {};

  return (
    <div className="bg-[#F3EFEA] min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-white p-8 shadow">
        {/* Bilde seksjon */}
        <div className="relative">
          <img src={image} alt={venue.name} className="w-full h-auto object-cover" />

          {venue.media?.filter((img) => img.url)?.length > 1 && (
            <>
              <button className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-2xl">
                ←
              </button>
              <button className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-2xl">
                →
              </button>
            </>
          )}
        </div>

        {/* Info seksjon */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-[#00473E]">{venue.name}</h1>
            {venue.rating !== null && (
              <div className="flex items-center gap-1 text-orange-500 font-medium text-lg">
                <FaStar className="text-xl" />
                <span>{venue.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-4">{venue.description}</p>

          <p className="text-gray-500 font-medium mb-1">Facilities:</p>
          <div className="flex space-x-4 text-orange text-xl mb-4">
            {venue.meta?.wifi && <FaWifi />} 
            {venue.meta?.parking && <FaParking />} 
            {venue.meta?.breakfast && <FaUtensils />} 
            {venue.meta?.pets && <FaPaw />} 
          </div>

          {venue.owner && (
            <div className="flex items-center gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Hosted by</p>
                <p className="text-base font-medium text-gray-800">{venue.owner.name}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#00473E] text-white px-6 py-3 hover:bg-[#033b33] transition"
          >
            Book this venue
          </button>
          <BookingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            venue={venue}
            bookedDates={bookedDates}
          />

          {/* Leaflet kart */}
          <div className="mt-6 h-60 w-full overflow-hidden border border-gray-300">
            {lat && lng && lat !== 0 && lng !== 0 ? (
              <MapContainer
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} />
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No location data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
