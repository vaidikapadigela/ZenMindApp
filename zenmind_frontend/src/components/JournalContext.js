import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const JournalContext = createContext();

// Create provider component
export const JournalProvider = ({ children }) => {
  const [contextEntries, setContextEntries] = useState([]);
  
  // Load entries from localStorage on initial render
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        // Helper: robustly parse a date-like value into a local Date
        const parseEntryDate = (dateVal) => {
          if (!dateVal) return null;
          if (typeof dateVal === 'string') {
            const m = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (m) {
              const y = Number(m[1]);
              const mm = Number(m[2]);
              const dd = Number(m[3]);
              return new Date(y, mm - 1, dd);
            }
            const asDate = new Date(dateVal);
            return isNaN(asDate.getTime()) ? null : asDate;
          }
          const asDate = new Date(dateVal);
          return isNaN(asDate.getTime()) ? null : asDate;
        };

        // Normalize entries so date is stored as YYYY-MM-DD (local date)
        const normalized = parsed.map((e) => {
          try {
            const d = parseEntryDate(e.date);
            if (d) {
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              return { ...e, date: `${yyyy}-${mm}-${dd}` };
            }
          } catch (_err) {
            // fall through
          }
          return e;
        });

        setContextEntries(normalized);
        // Persist normalized representation back to localStorage to avoid future parsing issues
        try {
          localStorage.setItem('journalEntries', JSON.stringify(normalized));
        } catch (_err) {
          // ignore storage errors
        }
      } catch (error) {
        console.error("Error parsing entries from localStorage:", error);
        setContextEntries([]);
      }
    }
  }, []);
  
  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(contextEntries));
  }, [contextEntries]);
  
  // Add a new entry
  const contextAddEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString()
    };
    // Use functional update to avoid stale state when adding entries
    setContextEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };
  
  // Delete an entry
  const contextDeleteEntry = (id) => {
    setContextEntries(contextEntries.filter(entry => entry.id !== id));
  };
  
  // Sync with existing components' entries state
  const syncEntries = (entries) => {
    setContextEntries(entries);
  };
  
  return (
    <JournalContext.Provider 
      value={{ 
        contextEntries, 
        contextAddEntry,
        contextDeleteEntry,
        syncEntries
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

// Custom hook to use the journal context
export const useJournal = () => useContext(JournalContext);