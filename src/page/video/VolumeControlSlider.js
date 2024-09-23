import React, { useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const VolumeControlSlider = ({ volume, handleVolumeChange }) => {
  const [prevVolume, setPrevVolume] = useState(volume);
  const volumePercentage = Math.round(volume * 100);

  const handleIconClick = () => {
    if (volume > 0) {
      // Mute the volume
      setPrevVolume(volume); // Save the current volume before muting
      handleVolumeChange({ target: { value: 0 } }); // Set volume to 0
    } else {
      // Restore the previous volume
      handleVolumeChange({ target: { value: prevVolume } });
    }
  };

  return (
    <div className="volume-control">
      {volume > 0 ? (
        <FaVolumeUp
          title="mute"
          size={24}
          style={{ color: "blueviolet", cursor: "pointer" }}
          onClick={handleIconClick}
        />
      ) : (
        <FaVolumeMute
          title="un mute"
          size={24}
          style={{ color: "blueviolet", cursor: "pointer" }}
          onClick={handleIconClick}
        />
      )}
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
      <span className="volume-percentage">{volumePercentage}%</span>
    </div>
  );
};

export default VolumeControlSlider;
