import React, { useState, useEffect } from "react";
import "./ZenMemoryGame.css";

const icons = ["🌿", "🪷", "☀️", "🌙", "🌸", "🍃", "🧘‍♀️", "🔔"];

const ZenMemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const shuffleCards = () => {
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setGameOver(false);
  };

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
        shuffleCards();
      }, 600);
    }
  }, [matched, cards]);

  return (
    <div className="zen-memory-container">
      <div className="zen-memory-header">
        <h1 className="zen-memory-title">Mindful Memory Game</h1>
        <p className="zen-memory-subtitle">
          Sharpen your focus and stay present — match the cards mindfully 🌿
        </p>
      </div>

      <div className="zen-memory-card">
        <div className="zen-memory-grid">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <div
                key={index}
                className={`zen-memory-tile ${isFlipped ? "flipped" : ""}`}
                onClick={() => handleFlip(index)}
              >
                <div className="zen-tile-inner">
                  <div className="zen-tile-front">❓</div>
                  <div className="zen-tile-back">{card.symbol}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="zen-memory-restart" onClick={shuffleCards}>
          Restart Game
        </button>

        <p className="zen-memory-tip">
          🌸 Focus on your breathing while flipping cards — it helps calm your mind 💫
        </p>
      </div>
    </div>
  );
};

export default ZenMemoryGame;
