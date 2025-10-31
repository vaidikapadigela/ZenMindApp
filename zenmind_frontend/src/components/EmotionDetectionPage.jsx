import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";
import "./EmotionDetectionPage.css";

const EmotionDetectionPage = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [mode, setMode] = useState("scan");
  const [manualEmotion, setManualEmotion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleScan = async () => {
    if (!videoRef.current) return;
    setIsLoading(true);

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const detectedEmotion = Object.entries(detections.expressions).sort(
          (a, b) => b[1] - a[1]
        )[0][0];
        setEmotion(detectedEmotion);
      } else {
        setEmotion("neutral");
      }
    } catch (error) {
      console.error("Detection error:", error);
      setEmotion("neutral");
    } finally {
      setIsLoading(false);
      stopCamera();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);

    const img = await faceapi.bufferToImage(file);
    setImage(URL.createObjectURL(file));
    const detections = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections && detections.expressions) {
      const detectedEmotion = Object.entries(detections.expressions).sort(
        (a, b) => b[1] - a[1]
      )[0][0];
      setEmotion(detectedEmotion);
    } else {
      setEmotion("neutral");
    }
    setIsLoading(false);
  };

  const saveManualEmotion = () => {
    if (manualEmotion.trim()) {
      setEmotion(manualEmotion);
      setManualEmotion("");
    }
  };

  // ✅ Emotion-based tool suggestions
  // ✅ Emotion-based tool suggestions (updated)
const getSuggestions = (emotion) => {
  const e = emotion.toLowerCase();
  const tools = {
    happy: [
      { name: "Journaling", path: "/Journaling" },
      { name: "Soundscape", path: "/Soundscape" },
      { name: "Tic Tac Toe", path: "/TicTacToe" },
      { name: "Pomodoro Timer", path: "/PomodoroTimer" },
      { name: "To-Do List", path: "/Todo" },
      { name: "Gratitude Log", path: "/GratitudeLog" },
      { name: "Flappy Bird", path: "/FlappyBird" }, // 🎮 New
    ],
    sad: [
      { name: "Breathing Exercise", path: "/Breathing-exercise" },
      { name: "Soundscape", path: "/Soundscape" },
      { name: "Zen Memory Game", path: "/ZenMemoryGame" },
      { name: "Meditation Timer", path: "/Meditation-timer" },
      { name: "Gratitude Log", path: "/GratitudeLog" },
      { name: "Sliding Puzzle", path: "/SlidingPuzzleGame" }, // 🧩 New
    ],
    angry: [
      { name: "Breathing Exercise", path: "/Breathing-exercise" },
      { name: "Soundscape", path: "/Soundscape" },
      { name: "Journaling", path: "/Journaling" },
      { name: "Pomodoro Timer", path: "/PomodoroTimer" },
      { name: "Snake Game", path: "/SnakeGame" }, // 🐍 New
    ],
    fearful: [
      { name: "Meditation Timer", path: "/Meditation-timer" },
      { name: "Soundscape", path: "/Soundscape" },
      { name: "Breathing Exercise", path: "/Breathing-exercise" },
      { name: "Worry Release", path: "/WorryRelease" },
      { name: "Sliding Puzzle", path: "/SlidingPuzzleGame" }, // 🧩 New
    ],
    surprised: [
      { name: "Tic Tac Toe", path: "/TicTacToe" },
      { name: "Maze Game", path: "/MazeGame" },
      { name: "Game 2048", path: "/Game2048" },
      { name: "Pomodoro Timer", path: "/PomodoroTimer" },
      { name: "Flappy Bird", path: "/FlappyBird" }, // 🎮 New
      { name: "Snake Game", path: "/SnakeGame" },   // 🐍 New
    ],
    disgusted: [
      { name: "Soundscape", path: "/Soundscape" },
      { name: "Breathing Exercise", path: "/Breathing-exercise" },
      { name: "Colouring Book", path: "/ColouringBook" },
      { name: "Sliding Puzzle", path: "/SlidingPuzzleGame" }, // 🧩 New
    ],
    neutral: [
      { name: "Journaling", path: "/Journaling" },
      { name: "Soundscape", path: "/Soundscape" },
      { name: "Breathing Exercise", path: "/Breathing-exercise" },
      { name: "Zen Memory Game", path: "/ZenMemoryGame" },
      { name: "Tic Tac Toe", path: "/TicTacToe" },
      { name: "Pomodoro Timer", path: "/PomodoroTimer" },
      { name: "To-Do List", path: "/Todo" },
      { name: "Meditation Timer", path: "/Meditation-timer" },
      { name: "Colouring Book", path: "/ColouringBook" },
      { name: "Breakout Game", path: "/BreakoutGame" },
      { name: "Clicker Game", path: "/ClickerGame" },
      { name: "Flappy Bird", path: "/FlappyBird" },   // 🎮 New
      { name: "Snake Game", path: "/SnakeGame" },     // 🐍 New
      { name: "Sliding Puzzle", path: "/SlidingPuzzleGame" }, // 🧩 New
    ],
  };
  return tools[e] || tools.neutral;
};


  return (
    <div className="emotion-wrapper">
      <div className="emotion-card">
        <h1>Emotion Detection 🌿</h1>
        <p className="emotion-subtext">
          Detect your emotion and explore personalized tools to match your mood.
        </p>

        {/* Mode Selector */}
        <div className="mode-selector">
          <button className={mode === "scan" ? "active" : ""} onClick={() => setMode("scan")}>
            📷 Scan
          </button>
          <button className={mode === "upload" ? "active" : ""} onClick={() => setMode("upload")}>
            🖼 Upload
          </button>
          <button className={mode === "manual" ? "active" : ""} onClick={() => setMode("manual")}>
            ✍️ Type
          </button>
        </div>

        {/* Scan Mode */}
        {mode === "scan" && (
          <div className="scan-section">
            <video ref={videoRef} autoPlay muted playsInline width="320" height="240" />
            <div className="button-group">
              <button onClick={startCamera}>🎥 Start</button>
              <button onClick={handleScan}>{isLoading ? "Detecting..." : "🔍 Detect"}</button>
            </div>
          </div>
        )}

        {/* Upload Mode */}
        {mode === "upload" && (
          <div className="upload-section">
            <label className="custom-upload">
  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
  📤 Upload Image
</label>

            {image && <img src={image} alt="uploaded" className="preview" />}
          </div>
        )}

        {/* Manual Mode */}
        {mode === "manual" && (
          <div className="manual-section">
            <input
              type="text"
              placeholder="Type your emotion (e.g., happy, sad)"
              value={manualEmotion}
              onChange={(e) => setManualEmotion(e.target.value)}
            />
            <button onClick={saveManualEmotion}>Save</button>
          </div>
        )}

        {/* Result */}
        {emotion && (
          <div className="result-section">
            <h2>Detected Emotion: <span>{emotion}</span></h2>
            <h3>Recommended Tools:</h3>
            <div className="tool-grid">
              {getSuggestions(emotion).map((tool, i) => (
                <button key={i} className="tool-button" onClick={() => navigate(tool.path)}>
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDetectionPage;
