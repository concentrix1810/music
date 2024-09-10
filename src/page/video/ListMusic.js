import React from "react";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { motion } from "framer-motion";

const ListMusic = ({
  filteredAudios,
  currentVideoIndex,
  handleAudioSelect,
  isPlaying,
  playCounts,
  playlistItemRefs,
}) => {
  return (
    <div className="playlist" style={{ marginTop: "16px" }}>
      <h5>
        List Music - <span>Have a nice day. Enjoy the music. 😉</span>
      </h5>
      <ul className="row">
        {filteredAudios.map((audio, index) => (
          <li
            key={index}
            className={`col-sm-6 col-lg-3 col-12 ${
              index === currentVideoIndex ? "active" : ""
            }`}
            onClick={() => handleAudioSelect(index)}
            ref={(el) => (playlistItemRefs.current[index] = el)}
          >
            <div className="audio-info">
              {playCounts[index] >= 3 && (
                <span className="heart" title="Do you like this song?">
                  ❤️
                </span>
              )}
              <span style={{ marginLeft: "10px" }}>{audio.name}</span>
            </div>
            {index === currentVideoIndex && isPlaying && (
              <motion.div
                className="music-wave"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <BsFillVolumeUpFill size={24} color="blueviolet" />
              </motion.div>
            )}
          </li>
        ))}
      </ul>
      <span>Copyright by CONCENTRIX ❤</span>
    </div>
  );
};

export default ListMusic;
