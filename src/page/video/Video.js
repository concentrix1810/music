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
  const canvasRef = useRef(null);
  const playlistItemRefs = useRef([]);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [bufferLength, setBufferLength] = useState(null);
  const [isVisualizerInitialized, setIsVisualizerInitialized] = useState(false);

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
    localStorage.setItem("currentVideoIndex", index); // Save current audio index to localStorage
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
    localStorage.setItem("currentVideoIndex", nextIndex); // Save next audio index to localStorage
  };

  useEffect(() => {
    const savedIndex = localStorage.getItem("currentVideoIndex");
    if (savedIndex !== null) {
      setCurrentVideoIndex(parseInt(savedIndex, 10)); // Restore saved audio
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

  const initializeAudioVisualizer = (mediaElement) => {
    // Nếu visualizer đã được khởi tạo, không làm gì thêm
    if (isVisualizerInitialized) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyserNode = audioCtx.createAnalyser();

    const source = audioCtx.createMediaElementSource(mediaElement);
    source.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);

    analyserNode.fftSize = 256; // Số lượng bin tần số
    const bufferLen = analyserNode.frequencyBinCount; // Nửa fftSize
    const dataArr = new Uint8Array(bufferLen);

    setAudioContext(audioCtx);
    setAnalyser(analyserNode);
    setBufferLength(bufferLen);
    setDataArray(dataArr);
    setIsVisualizerInitialized(true); // Đánh dấu rằng visualizer đã được khởi tạo
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const barCount = Math.floor(bufferLength / 2); // Tăng số thanh
    const barWidth = (WIDTH / barCount) * 0.8; // Đặt độ rộng thanh

    let x = 0;

    // Loop over the frequency data array and draw each bar
    for (let i = 0; i < barCount; i++) {
      const barHeight = dataArray[i] * (HEIGHT / 255) * 0.6; // Chiều cao nhỏ hơn

      // Tạo gradient cho mỗi thanh
      const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, "#0056b3");
      gradient.addColorStop(1, "blueviolet");

      // Vẽ thanh
      ctx.fillStyle = gradient;
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight); // Sử dụng fillRect để đơn giản hơn

      // Optional: Thêm đường viền cho thanh
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; // Đường viền trắng
      ctx.lineWidth = 1; // Độ dày đường viền
      ctx.strokeRect(x, HEIGHT - barHeight, barWidth, barHeight); // Đường viền

      x += barWidth + 2; // Khoảng cách giữa các thanh
    }

    requestAnimationFrame(drawVisualizer); // Hoạt ảnh cho visualizer
  };

  useEffect(() => {
    if (analyser) {
      drawVisualizer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyser]);

  return (
    <>
      <div className="audio-player">
        <div className="audio-container">
          <ReactPlayer
            ref={audioRef}
            url={audios[currentVideoIndex]?.url}
            playing={isPlaying}
            volume={volume}
            onReady={() => {
              const mediaElement = audioRef.current.getInternalPlayer();
              initializeAudioVisualizer(mediaElement);
            }}
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

          <div className="playlist">
            <canvas ref={canvasRef} className="visualizer"></canvas>
          </div>
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
