import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Breathing from './components/Breathing';
import Navbar from './components/Navbar';
import Journaling from "./components/Journaling";
import Todo from './components/Todo';
import MeditationTimer from './components/MeditationTimer';
import Soundscape from './components/Soundscape';
import ProfilePage from './components/ProfilePage';
import Home from './components/Home';
import Login from './components/Login';
import MoodHeatmap from './components/MoodHeatmap';
import JournalEntries from './components/JournalEntries';
import { AuthProvider, AuthContext } from './components/AuthContext';
import PomodoroTimer from './components/PomodoroTimer';
import { useContext } from 'react';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  
  if (!isLoggedIn) {
    return <Navigate to="/Login" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/Journaling" element={
          <ProtectedRoute>
            <Journaling />
          </ProtectedRoute>
        } />
        <Route path="/Todo" element={
          <ProtectedRoute>
            <Todo />
          </ProtectedRoute>
        } />
        <Route path="/PomodoroTimer" element={
          <ProtectedRoute>
            <PomodoroTimer />
          </ProtectedRoute>
        } />
        <Route path="/Breathing-exercise" element={
          <ProtectedRoute>
            <Breathing />
          </ProtectedRoute>
        } />
        <Route path="/Meditation-timer" element={
          <ProtectedRoute>
            <MeditationTimer />
          </ProtectedRoute>
        } />
        <Route path="/Soundscape" element={
          <ProtectedRoute>
            <Soundscape />
          </ProtectedRoute>
        } />
        <Route path="/ProfilePage" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/HeatMap" element={
          <ProtectedRoute>
            <MoodHeatmap />
          </ProtectedRoute>
        } />
        <Route path="/JournalEntries" element={
          <ProtectedRoute>
            <JournalEntries />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;