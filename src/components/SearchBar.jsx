// søke felt komponenet

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="w-full max-w-md mx-auto mb-6">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search venues..."
      className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8358] focus:border-[#FF8358] text-gray-700"
    />
  </div>
);

export default SearchBar;
