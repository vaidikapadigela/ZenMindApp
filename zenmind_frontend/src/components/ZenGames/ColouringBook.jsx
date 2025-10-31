import React, { useRef, useState, useEffect } from "react";
import "./ColouringBook.css";
import { MdCleaningServices } from "react-icons/md";

const colors = [
  "#F2827F",
  "#B3E0D6",
  "#3BB143",
  "#81D8D0",
  "#E5B73B",
  "#237658",
  "#F9E076",
  "#FF6347"
];

export default function CanvasColoringBook() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(colors[0]);
  const [ctx, setCtx] = useState(null);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // ✅ Ensure a white background
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 5;
    setCtx(context);
  }, []);

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      };
    }
  };

  const startDrawing = (e) => {
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing || !ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = isEraser ? "white" : color;
    ctx.lineWidth = isEraser ? 25 : 5;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setDrawing(false);
  };

  const clearCanvas = () => {
    if (!ctx) return;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✅ refill background as white after clear
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const toggleEraser = () => {
    setIsEraser((prev) => !prev);
  };

  // ✅ NEW: Save as PNG
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "my_drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="canvas-wrapper">
      <h1>Color It!</h1>

      <div className="tool-bar">
        <div className="color-palette">
          {colors.map((c) => (
            <button
              key={c}
              className={`color-btn ${c === color && !isEraser ? "selected" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
            />
          ))}
        </div>

        <button
          className={`eraser-btn ${isEraser ? "active" : ""}`}
          onClick={toggleEraser}
          title="Eraser"
        >
          <MdCleaningServices size={22} />
          <span className="eraser-text">Eraser</span>
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div className="btn-row">
        <button className="clear-btn" onClick={clearCanvas}>
          Clear Canvas
        </button>
        <button className="clear-btn" onClick={saveCanvas}>
          Save Drawing
        </button>
      </div>
    </div>
  );
}
