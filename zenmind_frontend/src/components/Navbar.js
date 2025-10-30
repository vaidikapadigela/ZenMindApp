import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "./AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  let { isLoggedIn, logout } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  isLoggedIn = !!token;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (name) =>
    setActiveDropdown(activeDropdown === name ? null : name);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <>
      <nav className="zen-navbar">
        {/* === LEFT: Brand === */}
        <div className="zen-navbar__brand">
          <Link to="/" className="zen-navbar__logo">
            ZenMind
          </Link>
        </div>

        {/* === CENTER MENU === */}
        {isLoggedIn && (
          <div className="zen-navbar__center">
            <div
              className="zen-navbar__group"
              onMouseEnter={() => setActiveBox("mindful")}
              onMouseLeave={() => setActiveBox(null)}
            >
              <div className="zen-navbar__item">Mindful</div>
              {activeBox === "mindful" && (
                <div className="zen-hoverbox">
                  <Link to="/WorryRelease">Worry Release</Link>
                  <Link to="/GratitudeLog">Gratitude Log</Link>
                  <Link to="/Journaling">Journal</Link>
                  <Link to="/Soundscape">Soundscape</Link>
                  <Link to="/Meditation-timer">Meditation Timer</Link>
                </div>
              )}
            </div>

            <div
              className="zen-navbar__group"
              onMouseEnter={() => setActiveBox("productive")}
              onMouseLeave={() => setActiveBox(null)}
            >
              <div className="zen-navbar__item">Productive</div>
              {activeBox === "productive" && (
                <div className="zen-hoverbox">
                  <Link to="/Todo">To-Do</Link>
                  <Link to="/PomodoroTimer">Pomodoro Timer</Link>
                </div>
              )}
            </div>

            <div
              className="zen-navbar__group"
              onMouseEnter={() => setActiveBox("games")}
              onMouseLeave={() => setActiveBox(null)}
            >
              <div className="zen-navbar__item">Games</div>
              {activeBox === "games" && (
                <div className="zen-hoverbox grid-large">
                  <Link to="/ZenMemoryGame">Memory</Link>
                  <Link to="/Sudoku">Sudoku</Link>
                  <Link to="/TicTacToe">Tic Tac Toe</Link>
                  <Link to="/ColouringBook">Scribble</Link>
                  <Link to="/BreakoutGame">Breakout</Link>
                  <Link to="/ClickerGame">Clicker</Link>
                  <Link to="/Game2048">2048</Link>
                  <Link to="/MazeGame">Maze</Link>
                  <Link to="/SnakeGame">Snake</Link>
                  <Link to="/FlappyBird">Flappy Bird</Link>
                  <Link to="/SlidingPuzzleGame">Sliding Puzzle</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === RIGHT BUTTONS === */}
        <div className="zen-navbar__right">
          {isLoggedIn ? (
            <>
              <Link to="/ProfilePage">
                <button className="zen-navbar__btn">Profile</button>
              </Link>
              <button onClick={handleLogout} className="zen-navbar__btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/Login">
              <button className="zen-navbar__btn">Login</button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
