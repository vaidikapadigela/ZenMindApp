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

  // 🧠 Close dropdown automatically when route changes
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      {/* === LEFT: Brand === */}
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          ZenMind
        </Link>

        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger"></span>
        </button>
      </div>

      {/* === CENTER + RIGHT === */}
      <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
        {/* === CENTER: Mindful / Productive / Games === */}
        {isLoggedIn && (
          <div className="navbar-center">
            {/* Mindful Dropdown */}
            <div className="navbar-dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => toggleDropdown("mindful")}
              >
                Mindful{" "}
                <FaChevronDown
                  className={`arrow ${
                    activeDropdown === "mindful" ? "open" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mindful" && (
                <div className="dropdown-menu">
                  <Link to="/WorryRelease" className="dropdown-item">
                    Worry Release
                  </Link>
                  <Link to="/GratitudeLog" className="dropdown-item">
                    Gratitude Log
                  </Link>
                  <Link to="/Journaling" className="dropdown-item">
                    Journal
                  </Link>
                  <Link to="/Soundscape" className="dropdown-item">
                    Soundscape
                  </Link>
                  <Link to="/Meditation-timer" className="dropdown-item">
                    Meditation Timer
                  </Link>
                </div>
              )}
            </div>

            {/* Productive Dropdown */}
            <div className="navbar-dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => toggleDropdown("productive")}
              >
                Productive{" "}
                <FaChevronDown
                  className={`arrow ${
                    activeDropdown === "productive" ? "open" : ""
                  }`}
                />
              </button>
              {activeDropdown === "productive" && (
                <div className="dropdown-menu">
                  <Link to="/Todo" className="dropdown-item">
                    To-Do
                  </Link>
                  <Link to="/PomodoroTimer" className="dropdown-item">
                    Pomodoro Timer
                  </Link>
                  
                </div>
              )}
            </div>

            {/* Games Dropdown */}
            <div className="navbar-dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => toggleDropdown("games")}
              >
                Games{" "}
                <FaChevronDown
                  className={`arrow ${
                    activeDropdown === "games" ? "open" : ""
                  }`}
                />
              </button>
              {activeDropdown === "games" && (
                <div className="dropdown-menu">
                  <Link to="/ZenMemoryGame" className="dropdown-item">
                    Zen Memory
                  </Link>
                  <Link to="/Sudoku" className="dropdown-item">
                    Sudoku
                  </Link>
                  <Link to="/TicTacToe" className="dropdown-item">
                    Tic Tac Toe
                  </Link>
                  <Link to="/ColouringBook" className="dropdown-item">
                    Scribble
                  </Link>
                  <Link to="/BreakoutGame" className="dropdown-item">
                    Breakout Game
                  </Link>
                  <Link to="/ClickerGame" className="dropdown-item">
                    Clicker Game
                  </Link>
                  <Link to="/Game2048" className="dropdown-item">
                    2048
                  </Link>
                  <Link to="/MazeGame" className="dropdown-item">
                    Maze Game
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      {/* === RIGHT: Profile + Logout === */}
<div className="navbar-right">
  {isLoggedIn ? (
    <>
      <Link to="/ProfilePage" className="profile-button">
        Profile
      </Link>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </>
  ) : (
    <Link to="/Login" className="logout-button">
      Login
    </Link>
  )}
</div>
      </div>
    </nav>
  );
};

export default Navbar;
