import React, { useState, useEffect, useRef } from "react";
import "./SnakeGame.css";

const SnakeGame = () => {
  const boardSize = 20;
  const initialSnake = [
    { x: 8, y: 10 },
    { x: 9, y: 10 },
  ];

  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState("LEFT");
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  const [isRunning, setIsRunning] = useState(false); // 🟢 NEW: start control
  const intervalRef = useRef(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver || !isRunning) return; // 🟢 only move when running
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameOver, isRunning]);

  // Game loop
  useEffect(() => {
    if (!isRunning || isGameOver) return; // 🟢 only run when started
    intervalRef.current = setInterval(moveSnake, speed);
    return () => clearInterval(intervalRef.current);
  });

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
      default:
        break;
    }

    // Check collisions
    if (
      head.x < 0 ||
      head.x >= boardSize ||
      head.y < 0 ||
      head.y >= boardSize ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setIsGameOver(true);
      setIsRunning(false);
      clearInterval(intervalRef.current);
      return;
    }

    newSnake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1);
      setFood({
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
      });
      if (speed > 60) setSpeed(speed - 5);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const startGame = () => {
    setSnake(initialSnake);
    setDirection("LEFT");
    setFood({ x: 5, y: 5 });
    setIsGameOver(false);
    setScore(0);
    setSpeed(150);
    setIsRunning(true); // 🟢 starts the loop
  };

  const restartGame = () => {
    startGame();
  };

  return (
    <div className="snake-wrapper">
      <h2 className="snake-heading">Snake Game</h2>

      <div className="snake-box">
        <p className="snake-desc">
          Use Arrow Keys to move and eat the food!
        </p>
        <p className="snake-score">Score: {score}</p>

        <div
          className="snake-grid"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          }}
        >
          {[...Array(boardSize * boardSize)].map((_, idx) => {
            const x = idx % boardSize;
            const y = Math.floor(idx / boardSize);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={idx}
                className={`snake-cell ${
                  isSnake
                    ? "snake-body"
                    : isFood
                    ? "snake-food"
                    : "snake-empty"
                }`}
              />
            );
          })}
        </div>

        {!isRunning && !isGameOver && (
          <button onClick={startGame} className="snake-btn">
            Start Game
          </button>
        )}

        {isGameOver && (
          <>
            <p className="snake-over">Game Over! Try Again.</p>
            <button onClick={restartGame} className="snake-btn">
              Restart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
