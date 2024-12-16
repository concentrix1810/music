import React, { useEffect, useRef, useState } from "react";
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
  const [greeting, setGreeting] = useState("");
  const audioRefs = useRef([]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const holidays = [
    { month: 1, day: 1, message: "Chúc mừng năm mới! 🎉" },
    { month: 2, day: 14, message: "Chúc mừng ngày lễ tình nhân! 💕" },
    { month: 2, day: 10, message: "Chúc mừng năm mới âm lịch! 🧧" },
    { month: 3, day: 8, message: "Chúc mừng ngày Quốc tế Phụ nữ! 💐" },
    { month: 4, day: 30, message: "Chúc mừng ngày Giải phóng miền Nam! 🇻🇳" },
    { month: 5, day: 1, message: "Chúc mừng ngày Quốc tế Lao động! 💪" },
    { month: 6, day: 1, message: "Chúc mừng ngày Quốc tế Thiếu nhi! 🎈" },
    { month: 9, day: 2, message: "Chúc mừng Quốc khánh Việt Nam! 🇻🇳" },
    { month: 10, day: 20, message: "Chúc mừng ngày Phụ nữ Việt Nam! 🌹" },
    { month: 11, day: 20, message: "Chúc mừng ngày Nhà giáo Việt Nam! 📚" },
    { month: 12, day: 25, message: "Chúc mừng Giáng Sinh! 🎄" },
    { month: 12, day: 31, message: "Chúc mừng đêm Giao thừa! 🕛" },
  ];

  const getNextHoliday = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const today = new Date(currentYear, now.getMonth(), now.getDate());

    const upcomingHolidays = holidays.map(({ month, day, message }) => {
      const holidayDate = new Date(currentYear, month - 1, day);
      if (holidayDate < today) {
        holidayDate.setFullYear(currentYear + 1); // Chuyển sang năm sau nếu ngày lễ đã qua
      }
      return { date: holidayDate, message };
    });

    upcomingHolidays.sort((a, b) => a.date - b.date);

    return upcomingHolidays[0];
  };

  useEffect(() => {
    const nextHoliday = getNextHoliday();
    setGreeting(nextHoliday.message);

    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = nextHoliday.date - now;

      if (timeDiff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

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
      <div className="countdown-container">
        <h5>Chỉ còn</h5>
        <div className="countdown">
          <div className="countdown-item">
            <p>{timeLeft.days}</p>
            <span>Ngày</span>
          </div>
          <div className="countdown-item">
            <p>{timeLeft.hours}</p>
            <span>Giờ</span>
          </div>
          <div className="countdown-item">
            <p>{timeLeft.minutes}</p>
            <span>Phút</span>
          </div>
          <div className="countdown-item">
            <p>{timeLeft.seconds}</p>
            <span>Giây</span>
          </div>
        </div>
        <h5>
          <span>{greeting}</span> - Hãy đếm ngược cùng những giai điệu tuyệt
          vời! 🎶
        </h5>
      </div>
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
