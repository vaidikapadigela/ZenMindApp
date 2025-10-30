import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import { AuthContext } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const googleBtnRef = useRef(null);
  const GOOGLE_CLIENT_ID =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    window.__REACT_APP_GOOGLE_CLIENT_ID ||
    localStorage.getItem('REACT_APP_GOOGLE_CLIENT_ID') ||
    '';
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

    if (!GOOGLE_CLIENT_ID) {
      console.warn('Google Client ID not configured');
      return;
    }

    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [GOOGLE_CLIENT_ID]);

  const initializeGoogleAuth = () => {
    try {
      if (!window.google) {
        console.error('Google SDK failed to load');
        return;
      }

      // Initialize OAuth 2.0 with Calendar scope
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events',
        callback: handleOAuthCallback,
        error_callback: (error) => {
          console.log('OAuth error or popup closed:', error);
          setIsLoading(false);
          if (error.type !== 'popup_closed') {
            setErrorMessage('Google Sign-In failed. Please try again.');
          }
        },
      });

      // Render custom Google button
      if (googleBtnRef.current) {
        googleBtnRef.current.onclick = () => {
          setIsLoading(true);
          setErrorMessage('');
          client.requestAccessToken();
        };
      }
    } catch (err) {
      console.error('Google Sign-In initialization failed:', err);
    }
  };

  const handleOAuthCallback = async (response) => {
    if (response.error) {
      console.error('OAuth error:', response.error);
      setErrorMessage('Google Sign-In failed. Please try again.');
      setIsLoading(false);
      return;
    }

    if (!response.access_token) {
      setErrorMessage('Failed to get access token');
      setIsLoading(false);
      return;
    }

    try {
      // Get user info using the access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await userInfoResponse.json();

      const userData = {
        email: userInfo.email,
        displayName: userInfo.name,
        googleId: userInfo.id,
        photoURL: userInfo.picture,
        accessToken: response.access_token,
        isGoogleUser: true,
      };

      await login(userData);
      navigate('/');
    } catch (err) {
      console.error('Google login failed:', err);
      setErrorMessage('Failed to login with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setErrorMessage('Please enter both email and password');
        return;
      }

      await login({ email, password, isGoogleUser: false });
      navigate('/');
    } catch (err) {
      console.error('Email/password login failed:', err);
      setErrorMessage(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <h1>Welcome Back</h1>
          <p>Continue your mindfulness journey</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In with Email'}
          </button>
        </form>

        {GOOGLE_CLIENT_ID && (
          <div className="divider"><span>or</span></div>
        )}

        <div className="login-footer">
          {GOOGLE_CLIENT_ID && (
            <div className="social-login">
              <button
                ref={googleBtnRef}
                className="google-signin-button"
                disabled={isLoading}
              >
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>
          )}
          {/* <p>Don't have an account? <Link to="/register" className="register-link">Sign up</Link></p> */}
        </div>
      </div>

      <div className={`login-quote ${animation ? 'fade-in' : ''}`}>
        <button className="refresh-quote" onClick={changeQuote} aria-label="Get new quote">⟳</button>
        <blockquote>"{quote.text}"<cite>— {quote.author}</cite></blockquote>
      </div>
    </div>
  );
};

export default Login;