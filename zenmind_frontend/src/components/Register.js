import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from './AuthContext';

const Register = () => {
  const [username,setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [animation, setAnimation] = useState(false);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const quotes = [
    { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
    { text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh" },
    { text: "Mindfulness isn't difficult, we just need to remember to do it.", author: "Sharon Salzberg" },
    { text: "Be where you are, otherwise you will miss your life.", author: "Buddha" },
    { text: "The little things? The little moments? They aren't little.", author: "Jon Kabat-Zinn" },
    { text: "Mindfulness is a way of befriending ourselves and our experience.", author: "Jon Kabat-Zinn" }
  ];

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    setTimeout(() => setAnimation(true), 300);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
      } else {
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch {
      setErrorMessage("Server error, try again later");
    }

    setIsLoading(false);
  };

  const changeQuote = () => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote.text === quote.text);

    setAnimation(false);
    setTimeout(() => {
      setQuote(newQuote);
      setAnimation(true);
    }, 300);
  };

  return (
    <div className="login-wrapper">
      <div className={`login-container ${animation ? 'fade-in' : ''}`}>

        <div className="login-logo">
          <div className="logo-circle"><span>ZM</span></div>
        </div>

        <div className="login-header">
          <h1>Create Account</h1>
          <p>Begin your mindfulness journey</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="error-message">⚠ {errorMessage}</div>
          )}
          {successMessage && (
            <div className="success-message">✅ {successMessage}</div>
          )}
          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/login" className="register-link">Sign In</Link></p>
        </div>
      </div>

      <div className={`login-quote ${animation ? 'fade-in' : ''}`}>
        <button className="refresh-quote" onClick={changeQuote}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
        <div className="quote-background-shape"></div>
        <blockquote>
          "{quote.text}"
          <cite>— {quote.author}</cite>
        </blockquote>
        <div className="zen-decoration">
          <div className="zen-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
