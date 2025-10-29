import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./EmotionDetectionPage.css";

const EmotionDetector = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [mode, setMode] = useState("scan");
  const [manualEmotion, setManualEmotion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null);

  // Load models once
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

  // Clear emotion when switching modes
  useEffect(() => {
    setEmotion("");
  }, [mode]);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setEmotion("");
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // Detect emotion (auto stop camera)
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
    } catch (err) {
      console.error("Detection error:", err);
      setEmotion("neutral");
    } finally {
      setIsLoading(false);
      stopCamera(); // ✅ Automatically stop camera after detection
    }
  };

  // Handle image upload
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

  // Save manual emotion
  const saveManualEmotion = () => {
    if (manualEmotion.trim()) {
      setEmotion(manualEmotion);
      setManualEmotion("");
    }
  };

  return (
    <div className="emotion-wrapper">
      <div className="emotion-card">
        <h1>Emotion Mirror 🌿</h1>
        <p className="emotion-subtext">
          Detect your mood through your face, upload a photo, or type how you feel.
        </p>

        {/* --- Mode Selector --- */}
        <div className="mode-selector">
          <button
            className={mode === "scan" ? "active" : ""}
            onClick={() => setMode("scan")}
          >
            📷 Scan Face
          </button>
          <button
            className={mode === "upload" ? "active" : ""}
            onClick={() => setMode("upload")}
          >
            🖼 Upload Image
          </button>
          <button
            className={mode === "manual" ? "active" : ""}
            onClick={() => setMode("manual")}
          >
            ✍️ Type Emotion
          </button>
        </div>

        {/* --- Scan Mode --- */}
        {mode === "scan" && (
          <div className="scan-section">
            <div className="camera-box">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width="320"
                height="240"
                className="camera-feed"
              />
            </div>

            <div className="button-group">
              <button onClick={startCamera}>🎥 Start Camera</button>
              <button onClick={handleScan} disabled={isLoading}>
                {isLoading ? "Detecting..." : "🔍 Detect Emotion"}
              </button>
            </div>
          </div>
        )}

        {/* --- Upload Mode --- */}
        {mode === "upload" && (
          <div className="upload-section">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="uploaded" className="preview-img" />}
          </div>
        )}

        {/* --- Manual Mode --- */}
        {mode === "manual" && (
          <div className="manual-section">
            <div className="manual-input-box">
              <input
                type="text"
                placeholder="Type your emotion..."
                value={manualEmotion}
                onChange={(e) => setManualEmotion(e.target.value)}
              />
              <button onClick={saveManualEmotion}>Save</button>
            </div>
          </div>
        )}

        {/* --- Emotion Result --- */}
        {emotion && (
          <div className="emotion-result glow-text">
            <h2>Your Emotion: {emotion.toUpperCase()}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDetector;
