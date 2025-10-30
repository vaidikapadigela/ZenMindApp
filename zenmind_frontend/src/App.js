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
import { JournalProvider } from './components/JournalContext';
import PomodoroTimer from './components/PomodoroTimer';
import EmotionDetectionPage from './components/EmotionDetectionPage';
import WorryRelease from './components/WorryRelease';
import GratitudeLog from './components/GratitudeLog';
import ZenMemoryGame from './components/ZenGames/ZenMemoryGame';
import TicTacToe from './components/ZenGames/TicTacToe';
import Sudoku from './components/ZenGames/Sudoku';
import ColouringBook from './components/ZenGames/ColouringBook';
import BreakoutGame from './components/ZenGames/BreakoutGame';
import ClickerGame from './components/ZenGames/ClickerGame';
import Game2048 from './components/ZenGames/Game2048';
import MazeGame from './components/ZenGames/MazeGame';
import SnakeGame from './components/ZenGames/SnakeGame';
import FlappyBird from './components/ZenGames/FlappyBird';
import SlidingPuzzleGame from './components/ZenGames/SlidingPuzzleGame';
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
        <Route path="/WorryRelease" element={
          <ProtectedRoute>
            <WorryRelease />
          </ProtectedRoute>
        } />
        <Route path="/Sudoku" element={
          <ProtectedRoute>
            <Sudoku />
          </ProtectedRoute>
        } />
        <Route path="/TicTacToe" element={
          <ProtectedRoute>
            <TicTacToe />
          </ProtectedRoute>
        } />
        <Route path="/ColouringBook" element={
          <ProtectedRoute>
            <ColouringBook />
          </ProtectedRoute>
        } />
          <Route path="/BreakoutGame" element={
            <ProtectedRoute>
              <BreakoutGame />
            </ProtectedRoute>
          } />
        <Route path="/ClickerGame" element={
          <ProtectedRoute>
            <ClickerGame />
          </ProtectedRoute>
        } />
        <Route path="/Game2048" element={
          <ProtectedRoute>
            <Game2048 />
          </ProtectedRoute>
        } />
         <Route path="/MazeGame" element={
          <ProtectedRoute>
            <MazeGame />
          </ProtectedRoute>
        } />
        <Route path="/SnakeGame" element={
          <ProtectedRoute>
            <SnakeGame />
          </ProtectedRoute>
        } />
        <Route path="/FlappyBird" element={
          <ProtectedRoute>
            <FlappyBird />
          </ProtectedRoute>
        } />
        <Route path="/SlidingPuzzleGame" element={
          <ProtectedRoute>
            <SlidingPuzzleGame />
          </ProtectedRoute>
        } />
        <Route path="/ZenMemoryGame" element={
          <ProtectedRoute>
            <ZenMemoryGame />
          </ProtectedRoute>
        } />
        <Route path="/Todo" element={
          <ProtectedRoute>
            <Todo />
          </ProtectedRoute>
        } />
        <Route path="/Emotion" element={
          <ProtectedRoute>
            <EmotionDetectionPage />
          </ProtectedRoute>
        } />
        <Route path="/PomodoroTimer" element={
          <ProtectedRoute>
            <PomodoroTimer />
          </ProtectedRoute>
        } />
        <Route path="/GratitudeLog" element={
          <ProtectedRoute>
            <GratitudeLog />
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
      <JournalProvider>
        <Router>
          <AppRoutes />
        </Router>
      </JournalProvider>
    </AuthProvider>
  );
}

export default App;