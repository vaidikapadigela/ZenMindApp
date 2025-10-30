import React, { useState, useEffect, useCallback } from "react";
import "./Sudoku.css";

/*
  Sudoku component
  - Displays a 9x9 Sudoku board
  - Accepts user input (digits 1-9). Use Backspace/Delete to clear.
  - Buttons: Solve (auto-solve with backtracking), Check (highlight conflicts),
             Clear (clear all non-given cells), Reset (restore initial puzzle)
  - Initial puzzle is editable below as `defaultPuzzle` (0 = empty)
*/

const defaultPuzzle = [
  // sample medium puzzle (0 = blank). Replace with your own if you want.
  [0,0,0, 2,6,0, 7,0,1],
  [6,8,0, 0,7,0, 0,9,0],
  [1,9,0, 0,0,4, 5,0,0],

  [8,2,0, 1,0,0, 0,4,0],
  [0,0,4, 6,0,2, 9,0,0],
  [0,5,0, 0,0,3, 0,2,8],

  [0,0,9, 3,0,0, 0,7,4],
  [0,4,0, 0,5,0, 0,3,6],
  [7,0,3, 0,1,8, 0,0,0]
];

const cloneBoard = (b) => b.map(row => row.slice());

function isValidPlacement(board, row, col, val) {
  // check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === val) return false;
  }
  // check col
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === val) return false;
  }
  // check 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === val) return false;
    }
  }
  return true;
}

// Backtracking solver. Returns true if solved, modifies board in-place.
function solveBoard(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let v = 1; v <= 9; v++) {
          if (isValidPlacement(board, r, c, v)) {
            board[r][c] = v;
            if (solveBoard(board)) return true;
            board[r][c] = 0;
          }
        }
        return false; // no valid number here -> backtrack
      }
    }
  }
  return true; // no empty cells -> solved
}

function findConflicts(board) {
  // returns a set of coordinates (r,c) that are in conflict
  const conflicts = new Set();

  // row conflicts
  for (let r = 0; r < 9; r++) {
    const seen = new Map();
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === 0) continue;
      if (!seen.has(v)) seen.set(v, []);
      seen.get(v).push([r, c]);
    }
    for (const [v, cells] of seen.entries()) {
      if (cells.length > 1) {
        cells.forEach(([rr, cc]) => conflicts.add(`${rr},${cc}`));
      }
    }
  }

  // col conflicts
  for (let c = 0; c < 9; c++) {
    const seen = new Map();
    for (let r = 0; r < 9; r++) {
      const v = board[r][c];
      if (v === 0) continue;
      if (!seen.has(v)) seen.set(v, []);
      seen.get(v).push([r, c]);
    }
    for (const [v, cells] of seen.entries()) {
      if (cells.length > 1) {
        cells.forEach(([rr, cc]) => conflicts.add(`${rr},${cc}`));
      }
    }
  }

  // box conflicts
  for (let boxR = 0; boxR < 3; boxR++) {
    for (let boxC = 0; boxC < 3; boxC++) {
      const seen = new Map();
      for (let r = boxR * 3; r < boxR * 3 + 3; r++) {
        for (let c = boxC * 3; c < boxC * 3 + 3; c++) {
          const v = board[r][c];
          if (v === 0) continue;
          if (!seen.has(v)) seen.set(v, []);
          seen.get(v).push([r, c]);
        }
      }
      for (const [v, cells] of seen.entries()) {
        if (cells.length > 1) {
          cells.forEach(([rr, cc]) => conflicts.add(`${rr},${cc}`));
        }
      }
    }
  }

  return conflicts;
}

const Sudoku = ({ initial = defaultPuzzle }) => {
  const [given, setGiven] = useState(() => cloneBoard(initial));
  const [board, setBoard] = useState(() => cloneBoard(initial));
  const [selected, setSelected] = useState([0, 0]); // [r,c]
  const [conflicts, setConflicts] = useState(new Set());
  const [message, setMessage] = useState("");

  useEffect(() => {
    // initial conflict check
    setConflicts(findConflicts(board));
  }, []); // on mount

  const handleCellClick = (r, c) => {
    setSelected([r, c]);
  };

  const handleKeyDown = useCallback((e) => {
    const [r, c] = selected;
    if (r === undefined) return;
    if (given[r][c] !== 0) {
      // given cell — ignore edits
      if (e.key === "ArrowUp") setSelected([Math.max(0, r - 1), c]);
      if (e.key === "ArrowDown") setSelected([Math.min(8, r + 1), c]);
      if (e.key === "ArrowLeft") setSelected([r, Math.max(0, c - 1)]);
      if (e.key === "ArrowRight") setSelected([r, Math.min(8, c + 1)]);
      return;
    }
    if ((e.key >= "1" && e.key <= "9") || e.key === "Backspace" || e.key === "Delete") {
      setBoard(prev => {
        const nxt = cloneBoard(prev);
        if (e.key === "Backspace" || e.key === "Delete") {
          nxt[r][c] = 0;
        } else {
          nxt[r][c] = parseInt(e.key, 10);
        }
        setConflicts(findConflicts(nxt));
        return nxt;
      });
    } else if (e.key === "ArrowUp") {
      setSelected([Math.max(0, r - 1), c]);
    } else if (e.key === "ArrowDown") {
      setSelected([Math.min(8, r + 1), c]);
    } else if (e.key === "ArrowLeft") {
      setSelected([r, Math.max(0, c - 1)]);
    } else if (e.key === "ArrowRight") {
      setSelected([r, Math.min(8, c + 1)]);
    }
  }, [selected, given]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const onCellValueChange = (r, c, valueStr) => {
    if (given[r][c] !== 0) return;
    const v = valueStr === "" ? 0 : Math.max(0, Math.min(9, parseInt(valueStr || "0", 10)));
    setBoard(prev => {
      const nxt = cloneBoard(prev);
      nxt[r][c] = isNaN(v) ? 0 : v;
      setConflicts(findConflicts(nxt));
      return nxt;
    });
  };

  const handleSolve = () => {
    const copy = cloneBoard(board);
    if (!solveBoard(copy)) {
      setMessage("No solution found from current board (might contain conflicts).");
      return;
    }
    setBoard(copy);
    setConflicts(new Set());
    setMessage("Solved ✅");
  };

  const handleClear = () => {
    setBoard(prev => {
      const nxt = cloneBoard(prev);
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (given[r][c] === 0) nxt[r][c] = 0;
        }
      }
      setConflicts(new Set());
      return nxt;
    });
    setMessage("Cleared non-given cells.");
  };

  const handleReset = () => {
    setBoard(cloneBoard(given));
    setConflicts(new Set());
    setMessage("Reset to initial puzzle.");
  };

  const handleCheck = () => {
    const conf = findConflicts(board);
    setConflicts(conf);
    if (conf.size === 0) {
      // also check for completeness
      let complete = true;
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (board[r][c] === 0) complete = false;
      setMessage(complete ? "Looks good — no conflicts!" : "No conflicts, but board is incomplete.");
    } else {
      setMessage("Conflicts highlighted in red.");
    }
  };

  const handleGiveUpSolve = () => {
    // try to solve original given puzzle
    const copy = cloneBoard(given);
    if (!solveBoard(copy)) {
      setMessage("Given puzzle has no solution.");
      return;
    }
    setBoard(copy);
    setConflicts(new Set());
    setMessage("Solved original given puzzle.");
  };

  return (
    <div className="sudoku-app">
      <h2 className="sudoku-title">Sudoku</h2>
      <div className="sudoku-wrapper">
        <div className="board" role="grid" aria-label="Sudoku board">
          {board.map((row, r) => (
            <div className="board-row" role="row" key={r}>
              {row.map((cell, c) => {
                const isGiven = given[r][c] !== 0;
                const isSelected = selected[0] === r && selected[1] === c;
                const isConflict = conflicts.has(`${r},${c}`);
                return (
                  <div
                    key={c}
                    role="gridcell"
                    tabIndex={0}
                    className={`cell ${isGiven ? "given" : "editable"} ${isSelected ? "selected" : ""} ${isConflict ? "conflict" : ""} ${((Math.floor(r/3)+Math.floor(c/3))%2===0) ? "box-even" : "box-odd"}`}
                    onClick={() => handleCellClick(r, c)}
                  >
                    {isGiven ? (
                      <div className="cell-value given-value">{cell || ""}</div>
                    ) : (
                      <input
                        className="cell-input"
                        value={cell === 0 ? "" : cell}
                        onChange={(e) => onCellValueChange(r, c, e.target.value.replace(/[^0-9]/g, ""))}
                        onFocus={() => setSelected([r, c])}
                        inputMode="numeric"
                        pattern="[1-9]*"
                        maxLength={1}
                        aria-label={`Row ${r+1} Column ${c+1}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="controls">
          <button onClick={handleSolve}>Solve (from current)</button>
          <button onClick={handleGiveUpSolve}>Solve Given Puzzle</button>
          <button onClick={handleCheck}>Check</button>
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleReset}>Reset</button>
          <div className="message">{message}</div>
          <div className="hint">
            Tip: click a cell and type 1–9. Use arrow keys to move, Backspace/Delete to clear.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sudoku;
