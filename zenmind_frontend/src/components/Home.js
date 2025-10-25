import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    {
      title: "Journaling",
      description: "Record your thoughts and emotions with our intuitive journaling tool.",
      icon: "📝",
      path: "/Journaling"
    },
    {
      title: "Task Management",
      description: "Keep track of your daily tasks and maintain productivity.",
      icon: "✓",
      path: "/Todo"
    },
    {
      title: "Meditation Timer",
      description: "Practice mindfulness with our customizable meditation timer.",
      icon: "⏱️",
      path: "/Meditation-timer"
    },
    {
      title: "Breathing Exercises",
      description: "Reduce stress with guided breathing techniques.",
      icon: "🌬️",
      path: "/Breathing-exercise"
    },
    {
      title: "Ambient Soundscapes",
      description: "Immerse yourself in calming audio environments.",
      icon: "🔊",
      path: "/Soundscape"
    },
    {
      title: "Pomodoro Timer",
      description: "Improve focus, reduce distractions, and manage mental fatigue.",
      icon: "⏱️",
      path: "/PomodoroTimer"
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ZenMind</h1>
          <p>Your personal sanctuary for mindfulness and mental wellness</p>
          <div className="hero-buttons">
            <Link to="/Todo" className="primary-button">Get Started</Link>
            <Link to="/ProfilePage" className="secondary-button">View Profile</Link>
          </div>
        </div>
      </div>

      <section className="features-section">
        <h2>Discover Inner Peace</h2>
        <p className="section-subtitle">Explore our suite of mindfulness tools designed to help you find balance in your daily life</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link to={feature.path} key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefits-content">
          <h2>Benefits of Mindfulness</h2>
          <ul className="benefits-list">
            <li>
              <span className="benefit-marker">01</span>
              <div>
                <h3>Reduced Stress</h3>
                <p>Regular mindfulness practice has been shown to lower cortisol levels and reduce overall stress.</p>
              </div>
            </li>
            <li>
              <span className="benefit-marker">02</span>
              <div>
                <h3>Improved Focus</h3>
                <p>Train your attention and enhance your ability to concentrate on tasks for longer periods.</p>
              </div>
            </li>
            <li>
              <span className="benefit-marker">03</span>
              <div>
                <h3>Better Sleep</h3>
                <p>Calm your mind before bed and develop healthier sleep patterns.</p>
              </div>
            </li>
            <li>
              <span className="benefit-marker">04</span>
              <div>
                <h3>Emotional Regulation</h3>
                <p>Develop greater awareness of your emotions and learn to respond rather than react.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      

      <section className="cta-section">
        <div className="cta-content">
          <h2>Begin Your Mindfulness Journey Today</h2>
          <p>Join thousands of users who have discovered greater peace and productivity with ZenMind.</p>
          <Link to="/Todo" className="cta-button">Start Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;