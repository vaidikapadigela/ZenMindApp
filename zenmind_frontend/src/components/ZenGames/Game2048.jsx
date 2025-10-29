import React, { useState, useEffect, useCallback } from "react";
import "./Game2048.css";

const Game2048 = () => {
  const [grid, setGrid] = useState(() => {
    const initial = generateEmptyGrid();
    addRandomTile(initial);
    addRandomTile(initial);
    return initial;
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function generateEmptyGrid() {
    return Array(4)
      .fill()
      .map(() => Array(4).fill(0));
  }

  function addRandomTile(grid) {
    const empty = [];
    grid.forEach((r, i) =>
      r.forEach((c, j) => {
        if (c === 0) empty.push([i, j]);
      })
    );
    if (empty.length) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  const slide = (row) => {
    let arr = row.filter((v) => v);
    let newScore = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        newScore += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter((v) => v);
    while (arr.length < 4) arr.push(0);
    return { row: arr, score: newScore };
  };

  const rotateLeft = (matrix) => matrix[0].map((_, i) => matrix.map((r) => r[i])).reverse();
  const rotateRight = (matrix) => matrix[0].map((_, i) => matrix.map((r) => r[i]).reverse());

  const checkGameOver = (grid) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return false;
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i][j] === grid[i][j + 1]) return false;
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  };

  const handleMove = useCallback(
    (key) => {
      if (gameOver) return;

      let newGrid = JSON.parse(JSON.stringify(grid));
      let moved = false;
      let totalScore = 0;

      if (key === "ArrowLeft") {
        newGrid = newGrid.map((row) => {
          const result = slide(row);
          totalScore += result.score;
          if (JSON.stringify(row) !== JSON.stringify(result.row)) moved = true;
          return result.row;
        });
      } else if (key === "ArrowRight") {
        newGrid = newGrid.map((r) => {
          const reversed = r.reverse();
          const result = slide(reversed);
          totalScore += result.score;
          if (JSON.stringify(reversed) !== JSON.stringify(result.row)) moved = true;
          return result.row.reverse();
        });
      } else if (key === "ArrowUp") {
        newGrid = rotateLeft(newGrid);
        newGrid = newGrid.map((row) => {
          const result = slide(row);
          totalScore += result.score;
          if (JSON.stringify(row) !== JSON.stringify(result.row)) moved = true;
          return result.row;
        });
        newGrid = rotateRight(newGrid);
      } else if (key === "ArrowDown") {
        newGrid = rotateLeft(newGrid);
        newGrid = newGrid.map((r) => {
          const reversed = r.reverse();
          const result = slide(reversed);
          totalScore += result.score;
          if (JSON.stringify(reversed) !== JSON.stringify(result.row)) moved = true;
          return result.row.reverse();
        });
        newGrid = rotateRight(newGrid);
      } else return;

      if (moved) {
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore((s) => s + totalScore);
        if (checkGameOver(newGrid)) setGameOver(true);
      }
    },
    [grid, gameOver]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        handleMove(e.key);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleMove]);

  const reset = () => {
    const fresh = generateEmptyGrid();
    addRandomTile(fresh);
    addRandomTile(fresh);
    setGrid(fresh);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game2048-container">
      <div className="game2048-card">
        <h2>🧩 2048</h2>
        <p className="desc">Use arrow keys to merge tiles</p>
        <div className="grid">
          {grid.map((row, i) =>
            row.map((num, j) => (
              <div key={`${i}-${j}`} className={`tile tile-${num}`}>
                {num !== 0 ? num : ""}
              </div>
            ))
          )}
        </div>
        <p className="score">Score: {score}</p>
        {gameOver && <p className="game-over-text">🎮 Game Over!</p>}
        <button onClick={reset}>Restart</button>
      </div>
    </div>
  );
};

export default Game2048;
