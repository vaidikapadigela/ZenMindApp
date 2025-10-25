import React, { useState, useRef, useEffect } from 'react';
import './Soundscape.css';
import './Breathing.css';

const soundOptions = [
  { name: 'Rain', src: '/sounds/rain.mp3' },
  { name: 'Waves', src: '/sounds/ocean.mp3' },
  { name: 'Forest', src: '/sounds/nature.mp3' },
  { name: 'Meditation', src: '/sounds/meditation.mp3' },
  { name: 'Aquarium', src: '/sounds/aqua.mp3' },
];

const videoOptions = [
  { name: 'Ocean', src: '/videos/ocean.mp4' },
  { name: 'Sun', src: '/videos/medi.mp4' },
  { name: 'Rain', src: '/videos/rain.mp4' },
  { name: 'Forest', src: '/videos/nature.mp4' },
];

const Soundscape = () => {
  const [selectedSound, setSelectedSound] = useState(soundOptions[0].src);
  const [selectedVideo, setSelectedVideo] = useState(videoOptions[0].src);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState('Inhale');
  const [circleSize, setCircleSize] = useState(100);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Breathing cycle logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prevPhase) => 
        prevPhase === 'Inhale' ? 'Hold' : 
        prevPhase === 'Hold' ? 'Exhale' : 
        'Inhale'
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Circle size animation
  useEffect(() => {
    if (phase === 'Inhale') {
      setCircleSize(200);
    } else if (phase === 'Exhale') {
      setCircleSize(100);
    }
  }, [phase]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => console.error('Video play error:', error));
      } else {
        videoRef.current.pause();
      }
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error('Audio play error:', error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedVideo, selectedSound]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="soundscape-container">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
        src={selectedVideo}
      >
        <source src={selectedVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={{ 
        display: 'flex', 
        width: '100%', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '80px',
        padding: '40px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left Side - Breathing Exercise */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="circle" style={{ width: circleSize, height: circleSize }}></div>
          <p className="instruction" style={{ 
            color: 'white',
            textShadow: '2px 2px 10px rgba(0, 0, 0, 0.8)',
            fontSize: '2rem',
            fontWeight: 600,
            marginTop: '2rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            opacity: 1,
            animation: 'none'
          }}>{phase}</p>
        </div>

        {/* Right Side - Sound Controls */}
        <div className="overlay" style={{ margin: 0, maxWidth: '400px' }}>
          <h1>Relax with Soothing Sounds</h1>

          <div className="selectors">
            <label>Choose a Sound:</label>
            <select onChange={(e) => setSelectedSound(e.target.value)} value={selectedSound}>
              {soundOptions.map((sound) => (
                <option key={sound.name} value={sound.src}>
                  {sound.name}
                </option>
              ))}
            </select>

            <label>Choose a Background:</label>
            <select onChange={(e) => setSelectedVideo(e.target.value)} value={selectedVideo}>
              {videoOptions.map((video) => (
                <option key={video.name} value={video.src}>
                  {video.name}
                </option>
              ))}
            </select>
          </div>

          <audio ref={audioRef} src={selectedSound} autoPlay loop />

          <button onClick={togglePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Soundscape;