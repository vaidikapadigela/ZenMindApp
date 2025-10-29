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
              to="/ZenMemoryGame" 
              className={`navbar-item ${location.pathname === '/ZenMemoryGame' ? 'active' : ''}`}
            >
              ZenMemoryGame
            </Link>

            <Link 
              to="/WorryRelease" 
              className={`navbar-item ${location.pathname === '/WorryRelease' ? 'active' : ''}`}
            >
              WorryRelease
            </Link>
            
            <Link 
              to="/Emotion" 
              className={`navbar-item ${location.pathname === '/Emotion' ? 'active' : ''}`}
            >
              EmotionDetectionPage
            </Link>

            <Link 
              to="/Sudoku" 
              className={`navbar-item ${location.pathname === '/Emotion' ? 'active' : ''}`}
            >
              Sudoku
            </Link>
            <Link 
              to="/TicTacToe" 
              className={`navbar-item ${location.pathname === '/TicTacToe' ? 'active' : ''}`}
            >
              TicTacToe
            </Link>
            <Link 
              to="/GratitudeLog" 
              className={`navbar-item ${location.pathname === '/GratitudeLog' ? 'active' : ''}`}
            >
              GratitudeLog
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

// import React, { useState, useContext, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { AuthContext } from "./AuthContext";
// import { Menu, X } from "lucide-react";
// import "./Navbar.css";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const { isLoggedIn, logout } = useContext(AuthContext);

//   useEffect(() => {
//   if (isOpen) {
//     document.body.classList.add("sidebar-open");
//   } else {
//     document.body.classList.remove("sidebar-open");
//   }
// }, [isOpen]);

//   const handleLogout = () => {
//     logout();
//     window.location.href = "/";
//   };

//   return (
//     <>
//       <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
//         {isOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       <aside className={`sidebar ${isOpen ? "open" : ""}`}>
//         <h2 className="sidebar-logo">🪷 ZenMind</h2>

//         {isLoggedIn ? (
//           <>
//             <Link
//               to="/Todo"
//               className={`sidebar-item ${
//                 location.pathname === "/Todo" ? "active" : ""
//               }`}
//             >
//               📝 To-Do
//             </Link>
//             <Link
//               to="/WorryRelease"
//               className={`sidebar-item ${
//                 location.pathname === "/WorryRelease" ? "active" : ""
//               }`}
//             >
//               📝 Worry Release
//             </Link>
//             <Link
//               to="/Emotion"
//               className={`sidebar-item ${
//                 location.pathname === "/Emotion" ? "active" : ""
//               }`}
//             >
//               😊 Emotion
//             </Link>
//             <Link
//               to="/GratitudeLog"
//               className={`sidebar-item ${
//                 location.pathname === "/GratitudeLog" ? "active" : ""
//               }`}
//             >
//               🌼 Gratitude
//             </Link>
//             <Link
//               to="/Journaling"
//               className={`sidebar-item ${
//                 location.pathname === "/Journaling" ? "active" : ""
//               }`}
//             >
//               📔 Journal
//             </Link>
//             <Link
//               to="/Soundscape"
//               className={`sidebar-item ${
//                 location.pathname === "/Soundscape" ? "active" : ""
//               }`}
//             >
//               🎧 Soundscape
//             </Link>
//             <Link
//               to="/Meditation-timer"
//               className={`sidebar-item ${
//                 location.pathname === "/Meditation-timer" ? "active" : ""
//               }`}
//             >
//               🧘 Meditation
//             </Link>
//             <Link
//               to="/PomodoroTimer"
//               className={`sidebar-item ${
//                 location.pathname === "/PomodoroTimer" ? "active" : ""
//               }`}
//             >
//               ⏱️ Pomodoro
//             </Link>
//             <Link
//               to="/ProfilePage"
//               className={`sidebar-item ${
//                 location.pathname === "/ProfilePage" ? "active" : ""
//               }`}
//             >
//               👤 Profile
//             </Link>

//             <button className="sidebar-item logout-btn" onClick={handleLogout}>
//               🚪 Logout
//             </button>
//           </>
//         ) : (
//           <Link
//             to="/Login"
//             className={`sidebar-item ${
//               location.pathname === "/Login" ? "active" : ""
//             }`}
//           >
//             🔐 Login
//           </Link>
//         )}
//       </aside>
//     </>
//   );
// };

// export default Navbar;
