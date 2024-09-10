import React from "react";

const SeekBar = ({ playedSeconds, duration, handleSeek }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className="seek-bar">
      <span>{formatTime(playedSeconds)}</span>
      <input
        id="seek"
        type="range"
        min="0"
        max={duration}
        step="0.1"
        value={playedSeconds}
        onChange={handleSeek}
        className="seek-slider"
      />
      <span className="seek-time">{formatTime(duration)}</span>
    </div>
  );
};

export default SeekBar;
