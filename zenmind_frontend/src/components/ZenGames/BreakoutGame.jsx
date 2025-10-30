import React, { useRef, useEffect, useState } from "react";
import "./BreakoutGame.css";

const BreakoutGame = () => {
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  const gameStateRef = useRef({
    animationId: null,
    rightPressed: false,
    leftPressed: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const ballRadius = 8;
    const paddleHeight = 10;
    const paddleWidth = 75;

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2.5;
    let dy = -2.5;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let localScore = 0;
    let started = false;

    const brickRowCount = 6;
    const brickColumnCount = 8;
    const brickWidth = 45;
    const brickHeight = 12;
    const brickPadding = 5;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 10;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const keyDownHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
        gameStateRef.current.rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        gameStateRef.current.leftPressed = true;
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (!started) {
          started = true;
          setIsStarted(true);
        }
      }
    };

    const keyUpHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
        gameStateRef.current.rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        gameStateRef.current.leftPressed = false;
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#77bfa3";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(
        paddleX,
        canvas.height - paddleHeight - 10,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = "#f4c95d";
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            const colors = [
              "#ff6b6b",
              "#ee5a6f",
              "#f06595",
              "#cc5de8",
              "#845ef7",
              "#5c7cfa",
            ];
            ctx.fillStyle = colors[r % colors.length];
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              localScore += 10;
              setScore(localScore);
            }
          }
        }
      }
    }

    function drawScore() {
      ctx.font = "14px Arial";
      ctx.fillStyle = "#5b5b5b";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${localScore}`, 10, 20);
    }

    function drawStartMessage() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#5b5b5b";
      ctx.textAlign = "center";
      ctx.fillText("Press Space to Start", canvas.width / 2, canvas.height / 2);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();

      if (!started) {
        drawStartMessage();
        gameStateRef.current.animationId = requestAnimationFrame(draw);
        return;
      }

      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > canvas.height - ballRadius - 10) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          setIsGameOver(true);
          return;
        }
      }

      if (
        gameStateRef.current.rightPressed &&
        paddleX < canvas.width - paddleWidth
      ) {
        paddleX += 6;
      } else if (gameStateRef.current.leftPressed && paddleX > 0) {
        paddleX -= 6;
      }

      x += dx;
      y += dy;

      gameStateRef.current.animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      if (gameStateRef.current.animationId) {
        cancelAnimationFrame(gameStateRef.current.animationId);
      }
    };
  }, [restartKey]);

  const handleRestart = () => {
    setIsGameOver(false);
    setIsStarted(false);
    setScore(0);
    setRestartKey((k) => k + 1);
  };

  return (
    <div className="breakout-bg">
       <h2 className="breakout-title">Breakout Game</h2>
      <div className="breakout-container">
        
        <p className="instructions">Use ⬅️ ➡️ to move. Press Space to start.</p>
        <canvas ref={canvasRef} width={420} height={320}></canvas>

        {isGameOver && (
          <div className="overlay">
            <p className="gameover-title">💥 Game Over!</p>
            <p className="score-text">Your score: {score}</p>
            <button onClick={handleRestart}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakoutGame;
