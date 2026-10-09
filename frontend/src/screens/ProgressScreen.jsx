// src/screens/ProgressScreen.jsx
export function ProgressScreen({ progressData, streakData }) {
  const dailyActivity = progressData?.daily_activity || [];
  const maxCount = Math.max(1, ...dailyActivity.map((d) => d.count || 0));

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Weekly Progress</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Your performance breakdown for the current week
        </p>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="card">
        <div className="section-title">
          <span>📊 Daily Activity (Mon — Sun)</span>
          <span className="count-badge">{progressData?.weekly_total || 0} Total Completed</span>
        </div>

        <div className="chart-container">
          {dailyActivity.map((day) => {
            const heightPct = Math.max(8, Math.round(((day.count || 0) / maxCount) * 100));
            return (
              <div key={day.date} className="chart-column">
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {day.count || 0}
                </span>
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      height: `${heightPct}%`,
                      backgroundColor: day.count > 0 ? 'var(--color-primary)' : 'var(--color-border)'
                    }} 
                  />
                </div>
                <span className="bar-label">{day.day_label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-value">{progressData?.completion_rate || 0}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">{progressData?.best_day || 'None yet'}</div>
          <div className="stat-label">Peak Performance Day</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">{streakData?.current_streak || 0} 🔥</div>
          <div className="stat-label">Current Active Streak</div>
        </div>

        <div className="stat-box">
          <div className="stat-value">{progressData?.weekly_total || 0}</div>
          <div className="stat-label">Tasks Done This Week</div>
        </div>
      </div>
    </div>
  );
}

export default ProgressScreen;
