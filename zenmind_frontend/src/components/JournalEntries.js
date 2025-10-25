import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./JournalEntries.css";


const JournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries);
      
      // Extract all unique tags from entries
      const allTags = new Set();
      parsedEntries.forEach(entry => {
        entry.tags.forEach(tag => allTags.add(tag));
      });
      setAvailableTags(Array.from(allTags));
    }
  }, []);

  const handleDeleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const updatedEntries = entries.filter((e) => e.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
      
      // Update available tags
      const allTags = new Set();
      updatedEntries.forEach(entry => {
        entry.tags.forEach(tag => allTags.add(tag));
      });
      setAvailableTags(Array.from(allTags));
    }
  };

  const toggleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setFilter("all");
    setSearchTerm("");
    setSelectedTags([]);
    setSortBy("newest");
  };

  const filteredEntries = entries
    .filter((e) => {
      // Filter by mood
      if (filter === "all") return true;
      return e.mood === filter;
    })
    .filter((e) => {
      // Filter by search term
      return Object.values(e).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((e) => {
      // Filter by selected tags
      if (selectedTags.length === 0) return true;
      return selectedTags.every(tag => e.tags.includes(tag));
    })
    .sort((a, b) => {
      // Sort entries
      if (sortBy === "newest") {
        return b.id - a.id;
      } else if (sortBy === "oldest") {
        return a.id - b.id;
      } else if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      } else {
        return 0;
      }
    });

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      Happy: "😊",
      Sad: "😢",
      Excited: "🎉",
      Anxious: "😰",
      Calm: "🌿",
      Energetic: "⚡",
      Tired: "😴",
      Creative: "🎨"
    };
    return moodEmojis[mood] || "";
  };

  return (
    <div className="journal-entries-wrapper">
      <div className="journal-entries-page">
        <header className="entries-header">
          <h1>Journal Entries</h1>
          <Link to="/" className="primary-button">Back to Journal</Link>
        </header>

        <div className="filters-container">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-options">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mood-filter"
            >
              <option value="all">All Moods</option>
              <option value="Happy">Happy 😊</option>
              <option value="Sad">Sad 😢</option>
              <option value="Excited">Excited 🎉</option>
              <option value="Anxious">Anxious 😰</option>
              <option value="Calm">Calm 🌿</option>
              <option value="Energetic">Energetic ⚡</option>
              <option value="Tired">Tired 😴</option>
              <option value="Creative">Creative 🎨</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-filter"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>

            <button onClick={clearFilters} className="clear-filters-button">
              Clear Filters
            </button>
          </div>
        </div>

        {availableTags.length > 0 && (
          <div className="tags-filter">
            <h3>Filter by Tags:</h3>
            <div className="available-tags">
              {availableTags.map((tag, index) => (
                <span
                  key={index}
                  className={`filter-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => toggleTagFilter(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="entries-stats">
          <p>Showing {filteredEntries.length} of {entries.length} entries</p>
        </div>

        <div className="entries-grid">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((e) => (
              <div key={e.id} className="entry-card">
                <div className="entry-card-header">
                  <h3 className="entry-title">{e.title}</h3>
                  <button
                    onClick={() => handleDeleteEntry(e.id)}
                    className="delete-button"
                    aria-label="Delete entry"
                  >
                    ×
                  </button>
                </div>
                <div className="entry-meta">
                  <span className="entry-date">
                    📅 {e.date} at {e.timestamp}
                  </span>
                  <span className="entry-mood">
                    {getMoodEmoji(e.mood)} {e.mood}
                  </span>
                </div>
                <p className="entry-preview">{e.journal.length > 150 ? `${e.journal.substring(0, 150)}...` : e.journal}</p>
                {e.tags.length > 0 && (
                  <div className="entry-tags">
                    {e.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-entries">
              <p>No entries found. Adjust your filters or start journaling!</p>
              <Link to="/" className="primary-button">Create New Entry</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalEntries;