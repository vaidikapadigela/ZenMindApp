// import React, { useState, useEffect } from 'react';

// const MoodHeatmap = ({ entries }) => {
//   const [yearData, setYearData] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [tooltipContent, setTooltipContent] = useState(null);
//   const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];
  
//   // Use your existing mood colors
//   const moodColors = {
//     "Happy": "#FFD700", // Gold
//     "Sad": "#6495ED", // Blue
//     "Excited": "#FF4500", // Orange-Red
//     "Anxious": "#9370DB", // Purple
//     "Calm": "#90EE90", // Light Green
//     "Energetic": "#FF6347", // Tomato
//     "Tired": "#778899", // Slate Gray
//     "Creative": "#FF69B4", // Hot Pink
//     "default": "#E0E0E0" // Light Gray for days with no entries
//   };
  
//   const moodEmojis = {
//     "Happy": "😊",
//     "Sad": "😢",
//     "Excited": "🎉",
//     "Anxious": "😰",
//     "Calm": "🌿",
//     "Energetic": "⚡",
//     "Tired": "😴",
//     "Creative": "🎨",
//     "default": ""
//   };

//   // Generate calendar data for the selected year
//   useEffect(() => {
//     // Create a matrix of days - 7 rows (days of week) and 53 columns (weeks in year)
//     const grid = Array(7).fill().map(() => Array(53).fill(null));
    
//     // Get first day of the year
//     const firstDay = new Date(selectedYear, 0, 1);
    
//     // Calculate days in the year (accounting for leap years)
//     const daysInYear = ((selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0) ? 366 : 365;
    
//     // Fill the grid with days
//     for (let dayOfYear = 0; dayOfYear < daysInYear; dayOfYear++) {
//       const currentDate = new Date(selectedYear, 0, dayOfYear + 1);
//       const weekday = currentDate.getDay(); // 0-6 (Sunday to Saturday)
//       const weekNumber = Math.floor((dayOfYear + firstDay.getDay()) / 7);
      
//       if (weekNumber < 53) {
//         grid[weekday][weekNumber] = {
//           date: new Date(currentDate),
//           mood: "default",
//           entries: []
//         };
//       }
//     }
    
//     // Add entries to the corresponding days
//     if (entries && entries.length > 0) {
//       entries.forEach(entry => {
//         const entryDate = new Date(entry.date);
//         if (entryDate.getFullYear() === selectedYear) {
//           const weekday = entryDate.getDay();
//           const dayOfYear = Math.floor((entryDate - new Date(selectedYear, 0, 1)) / (24 * 60 * 60 * 1000));
//           const weekNumber = Math.floor((dayOfYear + firstDay.getDay()) / 7);
          
//           if (weekNumber < 53 && grid[weekday][weekNumber]) {
//             // If multiple entries on the same day, use the latest one for mood
//             grid[weekday][weekNumber].entries.push(entry);
//             // Sort entries by date descending and use the latest entry's mood
//             if (grid[weekday][weekNumber].entries.length > 0) {
//               grid[weekday][weekNumber].entries.sort((a, b) => 
//                 new Date(b.date).getTime() - new Date(a.date).getTime()
//               );
//               grid[weekday][weekNumber].mood = grid[weekday][weekNumber].entries[0].mood || "default";
//             }
//           }
//         }
//       });
//     }
    
//     setYearData(grid);
//   }, [entries, selectedYear]);

//   const handleYearChange = (e) => {
//     setSelectedYear(parseInt(e.target.value));
//   };

//   const handleCellMouseEnter = (e, cell) => {
//     if (cell) {
//       const rect = e.target.getBoundingClientRect();
//       setTooltipPosition({
//         x: rect.left + window.scrollX,
//         y: rect.top + window.scrollY - 40
//       });
      
//       const date = cell.date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//       });
      
//       setTooltipContent({
//         date,
//         mood: cell.mood,
//         entries: cell.entries
//       });
//     }
//   };

//   const handleCellMouseLeave = () => {
//     setTooltipContent(null);
//   };

//   const styles = {
//     container: {
//       backgroundColor: 'var(--card-background)',
//       padding: '28px',
//       borderRadius: '16px',
//       boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
//       marginBottom: '40px',
//       border: '1px solid rgba(255, 255, 255, 0.3)',
//       transition: 'all 0.3s ease',
//       position: 'relative',
//       overflow: 'hidden'
//     },
//     header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '24px',
//       borderBottom: '2px solid var(--background-color2)',
//       paddingBottom: '16px'
//     },
//     title: {
//       color: 'var(--header-color)',
//       fontSize: '1.8rem',
//       fontWeight: 'bold',
//       margin: 0,
//       textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
//     },
//     yearSelector: {
//       padding: '10px 14px',
//       border: '2px solid var(--text-color)',
//       borderRadius: '8px',
//       backgroundColor: 'rgba(255, 255, 255, 0.9)',
//       color: 'var(--text-color)',
//       fontSize: '16px',
//       fontWeight: '500',
//       cursor: 'pointer',
//       transition: 'all 0.2s ease',
//       outline: 'none',
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
//     },
//     legendContainer: {
//       display: 'flex',
//       flexWrap: 'wrap',
//       gap: '12px',
//       marginBottom: '24px',
//       justifyContent: 'center',
//       padding: '12px',
//       backgroundColor: 'rgba(255, 255, 255, 0.3)',
//       borderRadius: '12px'
//     },
//     legendItem: {
//       display: 'flex',
//       alignItems: 'center',
//       marginRight: '12px',
//       fontSize: '0.9rem',
//       padding: '4px 8px',
//       borderRadius: '6px',
//       backgroundColor: 'rgba(255, 255, 255, 0.7)',
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
//       transition: 'transform 0.2s ease'
//     },
//     legendColor: {
//       width: '14px',
//       height: '14px',
//       borderRadius: '4px',
//       marginRight: '6px',
//       border: '1px solid rgba(0, 0, 0, 0.1)'
//     },
//     heatmapWrapper: {
//       position: 'relative',
//       padding: '8px 0',
//       marginTop: '8px',
//       backgroundColor: 'rgba(255, 255, 255, 0.5)',
//       borderRadius: '12px',
//       boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)'
//     },
//     monthsRow: {
//       display: 'flex',
//       marginLeft: '38px',
//       marginBottom: '8px'
//     },
//     monthLabel: {
//       width: `${100 / 13}%`,
//       fontSize: '0.8rem',
//       fontWeight: '600',
//       color: 'var(--text-color)',
//       textAlign: 'center'
//     },
//     gridContainer: {
//       display: 'flex',
//       paddingLeft: '4px'
//     },
//     daysColumn: {
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'space-around',
//       paddingRight: '12px',
//       width: '24px',
//     },
//     dayLabel: {
//       fontSize: '0.8rem',
//       fontWeight: '600',
//       color: 'var(--text-color)',
//       height: '16px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginRight: '4px'
//     },
//     cellsGrid: {
//       display: 'grid',
//       gridTemplateRows: 'repeat(7, 1fr)',
//       gridAutoFlow: 'column',
//       gap: '3px',
//       flex: 1,
//       paddingRight: '4px'
//     },
//     cell: {
//       width: '14px',
//       height: '14px',
//       borderRadius: '3px',
//       cursor: 'pointer',
//       transition: 'all 0.2s ease',
//       boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
//     },
//     tooltip: {
//       position: 'absolute',
//       backgroundColor: 'rgba(40, 40, 40, 0.95)',
//       color: 'white',
//       padding: '12px',
//       borderRadius: '8px',
//       fontSize: '0.85rem',
//       zIndex: 10,
//       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
//       maxWidth: '220px',
//       border: '1px solid rgba(255, 255, 255, 0.1)'
//     },
//     tooltipDate: {
//       fontWeight: 'bold',
//       marginBottom: '6px',
//       borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
//       paddingBottom: '4px'
//     },
//     tooltipMood: {
//       display: 'flex',
//       alignItems: 'center',
//       marginTop: '6px'
//     },
//     tooltipEntries: {
//       marginTop: '6px',
//       fontSize: '0.75rem',
//       opacity: 0.9
//     },
//     summaryText: {
//       marginTop: '20px',
//       textAlign: 'center',
//       fontSize: '0.95rem',
//       color: 'var(--text-color)',
//       fontWeight: '500',
//       padding: '8px 12px',
//       backgroundColor: 'rgba(255, 255, 255, 0.7)',
//       borderRadius: '8px',
//       display: 'inline-block',
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
//     },
//     summaryContainer: {
//       textAlign: 'center'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Decorative background element */}
//       <div style={{
//         position: 'absolute',
//         top: '-50px',
//         right: '-50px',
//         width: '150px',
//         height: '150px',
//         borderRadius: '50%',
//         background: 'radial-gradient(circle, var(--gold-color) 0%, transparent 70%)',
//         opacity: 0.1,
//         zIndex: 0
//       }}></div>
      
//       <div style={styles.header}>
//         <h2 style={styles.title}>Yearly Mood Journey</h2>
        
//         <select 
//           value={selectedYear} 
//           onChange={handleYearChange}
//           style={styles.yearSelector}
//         >
//           {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
//             <option key={year} value={year}>{year}</option>
//           ))}
//         </select>
//       </div>
      
//       {/* Mood legend */}
//       <div style={styles.legendContainer}>
//         {Object.keys(moodEmojis).filter(mood => mood !== "default").map(mood => (
//           <div key={mood} style={{
//             ...styles.legendItem,
//             ':hover': {
//               transform: 'scale(1.05)'
//             }
//           }}>
//             <div style={{ 
//               ...styles.legendColor, 
//               backgroundColor: moodColors[mood]
//             }}></div>
//             <span>{mood} {moodEmojis[mood]}</span>
//           </div>
//         ))}
//       </div>
      
//       <div style={styles.heatmapWrapper}>
//         {/* Month labels on top */}
//         <div style={styles.monthsRow}>
//           {months.map((month) => (
//             <div key={month} style={styles.monthLabel}>
//               {month}
//             </div>
//           ))}
//         </div>
        
//         {/* Weekday labels on left and grid cells */}
//         <div style={styles.gridContainer}>
//           <div style={styles.daysColumn}>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
//               <div key={day} style={styles.dayLabel}>{day[0]}</div>
//             ))}
//           </div>
          
//           <div style={styles.cellsGrid}>
//             {yearData.map((row, rowIndex) => (
//               row.map((cell, colIndex) => {
//                 const hasEntries = cell && cell.entries.length > 0;
//                 return (
//                   <div 
//                     key={`${rowIndex}-${colIndex}`} 
//                     style={{ 
//                       ...styles.cell,
//                       backgroundColor: cell ? moodColors[cell.mood] : 'rgba(224, 224, 224, 0.5)',
//                       border: hasEntries ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.03)',
//                       transform: hasEntries ? 'scale(1)' : 'scale(0.85)',
//                       opacity: hasEntries ? 1 : 0.6,
//                     }}
//                     onMouseEnter={(e) => handleCellMouseEnter(e, cell)}
//                     onMouseLeave={handleCellMouseLeave}
//                   />
//                 );
//               })
//             ))}
//           </div>
//         </div>
        
//         {/* Tooltip */}
//         {tooltipContent && tooltipContent.entries.length > 0 && (
//           <div style={{ 
//             ...styles.tooltip,
//             left: `${tooltipPosition.x}px`,
//             top: `${tooltipPosition.y}px`,
//             transform: 'translateX(-50%)'
//           }}>
//             <div style={styles.tooltipDate}>{tooltipContent.date}</div>
//             <div style={styles.tooltipMood}>
//               <span style={{ marginRight: '8px' }}>Mood:</span> 
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '2px 8px',
//                 backgroundColor: moodColors[tooltipContent.mood],
//                 color: tooltipContent.mood === 'Happy' ? '#333' : '#fff',
//                 borderRadius: '4px'
//               }}>
//                 {tooltipContent.mood} {moodEmojis[tooltipContent.mood]}
//               </div>
//             </div>
//             {tooltipContent.entries.length > 1 && (
//               <div style={styles.tooltipEntries}>
//                 {tooltipContent.entries.length} journal entries for this day
//               </div>
//             )}
//           </div>
//         )}
//       </div>
      
//       <div style={styles.summaryContainer}>
//         <div style={styles.summaryText}>
//           {yearData.flat().filter(cell => cell && cell.entries.length > 0).length} days with journal entries in {selectedYear}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MoodHeatmap;

import React, { useState, useEffect } from 'react';

// MoodHeatmap Component
const MoodHeatmap = ({ entries }) => {
  const [yearData, setYearData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const moodColors = {
    "Happy": "#FFD700",
    "Sad": "#6495ED",
    "Excited": "#FF4500",
    "Anxious": "#9370DB",
    "Calm": "#90EE90",
    "Energetic": "#FF6347",
    "Tired": "#778899",
    "Creative": "#FF69B4",
    "default": "#E0E0E0"
  };
  
  const moodEmojis = {
    "Happy": "😊",
    "Sad": "😢",
    "Excited": "🎉",
    "Anxious": "😰",
    "Calm": "🌿",
    "Energetic": "⚡",
    "Tired": "😴",
    "Creative": "🎨",
    "default": ""
  };

  useEffect(() => {
    const grid = Array(7).fill().map(() => Array(53).fill(null));
    const firstDay = new Date(selectedYear, 0, 1);
    const daysInYear = ((selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0) ? 366 : 365;
    
    for (let dayOfYear = 0; dayOfYear < daysInYear; dayOfYear++) {
      const currentDate = new Date(selectedYear, 0, dayOfYear + 1);
      const weekday = currentDate.getDay();
      const weekNumber = Math.floor((dayOfYear + firstDay.getDay()) / 7);
      
      if (weekNumber < 53) {
        grid[weekday][weekNumber] = {
          date: new Date(currentDate),
          mood: "default",
          entries: []
        };
      }
    }
    
    if (entries && entries.length > 0) {
      entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.getFullYear() === selectedYear) {
          const weekday = entryDate.getDay();
          const dayOfYear = Math.floor((entryDate - new Date(selectedYear, 0, 1)) / (24 * 60 * 60 * 1000));
          const weekNumber = Math.floor((dayOfYear + firstDay.getDay()) / 7);
          
          if (weekNumber < 53 && grid[weekday][weekNumber]) {
            grid[weekday][weekNumber].entries.push(entry);
            if (grid[weekday][weekNumber].entries.length > 0) {
              grid[weekday][weekNumber].entries.sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              grid[weekday][weekNumber].mood = grid[weekday][weekNumber].entries[0].mood || "default";
            }
          }
        }
      });
    }
    
    setYearData(grid);
  }, [entries, selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleCellMouseEnter = (e, cell) => {
    if (cell) {
      const rect = e.target.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 40
      });
      
      const date = cell.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      setTooltipContent({
        date,
        mood: cell.mood,
        entries: cell.entries
      });
    }
  };

  const handleCellMouseLeave = () => {
    setTooltipContent(null);
  };

  return (
    <div style={{
      backgroundColor: 'rgba(252, 234, 217, 0.95)',
      padding: '28px',
      borderRadius: '16px',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
      marginBottom: '40px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #E5B73B 0%, transparent 70%)',
        opacity: 0.1,
        zIndex: 0
      }}></div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '2px solid #f2e6c7',
        paddingBottom: '16px'
      }}>
        <h2 style={{
          color: '#237658',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          margin: 0,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
        }}>Yearly Mood Journey</h2>
        
        <select 
          value={selectedYear} 
          onChange={handleYearChange}
          style={{
            padding: '10px 14px',
            border: '2px solid #455b22',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#455b22',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
        justifyContent: 'center',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '12px'
      }}>
        {Object.keys(moodEmojis).filter(mood => mood !== "default").map(mood => (
          <div key={mood} style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '12px',
            fontSize: '0.9rem',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '4px',
              marginRight: '6px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: moodColors[mood]
            }}></div>
            <span>{mood} {moodEmojis[mood]}</span>
          </div>
        ))}
      </div>
      
      <div style={{
        position: 'relative',
        padding: '8px 0',
        marginTop: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '12px',
        boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          marginLeft: '38px',
          marginBottom: '8px'
        }}>
          {months.map((month) => (
            <div key={month} style={{
              width: `${100 / 13}%`,
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#455b22',
              textAlign: 'center'
            }}>
              {month}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', paddingLeft: '4px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            paddingRight: '12px',
            width: '24px'
          }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#455b22',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '4px'
              }}>{day[0]}</div>
            ))}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 1fr)',
            gridAutoFlow: 'column',
            gap: '3px',
            flex: 1,
            paddingRight: '4px'
          }}>
            {yearData.map((row, rowIndex) => (
              row.map((cell, colIndex) => {
                const hasEntries = cell && cell.entries.length > 0;
                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`} 
                    style={{ 
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                      backgroundColor: cell ? moodColors[cell.mood] : 'rgba(224, 224, 224, 0.5)',
                      border: hasEntries ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.03)',
                      transform: hasEntries ? 'scale(1)' : 'scale(0.85)',
                      opacity: hasEntries ? 1 : 0.6
                    }}
                    onMouseEnter={(e) => handleCellMouseEnter(e, cell)}
                    onMouseLeave={handleCellMouseLeave}
                  />
                );
              })
            ))}
          </div>
        </div>
        
        {tooltipContent && tooltipContent.entries.length > 0 && (
          <div style={{ 
            position: 'absolute',
            backgroundColor: 'rgba(40, 40, 40, 0.95)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            maxWidth: '220px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%)'
          }}>
            <div style={{
              fontWeight: 'bold',
              marginBottom: '6px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              paddingBottom: '4px'
            }}>{tooltipContent.date}</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '6px'
            }}>
              <span style={{ marginRight: '8px' }}>Mood:</span> 
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '2px 8px',
                backgroundColor: moodColors[tooltipContent.mood],
                color: tooltipContent.mood === 'Happy' ? '#333' : '#fff',
                borderRadius: '4px'
              }}>
                {tooltipContent.mood} {moodEmojis[tooltipContent.mood]}
              </div>
            </div>
            {tooltipContent.entries.length > 1 && (
              <div style={{
                marginTop: '6px',
                fontSize: '0.75rem',
                opacity: 0.9
              }}>
                {tooltipContent.entries.length} journal entries for this day
              </div>
            )}
          </div>
        )}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '0.95rem',
          color: '#455b22',
          fontWeight: '500',
          padding: '8px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '8px',
          display: 'inline-block',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          {yearData.flat().filter(cell => cell && cell.entries.length > 0).length} days with journal entries in {selectedYear}
        </div>
      </div>
    </div>
  );
}

export default MoodHeatmap;