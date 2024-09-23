import React, { useState, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import SearchInput from "./SearchInput";
import VolumeControlSlider from "./VolumeControlSlider";
import SeekBar from "./SeekBar";
import TrackControls from "./TrackControls";
import ListMusic from "./ListMusic";
import { audios } from "./audioFiles";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import "./style.css";

const Video = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => {
    const savedIndex = localStorage.getItem("currentVideoIndex");
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("volume");
    return savedVolume !== null ? parseFloat(savedVolume) : 0.3;
  });

  const [replay, setReplay] = useState(() => {
    const savedReplay = localStorage.getItem("replay");
    return savedReplay === "true";
  });

  const [random, setRandom] = useState(() => {
    const savedRandom = localStorage.getItem("random");
    return savedRandom === "true";
  });

  const audioRef = useRef(null);
  const playlistItemRefs = useRef([]);

  const filteredAudios = audios.filter((audio) =>
    audio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("volume", newVolume);
  }, []);

  const handleAudioSelect = useCallback((index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
    setPlayedSeconds(0);
    audioRef.current?.seekTo(0, "seconds");
    localStorage.setItem("currentVideoIndex", index);
  }, []);

  const handleAudioEnded = useCallback(() => {
    if (replay) {
      audioRef.current.seekTo(0, "seconds"); // Seek to the beginning
      setIsPlaying(true); // Ensure it starts playing
      return; // Don't change the index
    }

    let nextIndex = random
      ? Math.floor(Math.random() * audios.length)
      : (currentVideoIndex + 1) % audios.length;

    setCurrentVideoIndex(nextIndex);
    setPlayedSeconds(0);
    setIsPlaying(true);
    localStorage.setItem("currentVideoIndex", nextIndex);
  }, [currentVideoIndex, replay, random]);

  const pauseAudio = () => setIsPlaying(false);
  const playAudio = () => setIsPlaying(true);

  return (
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

      <div className="boxvideo">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredAudios={filteredAudios}
          onSelectAudio={handleAudioSelect}
        />

        <VolumeControlSlider
          volume={volume}
          handleVolumeChange={handleVolumeChange}
        />

        <div className="playlist">
          <h5
            onClick={() =>
              playlistItemRefs.current[currentVideoIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
            style={{ cursor: "pointer" }}
          >
            {audios[currentVideoIndex]?.name || "None"}
            {isPlaying ? (
              <AiOutlineArrowUp
                style={{ marginLeft: "8px", color: "#0056b3" }}
              />
            ) : (
              <AiOutlineArrowDown
                style={{ marginLeft: "8px", color: "blueviolet" }}
              />
            )}
          </h5>
        </div>

        <TrackControls
          isPlaying={isPlaying}
          handlePlayPause={() => setIsPlaying((prev) => !prev)}
          handlePrevious={() =>
            setCurrentVideoIndex((prev) =>
              prev === 0 ? audios.length - 1 : prev - 1
            )
          }
          handleNext={() =>
            setCurrentVideoIndex((prev) => (prev + 1) % audios.length)
          }
          replay={replay}
          handleReplay={() => {
            setReplay((prev) => !prev);
            if (!replay) audioRef.current.seekTo(0, "seconds"); // Seek to the start when enabling replay
          }}
          random={random}
          handleRandom={() => setRandom((prev) => !prev)}
        />

        <SeekBar
          playedSeconds={playedSeconds}
          duration={audioRef.current?.getDuration() || 0}
          handleSeek={(e) =>
            audioRef.current.seekTo(parseFloat(e.target.value), "seconds")
          }
        />
      </div>

      <ListMusic
        audios={audios}
        filteredAudios={filteredAudios}
        currentVideoIndex={currentVideoIndex}
        handleAudioSelect={handleAudioSelect}
        isPlaying={isPlaying}
        playAudio={playAudio}
        pauseAudio={pauseAudio}
        playlistItemRefs={playlistItemRefs}
      />
    </div>
  );
};

export default Video;
