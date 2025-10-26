import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./Journaling.css";
import { useJournal } from './JournalContext';

const Journaling = () => {
  const { contextEntries, contextAddEntry } = useJournal();
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const [entry, setEntry] = useState({
    title: "",
    mood: "",
    date: getTodayDate(),
    journal: "",
    tags: [],
    addToCalendar: false
  });
  const [tag, setTag] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEntry({ ...entry, [name]: type === 'checkbox' ? checked : value });
  };

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
      tags: entry.tags.filter((t) => t !== tagToRemove)
    });
  };

  const handleAddEntry = () => {
    if (entry.title && entry.mood && entry.date && entry.journal) {
      const toAdd = { ...entry };
      contextAddEntry(toAdd);
      setEntry({ title: "", mood: "", date: getTodayDate(), journal: "", tags: [] });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      alert("Please fill in all required fields.");
    }
  };

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
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#fefae9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(252, 234, 217, 0.95)',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
      }}>
        <h1 style={{
          color: '#237658',
          fontSize: '2.5rem',
          marginBottom: '30px',
          textAlign: 'center'
        }}>My Daily Journal</h1>

        <Link to="/HeatMap" className="primary-button">View Heatmap</Link>
        <br></br>
        <br></br>
      <Link to="/JournalEntries" className="primary-button">View Previous Enteries</Link>
     <br></br>
     <br></br>
        

        {/* Journal Form */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#237658',
              marginBottom: '8px',
              display: 'block'
            }}>Title *</label>
            <input
              type="text"
              name="title"
              value={entry.title}
              onChange={handleInputChange}
              placeholder="Give your entry a title..."
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1rem',
                border: '2px solid #455b22',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: '#237658',
                marginBottom: '8px',
                display: 'block'
              }}>Date *</label>
              <input
                type="date"
                name="date"
                value={entry.date}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1rem',
                  border: '2px solid #455b22',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: '#237658',
                marginBottom: '8px',
                display: 'block'
              }}>Mood *</label>
              <select
                name="mood"
                value={entry.mood}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1rem',
                  border: '2px solid #455b22',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>Select your mood</option>
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#237658',
              marginBottom: '8px',
              display: 'block'
            }}>Journal Entry *</label>
            <textarea
              name="journal"
              value={entry.journal}
              onChange={handleInputChange}
              placeholder="Write your thoughts here..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '15px',
                fontSize: '1rem',
                border: '2px solid #455b22',
                borderRadius: '8px',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Add tags..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #455b22',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <button onClick={handleAddTag} style={{
                padding: '12px 24px',
                backgroundColor: '#F2827F',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                Add Tag
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {entry.tags.map((tag, index) => (
                <span key={index} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  backgroundColor: '#237658',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}>
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      marginLeft: '8px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '0 4px'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button onClick={handleAddEntry} style={{
            backgroundColor: '#F2827F',
            color: 'white',
            padding: '16px 32px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'block',
            margin: '20px auto 0',
            maxWidth: '300px',
            width: '100%'
          }}>
            Save Entry
          </button>
        </div>

        {/* Recent Entries Preview */}
        <div>
          <h2 style={{
            color: '#237658',
            fontSize: '1.8rem',
            marginBottom: '20px'
          }}>Recent Entries ({contextEntries.slice(0, 3).length})</h2>
          {contextEntries.slice(0, 3).map((e) => (
            <div key={e.id} style={{
              padding: '25px',
              borderRadius: '8px',
              backgroundColor: '#f2e6c7',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#237658', margin: '0 0 10px 0' }}>{e.title}</h3>
              <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '15px',
                fontSize: '0.9rem',
                color: '#455b22'
              }}>
                <span>📅 {e.date} at {e.timestamp}</span>
                <span>{getMoodEmoji(e.mood)} {e.mood}</span>
              </div>
              <p style={{ margin: '12px 0', lineHeight: '1.6' }}>{e.journal}</p>
              {e.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                  {e.tags.map((tag, index) => (
                    <span key={index} style={{
                      padding: '6px 12px',
                      backgroundColor: '#237658',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {showConfetti && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '5rem',
            animation: 'confettiAnimation 3s ease-out forwards',
            pointerEvents: 'none'
          }}>🎉</div>
        )}
      </div>
    </div>
  );
};

export default Journaling;