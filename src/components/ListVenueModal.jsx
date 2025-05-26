import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const LocationPicker = ({ location, setLocation, reverseGeocode }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation((prev) => ({
        ...prev,
        lat,
        lng,
      }));
      reverseGeocode(lat, lng);
    },
  });

  return location.lat && location.lng ? (
    <Marker position={[location.lat, location.lng]} />
  ) : null;
};

const ListVenueModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrls, setMediaUrls] = useState([""]);
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [meta, setMeta] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  const [location, setLocation] = useState({
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "Europe",
    lat: 60.39,
    lng: 5.32,
  });

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      const address = data.address || {};
      setLocation((prev) => ({
        ...prev,
        city: address.city || address.town || address.village || "",
        country: address.country || "",
        address: data.display_name || "",
        zip: address.postcode || "",
      }));
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  };

  const toggleMeta = (key) => {
    setMeta((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeImage = (index) => {
    const newUrls = mediaUrls.filter((_, i) => i !== index);
    if (newUrls[newUrls.length - 1].trim() !== "") {
      newUrls.push("");
    }
    setMediaUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API = import.meta.env.VITE_NOROFF_API_URL;
    const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
    const accessToken = localStorage.getItem("accessToken");

    const venue = {
      name,
      description,
      media: mediaUrls
        .filter((url) => url.trim() !== "")
        .map((url) => ({
          url: url.trim(),
          alt: name.trim() || "Venue image",
        })),
      price: Number(price),
      maxGuests: Number(maxGuests),
      rating: 0,
      meta,
      location: {
        ...location,
        continent: location.continent || "Europe",
      },
    };

    try {
      const res = await fetch(`${API}/holidaze/venues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venue),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.[0]?.message || "Venue-oppretting feilet.");
      }

      onClose();
    } catch (err) {
      console.error("Feil ved innsending:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <h2 className="text-xl font-semibold mb-4 text-[#00473E]">List a New Venue</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Venue name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows="3"
            required
          />
          <label className="block text-sm font-medium text-gray-700">Image URLs</label>
          {mediaUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="url"
                placeholder={`Image URL ${index + 1}`}
                value={url}
                onChange={(e) => {
                  const newUrls = [...mediaUrls];
                  newUrls[index] = e.target.value;
                  setMediaUrls(newUrls);

                  if (index === mediaUrls.length - 1 && e.target.value.trim() !== "") {
                    setMediaUrls([...newUrls, ""]);
                  }
                }}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required={index === 0}
              />
              {mediaUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <input
            type="number"
            placeholder="Price in EUR/Night"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Max Guests"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(meta).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleMeta(key)}
                  className={`text-sm px-3 py-2 rounded border ${
                    meta[key]
                      ? "bg-orange text-white border-orange"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose location</label>
            <p className="text-xs text-gray-500 mb-2">Click on the map to choose location of venue.</p>

            <div className="h-60 w-full rounded overflow-hidden mb-2 border border-gray-300">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker
                  location={location}
                  setLocation={setLocation}
                  reverseGeocode={reverseGeocode}
                />
              </MapContainer>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="any"
                value={location.lat}
                onChange={(e) =>
                  setLocation((prev) => ({ ...prev, lat: parseFloat(e.target.value) }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Latitude"
              />
              <input
                type="number"
                step="any"
                value={location.lng}
                onChange={(e) =>
                  setLocation((prev) => ({ ...prev, lng: parseFloat(e.target.value) }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Longitude"
              />
            </div>

            <p className="text-sm text-gray-500 mt-2">
              📍 {location.city}, {location.country} — {location.zip}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-orange text-white hover:bg-opacity-90 text-sm"
            >
              List Venue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListVenueModal;
