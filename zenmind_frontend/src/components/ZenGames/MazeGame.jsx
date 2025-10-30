import React, { useState, useEffect, useCallback } from "react";
import "./MazeGame.css";

const size = 10;
const exit = [9, 9];

// ✅ Always generates a playable maze with an open path at least near start & exit
const generateMaze = () => {
  const maze = Array(size)
    .fill()
    .map(() => Array(size).fill(1));

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

  // carve from start
  carve(0, 0);

  // ✅ Ensure openings around start and exit
  maze[0][0] = 0;
  maze[0][1] = 0;
  maze[1][0] = 0;
  maze[exit[0]][exit[1]] = 0;
  maze[exit[0]][exit[1] - 1] = 0;
  maze[exit[0] - 1][exit[1]] = 0;

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
    <div className="maze-wrapper">
      <h2 className="maze-title">Maze Escape</h2>

      <div className="maze-card">
        <p className="maze-desc">Use arrow keys to reach the exit 🏁</p>
        <p className="maze-moves">Moves: {moves}</p>

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
                    className={`maze-cell ${isPlayer ? "maze-player" : ""} ${
                      isExit ? "maze-exit" : ""
                    } ${isWall ? "maze-wall" : ""} ${
                      isStart && !isPlayer ? "maze-start" : ""
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
          <div className="maze-win">
            <p className="maze-win-text">🎉 You Escaped the Maze!</p>
            <p className="maze-win-moves">Completed in {moves} moves</p>
          </div>
        )}

        <button className="maze-reset" onClick={reset}>
          New Maze
        </button>
      </div>
    </div>
  );
};

export default MazeGame;
