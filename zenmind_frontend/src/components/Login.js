import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [animation, setAnimation] = useState(false);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Array of mindfulness quotes
  const quotes = [
    { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
    { text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh" },
    { text: "Mindfulness isn't difficult, we just need to remember to do it.", author: "Sharon Salzberg" },
    { text: "Be where you are, otherwise you will miss your life.", author: "Buddha" },
    { text: "The little things? The little moments? They aren't little.", author: "Jon Kabat-Zinn" },
    { text: "Mindfulness is a way of befriending ourselves and our experience.", author: "Jon Kabat-Zinn" }
  ];

  useEffect(() => {
    // Set a random quote when component mounts
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    // Trigger animation after a slight delay
    setTimeout(() => {
      setAnimation(true);
    }, 300);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      // For demo purposes, just checking if fields are not empty
      if (email && password) {
        // Use the login function from AuthContext
        login();
        // Redirect to home page after successful login
        navigate('/');
      } else {
        setErrorMessage('Please enter both email and password');
      }
      setIsLoading(false);
    }, 1500);
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
          <div className="logo-circle">
            <span>ZM</span>
          </div>
        </div>
        
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Continue your mindfulness journey</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errorMessage}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="spinner" viewBox="0 0 50 50">
                  <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="register-link">Sign up</Link></p>
          <div className="divider">
            <span>or continue with</span>
          </div>
          <div className="social-login">
            <button className="social-button google">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="social-button facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              Facebook
            </button>
            <button className="social-button apple">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5775 12.3855C17.5775 14.9855 15.4735 17.0895 12.8735 17.0895H11.1255C8.5255 17.0895 6.4215 14.9855 6.4215 12.3855V11.6145C6.4215 9.0145 8.5255 6.9105 11.1255 6.9105H12.8735C15.4735 6.9105 17.5775 9.0145 17.5775 11.6145V12.3855Z" strokeWidth="1.5" stroke="currentColor" fill="none"/>
                <path d="M15.8456 4.89661V6.91061" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round"/>
                <path d="M8.15527 4.89661V6.91061" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round"/>
                <path d="M17.5776 9.90576H6.42163" strokeWidth="1.5" stroke="currentColor"/>
                <path d="M13.9995 20.0944V17.0894" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round"/>
                <path d="M10.001 20.0944V17.0894" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round"/>
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
      
      <div className={`login-quote ${animation ? 'fade-in' : ''}`}>
        <button className="refresh-quote" onClick={changeQuote} aria-label="Change quote">
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

export default Login;