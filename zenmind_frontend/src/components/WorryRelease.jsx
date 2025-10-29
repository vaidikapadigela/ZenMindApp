import React, { useState } from "react";
import "./WorryRelease.css";

const WorryRelease = () => {
  const [worry, setWorry] = useState("");
  const [crumple, setCrumple] = useState(false);

  const handleRelease = () => {
    if (!worry.trim()) return;
    setCrumple(true);

    // reset after animation
    setTimeout(() => {
      setCrumple(false);
      setWorry("");
    }, 3500);
  };

  return (
    <div className="todo-wrapper">
      <div className="todo-app worry-card">
        <h1>Release Your Worries 🌿</h1>
        <p className="worry-subtext">
          Write down your worries and watch them fade away — let go of what no longer serves you.
        </p>

        <div className="worry-zone">
          <div className="dustbin">🗑️</div>

          <textarea
            className={`worry-input ${crumple ? "crumple" : ""}`}
            value={worry}
            onChange={(e) => setWorry(e.target.value)}
            placeholder="Type your worry here..."
            disabled={crumple}
          />
        </div>

        <button
          className="release-button"
          onClick={handleRelease}
          disabled={!worry.trim() || crumple}
        >
          Release ✨
        </button>
      </div>
    </div>
  );
};

export default WorryRelease;
