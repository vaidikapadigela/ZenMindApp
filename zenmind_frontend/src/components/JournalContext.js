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
        setContextEntries(JSON.parse(savedEntries));
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
    setContextEntries([newEntry, ...contextEntries]);
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