import React, { useState } from "react";
import "./WorryRelease.css";

const WorryRelease = () => {
  const [worry, setWorry] = useState("");
  const [released, setReleased] = useState(false);

  const handleRelease = () => {
    if (!worry.trim()) return;
    setReleased(true);
    setTimeout(() => {
      setWorry("");
      setReleased(false);
    }, 3000);
  };

  return (
    <div className="todo-wrapper">
      <div className="todo-app worry-card">
        <h1>Release Your Worries 🌿</h1>
        <p className="worry-subtext">
          Write down your worries and watch them fade away — let go of what no longer serves you.
        </p>

        <textarea
          className={`worry-input ${released ? "fade-up" : ""}`}
          value={worry}
          onChange={(e) => setWorry(e.target.value)}
          placeholder="Type your worry here..."
          disabled={released}
        />

        <button
          className="release-button"
          onClick={handleRelease}
          disabled={!worry.trim() || released}
        >
          Release ✨
        </button>

        {released && (
          <div className="vanish-text">
            <span>{worry}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorryRelease;
