import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useJournal } from "./JournalContext";
import { useTodo } from "./TodoContext";
import "./ProfilePage.css";
import "./MoodHeatmap.css";
import MoodHeatmap from "./MoodHeatmap";

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


// --- STREAK CALCULATION LOGIC ---
const getJournalStreaks = (entries) => {
  if (!entries || entries.length === 0) return { current: 0, max: 0 };

  const dates = [
    ...new Set(
      entries
        .map((e) => {
          const d = new Date(e.date);
          return isNaN(d.getTime())
            ? null
            : d.toLocaleDateString("en-CA"); // use local date (fixes timezone)
        })
        .filter(Boolean)
    ),
  ].sort();

  let currentStreak = 0;
  let maxStreak = 0;
  let streak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) streak++;
    else {
      if (streak > maxStreak) maxStreak = streak;
      streak = 1;
    }
  }
  if (streak > maxStreak) maxStreak = streak;

  // --- calculate current streak ---
  const todayStr = new Date().toLocaleDateString("en-CA");
  const lastStr = dates[dates.length - 1];
  const diffFromToday =
    (new Date(todayStr) - new Date(lastStr)) / (1000 * 60 * 60 * 24);

  if (diffFromToday === 0 || diffFromToday === 1) {
    currentStreak = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      const prev = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      const diff = (next - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) currentStreak++;
      else break;
    }
  }

  return { current: currentStreak, max: maxStreak };
};

// --- REWARD LOGIC ---
const getRewards = (streak) => {
  const rewards = [];
  if (streak >= 2) rewards.push({ title: "✨ Consistency Starter", desc: "2-day streak achieved!" });
  if (streak >= 5) rewards.push({ title: "🌿 Mindful Explorer", desc: "5-day streak unlocked!" });
  if (streak >= 10) rewards.push({ title: "🌸 Zen Master", desc: "10-day streak achieved! Incredible discipline!" });
  return rewards;
};

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { contextEntries } = useJournal();
  const { tasks } = useTodo();
  const { current, max } = getJournalStreaks(contextEntries);
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const rewards = getRewards(current);

  return (
    <div className="journal-wrapper">
      <div className="journal-page">
        <h1>ZenMind Profile</h1>

        <div className="profile-section">
          <div className="profile-details">
            <p><strong>Username:</strong> {user?.username || user?.displayName || "Not available"}</p>
            <p><strong>Email:</strong> {user?.email || "Not available"}</p>
            <p><strong>Current Streak:</strong> {current} {current === 1 ? "Day" : "Days"}</p>
            <p><strong>Max Streak:</strong> {max} {max === 1 ? "Day" : "Days"}</p>
          </div>
        </div>

        <h2>Rewards</h2>
        <div className="stats-container">
          {rewards.length > 0 ? (
            rewards.map((reward, i) => (
              <div key={i} className="stat-card reward-card">
                <h3>{reward.title}</h3>
                <p>{reward.desc}</p>
              </div>
            ))
          ) : (
            <div className="stat-card reward-card locked">
              <h3>🔒 Keep journaling to unlock rewards!</h3>
              <p>Start your streak to earn your first badge.</p>
            </div>
          )}
        </div>

        <h2>Mindfulness Stats</h2>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <p>{pendingCount}</p>
          </div>
        </div>

        

        <h2>Activities</h2>
        <div className="stats-container">
          <div className="stat-card heatmap-container">
            <MoodHeatmap entries={contextEntries} />
          </div>
        </div>

        <h2>Recent Journals</h2>
<div className="journal-entries">
  {contextEntries && contextEntries.length > 0 ? (
    contextEntries.slice(0, 3).map((entry) => (
      <div key={entry.id || entry.date} className="journal-entry">
        <div className="entry-header">
          <h3>{entry.title || "Untitled"}</h3>
        </div>

        <div className="entry-meta">
          <div className="entry-date">
            📅 {entry.date} {entry.timestamp && `at ${entry.timestamp}`}
          </div>
          <div className="entry-mood">
            {getMoodEmoji(entry.mood)} {entry.mood}
          </div>
        </div>

        <p className="entry-content">{entry.journal || "(No content)"}</p>

        {Array.isArray(entry.tags) && entry.tags.length > 0 && (
          <div className="entry-tags">
            {entry.tags.map((tag, i) => (
              <span key={i} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    ))
  ) : (
    <p className="no-entries">No recent journal entries yet.</p>
  )}
</div>

      </div>
    </div>
  );
};

export default ProfilePage;
