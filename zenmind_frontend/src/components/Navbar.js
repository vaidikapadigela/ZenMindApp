import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "./AuthContext";
import { FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (name) =>
    setActiveDropdown(activeDropdown === name ? null : name);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Close dropdown automatically when route changes
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <nav className="zen-navbar">
      {/* === LEFT: Brand === */}
      <div className="zen-navbar__brand">
        <Link to="/" className="zen-navbar__logo">
          ZenMind
        </Link>

        <button
          className="zen-navbar__toggle"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
        >
          <span className="zen-navbar__hamburger"></span>
        </button>
      </div>

      {/* === CENTER + RIGHT === */}
      <div className={`zen-navbar__menu ${isMenuOpen ? "zen-navbar__menu--active" : ""}`}>
        {/* === CENTER: Mindful / Productive / Games === */}
        {isLoggedIn && (
          <div className="zen-navbar__center">
            {/* Mindful Dropdown */}
            <div className="zen-navbar__dropdown">
              <button
                className="zen-navbar__dropdown-toggle"
                onClick={() => toggleDropdown("mindful")}
              >
                Mindful{" "}
                <FaChevronDown
                  className={`zen-navbar__arrow ${
                    activeDropdown === "mindful" ? "zen-navbar__arrow--open" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mindful" && (
                <div className="zen-navbar__dropdown-menu">
                  <Link to="/WorryRelease" className="zen-navbar__dropdown-item">
                    Worry Release
                  </Link>
                  <Link to="/GratitudeLog" className="zen-navbar__dropdown-item">
                    Gratitude Log
                  </Link>
                  <Link to="/Journaling" className="zen-navbar__dropdown-item">
                    Journal
                  </Link>
                  <Link to="/Soundscape" className="zen-navbar__dropdown-item">
                    Soundscape
                  </Link>
                  <Link to="/Meditation-timer" className="zen-navbar__dropdown-item">
                    Meditation Timer
                  </Link>
                </div>
              )}
            </div>

            {/* Productive Dropdown */}
            <div className="zen-navbar__dropdown">
              <button
                className="zen-navbar__dropdown-toggle"
                onClick={() => toggleDropdown("productive")}
              >
                Productive{" "}
                <FaChevronDown
                  className={`zen-navbar__arrow ${
                    activeDropdown === "productive" ? "zen-navbar__arrow--open" : ""
                  }`}
                />
              </button>
              {activeDropdown === "productive" && (
                <div className="zen-navbar__dropdown-menu">
                  <Link to="/Todo" className="zen-navbar__dropdown-item">
                    To-Do
                  </Link>
                  <Link to="/PomodoroTimer" className="zen-navbar__dropdown-item">
                    Pomodoro Timer
                  </Link>
                  
                </div>
              )}
            </div>

            {/* Games Dropdown */}
            <div className="zen-navbar__dropdown">
              <button
                className="zen-navbar__dropdown-toggle"
                onClick={() => toggleDropdown("games")}
              >
                Games{" "}
                <FaChevronDown
                  className={`zen-navbar__arrow ${
                    activeDropdown === "games" ? "zen-navbar__arrow--open" : ""
                  }`}
                />
              </button>
              {activeDropdown === "games" && (
                <div className="zen-navbar__dropdown-menu">
                  <Link to="/ZenMemoryGame" className="zen-navbar__dropdown-item">
                    Zen Memory
                  </Link>
                  <Link to="/Sudoku" className="zen-navbar__dropdown-item">
                    Sudoku
                  </Link>
                  <Link to="/TicTacToe" className="zen-navbar__dropdown-item">
                    Tic Tac Toe
                  </Link>
                  <Link to="/ColouringBook" className="zen-navbar__dropdown-item">
                    Scribble
                  </Link>
                  <Link to="/BreakoutGame" className="zen-navbar__dropdown-item">
                    Breakout Game
                  </Link>
                  <Link to="/ClickerGame" className="zen-navbar__dropdown-item">
                    Clicker Game
                  </Link>
                  <Link to="/Game2048" className="zen-navbar__dropdown-item">
                    2048
                  </Link>
                  <Link to="/MazeGame" className="zen-navbar__dropdown-item">
                    Maze Game
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === RIGHT: Profile + Logout === */}
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
      </div>
    </nav>
  );
};

export default Navbar;