import React from "react";
import { Link } from 'react-router-dom';
import './ProfilePage.css';
import MoodHeatmap from "./MoodHeatmap";
const ProfilePage = () => {
  return (
    <div className="journal-wrapper">
      <div className="journal-page">
        <h1>ZenMind Profile</h1>
        <div className="profile-section">
          {/* <img
            src="/profile-pic-placeholder.png"
            alt="Profile"
            className="profile-pic"
          /> */}
          <div className="profile-details">
            <h2>John Doe</h2>
            <p><strong>Email:</strong> johndoe@gmail.com</p>
            <p><strong>Journaling Streak:</strong> 0 Days</p>
            
          </div>
        </div>

        <h2>Mindfulness Stats</h2>
        <div className="stats-container">
          
          
        <div className="stat-card">
            <h3>Pending Tasks</h3>
            <p>0</p>
          </div>
          
        </div>
        <h2>Activities</h2>
        <div className="stats-container">
        <div className="stat-card">

          <div className="stat-card">
            <MoodHeatmap/>
            {/* <Link to="/HeatMap" className="primary-button">View My Heatmap</Link> */}
            
          </div>
          
        </div>
        </div>

        <h2>Recent Journals</h2>
        <div className="journal-entries">
          
        </div>
        <br></br>
        <br></br>
        <div className="stat-card">
            <Link to="/JournalEntries" className="primary-button">View All My Enteries</Link>
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;