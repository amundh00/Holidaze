import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const username = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!username || !accessToken) {
      setError("You must be logged in.");
      return;
    }

    const profileUrl = `${API}/holidaze/profiles/${username}`;
    fetch(profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load profile (HTTP ${res.status})`);
        return res.json();
      })
      .then(({ data }) => setProfile(data))
      .catch((err) => setError(err.message));
  }, [username, accessToken, API, API_KEY]);

  useEffect(() => {
    if (!username || !accessToken) return;

    const bookingsUrl = `${API}/holidaze/profiles/${username}/bookings?_venue=true`;
    fetch(bookingsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load bookings (HTTP ${res.status})`);
        return res.json();
      })
      .then(({ data }) => setBookings(data))
      .catch((err) => console.error("Booking fetch error:", err.message));
  }, [username, accessToken, API, API_KEY]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!profile) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="bg-[#ece5dc] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-transparent p-8 rounded text-center">
        {profile.avatar?.url ? (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "Avatar"}
            className="mx-auto mb-4 w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-gray-300" />
        )}

        <h1 className="text-xl font-semibold text-[#4e392f]">{profile.name}</h1>
        <p className="text-sm text-gray-600 mb-4">{profile.bio || "Biography"}</p>

        <button className="bg-[#2a5d53] text-white px-4 py-2 rounded-md mb-6 hover:bg-[#244e47] transition">
          Edit Profile
        </button>

        <h2 className="text-lg font-medium text-gray-800 mb-4">Upcoming bookings:</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">Ingen kommende bookinger funnet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const venue = booking.venue;
              return (
                <div key={booking.id} className="bg-white rounded shadow overflow-hidden">
                  <img
                    src={venue?.media?.[0]?.url || "https://via.placeholder.com/600x400"}
                    alt={venue?.media?.[0]?.alt || "Venue image"}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 text-left">
                    <h3 className="text-lg font-semibold text-[#4e392f] mb-2">{venue?.name || "Ukjent sted"}</h3>
                    <div className="text-sm text-gray-600 mb-2 flex items-center justify-between">
                      <span>{new Date(booking.dateFrom).toLocaleDateString()}</span>
                      <span className="mx-1">→</span>
                      <span>{new Date(booking.dateTo).toLocaleDateString()}</span>
                    </div>
                    <button className="bg-[#00473E] text-white text-sm px-3 py-1 rounded hover:bg-[#033b33] transition">
                      Se detaljer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
