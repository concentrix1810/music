import React from "react";

const VolumeControlSlider = ({ volume, handleVolumeChange }) => {
  const volumePercentage = Math.round(volume * 100);

  return (
    <div className="volume-control ">
      <label htmlFor="volume">Volume:</label>
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
