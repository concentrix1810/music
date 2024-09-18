import React, { useState, useEffect, useRef } from "react";
import { audios } from "./audioFiles"; // Make sure this import is correct
import { FaTimes } from "react-icons/fa";

const SearchInput = ({
  searchTerm,
  setSearchTerm,
  filteredAudios,
  onSelectAudio,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const handleSuggestionClick = (audio) => {
    const index = audios.findIndex((item) => item.name === audio.name);
    setSearchTerm(audio.name);
    onSelectAudio(index);
    setShowSuggestions(false);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatSuggestion = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <>
      <div className="search-wrapper" ref={searchRef}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for music..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-button" onClick={handleClearSearch}>
              <FaTimes />
            </button>
          )}
          <div
            className={`search-suggestions ${showSuggestions ? "visible" : ""}`}
          >
            {searchTerm && filteredAudios.length > 0 ? (
              filteredAudios.map((audio, index) => (
                <div
                  key={index}
                  className="search-suggestion"
                  onClick={() => handleSuggestionClick(audio)}
                >
                  {formatSuggestion(audio.name)}
                </div>
              ))
            ) : (
              <div className="search-suggestion">No results found</div>
            )}
          </div>
        </div>
      </div>
      <div style={{ justifyContent: "center", display: "flex" }}>
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
