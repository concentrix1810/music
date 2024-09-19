import React, { useState, useEffect, useRef } from "react";
import { audios } from "./audioFiles"; // Make sure this import is correct
import { FaTimes, FaHistory, FaTrash } from "react-icons/fa"; // Import FaTrash icon

const SearchInput = ({
  searchTerm,
  setSearchTerm,
  filteredAudios,
  onSelectAudio,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);

  // Load search history from localStorage when the component mounts
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  // Save the selected audio to localStorage and update the search history
  const handleSuggestionClick = (audio) => {
    const index = audios.findIndex((item) => item.name === audio.name);
    setSearchTerm(audio.name);
    onSelectAudio(index);
    setShowSuggestions(false);

    // Update search history in localStorage
    const updatedHistory = [
      audio.name,
      ...searchHistory.filter((item) => item !== audio.name),
    ].slice(0, 5); // Limit to 5 entries
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // Function to delete a search history item
  const handleDeleteHistoryItem = (historyItem, event) => {
    event.stopPropagation(); // Prevent click event from propagating
    const updatedHistory = searchHistory.filter((item) => item !== historyItem);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // Hide suggestions when clicking outside
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  // Show suggestions when the input is focused
  const handleFocus = () => {
    setShowSuggestions(true);
  };

  // Clear the search input
  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
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

  return (
    <>
      <div className="search-wrapper" ref={searchRef}>
        <div className="search-container">
          <div className="search-input-container">
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
          </div>
          <div
            className={`search-suggestions ${showSuggestions ? "visible" : ""}`}
          >
            {/* Display search history if no current search term */}
            {!searchTerm && searchHistory.length > 0 ? (
              searchHistory.map((historyItem, index) => {
                // const isLast7 = index <= searchHistory.length - 3;
                const isFirst3 = index < 3;
                return (
                  <div
                    key={index}
                    className="search-suggestion"
                    onClick={() => handleSuggestionClick({ name: historyItem })}
                  >
                    {/* Add the FaHistory icon with conditional opacity for the last 7 items */}
                    <FaHistory
                      title="Recent searches"
                      style={{
                        marginRight: "12px",
                        opacity: isFirst3 ? 1 : 0.5, // Fully opaque for the first 3 items, dimmed for the rest
                      }}
                    />
                    {formatSuggestion(historyItem)}

                    {/* Add FaTrash icon to delete history item */}
                    <FaTrash
                      title="Delete"
                      className="delete-icon"
                      onClick={(event) =>
                        handleDeleteHistoryItem(historyItem, event)
                      }
                    />
                  </div>
                );
              })
            ) : searchTerm && filteredAudios.length > 0 ? (
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
