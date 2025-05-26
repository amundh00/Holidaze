import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaWifi, FaParking, FaUtensils, FaPaw, FaStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import BookingModal from "../components/BookingModal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow cursor-pointer z-10 hover:bg-gray-200"
    onClick={onClick}
  >
    <FaChevronRight className="text-gray-800 text-lg" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow cursor-pointer z-10 hover:bg-gray-200"
    onClick={onClick}
  >
    <FaChevronLeft className="text-gray-800 text-lg" />
  </div>
);

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
      .then(({ data }) => {
        console.log("Media-data:", data.media);
        setVenue(data);
      })
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

  const { lat, lng } = venue.location || {};

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="bg-[#F3EFEA] min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 shadow space-y-6">
        <div className="w-full overflow-hidden rounded-lg relative">
          {venue.media?.length > 1 ? (
            <Slider {...settings}>
              {venue.media.map((media, index) => (
                <div key={index}>
                  <img
                    src={media.url}
                    alt={media.alt || `Image ${index + 1}`}
                    className="w-full h-[500px] object-cover rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src={venue.media?.[0]?.url || "https://placehold.co/1200x800?text=No+Image"}
              alt={venue.name}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[#00473E] mb-1">{venue.name}</h1>

          {venue.rating !== null && (
            <div className="flex items-center gap-1 text-orange-500 font-medium text-lg mb-3">
              <FaStar className="text-xl" />
              <span>{venue.rating.toFixed(1)}</span>
            </div>
          )}

          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{venue.description}</p>

          <div className="text-gray-700 mb-4">
            <p><span className="font-medium">Price per night:</span> €{venue.price}</p>
            <p><span className="font-medium">Max Guests:</span> {venue.maxGuests}</p>
          </div>

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
        </div>

        <div className="h-60 w-full border border-gray-300 rounded-lg">
          {lat && lng && lat !== 0 && lng !== 0 ? (
            <MapContainer
              center={[lat, lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
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
  );
};

export default VenueDetails;
