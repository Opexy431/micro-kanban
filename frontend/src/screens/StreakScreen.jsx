// src/screens/StreakScreen.jsx
export function StreakScreen({ streakData }) {
  const currentStreak = streakData?.current_streak || 0;
  const longestStreak = streakData?.longest_streak || 0;
  const todayCount = streakData?.today_count || 0;
  const graceAvailable = streakData?.grace_available;

  const milestones = [
    { days: 3, label: '3-Day Spark', icon: '⚡', unlocked: longestStreak >= 3 },
    { days: 7, label: '1-Week Flame', icon: '🔥', unlocked: longestStreak >= 7 },
    { days: 14, label: '2-Week Blaze', icon: '💥', unlocked: longestStreak >= 14 },
    { days: 30, label: 'Monthly Master', icon: '👑', unlocked: longestStreak >= 30 },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Streak & Consistency</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Small daily efforts compound into extraordinary results
        </p>
      </div>

      {/* Hero Streak Card */}
      <div className="card" style={{ textAlign: 'center', padding: '28px 16px', background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)', borderColor: '#fde68a' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🔥</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#b45309', lineHeight: 1.1 }}>
          {currentStreak} Day{currentStreak === 1 ? '' : 's'}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 600, marginTop: '4px' }}>
          Current Active Streak
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
          All-time longest streak: <strong>{longestStreak} days</strong>
        </p>
      </div>

      {/* Grace Period & Protection Info */}
      <div className="card">
        <div className="section-title">
          <span>🛡️ Streak Protection & Grace System</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
          Life happens. If you miss one day, your streak will be protected by a grace day so you don't lose your momentum.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontSize: '1.2rem' }}>{graceAvailable ? '✅' : '⏳'}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {graceAvailable ? 'Grace day currently active/applied' : 'Grace day available for protection'}
          </span>
        </div>
      </div>

      {/* Milestones / Badges */}
      <div className="card">
        <div className="section-title">
          <span>🏆 Streak Milestones</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {milestones.map((m) => (
            <div
              key={m.days}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                textAlign: 'center',
                backgroundColor: m.unlocked ? 'var(--color-surface)' : 'var(--color-bg)',
                opacity: m.unlocked ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{m.icon}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{m.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {m.days} Days {m.unlocked ? '✓' : '🔒'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StreakScreen;
