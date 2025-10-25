// import React, { useState, useEffect } from 'react';
// import { Clock, Palette, Play, Pause, RotateCcw } from 'lucide-react';
// import './MeditationTimer.css';

// const colorPalettes = {
//   sunset: {
//     name: 'sunset',
//     label: 'Sunset'
//   },
//   ocean: {
//     name: 'ocean',
//     label: 'Ocean'
//   },
//   forest: {
//     name: 'forest',
//     label: 'Forest'
//   },
//   twilight: {
//     name: 'twilight',
//     label: 'Twilight'
//   }
// };

// const timePresets = [
//   { label: '5 min', value: 5 },
//   { label: '15 min', value: 15 },
//   { label: '30 min', value: 30 }
// ];

// const MeditationTimer = () => {
//   const [selectedPalette, setSelectedPalette] = useState('sunset');
//   const [timeInMinutes, setTimeInMinutes] = useState(5);
//   const [timeLeft, setTimeLeft] = useState(timeInMinutes * 60);
//   const [isRunning, setIsRunning] = useState(false);
//   const [customTime, setCustomTime] = useState('');
//   const [isCustom, setIsCustom] = useState(false);

//   useEffect(() => {
//     let interval;
//     if (isRunning && timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0) {
//       setIsRunning(false);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning, timeLeft]);

//   const toggleTimer = () => {
//     setIsRunning(!isRunning);
//   };

//   const resetTimer = () => {
//     setIsRunning(false);
//     setTimeLeft(timeInMinutes * 60);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleTimePresetClick = (minutes) => {
//     setIsCustom(false);
//     setTimeInMinutes(minutes);
//     setTimeLeft(minutes * 60);
//     setIsRunning(false);
//     setCustomTime('');
//   };

//   const handleCustomTimeSubmit = (e) => {
//     e.preventDefault();
//     const customMinutes = parseInt(customTime);
//     if (customMinutes > 0 && customMinutes <= 180) {
//       setIsCustom(true);
//       setTimeInMinutes(customMinutes);
//       setTimeLeft(customMinutes * 60);
//       setIsRunning(false);
//     }
//   };

//   return (
//     <div className='timer-wrapper'>
//     <div className={`timer-container ${selectedPalette}`}>
//       <div className="timer-card">
//         <h1 className="timer-title">Meditation Timer</h1>

//         {/* Color Palette Selection */}
//         <div className="palette-section">
//           <div className="section-header">
//             <Palette size={20} />
//             <h2>Theme</h2>
//           </div>
//           <div className="palette-grid">
//             {Object.keys(colorPalettes).map((palette) => (
//               <button
//                 key={palette}
//                 onClick={() => setSelectedPalette(palette)}
//                 className={`palette-button ${palette} ${
//                   selectedPalette === palette ? 'selected' : ''
//                 }`}
//               >
//                 {colorPalettes[palette].label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Time Presets and Custom Time */}
//         <div className="duration-section">
//           <div className="section-header">
//             <Clock size={20} />
//             <h2>Duration</h2>
//           </div>
//           <div className="preset-grid">
//             {timePresets.map((preset) => (
//               <button
//                 key={preset.value}
//                 onClick={() => handleTimePresetClick(preset.value)}
//                 className={`preset-button ${
//                   timeInMinutes === preset.value && !isCustom ? 'active' : ''
//                 }`}
//               >
//                 {preset.label}
//               </button>
//             ))}
//           </div>

//           {/* Custom Time Input */}
//           <form onSubmit={handleCustomTimeSubmit} className="custom-time-form">
//             <input
//               type="number"
//               value={customTime}
//               onChange={(e) => setCustomTime(e.target.value)}
//               placeholder="Custom minutes"
//               min="1"
//               max="180"
//               className="custom-time-input"
//             />
//             <button
//               type="submit"
//               className={`custom-time-button ${isCustom ? 'active' : ''}`}
//             >
//               Set
//             </button>
//           </form>
//         </div>

//         {/* Timer Display */}
//         <div className="timer-display">
//           <div className="time-text">{formatTime(timeLeft)}</div>
          
//           <div className="timer-controls">
//             <button
//               onClick={toggleTimer}
//               className="control-button"
//             >
//               {isRunning ? <Pause size={24} /> : <Play size={24} />}
//             </button>
//             <button
//               onClick={resetTimer}
//               className="control-button"
//             >
//               <RotateCcw size={24} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default MeditationTimer;


// import React, { useState, useEffect } from 'react';
// import { Clock, Palette, Play, Pause, RotateCcw, X } from 'lucide-react';
// import './MeditationTimer.css';

// const colorPalettes = {
//   sunset: { name: 'sunset', label: 'Sunset' },
//   ocean: { name: 'ocean', label: 'Ocean' },
//   forest: { name: 'forest', label: 'Forest' },
//   twilight: { name: 'twilight', label: 'Twilight' }
// };

// const timePresets = [
//   { label: '5 min', value: 5 },
//   { label: '15 min', value: 15 },
//   { label: '30 min', value: 30 }
// ];

// const MeditationTimer = () => {
//   const [selectedPalette, setSelectedPalette] = useState('sunset');
//   const [timeInMinutes, setTimeInMinutes] = useState(5);
//   const [timeLeft, setTimeLeft] = useState(timeInMinutes * 60);
//   const [isRunning, setIsRunning] = useState(false);
//   const [customTime, setCustomTime] = useState('');
//   const [isCustom, setIsCustom] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   // sound
//   const sound = new Audio(
//     'https://cdn.pixabay.com/download/audio/2022/03/15/audio_16f5fa8d43.mp3?filename=bell-107173.mp3'
//   );

//   useEffect(() => {
//     let interval;
//     if (isRunning && timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0) {
//       setIsRunning(false);
//       sound.play();
//       setShowPopup(true);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning, timeLeft]);

//   const toggleTimer = () => setIsRunning(!isRunning);

//   const resetTimer = () => {
//     setIsRunning(false);
//     setTimeLeft(timeInMinutes * 60);
//     setShowPopup(false);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleTimePresetClick = (minutes) => {
//     setIsCustom(false);
//     setTimeInMinutes(minutes);
//     setTimeLeft(minutes * 60);
//     setIsRunning(false);
//     setCustomTime('');
//   };

//   const handleCustomTimeSubmit = (e) => {
//     e.preventDefault();
//     const customMinutes = parseInt(customTime);
//     if (customMinutes > 0 && customMinutes <= 180) {
//       setIsCustom(true);
//       setTimeInMinutes(customMinutes);
//       setTimeLeft(customMinutes * 60);
//       setIsRunning(false);
//     }
//   };

//   return (
//     <div className="timer-wrapper">
//       <div className={`timer-container ${selectedPalette}`}>
//         <div className="timer-card">
//           <h1 className="timer-title">Meditation Timer</h1>

//           {/* Theme Selector */}
//           <div className="palette-section">
//             <div className="section-header">
//               <Palette size={20} />
//               <h2>Theme</h2>
//             </div>
//             <div className="palette-grid">
//               {Object.keys(colorPalettes).map((palette) => (
//                 <button
//                   key={palette}
//                   onClick={() => setSelectedPalette(palette)}
//                   className={`palette-button ${palette} ${
//                     selectedPalette === palette ? 'selected' : ''
//                   }`}
//                 >
//                   {colorPalettes[palette].label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Time Settings */}
//           <div className="duration-section">
//             <div className="section-header">
//               <Clock size={20} />
//               <h2>Duration</h2>
//             </div>
//             <div className="preset-grid">
//               {timePresets.map((preset) => (
//                 <button
//                   key={preset.value}
//                   onClick={() => handleTimePresetClick(preset.value)}
//                   className={`preset-button ${
//                     timeInMinutes === preset.value && !isCustom ? 'active' : ''
//                   }`}
//                 >
//                   {preset.label}
//                 </button>
//               ))}
//             </div>

//             {/* Custom Input */}
//             <form onSubmit={handleCustomTimeSubmit} className="custom-time-form">
//               <input
//                 type="number"
//                 value={customTime}
//                 onChange={(e) => setCustomTime(e.target.value)}
//                 placeholder="Custom minutes"
//                 min="1"
//                 max="180"
//                 className="custom-time-input"
//               />
//               <button
//                 type="submit"
//                 className={`custom-time-button ${isCustom ? 'active' : ''}`}
//               >
//                 Set
//               </button>
//             </form>
//           </div>

//           {/* Timer */}
//           <div className="timer-display">
//             <div className="time-text">{formatTime(timeLeft)}</div>
//             <div className="timer-controls">
//               <button onClick={toggleTimer} className="control-button">
//                 {isRunning ? <Pause size={24} /> : <Play size={24} />}
//               </button>
//               <button onClick={resetTimer} className="control-button">
//                 <RotateCcw size={24} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pop-up Modal */}
//       {showPopup && (
//         <div className="popup-overlay" onClick={() => setShowPopup(false)}>
//           <div className="popup-card" onClick={(e) => e.stopPropagation()}>
//             <button className="popup-close" onClick={() => setShowPopup(false)}>
//               <X size={20} />
//             </button>
//             <h2>✨ Session Complete ✨</h2>
//             <p>Great job taking this time for yourself. 🌿</p>
//             <button className="popup-ok" onClick={() => setShowPopup(false)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MeditationTimer;


import React, { useState, useEffect } from 'react';
import { Clock, Palette, Play, Pause, RotateCcw, X } from 'lucide-react';
import './MeditationTimer.css';

const colorPalettes = {
  sunset: { name: 'sunset', label: 'Sunset' },
  ocean: { name: 'ocean', label: 'Ocean' },
  forest: { name: 'forest', label: 'Forest' },
  twilight: { name: 'twilight', label: 'Twilight' }
};

const timePresets = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 }
];

const MeditationTimer = () => {
  const [selectedPalette, setSelectedPalette] = useState('sunset');
  const [timeInMinutes, setTimeInMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(timeInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Reliable bell sound source
  const bellSound = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  bellSound.preload = "auto";

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);

      // ✅ Safe audio playback with fallback
      bellSound.currentTime = 0;
      bellSound.play().catch((err) => console.warn("Audio playback failed:", err));

      setShowPopup(true);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timeInMinutes * 60);
    setShowPopup(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimePresetClick = (minutes) => {
    setIsCustom(false);
    setTimeInMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setCustomTime('');
  };

  const handleCustomTimeSubmit = (e) => {
    e.preventDefault();
    const customMinutes = parseInt(customTime);
    if (customMinutes > 0 && customMinutes <= 180) {
      setIsCustom(true);
      setTimeInMinutes(customMinutes);
      setTimeLeft(customMinutes * 60);
      setIsRunning(false);
    }
  };

  return (
    <div className="timer-wrapper">
      <div className={`timer-container ${selectedPalette}`}>
        <div className="timer-card">
          <h1 className="timer-title">Meditation Timer</h1>

          {/* Theme Selection */}
          <div className="palette-section">
            <div className="section-header">
              <Palette size={20} />
              <h2>Theme</h2>
            </div>
            <div className="palette-grid">
              {Object.keys(colorPalettes).map((palette) => (
                <button
                  key={palette}
                  onClick={() => setSelectedPalette(palette)}
                  className={`palette-button ${palette} ${
                    selectedPalette === palette ? 'selected' : ''
                  }`}
                >
                  {colorPalettes[palette].label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Section */}
          <div className="duration-section">
            <div className="section-header">
              <Clock size={20} />
              <h2>Duration</h2>
            </div>
            <div className="preset-grid">
              {timePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleTimePresetClick(preset.value)}
                  className={`preset-button ${
                    timeInMinutes === preset.value && !isCustom ? 'active' : ''
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Time Input */}
            <form onSubmit={handleCustomTimeSubmit} className="custom-time-form">
              <input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="Custom minutes"
                min="1"
                max="180"
                className="custom-time-input"
              />
              <button
                type="submit"
                className={`custom-time-button ${isCustom ? 'active' : ''}`}
              >
                Set
              </button>
            </form>
          </div>

          {/* Timer Display */}
          <div className="timer-display">
            <div className="time-text">{formatTime(timeLeft)}</div>
            <div className="timer-controls">
              <button onClick={toggleTimer} className="control-button">
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={resetTimer} className="control-button">
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              <X size={20} />
            </button>
            <h2>✨ Session Complete ✨</h2>
            <p>Great job taking this time for yourself. 🌿</p>
            <button className="popup-ok" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeditationTimer;
