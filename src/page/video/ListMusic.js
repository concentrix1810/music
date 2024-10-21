import React, { useRef } from "react";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { motion } from "framer-motion";

const ListMusic = ({
  audios,
  filteredAudios,
  currentVideoIndex,
  handleAudioSelect,
  isPlaying,
  playAudio,
  pauseAudio,
  playlistItemRefs,
}) => {
  const audioRefs = useRef([]);

  const scrollToIndex = (index) => {
    if (audioRefs.current[index]) {
      audioRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleClick = (index) => {
    if (currentVideoIndex === index) {
      if (isPlaying) {
        pauseAudio(); // Pause if it's currently playing
      } else {
        playAudio(); // Resume if it's currently paused
      }
    } else {
      scrollToIndex(index);
      handleAudioSelect(index);
      if (!isPlaying) {
        playAudio(); // Start playback if it's not currently playing
      }
    }
  };

  return (
    <div className="playlist" style={{ marginTop: "16px" }}>
      <h5>
        List Music - <span>Have a nice day. Enjoy the music. 😉</span>
      </h5>
      {/* <p>
        Nhân ngày 20/10, thay mặt các chàng trai GF Team, mình xin chúc toàn thể
        các chị em phụ nữ sức khỏe, sắc đẹp và công việc thì có thần tài dẫn lối
        83 86 nhó! Chúc một ngày vạn sự như ý, tỷ sự như mơ, triệu triệu bất ngờ
        và ngập tràn may mắn. Team GF mãi đỉnh, đỉnh mãi và không bao giờ hết
        đỉnh! 🎉💐🚀 Và để thêm phần vui vẻ, hôm nay các chàng trai chúng tôi sẽ
        khao mọi người một món quà nhỏ. Mọi người cứ thoải mái đặt nước đi ạ!
        🍹🥤
      </p> */}
      <ul className="row">
        {filteredAudios.map((audio, index) => {
          const actualIndex = audios.findIndex((a) => a.name === audio.name);
          const isActive = actualIndex === currentVideoIndex;

          return (
            <li
              key={index}
              ref={(el) => (playlistItemRefs.current[actualIndex] = el)} // Correctly use refs
              className={`col-sm-6 col-lg-3 col-12 ${isActive ? "active" : ""}`}
              onClick={() => handleClick(actualIndex)}
            >
              <div className="audio-info">
                <div className="song-row">
                  <span>{audio.name}</span>
                  <span>
                    {isActive && isPlaying && (
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
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <span>Copyright by CONCENTRIX ❤</span>
    </div>
  );
};

export default ListMusic;
