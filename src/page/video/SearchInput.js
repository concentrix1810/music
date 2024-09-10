import React from "react";

const SearchInput = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for music..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
          className="search-input"
        />
      </div>
      <div className="playlist" style={{ marginTop: "10px" }}>
        <a
          href="https://drive.google.com/drive/u/1/folders/1EEIo1ieVHgBy8EZdpSYizcomCJ_OwWFq"
          target="blank"
        >
          Long Playlist
        </a>
      </div>
    </>
  );
};

export default SearchInput;
