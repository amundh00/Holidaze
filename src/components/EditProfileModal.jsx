import React, { useState } from "react";

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar?.url || "");
  const [avatarAlt, setAvatarAlt] = useState(profile.avatar?.alt || "");
  const [bannerUrl, setBannerUrl] = useState(profile.banner?.url || "");
  const [bannerAlt, setBannerAlt] = useState(profile.banner?.alt || "");
  const [venueManager, setVenueManager] = useState(profile.venueManager || false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProfile = {
      name,
      bio,
      avatar: { url: avatarUrl, alt: avatarAlt },
      banner: { url: bannerUrl, alt: bannerAlt },
      venueManager,
    };

    onSave(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-[#00473E]">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Rediger Navn */}
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Rediger Bio */}
          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              rows="3"
            />
          </div>

          {/* Bytte profil bilde */}
          <div>
            <label className="text-sm font-medium text-gray-700">Profile image (URL)</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
            <input
              type="text"
              value={avatarAlt}
              onChange={(e) => setAvatarAlt(e.target.value)}
              placeholder="Alt-tekst"
              className="w-full border border-gray-200 rounded px-3 py-2 mt-2 text-sm"
            />
          </div>

          {/* Bytte banner PS banner brukes ikke i min app */}
          <div>
            <label className="text-sm font-medium text-gray-700">Banner image (URL)</label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
            <input
              type="text"
              value={bannerAlt}
              onChange={(e) => setBannerAlt(e.target.value)}
              placeholder="Alt-tekst"
              className="w-full border border-gray-200 rounded px-3 py-2 mt-2 text-sm"
            />
          </div>

          {/* Vil man være venuemanager boolean? */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 font-medium">I will list venues</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={venueManager}
                onChange={() => setVenueManager(!venueManager)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange" />
            </label>
          </div>

          {/* Knapper for og avbryte eller lagre endringer */}
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
              className="px-4 py-2 rounded bg-[#00473E] text-white hover:bg-[#033b33] text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
