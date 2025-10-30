import React, { useState } from "react";
import "./TicTacToe.css";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : `Turn: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="tic-tac-toe-container">
      <h2 className="tic-tac-toe-title">Tic Tac Toe</h2>

      <div className="tic-tac-toe-board">
        {board.map((cell, index) => (
          <div key={index} className="tic-cell" onClick={() => handleClick(index)}>
            {cell}
          </div>
        ))}
      </div>

      <div className="tic-info">{status}</div>

      <button className="tic-reset" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
