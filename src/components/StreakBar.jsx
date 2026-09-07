// src/components/StreakBar.jsx
export function StreakBar({ currentStreak = 0, longestStreak = 0, todayCount = 0, graceAvailable = false }) {
  return (
    <div className="streak-bar">
      <div className="streak-info">
        <div className="streak-flame">🔥</div>
        <div className="streak-text">
          <h4>{currentStreak} Day{currentStreak === 1 ? '' : 's'} Streak</h4>
          <p>{todayCount} task{todayCount === 1 ? '' : 's'} completed today (Best: {longestStreak} days)</p>
        </div>
      </div>
      {graceAvailable && (
        <span className="grace-tag" title="1 Grace Day active this week">
          🛡️ Grace Active
        </span>
      )}
    </div>
  );
}

export default StreakBar;
