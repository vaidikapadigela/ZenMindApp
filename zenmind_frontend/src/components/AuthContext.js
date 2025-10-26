import React, { createContext, useState, useEffect, useContext } from 'react';
import { calendarService } from '../services/SimplifiedCalendarService';

export const AuthContext = createContext();

// Custom hook for using auth context
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Check localStorage on initial load and initialize Google API
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
      
      // Initialize calendar service only for Google users
      if (userData.isGoogleUser) {
        calendarService.init().catch(console.error);
      }
    }
    setIsLoading(false);
  }, []);

  // Email/Password validation (you can replace this with actual backend API call)
  const validateEmailPassword = async (email, password) => {
    // TODO: Replace this with actual API call to your backend
    // For now, this is a mock implementation
    // Example: const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    
    // Mock validation - replace with real backend call
    if (email && password) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, accept any email/password
      // In production, this should validate against your backend
      return {
        email: email,
        displayName: email.split('@')[0], // Use email username as display name
        isGoogleUser: false,
        uid: `email_${Date.now()}`, // Generate a unique ID
      };
    }
    
    throw new Error('Invalid email or password');
  };

  // Login function - supports both Google and Email/Password
  const login = async (userData) => {
    try {
      let userToSave;

      if (userData.isGoogleUser) {
        // Google login
        try {
          // Initialize calendar service with access token for Google users
          await calendarService.init(userData.accessToken);
          calendarService.setAccessToken(userData.accessToken);
        } catch (error) {
          console.warn('Calendar service initialization failed:', error);
          // Continue with login even if calendar fails
        }
        
        userToSave = {
          email: userData.email,
          displayName: userData.displayName,
          googleId: userData.googleId,
          photoURL: userData.photoURL,
          accessToken: userData.accessToken,
          isGoogleUser: true,
        };
      } else {
        // Email/Password login
        const validatedUser = await validateEmailPassword(userData.email, userData.password);
        userToSave = validatedUser;
      }

      localStorage.setItem('user', JSON.stringify(userToSave));
      setUser(userToSave);
      setIsLoggedIn(true);
      return userToSave;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Only sign out from Google if user is a Google user
      if (user?.isGoogleUser) {
        const auth2 = window.gapi?.auth2?.getAuthInstance();
        if (auth2) {
          await auth2.signOut();
        }
        
        // Also revoke Google Sign-In
        if (window.google?.accounts?.id) {
          window.google.accounts.id.disableAutoSelect();
        }
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
    
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};