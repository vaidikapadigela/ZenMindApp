// // import React, { useState, useRef, useEffect } from "react";
// // import * as faceapi from "face-api.js";
// // import "./EmotionDetectionPage.css";

// // const EmotionDetectionPage = () => {
// //   const [image, setImage] = useState(null);
// //   const [emotion, setEmotion] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [modelsLoaded, setModelsLoaded] = useState(false);
// //   const imgRef = useRef();

// //   // Load models when component mounts
// //   useEffect(() => {
// //     const loadModels = async () => {
// //       const MODEL_URL = "/models"; // place model files in public/models/
// //       try {
// //         await Promise.all([
// //           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
// //           faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
// //         ]);
// //         setModelsLoaded(true);
// //       } catch (err) {
// //         console.error("Model loading error:", err);
// //       }
// //     };
// //     loadModels();
// //   }, []);

// //   const handleImageUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setImage(URL.createObjectURL(file));
// //       setEmotion(null);
// //     }
// //   };

// //   const detectEmotion = async () => {
// //     if (!modelsLoaded) {
// //       alert("Models still loading. Please wait...");
// //       return;
// //     }
// //     if (!imgRef.current) return;
// //     setLoading(true);
// //     try {
// //       const detections = await faceapi
// //         .detectSingleFace(imgRef.current, new faceapi.TinyFaceDetectorOptions())
// //         .withFaceExpressions();

// //       if (detections && detections.expressions) {
// //         const sorted = Object.entries(detections.expressions).sort(
// //           (a, b) => b[1] - a[1]
// //         );
// //         const [topEmotion, confidence] = sorted[0];
// //         setEmotion({
// //           name: topEmotion,
// //           confidence: (confidence * 100).toFixed(1),
// //         });
// //       } else {
// //         setEmotion({ name: "No face detected", confidence: null });
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setEmotion({ name: "Error detecting emotion", confidence: null });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="todo-wrapper">
// //       <div className="todo-app emotion-app">
// //         <h1>Emotion Detection</h1>

// //         <div className="emotion-upload-section">
// //           <label className="upload-label">
// //             Upload or Scan Face:
// //             <input
// //               type="file"
// //               accept="image/*"
// //               capture="user"
// //               onChange={handleImageUpload}
// //             />
// //           </label>

// //           {image && (
// //             <div className="preview-container">
// //               <img
// //                 src={image}
// //                 alt="preview"
// //                 className="preview-img"
// //                 ref={imgRef}
// //                 onLoad={detectEmotion}
// //               />
// //             </div>
// //           )}
// //         </div>

// //         {loading && (
// //           <div className="calendar-status-indicator">
// //             Detecting emotion... please wait.
// //           </div>
// //         )}

// //         {emotion && !loading && (
// //           <div className="emotion-result">
// //             <h2>
// //               Detected Emotion: <span>{emotion.name}</span>
// //             </h2>
// //             {emotion.confidence && (
// //               <p className="confidence">Confidence: {emotion.confidence}%</p>
// //             )}

// //             {emotion.name !== "No face detected" &&
// //               emotion.name !== "Error detecting emotion" && (
// //                 <div className="feature-suggestions">
// //                   <p>
// //                     Based on your emotion, you could try these features on our
// //                     platform:
// //                   </p>
// //                   <ul>
// //                     {emotion.name === "happy" && (
// //                       <>
// //                         <li>🎶 Uplifting playlists</li>
// //                         <li>🌟 Gratitude journaling</li>
// //                       </>
// //                     )}
// //                     {emotion.name === "sad" && (
// //                       <>
// //                         <li>💬 Talk to our AI companion</li>
// //                         <li>🧘 Guided meditation</li>
// //                       </>
// //                     )}
// //                     {emotion.name === "angry" && (
// //                       <>
// //                         <li>💨 Breathing exercises</li>
// //                         <li>🎮 Distraction games</li>
// //                       </>
// //                     )}
// //                     {emotion.name === "surprised" && (
// //                       <>
// //                         <li>✨ New daily challenges</li>
// //                         <li>📸 Capture reaction photos</li>
// //                       </>
// //                     )}
// //                     {emotion.name === "neutral" && (
// //                       <>
// //                         <li>📖 Reflective journaling</li>
// //                         <li>☕ Relaxation stories</li>
// //                       </>
// //                     )}
// //                   </ul>
// //                 </div>
// //               )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmotionDetectionPage;
// import React, { useState, useRef, useEffect } from "react";
// import * as faceapi from "face-api.js";
// import "./EmotionDetectionPage.css";

// const EmotionDetectionPage = () => {
//   const [image, setImage] = useState(null);
//   const [emotion, setEmotion] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const videoRef = useRef();
//   const imgRef = useRef();
//   const canvasRef = useRef();

//   // Load models once
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = "/models";
//       try {
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
//         ]);
//         setModelsLoaded(true);
//       } catch (err) {
//         console.error("Error loading models:", err);
//       }
//     };
//     loadModels();
//   }, []);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//       setEmotion(null);
//       setIsCameraOn(false);
//     }
//   };

//   const startCamera = async () => {
//     setIsCameraOn(true);
//     setImage(null);
//     setEmotion(null);

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//     } catch (err) {
//       console.error("Error accessing camera:", err);
//       alert("Could not access camera. Please allow camera permissions.");
//     }
//   };

//   const stopCamera = () => {
//     setIsCameraOn(false);
//     const stream = videoRef.current?.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//   };

//   const capturePhoto = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataUrl = canvas.toDataURL("image/png");
//     setImage(dataUrl);
//     stopCamera();
//   };

//   const detectEmotion = async () => {
//     if (!modelsLoaded) {
//       alert("Models are still loading. Please wait...");
//       return;
//     }
//     if (!imgRef.current) return;

//     setLoading(true);
//     try {
//       const detections = await faceapi
//         .detectSingleFace(imgRef.current, new faceapi.TinyFaceDetectorOptions())
//         .withFaceExpressions();

//       if (detections && detections.expressions) {
//         const sorted = Object.entries(detections.expressions).sort(
//           (a, b) => b[1] - a[1]
//         );
//         const [topEmotion, confidence] = sorted[0];
//         setEmotion({
//           name: topEmotion,
//           confidence: (confidence * 100).toFixed(1),
//         });
//       } else {
//         setEmotion({ name: "No face detected", confidence: null });
//       }
//     } catch (err) {
//       console.error("Detection error:", err);
//       setEmotion({ name: "Error detecting emotion", confidence: null });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (image) detectEmotion();
//   }, [image]);

//   return (
//     <div className="todo-wrapper">
//       <div className="todo-app emotion-app">
//         <h1>Emotion Detection</h1>

//         <div className="emotion-upload-section">
//           {/* Upload Option */}
//           <label className="upload-label">
//             Upload a Picture
//             <input type="file" accept="image/*" onChange={handleImageUpload} />
//           </label>

//           {/* OR Divider */}
//           <div className="divider">OR</div>

//           {/* Capture Option */}
//           {!isCameraOn && (
//             <button className="upload-label" onClick={startCamera}>
//               📸 Capture Picture Now
//             </button>
//           )}

//           {isCameraOn && (
//             <div className="camera-section">
//               <video ref={videoRef} autoPlay playsInline className="video-feed" />
//               <div className="camera-controls">
//                 <button className="upload-label" onClick={capturePhoto}>
//                   Capture
//                 </button>
//                 <button className="cancel-btn" onClick={stopCamera}>
//                   Cancel
//                 </button>
//               </div>
//               <canvas ref={canvasRef} style={{ display: "none" }} />
//             </div>
//           )}

//           {image && !isCameraOn && (
//             <div className="preview-container">
//               <img
//                 src={image}
//                 alt="Captured"
//                 ref={imgRef}
//                 className="preview-img"
//               />
//             </div>
//           )}
//         </div>

//         {loading && (
//           <div className="calendar-status-indicator">
//             Detecting emotion... please wait.
//           </div>
//         )}

//         {emotion && !loading && (
//           <div className="emotion-result">
//             <h2>
//               Detected Emotion: <span>{emotion.name}</span>
//             </h2>
//             {emotion.confidence && (
//               <p className="confidence">Confidence: {emotion.confidence}%</p>
//             )}

//             {emotion.name !== "No face detected" &&
//               emotion.name !== "Error detecting emotion" && (
//                 <div className="feature-suggestions">
//                   <p>
//                     Based on your emotion, you could try these features on our
//                     platform:
//                   </p>
//                   <ul>
//                     {emotion.name === "happy" && (
//                       <>
//                         <li>🎶 Uplifting playlists</li>
//                         <li>🌟 Gratitude journaling</li>
//                       </>
//                     )}
//                     {emotion.name === "sad" && (
//                       <>
//                         <li>💬 Talk to our AI companion</li>
//                         <li>🧘 Guided meditation</li>
//                       </>
//                     )}
//                     {emotion.name === "angry" && (
//                       <>
//                         <li>💨 Breathing exercises</li>
//                         <li>🎮 Distraction games</li>
//                       </>
//                     )}
//                     {emotion.name === "surprised" && (
//                       <>
//                         <li>✨ New daily challenges</li>
//                         <li>📸 Capture reaction photos</li>
//                       </>
//                     )}
//                     {emotion.name === "neutral" && (
//                       <>
//                         <li>📖 Reflective journaling</li>
//                         <li>☕ Relaxation stories</li>
//                       </>
//                     )}
//                   </ul>
//                 </div>
//               )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmotionDetectionPage;
import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "./EmotionDetectionPage.css";

const EmotionDetectionPage = () => {
  const [emotion, setEmotion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("scan"); // 'scan' | 'upload' | 'manual'
  const [previewImage, setPreviewImage] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();

  // Load face-api models
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

  // Start webcam if scan mode selected
  useEffect(() => {
    if (mode === "scan") startVideo();
  }, [mode]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const handleScan = async () => {
    if (!videoRef.current) return;
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);

    // Set preview image
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewImage(ev.target.result);
    reader.readAsDataURL(file);

    const img = await faceapi.bufferToImage(file);
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

  const handleManualInput = (e) => {
    setEmotion(e.target.value.toLowerCase());
  };

  const [manualEmotion, setManualEmotion] = useState("");

const handleManualEmotion = () => {
  if (manualEmotion.trim() !== "") {
    setEmotion(manualEmotion.toLowerCase());
  }
};

  return (
    <div className="todo-wrapper">
      <div className="todo-app emotion-app">
        <h1>Emotion Recognition 🌈</h1>

        <div className="mode-selector">
          <button
            className={mode === "scan" ? "active" : ""}
            onClick={() => setMode("scan")}
          >
            📷 Scan Face
          </button>
          <br></br>
          <br></br>
          <button
            className={mode === "upload" ? "active" : ""}
            onClick={() => setMode("upload")}
          >
            🖼 Upload Image
          </button>
          <br></br>
          <br></br>
          <button
            className={mode === "manual" ? "active" : ""}
            onClick={() => setMode("manual")}
          >
            ✍️ Type Emotion
          </button>
        </div>

        {mode === "scan" && (
          <div className="camera-section">
            <video ref={videoRef} autoPlay muted width="320" height="240" />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button onClick={handleScan} disabled={isLoading}>
              {isLoading ? "Detecting..." : "Detect Emotion"}
            </button>
          </div>
        )}

        {mode === "upload" && (
          <div className="upload-section">
            <label className="custom-file-upload">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              Choose Image 📁
            </label>

            {previewImage && (
              <img src={previewImage} alt="preview" className="preview-image" />
            )}
          </div>
        )}

       {mode === "manual" && (
  <div className="manual-input-container">
    <input
      type="text"
      placeholder="Type your emotion (e.g., happy, sad, calm)"
      value={manualEmotion}
      onChange={(e) => setManualEmotion(e.target.value)}
    />
    <button onClick={handleManualEmotion}>Submit</button>
  </div>
)}


        {emotion && (
          <div className="emotion-result">
            <h2>Detected Emotion: {emotion.toUpperCase()}</h2>
            <h3>Recommended ZenMind Features:</h3>
            <ul>
              {emotion === "happy" && (
                <>
                  <li>🌸 Gratitude Log — note what you’re thankful for</li>
                  <li>🎧 Soundscape — match your joy with calm tunes</li>
                </>
              )}
              {emotion === "sad" && (
                <>
                  <li>📔 Journaling — express your feelings freely</li>
                  <li>🌿 Worry Release — write and let it vanish</li>
                </>
              )}
              {emotion === "angry" && (
                <>
                  <li>🧘 Meditation Timer — breathe and calm down</li>
                  <li>🌿 Worry Release — let go of tension safely</li>
                </>
              )}
              {emotion === "anxious" && (
                <>
                  <li>🎧 Soundscape — soothing ambient sounds</li>
                  <li>🧘 Meditation Timer — calm your thoughts</li>
                </>
              )}
              {emotion === "tired" && (
                <>
                  <li>⏱ Pomodoro — refresh with short focus cycles</li>
                  <li>🎧 Soundscape — rest with gentle sounds</li>
                </>
              )}
              {emotion === "bored" && (
                <>
                  <li>🧾 To-Do — start small, build momentum</li>
                  <li>🌸 Gratitude Log — reflect and uplift mood</li>
                </>
              )}
              {emotion === "neutral" && (
                <>
                  <li>📔 Journaling — maintain your balance</li>
                  <li>🧾 To-Do — organize your thoughts</li>
                </>
              )}
              {emotion === "calm" && (
                <>
                  <li>🧘 Meditation Timer — deepen relaxation</li>
                  <li>🎧 Soundscape — stay grounded and serene</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDetectionPage;
