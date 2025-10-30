import React, { useEffect, useState, useRef } from "react";
import "./FlappyBird.css";

const FlappyBirdGame = () => {
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gravity = 0.6;
  const jumpPower = -10;
  const pipeSpeed = 3;
  const pipeGap = 140;
  const pipeWidth = 60;
  const gameRef = useRef();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        if (!gameRunning && !gameOver) {
          setGameRunning(true);
          setGameOver(false);
          setScore(0);
          setBirdY(200);
          setPipes([]);
        }
        if (gameRunning) setVelocity(jumpPower);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameRunning, gameOver]);

  useEffect(() => {
    if (!gameRunning) return;

    const interval = setInterval(() => {
      setBirdY((prev) => prev + velocity);
      setVelocity((prev) => prev + gravity);
    }, 20);

    return () => clearInterval(interval);
  }, [velocity, gameRunning]);

  useEffect(() => {
    if (!gameRunning) return;

    const interval = setInterval(() => {
      const topHeight = Math.random() * 200 + 50;
      setPipes((prev) => [
        ...prev,
        { x: 400, topHeight, bottomY: topHeight + pipeGap },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [gameRunning]);

  useEffect(() => {
    if (!gameRunning) return;

    const interval = setInterval(() => {
      setPipes((prev) =>
        prev
          .map((pipe) => ({ ...pipe, x: pipe.x - pipeSpeed }))
          .filter((pipe) => pipe.x + pipeWidth > 0)
      );
    }, 20);

    return () => clearInterval(interval);
  }, [gameRunning]);

  useEffect(() => {
    if (!gameRunning) return;

    const gameHeight = 400;
    if (birdY > gameHeight - 20 || birdY < 0) {
      endGame();
      return;
    }

    pipes.forEach((pipe) => {
      if (
        pipe.x < 50 &&
        pipe.x + pipeWidth > 20 &&
        (birdY < pipe.topHeight || birdY > pipe.bottomY)
      ) {
        endGame();
      } else if (pipe.x + pipeWidth === 20) {
        setScore((s) => s + 1);
      }
    });
  }, [birdY, pipes]);

  const endGame = () => {
    setGameOver(true);
    setGameRunning(false);
  };

  const handleRestart = () => {
    setGameOver(false);
    setGameRunning(false);
    setBirdY(200);
    setVelocity(0);
    setPipes([]);
    setScore(0);
  };

  return (
    <div className="flappy-wrapper">
      <h1 className="flappy-title">Flappy Bird</h1>

      <div className="flappy-card" ref={gameRef}>
        <div className="flappy-game-area">
          <div className="flappy-bird" style={{ top: birdY + "px" }}></div>
          {pipes.map((pipe, index) => (
            <React.Fragment key={index}>
              <div
                className="flappy-pipe top"
                style={{
                  left: pipe.x,
                  height: pipe.topHeight,
                }}
              ></div>
              <div
                className="flappy-pipe bottom"
                style={{
                  left: pipe.x,
                  top: pipe.bottomY,
                  height: 400 - pipe.bottomY,
                }}
              ></div>
            </React.Fragment>
          ))}
        </div>

        {!gameRunning && !gameOver && (
          <>
            <p className="flappy-desc">
              Hit <b>Space</b> to Start & Jump!
            </p>
            <button className="flappy-btn" onClick={() => setGameRunning(true)}>
              Start Game
            </button>
          </>
        )}

        {gameOver && (
          <div className="flappy-over">
            <p className="flappy-over-text">💥 Game Over!</p>
            <p className="flappy-score">Score: {score}</p>
            <button className="flappy-btn" onClick={handleRestart}>
              Restart Game
            </button>
          </div>
        )}

        {!gameOver && gameRunning && (
          <p className="flappy-score">Score: {score}</p>
        )}
      </div>
    </div>
  );
};

export default FlappyBirdGame;
