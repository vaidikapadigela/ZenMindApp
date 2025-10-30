import React, { useState, useRef, useEffect } from "react";
import "./Soundscape.css";

const soundOptions = [
  { name: "Rain", src: "/sounds/rain.mp3" },
  { name: "Waves", src: "/sounds/ocean.mp3" },
  { name: "Forest", src: "/sounds/nature.mp3" },
  { name: "Meditation", src: "/sounds/meditation.mp3" },
  { name: "Aquarium", src: "/sounds/aqua.mp3" },
];

const videoOptions = [
  { name: "Ocean", src: "/videos/ocean.mp4" },
  { name: "Sun", src: "/videos/medi.mp4" },
  { name: "Rain", src: "/videos/rain.mp4" },
  { name: "Forest", src: "/videos/nature.mp4" },
];

const Soundscape = () => {
  const [selectedSound, setSelectedSound] = useState(soundOptions[0].src);
  const [selectedVideo, setSelectedVideo] = useState(videoOptions[0].src);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState("Inhale");
  const [circleSize, setCircleSize] = useState(150);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Breathing phase cycle
  useEffect(() => {
    const phases = ["Inhale", "Hold", "Exhale", "Hold"];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % phases.length;
      setPhase(phases[index]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Circle size animation
  useEffect(() => {
    if (phase === "Inhale") setCircleSize(220);
    else if (phase === "Exhale") setCircleSize(150);
  }, [phase]);

  // Audio & video play/pause logic
  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, selectedVideo, selectedSound]);

  const togglePlayPause = () => setIsPlaying((prev) => !prev);

  return (
    <div className="zen-soundscape-container">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="zen-background-video"
        src={selectedVideo}
      />

      <div className="zen-content">
        {/* Left Side - Breathing Animation */}
        <div className="zen-breathing-section">
          <div
            className="zen-breathing-circle"
            style={{ width: `${circleSize}px`, height: `${circleSize}px` }}
          ></div>
          <p className="zen-breathing-instruction">{phase}</p>
        </div>

        {/* Right Side - Soundscape Controls */}
        <div className="zen-control-panel">
          <h1 className="zen-title">Relax with Sound & Breath</h1>

          <div className="zen-selector-group">
            <label>Choose Sound:</label>
            <select
              onChange={(e) => setSelectedSound(e.target.value)}
              value={selectedSound}
            >
              {soundOptions.map((sound) => (
                <option key={sound.name} value={sound.src}>
                  {sound.name}
                </option>
              ))}
            </select>

            <label>Choose Background:</label>
            <select
              onChange={(e) => setSelectedVideo(e.target.value)}
              value={selectedVideo}
            >
              {videoOptions.map((video) => (
                <option key={video.name} value={video.src}>
                  {video.name}
                </option>
              ))}
            </select>
          </div>

          <audio ref={audioRef} src={selectedSound} autoPlay loop />

          <button className="zen-toggle-btn" onClick={togglePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Soundscape;
