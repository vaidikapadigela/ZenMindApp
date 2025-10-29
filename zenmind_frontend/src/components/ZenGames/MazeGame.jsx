import React, { useState, useEffect, useCallback } from "react";
import "./MazeGame.css";

const size = 10;
const exit = [9, 9];

// Generate a solvable maze using recursive backtracking
const generateMaze = () => {
  const maze = Array(size)
    .fill()
    .map(() => Array(size).fill(1)); // Start with all walls

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const isValid = (x, y) => x >= 0 && x < size && y >= 0 && y < size;

  const carve = (x, y) => {
    maze[x][y] = 0;
    const dirs = shuffle([...directions]);
    for (let [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      const nnx = x + dx * 2;
      const nny = y + dy * 2;
      if (isValid(nnx, nny) && maze[nnx][nny] === 1) {
        maze[nx][ny] = 0;
        carve(nnx, nny);
      }
    }
  };

  carve(0, 0);

  // Ensure exit is reachable
  const visited = Array(size)
    .fill()
    .map(() => Array(size).fill(false));

  const canReach = (x, y) => {
    if (
      x < 0 ||
      x >= size ||
      y < 0 ||
      y >= size ||
      visited[x][y] ||
      maze[x][y] === 1
    )
      return false;
    if (x === exit[0] && y === exit[1]) return true;
    visited[x][y] = true;
    return (
      canReach(x + 1, y) ||
      canReach(x - 1, y) ||
      canReach(x, y + 1) ||
      canReach(x, y - 1)
    );
  };

  // Create guaranteed path if unreachable
  if (!canReach(0, 0)) {
    let x = 0,
      y = 0;
    while (x < exit[0] || y < exit[1]) {
      maze[x][y] = 0;
      if (x < exit[0] && (y === exit[1] || Math.random() < 0.5)) {
        x++;
      } else if (y < exit[1]) {
        y++;
      }
      maze[x][y] = 0;
    }
  }

  maze[0][0] = 0;
  maze[exit[0]][exit[1]] = 0;
  return maze;
};

const MazeGame = () => {
  const [player, setPlayer] = useState([0, 0]);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [maze, setMaze] = useState(() => generateMaze());

  const isValidMove = (x, y) =>
    x >= 0 && x < size && y >= 0 && y < size && maze[x][y] === 0;

  const move = useCallback(
    (dx, dy) => {
      if (won) return;
      const [x, y] = player;
      const nx = x + dx;
      const ny = y + dy;
      if (isValidMove(nx, ny)) {
        setPlayer([nx, ny]);
        setMoves((m) => m + 1);
        if (nx === exit[0] && ny === exit[1]) setWon(true);
      }
    },
    [player, won, maze]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") move(-1, 0);
        if (e.key === "ArrowDown") move(1, 0);
        if (e.key === "ArrowLeft") move(0, -1);
        if (e.key === "ArrowRight") move(0, 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  const reset = () => {
    setPlayer([0, 0]);
    setWon(false);
    setMoves(0);
    setMaze(generateMaze());
  };

  return (
    <div className="maze-container">
      <div className="maze-card">
        <h2>🌾 Maze Escape</h2>
        <p className="desc">Use arrow keys to reach the exit!</p>
        <p className="moves">Moves: {moves}</p>

        <div className="maze-grid">
          {[...Array(size)].map((_, i) => (
            <div key={i} className="maze-row">
              {[...Array(size)].map((_, j) => {
                const isPlayer = player[0] === i && player[1] === j;
                const isExit = exit[0] === i && exit[1] === j;
                const isWall = maze[i][j] === 1;
                const isStart = i === 0 && j === 0;

                return (
                  <div
                    key={`${i}-${j}`}
                    className={`maze-cell ${isPlayer ? "player" : ""} ${
                      isExit ? "exit" : ""
                    } ${isWall ? "wall" : ""} ${
                      isStart && !isPlayer ? "start" : ""
                    }`}
                  >
                    {isPlayer && "🧑"}
                    {isExit && !isPlayer && "🏁"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {won && (
          <div className="win-section">
            <p className="win-text">🎉 You Escaped the Maze!</p>
            <p className="win-moves">Completed in {moves} moves</p>
          </div>
        )}

        <button onClick={reset}>New Maze</button>
      </div>
    </div>
  );
};

export default MazeGame;
