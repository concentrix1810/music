// import React, { useEffect } from "react";
// import {
//   FaPlay,
//   FaPause,
//   FaBackward,
//   FaForward,
//   FaRandom,
// } from "react-icons/fa";
// import { AiOutlineRetweet } from "react-icons/ai";

// const TrackControls = ({
//   isPlaying,
//   handlePlayPause,
//   handlePrevious,
//   handleNext,
//   replay,
//   handleReplay,
//   random,
//   handleRandom,
// }) => {
//   // Listen for keydown event to trigger play/pause with Spacebar
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.code === "Space") {
//         event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
//         handlePlayPause();
//       } else if (event.code === "ArrowRight") {
//         handleNext();
//       } else if (event.code === "ArrowLeft") {
//         handlePrevious();
//       } else if (event.code === "Digit1") {
//         handleReplay(); // Toggle random mode with key 1
//       } else if (event.code === "Digit2") {
//         handleRandom(); // Toggle replay mode with key 2
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPlaying, random, replay]);
//   return (
//     <div className="track-controls">
//       <button onClick={handlePrevious} title="Previous">
//         <FaBackward size={24} />
//       </button>
//       <button onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"}>
//         {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
//       </button>
//       <button
//         onClick={handleReplay}
//         title={replay ? "Stop Replay" : "Replay"}
//         className={replay ? "active" : "inactive"}
//       >
//         <AiOutlineRetweet size={24} />
//       </button>
//       <button
//         onClick={handleRandom}
//         title={random ? "Stop Random" : "Random"}
//         className={random ? "active" : "inactive"}
//       >
//         <FaRandom size={20} />
//       </button>
//       <button onClick={handleNext} title="Next">
//         <FaForward size={24} />
//       </button>
//     </div>
//   );
// };

// export default TrackControls;

import React, { useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaBackward,
  FaForward,
  FaRandom,
} from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";

const TrackControls = ({
  isPlaying,
  handlePlayPause,
  handlePrevious,
  handleNext,
  replay,
  handleReplay,
  random,
  handleRandom,
}) => {
  // Listen for keydown event to trigger play/pause with Spacebar
  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;

      // Ignore keydown events if an input field or textarea is focused
      if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
        handlePlayPause();
      } else if (event.code === "ArrowRight") {
        handleNext();
      } else if (event.code === "ArrowLeft") {
        handlePrevious();
      } else if (event.code === "Digit1") {
        handleReplay(); // Toggle replay mode with key 1
      } else if (event.code === "Digit2") {
        handleRandom(); // Toggle random mode with key 2
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, random, replay]);

  return (
    <div className="track-controls">
      <button onClick={handlePrevious} title="Previous">
        <FaBackward size={24} />
      </button>
      <button onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
      </button>
      <button
        onClick={handleReplay}
        title={replay ? "Stop Replay" : "Replay"}
        className={replay ? "active" : "inactive"}
      >
        <AiOutlineRetweet size={24} />
      </button>
      <button
        onClick={handleRandom}
        title={random ? "Stop Random" : "Random"}
        className={random ? "active" : "inactive"}
      >
        <FaRandom size={20} />
      </button>
      <button onClick={handleNext} title="Next">
        <FaForward size={24} />
      </button>
    </div>
  );
};

export default TrackControls;
