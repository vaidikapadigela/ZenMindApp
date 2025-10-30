import React, { useState } from "react";
import "./ClickerGame.css";

const ClickerGame = () => {
  const [score, setScore] = useState(0);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setScore(score + 1);
    setClicked(true);
    setTimeout(() => setClicked(false), 150);
  };

  const handleReset = () => {
    setScore(0);
  };

  return (
    <div className="clicker-container">
      <h1 className="clicker-title">Calm Clicker</h1>
      <div className="clicker-content">
        
        <p className="clicker-desc">Tap to relax and release tension</p>

        <div
          className={`clicker-button ${clicked ? "clicked" : ""}`}
          onClick={handleClick}
        >
        </div>

        <h2 className="clicker-score">Score: {score}</h2>

        <button className="clicker-reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ClickerGame;
