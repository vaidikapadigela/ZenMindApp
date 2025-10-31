import React, { useState } from "react";
import "./GratitudeLog.css";

const GratitudeLog = () => {
  const [entries, setEntries] = useState(["", "", ""]);
  const [savedLogs, setSavedLogs] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editEntries, setEditEntries] = useState([]);

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
    setSavedLogs([
      ...savedLogs,
      { date: new Date(), items: entries, edited: false },
    ]);
    setEntries(["", "", ""]);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditEntries([...savedLogs[index].items]);
  };

  const handleEditChange = (i, value) => {
    const updated = [...editEntries];
    updated[i] = value;
    setEditEntries(updated);
  };

  const handleSaveEdit = (index) => {
    const updatedLogs = [...savedLogs];
    updatedLogs[index].items = [...editEntries];
    updatedLogs[index].edited = true;
    setSavedLogs(updatedLogs);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditEntries([]);
  };

  const handleDelete = (index) => {
    // ✅ Permanently remove the log
    const updatedLogs = savedLogs.filter((_, i) => i !== index);
    setSavedLogs(updatedLogs);
  };

  return (
    <div className="gratitude-container">
      <div className="gratitude-box">
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
      </div>

      {savedLogs.length > 0 && (
        <div className="gratitude-history">
          <h3>Previous Gratitude Logs</h3>
          {savedLogs.map((log, index) => (
            <div key={index} className="gratitude-card">
              <div className="gratitude-card-header">
                <p className="gratitude-date">
                  {log.date.toLocaleDateString()} —{" "}
                  {log.date.toLocaleTimeString()}
                  {log.edited && (
                    <span className="edited-badge"> ✏️ Edited</span>
                  )}
                </p>
              </div>

              {editingIndex === index ? (
                <div className="gratitude-edit-section">
                  {editEntries.map((entry, i) => (
                    <input
                      key={i}
                      type="text"
                      className="gratitude-input edit-input"
                      value={entry}
                      onChange={(e) => handleEditChange(i, e.target.value)}
                    />
                  ))}
                  <div className="edit-btns">
                    <button
                      className="gratitude-btn save-btn"
                      onClick={() => handleSaveEdit(index)}
                    >
                      💾 Save Changes
                    </button>
                    <button
                      className="gratitude-btn cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <ul>
                    {log.items.map((item, i) => (
                      <li key={i}>🌸 {item}</li>
                    ))}
                  </ul>
                  <div className="card-btns">
                    <button
                      className="gratitude-btn edit-btn"
                      onClick={() => handleEdit(index)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="gratitude-btn delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GratitudeLog;
