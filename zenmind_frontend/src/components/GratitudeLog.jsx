import React, { useState } from "react";
import "./GratitudeLog.css";

const GratitudeLog = () => {
  const [entries, setEntries] = useState(["", "", ""]);
  const [savedLogs, setSavedLogs] = useState([]);
  const token = localStorage.getItem('token');

  const handleChange = (index, value) => {
    const updated = [...entries];
    updated[index] = value;
    setEntries(updated);
  };

  const handleSave = () => {
    if (entries.some((e) => e.trim() === "")) {
      alert("Please fill in all three gratitude entries 🌸");
      return;
    }
    
    setSavedLogs([...savedLogs, { date: new Date(), items: entries }]);
    setEntries(["", "", ""]);
  };

  return (
    <div className="gratitude-container">
      <h2 className="gratitude-title">🌼 Gratitude Log</h2>
      <p className="gratitude-subtitle">
        Write three things you’re grateful for today.
      </p>

      <div className="gratitude-inputs">
        {entries.map((entry, index) => (
          <input
            key={index}
            type="text"
            className="gratitude-input"
            placeholder={`Grateful for #${index + 1}`}
            value={entry}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
      </div>

      <button className="gratitude-btn" onClick={handleSave}>
        Save Gratitude 🌿
      </button>

      {savedLogs.length > 0 && (
        <div className="gratitude-history">
          <h3>Previous Gratitude Logs</h3>
          {savedLogs.map((log, index) => (
            <div key={index} className="gratitude-card">
              <p className="gratitude-date">
                {log.date.toLocaleDateString()} — {log.date.toLocaleTimeString()}
              </p>
              <ul>
                {log.items.map((item, i) => (
                  <li key={i}>🌸 {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GratitudeLog;
