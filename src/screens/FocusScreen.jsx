// src/screens/FocusScreen.jsx
import { useState, useEffect, useRef } from 'react';

export function FocusScreen({ dailyTasks, onTaskCompleted }) {
  const DEFAULT_FOCUS_TIME = 25 * 60; // 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak'
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            // Handle timer finish
            alert(mode === 'focus' ? '🎉 Focus session finished! Take a break.' : '⏰ Break is over! Ready to focus?');
            return mode === 'focus' ? 5 * 60 : DEFAULT_FOCUS_TIME;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const togglePlay = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? DEFAULT_FOCUS_TIME : 5 * 60);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? DEFAULT_FOCUS_TIME : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="focus-container">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Deep Focus Timer</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Eliminate distractions and build momentum
        </p>
      </div>

      {/* Mode Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          className="btn"
          style={{
            backgroundColor: mode === 'focus' ? 'var(--color-primary)' : 'var(--color-bg)',
            color: mode === 'focus' ? '#fff' : 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            padding: '6px 14px',
            fontSize: '0.8rem',
          }}
          onClick={() => switchMode('focus')}
        >
          25m Focus
        </button>
        <button
          type="button"
          className="btn"
          style={{
            backgroundColor: mode === 'shortBreak' ? 'var(--color-primary)' : 'var(--color-bg)',
            color: mode === 'shortBreak' ? '#fff' : 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            padding: '6px 14px',
            fontSize: '0.8rem',
          }}
          onClick={() => switchMode('shortBreak')}
        >
          5m Break
        </button>
      </div>

      {/* Timer Circle */}
      <div className="timer-circle">
        <span className="timer-digits">{formatTime(timeLeft)}</span>
        <span className="timer-label">{mode === 'focus' ? 'Focusing' : 'Short Break'}</span>
      </div>

      {/* Linked Task Selector */}
      {dailyTasks && dailyTasks.length > 0 && (
        <div style={{ width: '100%', maxWidth: '320px', marginBottom: '20px' }}>
          <label className="form-label" style={{ textAlign: 'left' }}>Focus on specific task:</label>
          <select
            className="form-select"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <option value="">-- General Study Session --</option>
            {dailyTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} {t.status === 'completed' ? '(Done)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Controls */}
      <div className="timer-controls">
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '12px 28px', fontSize: '1rem' }}
          onClick={togglePlay}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button
          type="button"
          className="btn"
          style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '12px 20px' }}
          onClick={resetTimer}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default FocusScreen;
