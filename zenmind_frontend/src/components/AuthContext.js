import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { calendarService } from '../services/SimplifiedCalendarService';

export const AuthContext = createContext();

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Check localStorage only once on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setToken(savedToken);
        setIsLoggedIn(true);

        // Initialize Google Calendar only for Google users
        if (userData.isGoogleUser) {
          calendarService.init().catch(console.error);
        }
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setIsLoading(false);
  }, []);

  // ✅ Backend login (username/password)
  const loginWithBackend = async (username, password, rememberMe = false) => {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
        rememberMe,
      });

      if (response.data?.token) {
  const userData = {
    username: response.data.user?.username || username,
    email: response.data.user?.email || `${username}@zenmind.app`,
    displayName: response.data.user?.username || username,
    isGoogleUser: false,
  };

  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('justLoggedIn', 'true');

  setUser(userData);
  setToken(response.data.token);
  setIsLoggedIn(true);

  return userData;
} else {
  throw new Error(response.data.message || 'Login failed');
}
} catch (error) {
  console.error('Backend login error:', error);
  throw new Error(
    error.response?.data?.message || 'Failed to login with backend'
  );
}
};


  // ✅ Google login
// ✅ Google login (fixed and resilient)
const loginWithGoogle = async (userData) => {
  if (!userData || !userData.accessToken) {
    throw new Error('Invalid Google login data');
  }

  try {
    // 1️⃣  Send Google user data to backend
    const res = await axios.post('http://localhost:5000/api/auth/google', {
      email: userData.email,
      displayName: userData.displayName,
      googleId: userData.googleId,
      photoURL: userData.photoURL,
    });

    // 2️⃣  Build user object
    // 2️⃣  Build user object (include access token)
const userToSave = {
  username: userData.displayName || userData.email.split("@")[0], // ✅ fallback username
  email: userData.email,
  displayName: userData.displayName,
  googleId: userData.googleId,
  photoURL: userData.photoURL,
  isGoogleUser: true,
  accessToken: userData.accessToken,
};



    // 3️⃣  Save token + user
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(userToSave));
    localStorage.setItem('justLoggedIn', 'true');

    // 4️⃣  Update state
    setUser(userToSave);
    setToken(res.data.token);
    setIsLoggedIn(true);

    // Optional: initialize calendar
    await calendarService.init(userData.accessToken);
    calendarService.setAccessToken(userData.accessToken);


    console.log("✅ Google login successful:", userToSave);
    return userToSave;
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error('Failed to login with Google. Check backend route.');
  }
};



  // ✅ Unified login
  const login = async (userData) => {
    if (!userData) {
      throw new Error('User data missing');
    }

    // Prevent accidental undefined login
    if (!userData.isGoogleUser && (!userData.username || !userData.password)) {
      throw new Error('Username and password are required');
    }

    if (userData.isGoogleUser) {
      return await loginWithGoogle(userData);
    } else {
      return await loginWithBackend(
        userData.username,
        userData.password,
        userData.rememberMe
      );
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      if (user?.isGoogleUser) {
        const auth2 = window.gapi?.auth2?.getAuthInstance();
        if (auth2) await auth2.signOut();

        if (window.google?.accounts?.id) {
          window.google.accounts.id.disableAutoSelect();
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('justLoggedIn');

    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};