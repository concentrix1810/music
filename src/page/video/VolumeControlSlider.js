import React from "react";
import { FaVolumeUp } from "react-icons/fa";

const VolumeControlSlider = ({ volume, handleVolumeChange }) => {
  const volumePercentage = Math.round(volume * 100);

  return (
    <div className="volume-control ">
      <FaVolumeUp size={24} style={{ color: "blueviolet" }} />
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
