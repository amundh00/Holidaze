import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Konfigurer standard ikon for Leaflet slik at markørene vises riktig
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Komponent for å håndtere klikk på kartet og oppdatere posisjon
const LocationPicker = ({ location, setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation((prev) => ({
        ...prev,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      }));
    },
  });

  // Viser markør kun hvis både lat og lng er satt
  return location.lat && location.lng ? <Marker position={[location.lat, location.lng]} /> : null;
};

// Modal for å redigere informasjon om et venue
const EditVenueModal = ({ venue, onClose, onSave, onDelete }) => {
  // Opprett lokal state for hvert felt som kan redigeres
  const [name, setName] = useState(venue.name);
  const [description, setDescription] = useState(venue.description);
  const [price, setPrice] = useState(venue.price);
  const [maxGuests, setMaxGuests] = useState(venue.maxGuests);
  const [mediaUrl, setMediaUrl] = useState(venue.media?.[0]?.url || "");
  const [meta, setMeta] = useState(venue.meta || {});
  const [location, setLocation] = useState(venue.location || { lat: 60.39, lng: 5.32 });
  

  // Funksjon for å slå av/på metadata som wifi, parkering, osv.
  const toggleMeta = (key) => {
    setMeta((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = async () => {
  const confirmed = window.confirm("Er du sikker på at du vil slette dette venue?");
  if (!confirmed) return;

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const res = await fetch(`${API}/holidaze/venues/${venue.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.errors?.[0]?.message || "Sletting feilet.");
    }

    console.log("Venue slettet.");
    if (onDelete) onDelete(venue.id);
    onClose();
  } catch (err) {
    console.error("Feil ved sletting:", err);
    alert("Sletting feilet. Prøv igjen.");
  }
};


  // Når brukeren sender inn skjemaet lagres endringene og lukker modalen
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedVenue = {
      name,
      description,
      price: Number(price),
      maxGuests: Number(maxGuests),
      media: [{ url: mediaUrl, alt: name }],
      meta,
      location,
    };

    onSave(updatedVenue, venue.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-[#00473E]">Rediger Venue</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Beskrivelse"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows="3"
            required
          />
          <input
            type="url"
            placeholder="Bilde-URL"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Pris"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Maks gjester"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
            <div className="grid grid-cols-2 gap-2">
              {['wifi', 'parking', 'breakfast', 'pets'].map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleMeta(key)}
                  className={`text-sm px-3 py-2 rounded border ${meta[key] ? 'bg-orange text-white border-orange' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Velg lokasjon</label>
            <p className="text-xs text-gray-500 mb-2">Klikk på kartet for å plassere venue.</p>

            <div className="h-60 w-full rounded overflow-hidden mb-2 border border-gray-300">
              <MapContainer
                center={[location.lat || 60.39, location.lng || 5.32]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker location={location} setLocation={setLocation} />
              </MapContainer>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="any"
                value={location.lat}
                onChange={(e) => setLocation((prev) => ({ ...prev, lat: parseFloat(e.target.value) }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Latitude"
              />
              <input
                type="number"
                step="any"
                value={location.lng}
                onChange={(e) => setLocation((prev) => ({ ...prev, lng: parseFloat(e.target.value) }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Longitude"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Slett Venue
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#00473E] text-white hover:bg-[#033b33] text-sm"
            >
              Lagre endringer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenueModal;
