import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Journaling.css";
import { useJournal } from "./JournalContext";

const Journaling = () => {
  const { contextEntries, contextAddEntry } = useJournal();

  // Local date helper (respects timezone)
  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  const [entry, setEntry] = useState({
    title: "",
    mood: "",
    date: getTodayDate(),
    journal: "",
    tags: [],
    addToCalendar: false,
  });

  const [tag, setTag] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle field input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEntry({ ...entry, [name]: type === "checkbox" ? checked : value });
  };

  // Add tag
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tag && !entry.tags.includes(tag)) {
      setEntry({ ...entry, tags: [...entry.tags, tag] });
      setTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setEntry({
      ...entry,
      tags: entry.tags.filter((t) => t !== tagToRemove),
    });
  };

  // Add journal entry
  const handleAddEntry = () => {
    if (entry.title && entry.mood && entry.date && entry.journal) {
      const toAdd = { ...entry };
      contextAddEntry(toAdd); // add to context (and localStorage)

      // Reset input fields
      setEntry({
        title: "",
        mood: "",
        date: getTodayDate(),
        journal: "",
        tags: [],
      });

      // Confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // Debugging aid — verify when entries update
  useEffect(() => {
    console.log("Context updated → entries:", contextEntries);
  }, [contextEntries]);

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      Happy: "😊",
      Sad: "😢",
      Excited: "🎉",
      Anxious: "😰",
      Calm: "🌿",
      Energetic: "⚡",
      Tired: "😴",
      Creative: "🎨",
    };
    return moodEmojis[mood] || "";
  };

  // Latest 3 entries safely
  const recentEntries = Array.isArray(contextEntries)
    ? contextEntries.slice(0, 3)
    : [];

  return (
    <div className="journal-wrapper">
      <div className="journal-page">
        <h1>My Daily Journal</h1>

        <Link to="/JournalEntries" className="primary-button">
          View Previous Entries
        </Link>
        <br></br>
        <br></br>
        {/* --- Form Section --- */}
        <div className="journal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={entry.title}
              onChange={handleInputChange}
              placeholder="Give your entry a title..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={entry.date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Mood *</label>
              <select
                name="mood"
                value={entry.mood}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select your mood
                </option>
                <option value="Happy">Happy 😊</option>
                <option value="Sad">Sad 😢</option>
                <option value="Excited">Excited 🎉</option>
                <option value="Anxious">Anxious 😰</option>
                <option value="Calm">Calm 🌿</option>
                <option value="Energetic">Energetic ⚡</option>
                <option value="Tired">Tired 😴</option>
                <option value="Creative">Creative 🎨</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Journal Entry *</label>
            <textarea
              name="journal"
              value={entry.journal}
              onChange={handleInputChange}
              placeholder="Write your thoughts here..."
            />
          </div>

          {/* --- Tags --- */}
          <div className="tags-section">
            <div className="tag-input-group">
              <input
                type="text"
                className="tag-input"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Add tags..."
              />
              <button onClick={handleAddTag} className="tag-button">
                Add Tag
              </button>
            </div>
            <div className="tags-container">
              {entry.tags.map((t, index) => (
                <span key={index} className="tag">
                  #{t}
                  <button
                    onClick={() => removeTag(t)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button onClick={handleAddEntry}>Save Entry</button>
        </div>

        {/* --- Recent Journals Section --- */}
        <div className="journal-entries">
          <h2>Recent Entries ({recentEntries.length})</h2>
          {recentEntries.length > 0 ? (
            recentEntries.map((e) => (
              <div key={e.id || e.date} className="journal-entry">
                <div className="entry-header">
                  <h3>{e.title || "Untitled"}</h3>
                </div>

                <div className="entry-meta">
                  <div className="entry-date">
                    📅 {e.date} {e.timestamp && `at ${e.timestamp}`}
                  </div>
                  <div className="entry-mood">
                    {getMoodEmoji(e.mood)} {e.mood}
                  </div>
                </div>

                <p className="entry-content">{e.journal || "(No content)"}</p>

                {Array.isArray(e.tags) && e.tags.length > 0 && (
                  <div className="entry-tags">
                    {e.tags.map((tag, i) => (
                      <span key={i} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-entries">No recent entries yet.</div>
          )}
        </div>

        {showConfetti && <div className="confetti">🎉</div>}
      </div>
    </div>
  );
};

export default Journaling;
