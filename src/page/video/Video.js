import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import SearchInput from "./SearchInput";
import VolumeControlSlider from "./VolumeControlSlider";
import SeekBar from "./SeekBar";
import TrackControls from "./TrackControls";
import ListMusic from "./ListMusic";
import { audios } from "./audioFiles";
import "./style.css";

const Video = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [playCounts, setPlayCounts] = useState(Array(audios.length).fill(0));
  const [searchTerm, setSearchTerm] = useState("");
  const [volume, setVolume] = useState(0.3);
  const [replay, setReplay] = useState(false);
  const [random, setRandom] = useState(false);
  const audioRef = useRef(null);
  const playlistItemRefs = useRef([]);

  const filteredAudios = audios.filter((audio) =>
    audio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAudioSelect = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
    setPlayedSeconds(0);
    if (audioRef.current) {
      audioRef.current.seekTo(0, "seconds");
    }
  };

  const handleAudioEnded = () => {
    if (replay) {
      audioRef.current.seekTo(0, "seconds");
      setPlayedSeconds(0);
      setIsPlaying(true);
    } else if (random) {
      const randomIndex = Math.floor(Math.random() * audios.length);
      setCurrentVideoIndex(randomIndex);
      setPlayedSeconds(0);
      setIsPlaying(true);
    } else {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % audios.length);
      setPlayedSeconds(0);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "ArrowUp") {
        event.preventDefault(); // Prevent default arrow up behavior (scrolling)
        setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1)); // Increase volume
      } else if (event.code === "ArrowDown") {
        event.preventDefault(); // Prevent default arrow down behavior (scrolling)
        setVolume((prevVolume) => Math.max(prevVolume - 0.1, 0)); // Decrease volume
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  return (
    <>
      <div className="audio-player">
        <div className="audio-container">
          <ReactPlayer
            ref={audioRef}
            url={audios[currentVideoIndex]?.url}
            playing={isPlaying}
            volume={volume}
            onEnded={handleAudioEnded}
            onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
            width="100%"
            height="100%"
          />
        </div>

        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <VolumeControlSlider
          volume={volume}
          handleVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
        />

        <SeekBar
          playedSeconds={playedSeconds}
          duration={audioRef.current?.getDuration() || 0}
          handleSeek={(e) =>
            audioRef.current.seekTo(parseFloat(e.target.value), "seconds")
          }
        />

        <TrackControls
          isPlaying={isPlaying}
          handlePlayPause={() => setIsPlaying(!isPlaying)}
          handlePrevious={() =>
            setCurrentVideoIndex((prevIndex) =>
              prevIndex === 0 ? audios.length - 1 : prevIndex - 1
            )
          }
          handleNext={() =>
            setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % audios.length)
          }
          replay={replay}
          handleReplay={() => setReplay(!replay)}
          random={random}
          handleRandom={() => setRandom(!random)}
        />

        <ListMusic
          filteredAudios={filteredAudios}
          currentVideoIndex={currentVideoIndex}
          handleAudioSelect={handleAudioSelect}
          isPlaying={isPlaying}
          playCounts={playCounts}
          playlistItemRefs={playlistItemRefs}
        />
      </div>
    </>
  );
};

export default Video;
