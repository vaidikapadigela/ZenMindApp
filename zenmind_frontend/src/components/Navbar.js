import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from './AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    // Optional: redirect to homepage after logout
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className={`navbar-logo ${isMenuOpen ? 'active' : ''}`}>
          ZenMind
        </Link>
        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="hamburger"></span>
        </button>
      </div>

      <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        {/* <Link 
          to="/" 
          className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link> */}
        
        {isLoggedIn ? (
          <>
            <Link 
              to="/Todo" 
              className={`navbar-item ${location.pathname === '/Todo' ? 'active' : ''}`}
            >
              Todo
            </Link>
            <Link 
              to="/Journaling" 
              className={`navbar-item ${location.pathname === '/Journaling' ? 'active' : ''}`}
            >
              Journal
            </Link>
            
            <Link 
              to="/Soundscape" 
              className={`navbar-item ${location.pathname === '/Soundscape' ? 'active' : ''}`}
            >
              Soundscape
            </Link>
            <Link 
              to="/Meditation-timer" 
              className={`navbar-item ${location.pathname === '/Meditation-timer' ? 'active' : ''}`}
            >
              Meditation Timer
            </Link>

            <Link 
              to="/PomodoroTimer" 
              className={`navbar-item ${location.pathname === '/PomodoroTimer' ? 'active' : ''}`}
            >
              Pomodoro
            </Link>

            <Link 
              to="/ProfilePage" 
              className={`navbar-item ${location.pathname === '/ProfilePage' ? 'active' : ''}`}
            >
              Profile
            </Link>
            
            <button 
              onClick={handleLogout}
              className="navbar-item logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/Login" 
            className={`navbar-item ${location.pathname === '/Login' ? 'active' : ''}`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;