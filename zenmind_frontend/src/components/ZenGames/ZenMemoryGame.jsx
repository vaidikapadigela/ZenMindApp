import React, { useState, useEffect } from "react";
import "./ZenMemoryGame.css";

const icons = ["🌿", "🪷", "☀️", "🌙", "🌸", "🍃", "🧘‍♀️", "🔔"];

const ZenMemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // shuffle cards
  const shuffleCards = () => {
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setGameOver(false);
  };

  // initial shuffle
  useEffect(() => {
    shuffleCards();
  }, []);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      if (cards[a].symbol === cards[b].symbol) {
        setMatched((prev) => [...prev, a, b]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true);
      setTimeout(() => {
        alert("✨ Well done! Your mind is calm and focused. 🪷");
        shuffleCards(); // reshuffle positions after game ends
      }, 600);
    }
  }, [matched, cards]);

  return (
    <div className="zenmind-container">
      <div className="zenmind-card">
        <h1 className="zenmind-title">🧩 Mindful Memory Game</h1>
        <p className="zenmind-subtitle">
          Sharpen your focus and stay present — match the cards mindfully 🌿
        </p>

        <div className="memory-grid">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <div
                key={index}
                className={`memory-card ${isFlipped ? "flipped" : ""}`}
                onClick={() => handleFlip(index)}
              >
                <div className="card-inner">
                  <div className="card-front">❓</div>
                  <div className="card-back">{card.symbol}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="restart-btn" onClick={shuffleCards}>
          Restart Game
        </button>

        <p className="zenmind-tip">
          Tip: Focus on your breathing while flipping cards — it helps improve calm concentration 💫
        </p>
      </div>
    </div>
  );
};

export default ZenMemoryGame;
