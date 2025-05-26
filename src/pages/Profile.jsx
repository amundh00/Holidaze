import React, { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import ListVenueModal from "../components/ListVenueModal";
import MyBookings from "../components/MyBookings";
import MyVenues from "../components/MyVenues";
import { useNavigate } from "react-router-dom";



const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_NOROFF_API_URL;
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
  const username = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accessToken");
  const [isEditing, setIsEditing] = useState(false);
  const [showListVenueModal, setShowListVenueModal] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (!username || !accessToken) {
      navigate("/login");
    }
  }, [username, accessToken, navigate]);

  useEffect(() => {
  if (!username || !accessToken || !profile?.venueManager) return;

  const fetchVenuesWithOwner = async () => {
    try {
      const res = await fetch(`${API}/holidaze/profiles/${username}/venues?_bookings=true`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });


      if (!res.ok) throw new Error("Failed to load venues");
      const { data } = await res.json();

      // hent alle venues med eier
      const detailedVenues = await Promise.all(
        data.map((venue) =>
          fetch(`${API}/holidaze/venues/${venue.id}?_owner=true`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }).then((res) => res.ok ? res.json().then(({ data }) => data) : venue)
        )
      );

      setVenues(data);
    } catch (err) {
      console.error("Venue fetch error:", err.message);
    }
  };

  fetchVenuesWithOwner();
}, [username, accessToken, API, API_KEY, profile?.venueManager]);





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

  const handleUnbook = async (bookingId) => {
  const confirmed = confirm("Are you sure you want to cancel this booking?");
  if (!confirmed) return;

  try {
    const res = await fetch(`${API}/holidaze/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!res.ok) throw new Error("Failed to cancel booking");

    // Ta vekk booking fra listen
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  } catch (err) {
    alert("Could not cancel booking: " + err.message);
  }
};


  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!profile) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="bg-[#ece5dc] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-transparent p-8 text-center">
        {profile.avatar?.url ? (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "Avatar"}
            className="mx-auto mb-4 w-24 h-24 object-cover border rounded-full"
          />
        ) : (
          <div className="mx-auto mb-4 w-24 h-24 bg-gray-300" />
        )}

        <h1 className="text-xl font-semibold text-[#4e392f]">{profile.name}</h1>

        {/* Vis om bruker er VenueManager */}
        {profile.venueManager && (
          <div className="mt-1 mb-2">
            <span className="inline-block bg-orange text-white text-xs font-semibold px-3 py-1">
              Venue Manager
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">{profile.bio || "Biography"}</p>

        <div className="flex flex-col items-center gap-3 mb-6">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-[#2a5d53] text-white px-4 py-2 hover:bg-[#244e47] transition"
        >
          Edit Profile
        </button>

        {profile.venueManager && (
          <button
            onClick={() => setShowListVenueModal(true)}
            className="bg-orange text-white px-4 py-2 hover:bg-opacity-90 transition"
          >
            List a Venue
          </button>
        )}
      </div>


        {profile.venueManager && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-2 ${
                activeTab === "bookings"
                  ? "bg-[#00473E] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab("venues")}
              className={`px-4 py-2 ${
                activeTab === "venues"
                  ? "bg-[#00473E] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              My Venues
            </button>
          </div>
        )}

        {/* Hvis bruker ikke er venuemanager så vises ikke den tabben */}
        {!profile.venueManager && (
          <h2 className="text-lg font-medium text-gray-800 mb-4">My Bookings:</h2>
        )}

        {/* vis venuue manager tab */}
        {activeTab === "bookings" && (
          <MyBookings bookings={bookings} onUnbook={handleUnbook} />
        )}

        {activeTab === "venues" && profile.venueManager && (
          <MyVenues venues={venues} />
        )}

      </div>
      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
          onSave={async (updatedData) => {
          try {
            const res = await fetch(`${API}/holidaze/profiles/${username}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY,
              },
              body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const { data } = await res.json();
            setProfile(data);
          } catch (err) {
            alert("Feil ved oppdatering av profil: " + err.message);
          }
        }}
        />
      )}

      {showListVenueModal && (
      <ListVenueModal
        onClose={() => setShowListVenueModal(false)}
        onSave={async (venueData) => {
          try {
            const res = await fetch(`${API}/holidaze/venues`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY,
              },
              body: JSON.stringify(venueData),
            });

            if (!res.ok) throw new Error("Failed to list venue");

            alert("Venue listed successfully!");
          } catch (err) {
            alert("Error: " + err.message);
          }
        }}
      />
    )}
    </div>
  );
};

export default Profile;
