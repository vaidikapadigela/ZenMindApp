import React, { useState, useEffect } from 'react';
import { useJournal } from './JournalContext';
import { useAuth } from './AuthContext';
import './MoodHeatmap.css';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const moodColors = {
  Happy: '#FFD700',
  Sad: '#6495ED',
  Excited: '#FF4500',
  Anxious: '#9370DB',
  Calm: '#90EE90',
  Energetic: '#FF6347',
  Tired: '#778899',
  Creative: '#FF69B4',
  default: '#E0E0E0'
};

const moodEmojis = {
  Happy: '😊',
  Sad: '😢',
  Excited: '🎉',
  Anxious: '😰',
  Calm: '🌿',
  Energetic: '⚡',
  Tired: '😴',
  Creative: '🎨',
  default: ''
};

function parseEntryDate(dateVal) {
  if (!dateVal) return null;
  if (typeof dateVal === 'string') {
    const m = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    const parsed = new Date(dateVal);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  const asDate = new Date(dateVal);
  return isNaN(asDate.getTime()) ? null : asDate;
}

const MoodHeatmap = ({ entries }) => {
  const { contextEntries } = useJournal();
  const { user } = useAuth();
  const usedEntries = entries || contextEntries || [];
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [weeks, setWeeks] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  useEffect(() => {
    const map = {};
    (usedEntries || []).forEach(e => {
      const d = parseEntryDate(e.date);
      if (!d) return;
      const key = getKey(d);
      map[key] = map[key] || [];
      map[key].push(e);
    });

    const jan1 = new Date(selectedYear, 0, 1);
    const start = new Date(jan1);
    start.setDate(jan1.getDate() - jan1.getDay()); // Sunday on or before Jan 1

    const weeksArr = Array.from({ length: 53 }, (_, wi) =>
      Array.from({ length: 7 }, (_, di) => {
        const d = new Date(start);
        d.setDate(start.getDate() + wi * 7 + di);
        const key = getKey(d);
        const entriesForDay = map[key] || [];
        return {
          date: d,
          key,
          entries: entriesForDay,
          mood: entriesForDay.length ? (entriesForDay[0].mood || 'default') : 'default'
        };
      })
    );
    setWeeks(weeksArr);
  }, [usedEntries, selectedYear]);

  const handleEnter = (e, day) => {
    if (!day) return;
    const rect = e.target.getBoundingClientRect();
    // Position tooltip above the cell with better positioning
    setTooltipPos({ 
      x: rect.left + rect.width / 2, 
      y: rect.top - 10 
    });
    setTooltip({
      date: day.date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      entries: day.entries || [],
      mood: day.mood
    });
  };

  const handleLeave = () => setTooltip(null);

  const daysWithEntries = weeks.flat().filter(d => d && d.entries && d.entries.length > 0).length;

  const monthLeftPercents = months.map((_, m) => {
    for (let wi = 0; wi < weeks.length; wi++) {
      if (weeks[wi].some(d => d.date.getFullYear() === selectedYear && d.date.getMonth() === m)) {
        return ((wi + 0.5) / weeks.length) * 100;
      }
    }
    return null;
  });

  return (
    <div className="mood-heatmap-container" style={{ position: 'relative' }}>
      {/* Title and year selector */}
      <div className="mood-heatmap-header">
        <h3 style={{ margin: 0, color: '#237658' }}>Yearly Mood Journey</h3>
        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y =>
            <option key={y} value={y}>{y}</option>
          )}
        </select>
      </div>

      {/* 🌈 Mood legend above heatmap */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 20
      }}>
        {Object.keys(moodColors).filter(m => m !== 'default').map((mood) => (
          <div
            key={mood}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 6,
              padding: '6px 10px'
            }}
          >
            <div style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              backgroundColor: moodColors[mood]
            }} />
            <span style={{ fontSize: 14 }}>
              {moodEmojis[mood]} {mood}
            </span>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="mood-heatmap-grid" style={{ position: 'relative' }}>
        <div className="mood-heatmap-months">
          {monthLeftPercents.map((p, idx) => p != null && (
            <div
              key={idx}
              className="mood-heatmap-month"
              style={{
                left: `${p}%`
              }}
            >
              {months[idx]}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginTop: 8 }}>
          <div style={{ width: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} style={{ height: 16, fontSize: 12, color: '#455b22' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flex: 1 }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {week.map((day, di) => {
                  const isCurrentYear = day.date.getFullYear() === selectedYear;
                  const hasEntry = day.entries && day.entries.length > 0;
                  const bg = hasEntry
                    ? moodColors[day.mood] || moodColors.default
                    : 'rgba(224,224,224,0.5)';
                  return (
                    <div
                      key={di}
                      onMouseEnter={(e) => handleEnter(e, day)}
                      onMouseLeave={handleLeave}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: bg,
                        opacity: isCurrentYear ? 1 : 0.3,
                        border: hasEntry ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip - Fixed positioning */}
        {tooltip && (
          <div
            style={{
              position: 'fixed',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
              background: '#282828',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: 8,
              zIndex: 9999,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontSize: 13,
              whiteSpace: 'nowrap',
              minWidth: 200
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>
              {tooltip.date}
            </div>
            {tooltip.entries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>
                  {tooltip.entries.length} journal {tooltip.entries.length === 1 ? 'entry' : 'entries'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Mood:</span>
                  <span>{moodEmojis[tooltip.mood]} {tooltip.mood}</span>
                </div>
              </div>
            ) : (
              <div style={{ color: '#aaa' }}>No entries for this day</div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '6px 10px', background: 'rgba(255,255,255,0.8)', borderRadius: 6 }}>
          {daysWithEntries} days with journal entries in {selectedYear}
        </div>
      </div>
    </div>
  );
};

export default MoodHeatmap;