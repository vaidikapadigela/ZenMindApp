import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Journaling.css";
import axios from "axios";
import { useJournal } from "./JournalContext";

const Journaling = () => {
  const { contextEntries, contextAddEntry, contextDeleteEntry, syncEntries } = useJournal();

  const getTodayDate = () => new Date().toLocaleDateString("en-CA");

  const [entry, setEntry] = useState({
    title: "",
    mood: "",
    date: getTodayDate(),
    journal: "",
    tags: [],
    addToCalendar: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [editEntry, setEditEntry] = useState({
    title: "",
    mood: "",
    date: "",
    journal: "",
    tags: [],
  });

  const [tag, setTag] = useState("");
  const [editTag, setEditTag] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Input change for add form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEntry({ ...entry, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Add tag
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tag && !entry.tags.includes(tag)) {
      setEntry({ ...entry, tags: [...entry.tags, tag] });
      setTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setEntry({
      ...entry,
      tags: entry.tags.filter((t) => t !== tagToRemove),
    });
  };

  // ✅ Add tag in edit mode
  const handleAddEditTag = (e) => {
    e.preventDefault();
    if (editTag && !editEntry.tags.includes(editTag)) {
      setEditEntry({ ...editEntry, tags: [...editEntry.tags, editTag] });
      setEditTag("");
    }
  };

  const removeEditTag = (tagToRemove) => {
    setEditEntry({
      ...editEntry,
      tags: editEntry.tags.filter((t) => t !== tagToRemove),
    });
  };

  // ✅ Add new entry - FIXED with userId
  const handleAddEntry = async () => {
    if (entry.title && entry.mood && entry.date && entry.journal) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Get userId from token or localStorage
        let userId = localStorage.getItem("userId");
        
        // If userId not in localStorage, decode from token
        if (!userId && token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.userId || payload.id;
          } catch (e) {
            console.error("Error decoding token:", e);
          }
        }

        const entryData = {
          ...entry,
          userId: userId // Add userId to the entry
        };

        const res = await axios.post(
          "http://localhost:5000/api/journal", 
          entryData, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Update context with new entry
        syncEntries([res.data, ...contextEntries]);
        
        setEntry({
          title: "",
          mood: "",
          date: getTodayDate(),
          journal: "",
          tags: [],
          addToCalendar: false,
        });

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      } catch (err) {
        console.error("Error saving journal:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to save journal entry.";
        alert(`Error: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // ✅ Edit start
  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEditEntry({
      title: entry.title || "",
      mood: entry.mood || "",
      date: entry.date ? entry.date.slice(0, 10) : getTodayDate(),
      journal: entry.journal || "",
      tags: entry.tags || [],
    });
  };

  // ✅ Save edit - FIXED
  const handleSaveEdit = async () => {
    if (!editEntry.title || !editEntry.mood || !editEntry.journal) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/journal/${editingId}`,
        editEntry,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        const updatedEntries = contextEntries.map((e) =>
          e._id === editingId ? res.data : e
        );
        syncEntries(updatedEntries);
        setEditingId(null);
        setEditEntry({ title: "", mood: "", date: "", journal: "", tags: [] });
      }
    } catch (err) {
      console.error("Error updating journal:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to update entry.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditEntry({ title: "", mood: "", date: "", journal: "", tags: [] });
    setEditTag("");
  };

  // ✅ Delete entry - FIXED
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/journal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const updatedEntries = contextEntries.filter((e) => e._id !== id);
        syncEntries(updatedEntries);
      }
    } catch (err) {
      console.error("Error deleting journal:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete entry.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch journals from backend on load
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/journal", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data)) {
          syncEntries(res.data.reverse());
        }
      } catch (err) {
        console.error("Error fetching journals:", err);
      }
    };
    fetchJournals();
  }, []);

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

        <div className="journal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={entry.title}
              onChange={handleInputChange}
              placeholder="Give your entry a title..."
              disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Mood *</label>
              <select 
                name="mood" 
                value={entry.mood} 
                onChange={handleInputChange}
                disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div className="tags-section">
            <div className="tag-input-group">
              <input
                type="text"
                className="tag-input"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Add tags..."
                disabled={loading}
              />
              <button onClick={handleAddTag} className="tag-button" disabled={loading}>
                Add Tag
              </button>
            </div>
            <div className="tags-container">
              {entry.tags.map((t, i) => (
                <span key={i} className="tag">
                  #{t}
                  <button onClick={() => removeTag(t)} className="tag-remove">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button onClick={handleAddEntry} disabled={loading}>
            {loading ? "Saving..." : "Save Entry"}
          </button>
        </div>

        <div className="journal-entries">
          <h2>Recent Entries ({recentEntries.length})</h2>
          {recentEntries.length > 0 ? (
            recentEntries.map((e) => (
              <div key={e._id} className="journal-entry">
                {editingId === e._id ? (
                  <div className="edit-section">
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={editEntry.title}
                        onChange={(ev) =>
                          setEditEntry({ ...editEntry, title: ev.target.value })
                        }
                        placeholder="Title"
                        className="edit-input"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Date *</label>
                        <input
                          type="date"
                          value={editEntry.date}
                          onChange={(ev) =>
                            setEditEntry({ ...editEntry, date: ev.target.value })
                          }
                          className="edit-input"
                          disabled={loading}
                        />
                      </div>

                      <div className="form-group">
                        <label>Mood *</label>
                        <select
                          value={editEntry.mood}
                          onChange={(ev) =>
                            setEditEntry({ ...editEntry, mood: ev.target.value })
                          }
                          className="edit-select"
                          disabled={loading}
                        >
                          <option value="">Select mood</option>
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
                        value={editEntry.journal}
                        onChange={(ev) =>
                          setEditEntry({ ...editEntry, journal: ev.target.value })
                        }
                        placeholder="Edit your thoughts..."
                        className="edit-textarea"
                        disabled={loading}
                      />
                    </div>

                    {/* Edit Tags Section */}
                    <div className="tags-section">
                      <label>Tags</label>
                      <div className="tag-input-group">
                        <input
                          type="text"
                          className="tag-input"
                          value={editTag}
                          onChange={(e) => setEditTag(e.target.value)}
                          placeholder="Add tags..."
                          disabled={loading}
                        />
                        <button 
                          onClick={handleAddEditTag} 
                          className="tag-button"
                          disabled={loading}
                        >
                          Add Tag
                        </button>
                      </div>
                      <div className="tags-container">
                        {editEntry.tags.map((t, i) => (
                          <span key={i} className="tag">
                            #{t}
                            <button 
                              onClick={() => removeEditTag(t)} 
                              className="tag-remove"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="entry-buttons">
                      <button 
                        className="save-btn" 
                        onClick={handleSaveEdit}
                        disabled={loading}
                      >
                        💾 {loading ? "Saving..." : "Save"}
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{e.title || "Untitled"}</h3>
                    <div className="entry-meta">
                      <div>📅 {e.date}</div>
                      <div>
                        {getMoodEmoji(e.mood)} {e.mood}
                      </div>
                    </div>
                    <p className="entry-content">{e.journal}</p>
                    {Array.isArray(e.tags) && e.tags.length > 0 && (
                      <div className="entry-tags">
                        {e.tags.map((t, i) => (
                          <span key={i} className="tag">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="entry-buttons">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEdit(e)}
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(e._id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
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