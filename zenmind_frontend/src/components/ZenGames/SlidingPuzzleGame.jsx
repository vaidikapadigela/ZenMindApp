import React, { useState, useEffect } from "react";
import "./SlidingPuzzleGame.css";

const GRID_SIZE = 3; // 3x3 puzzle

const createShuffledTiles = () => {
  const tiles = Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i + 1);
  tiles.push(null); // Empty space
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
};

const SlidingPuzzleGame = () => {
  const [tiles, setTiles] = useState(createShuffledTiles());
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const handleTileClick = (index) => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(null);
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - GRID_SIZE,
      emptyIndex + GRID_SIZE,
    ];

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const isSolved = tiles.every((tile, i) => tile === (i + 1) || (i === tiles.length - 1 && tile === null));
    setIsWon(isSolved);
  }, [tiles]);

  const restartGame = () => {
    setTiles(createShuffledTiles());
    setMoves(0);
    setIsWon(false);
  };

  return (
    <div className="puzzle-wrapper">
      <h2 className="puzzle-title">Sliding Puzzle</h2>

      <div className="puzzle-card">
        <p className="puzzle-desc">Arrange the tiles in order (1 → 8)!</p>
        <p className="puzzle-moves">Moves: {moves}</p>

        <div
          className="puzzle-grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 80px)`,
          }}
        >
          {tiles.map((tile, i) => (
            <div
              key={i}
              className={`puzzle-cell ${tile ? "puzzle-tile" : "puzzle-empty"}`}
              onClick={() => handleTileClick(i)}
            >
              {tile}
            </div>
          ))}
        </div>

        {isWon && (
          <div className="puzzle-win">
            <p className="puzzle-win-text">🎉 You solved it in {moves} moves!</p>
          </div>
        )}

        <button className="puzzle-btn" onClick={restartGame}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default SlidingPuzzleGame;
