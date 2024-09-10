import React from "react";

const SearchInput = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for music..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;
