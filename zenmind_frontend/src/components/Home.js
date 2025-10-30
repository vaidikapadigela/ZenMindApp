import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const mindfulnessFeatures = [
    { title: "Worry Release", description: "Let go of your worries with guided release prompts.", icon: "🌤️", path: "/WorryRelease" },
    { title: "Gratitude Log", description: "Reflect daily and nurture gratitude for the little things.", icon: "🙏", path: "/GratitudeLog" },
    { title: "Journal", description: "Record your thoughts and emotions anytime, anywhere.", icon: "📝", path: "/Journaling" },
    { title: "Soundscape", description: "Immerse yourself in relaxing ambient sounds.", icon: "🎧", path: "/Soundscape" },
    { title: "Meditation Timer", description: "Time your mindfulness sessions for focus and calm.", icon: "⏱️", path: "/Meditation-timer" },
    { title: "Breathing Exercises", description: "Reduce stress with guided breathing techniques.", icon: "🌬️", path: "/Breathing-exercise" },
  ];

  const productivityTools = [
    { title: "To-Do List", description: "Organize your day and stay on top of your goals.", icon: "📋", path: "/Todo" },
    { title: "Pomodoro Timer", description: "Work efficiently with timed focus and short breaks.", icon: "🍅", path: "/PomodoroTimer" },
  ];

  const gamesForRelaxation = [
    { title: "Memory Game", description: "Train your brain with fun tile-matching puzzles.", icon: "🧠", path: "/ZenMemoryGame" },
    { title: "Sudoku", description: "Challenge your logic and focus with Sudoku puzzles.", icon: "🔢", path: "/Sudoku" },
    { title: "Tic Tac Toe", description: "Classic game to relax and refresh your mind.", icon: "❌⭕", path: "/TicTacToe" },
    { title: "Scribble", description: "Express creativity through doodles and sketches.", icon: "🎨", path: "/ColouringBook" },
    { title: "Breakout", description: "Smash bricks and unwind with this arcade classic.", icon: "🧱", path: "/BreakoutGame" },
    { title: "Clicker", description: "Tap away and relieve stress with a simple clicker game.", icon: "🖱️", path: "/ClickerGame" },
    { title: "2048", description: "Relax while merging numbers to reach 2048!", icon: "🔢", path: "/Game2048" },
    { title: "Maze", description: "Find your way out and enjoy a mindful challenge.", icon: "🌀", path: "/MazeGame" },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ZenMind</h1>
          <p>Your personal sanctuary for mindfulness, relaxation, and focus</p>
          <div className="hero-buttons">
            <Link to="/Emotion" className="primary-button">Detect Emotion</Link>
            <Link to="/ProfilePage" className="secondary-button">View Profile</Link>
          </div>
        </div>
      </div>

      {/* Mood Match Section */}
      <section className="mood-match-section">
        <h2>Feeling This? Try That!</h2>
        <p className="section-subtitle">
          Not sure where to start? Let your emotions guide you 💫 <br />
          You can also try our <Link to="/Emotion" className="inline-link">Emotion Detection</Link> & get personalized suggestions to help you navigate ZenMind better.
        </p>
        <div className="mood-grid">
          <div className="mood-card">
            <h3>😌 Feeling Stressed?</h3>
            <p>Try <Link to="/Breathing-exercise">Breathing Exercises</Link> or unwind with <Link to="/Soundscape">Soundscape</Link>.</p>
          </div>
          <div className="mood-card">
            <h3>💭 Feeling Overwhelmed?</h3>
            <p>Release it all with <Link to="/WorryRelease">Worry Release</Link> or relax with <Link to="/TicTacToe">Tic Tac Toe</Link>.</p>
          </div>
          <div className="mood-card">
            <h3>✨ Feeling Grateful?</h3>
            <p>Write it down in your <Link to="/GratitudeLog">Gratitude Log</Link> and keep the positivity flowing.</p>
          </div>
          <div className="mood-card">
            <h3>🎯 Need Focus?</h3>
            <p>Boost productivity using the <Link to="/PomodoroTimer">Pomodoro Timer</Link> or plan your day with the <Link to="/Todo">To-Do List</Link>.</p>
          </div>
          <div className="mood-card">
            <h3>😔 Feeling Low?</h3>
            <p>Lift your spirits through <Link to="/Journaling">Journaling</Link> or relax with <Link to="/Soundscape">Calming Sounds</Link>.</p>
          </div>
          <div className="mood-card">
            <h3>😴 Feeling Bored?</h3>
            <p>Recharge your mind with <Link to="/ZenMemoryGame">Memory Game</Link> or <Link to="/Scribble">Scribble</Link> something fun!</p>
          </div>
        </div>
      </section>

      {/* Mindfulness Tools */}
      <section className="features-section">
        <h2>Mindfulness Tools</h2>
        <p className="section-subtitle">Explore tools that help you calm your mind and nurture inner peace</p>
        <div className="features-grid">
          {mindfulnessFeatures.map((feature, index) => (
            <Link to={feature.path} key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productivity Tools */}
      <section className="features-section">
        <h2>Productivity Tools</h2>
        <p className="section-subtitle">Stay focused, organized, and in control of your tasks</p>
        <div className="features-grid">
          {productivityTools.map((feature, index) => (
            <Link to={feature.path} key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Games for Relaxation */}
      <section className="features-section">
        <h2>Games for Relaxation</h2>
        <p className="section-subtitle">Take a mindful break with our collection of relaxing games</p>
        <div className="features-grid">
          {gamesForRelaxation.map((feature, index) => (
            <Link to={feature.path} key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <h2>Benefits of Mindfulness</h2>
          <ul className="benefits-list">
            <li><span className="benefit-marker">01</span><div><h3>Reduced Stress</h3><p>Calm your nervous system and feel lighter.</p></div></li>
            <li><span className="benefit-marker">02</span><div><h3>Improved Focus</h3><p>Boost attention span and work smarter.</p></div></li>
            <li><span className="benefit-marker">03</span><div><h3>Better Sleep</h3><p>Unwind before bed and wake up refreshed.</p></div></li>
            <li><span className="benefit-marker">04</span><div><h3>Emotional Awareness</h3><p>Understand your emotions deeply and respond with calm.</p></div></li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Start Your Mindful Journey</h2>
          <p>Let ZenMind guide you toward a calmer, happier, and more productive self.</p>
          <Link to="/Emotion" className="cta-button">Detect Emotion & Get Suggestions</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
