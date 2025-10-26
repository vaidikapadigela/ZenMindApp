import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useJournal } from './JournalContext';
import './ProfilePage.css';
import './MoodHeatmap.css';
import MoodHeatmap from "./MoodHeatmap";
const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { contextEntries } = useJournal();
  
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
            <h2>{user?.displayName || 'Welcome!'}</h2>
            <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
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
          <div className="stat-card heatmap-container">
            <MoodHeatmap entries={contextEntries} />
          </div>
        </div>

        <h2>Recent Journals</h2>
        <div className="journal-entries">
          
        </div>
        <br></br>
        <br></br>
          <div className="stat-card">
            <Link to="/JournalEntries" className="primary-button">View All My Entries</Link>
          </div>
          
      </div>
    </div>
  );
};

export default ProfilePage;