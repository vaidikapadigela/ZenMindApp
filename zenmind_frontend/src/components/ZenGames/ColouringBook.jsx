import React, { useRef, useState, useEffect } from "react";
import "./ColouringBook.css";

const colors = [
  "#F2827F", // coral pink
  "#B3E0D6", // pastel teal
  "#3BB143", // green
  "#81D8D0", // light teal
  "#E5B73B", // gold
  "#237658", // dark green
  "#F9E076", // light yellow
  "#FF6347"  // tomato
];

export default function CanvasColoringBook() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(colors[0]);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Setup drawing context
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
    ctx.strokeStyle = color;
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
  };

  return (
    <div className="canvas-wrapper">
      <h1>🎨 Color It!</h1>

      <div className="color-palette">
        {colors.map((c) => (
          <button
            key={c}
            className={`color-btn ${c === color ? "selected" : ""}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
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

      <button className="clear-btn" onClick={clearCanvas}>
        Clear Canvas
      </button>
    </div>
  );
}
