import React, { useState, useRef, useEffect } from "react";
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [volume, setVolume] = useState(0.3);
  const [replay, setReplay] = useState(false);
  const [random, setRandom] = useState(false);
  const audioRef = useRef(null);
  const playlistItemRefs = useRef([]);
  const [isAudioPaused, setIsAudioPaused] = useState(false);

  const filteredAudios = audios.filter((audio) =>
    audio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const savedReplay = localStorage.getItem("replay");
    const savedRandom = localStorage.getItem("random");
    setReplay(savedReplay === "true");
    setRandom(savedRandom === "true");
  }, []);

  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume)); // Restore volume from localStorage
    }
  }, []);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("volume", newVolume); // Save volume to localStorage
  };

  const handleAudioSelect = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
    setPlayedSeconds(0);
    if (audioRef.current) {
      audioRef.current.seekTo(0, "seconds");
    }
    setIsAudioPaused(false);
    localStorage.setItem("currentVideoIndex", index); // Lưu chỉ số bài hát vào localStorage
  };

  const scrollToCurrentAudio = () => {
    const savedIndex = localStorage.getItem("currentVideoIndex");
    const index =
      savedIndex !== null ? parseInt(savedIndex, 10) : currentVideoIndex;

    if (playlistItemRefs.current[index]) {
      playlistItemRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "3") {
        scrollToCurrentAudio(); // Trigger scrolling when "3" is pressed
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAudioEnded = () => {
    let nextIndex;
    if (replay) {
      nextIndex = currentVideoIndex;
      audioRef.current.seekTo(0, "seconds");
      setPlayedSeconds(0);
      setIsPlaying(true);
    } else if (random) {
      nextIndex = Math.floor(Math.random() * audios.length);
      setCurrentVideoIndex(nextIndex);
      setPlayedSeconds(0);
      setIsPlaying(true);
    } else {
      nextIndex = (currentVideoIndex + 1) % audios.length;
      setCurrentVideoIndex(nextIndex);
      setPlayedSeconds(0);
      setIsPlaying(true);
    }
    localStorage.setItem("currentVideoIndex", nextIndex); // Lưu chỉ số bài hát tiếp theo vào localStorage
  };

  useEffect(() => {
    const savedIndex = localStorage.getItem("currentVideoIndex");
    if (savedIndex !== null) {
      setCurrentVideoIndex(parseInt(savedIndex, 10)); // Khôi phục bài hát đã lưu
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "ArrowUp") {
        event.preventDefault();
        setVolume((prevVolume) => {
          const newVolume = Math.min(prevVolume + 0.1, 1);
          localStorage.setItem("volume", newVolume); // Save new volume to localStorage
          return newVolume;
        });
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        setVolume((prevVolume) => {
          const newVolume = Math.max(prevVolume - 0.1, 0);
          localStorage.setItem("volume", newVolume); // Save new volume to localStorage
          return newVolume;
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleReplay = () => {
    setReplay((prev) => {
      const newReplay = !prev;
      localStorage.setItem("replay", newReplay); // Save replay state to localStorage
      return newReplay;
    });
  };

  const handleRandom = () => {
    setRandom((prev) => {
      const newRandom = !prev;
      localStorage.setItem("random", newRandom); // Save random state to localStorage
      return newRandom;
    });
  };

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
            <h5 onClick={scrollToCurrentAudio} style={{ cursor: "pointer" }}>
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
            handlePlayPause={() => setIsPlaying(!isPlaying)}
            handlePrevious={() =>
              setCurrentVideoIndex((prevIndex) =>
                prevIndex === 0 ? audios.length - 1 : prevIndex - 1
              )
            }
            handleNext={() =>
              setCurrentVideoIndex(
                (prevIndex) => (prevIndex + 1) % audios.length
              )
            }
            replay={replay}
            handleReplay={handleReplay}
            random={random}
            handleRandom={handleRandom}
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
          isAudioPaused={isAudioPaused}
          playAudio={() => setIsPlaying(true)}
          pauseAudio={() => setIsPlaying(false)}
          playlistItemRefs={playlistItemRefs}
        />
      </div>
    </>
  );
};

export default Video;
