// src/screens/FocusScreen.jsx
<<<<<<< HEAD
import { useState } from 'react';

export function FocusScreen({
  dailyTasks,
  timerState,
}) {
  const {
    timeLeft,
    durationMinutes,
    isRunning,
    mode,
    selectedTaskId,
    setSelectedTaskId,
    togglePlay,
    resetTimer,
    setPreset,
    setCustomMinutes,
  } = timerState;

  const [customInput, setCustomInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
=======
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
>>>>>>> ae2b701c0a8b9bf3ebc112e8ac3556b04166f003

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

<<<<<<< HEAD
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const mins = parseInt(customInput, 10);
    if (!isNaN(mins) && mins > 0) {
      setCustomMinutes(mins);
      setShowCustomModal(false);
      setCustomInput('');
    }
  };

  const progressPercent = Math.max(0, Math.min(100, ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100));

  return (
    <div className="focus-container">
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Deep Focus Studio</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Timer keeps running uninterrupted even when navigating tabs
        </p>
      </div>

      {/* Preset Badges & Custom Duration Selector */}
      <div className="focus-presets-wrapper">
        <button
          type="button"
          className={`btn-preset ${mode === 'focus' && durationMinutes === 25 ? 'active' : ''}`}
          onClick={() => setPreset('focus', 25)}
=======
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
>>>>>>> ae2b701c0a8b9bf3ebc112e8ac3556b04166f003
        >
          25m Focus
        </button>
        <button
          type="button"
<<<<<<< HEAD
          className={`btn-preset ${mode === 'focus' && durationMinutes === 45 ? 'active' : ''}`}
          onClick={() => setPreset('focus', 45)}
        >
          45m Deep
        </button>
        <button
          type="button"
          className={`btn-preset ${mode === 'focus' && durationMinutes === 60 ? 'active' : ''}`}
          onClick={() => setPreset('focus', 60)}
        >
          60m Sprint
        </button>
        <button
          type="button"
          className={`btn-preset ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => setPreset('shortBreak', 5)}
        >
          5m Break
        </button>
        <button
          type="button"
          className={`btn-preset ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => setPreset('longBreak', 15)}
        >
          15m Rest
        </button>
        <button
          type="button"
          className={`btn-preset btn-preset-custom ${mode === 'custom' ? 'active' : ''}`}
          onClick={() => setShowCustomModal(true)}
        >
          ⚙️ {mode === 'custom' ? `${durationMinutes}m Custom` : 'Custom...'}
        </button>
      </div>

      {/* Custom Duration Input Modal / Popup */}
      {showCustomModal && (
        <div className="card" style={{ width: '100%', maxWidth: '340px', marginBottom: '20px', border: '1px solid var(--color-primary)' }}>
          <form onSubmit={handleCustomSubmit}>
            <label className="form-label" style={{ textAlign: 'left' }}>Set Custom Session Duration (Minutes):</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="number"
                min="1"
                max="240"
                className="form-input"
                placeholder="e.g. 50"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                autoFocus
                required
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                Set
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowCustomModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modern Circular Timer Display */}
      <div className="timer-circle-wrapper">
        <svg className="timer-svg" viewBox="0 0 240 240">
          <circle
            className="timer-svg-bg"
            cx="120"
            cy="120"
            r="104"
          />
          <circle
            className="timer-svg-progress"
            cx="120"
            cy="120"
            r="104"
            style={{
              strokeDasharray: 653.45,
              strokeDashoffset: 653.45 - (653.45 * progressPercent) / 100,
            }}
          />
        </svg>

        <div className="timer-circle-inner">
          <span className="timer-digits">{formatTime(timeLeft)}</span>
          <span className="timer-mode-label">
            {mode.includes('Break') ? '☕ Rest & Recharge' : '🎯 Deep Focus'}
          </span>
          <span className="timer-sublabel">
            {durationMinutes} min total
          </span>
        </div>
=======
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
>>>>>>> ae2b701c0a8b9bf3ebc112e8ac3556b04166f003
      </div>

      {/* Linked Task Selector */}
      {dailyTasks && dailyTasks.length > 0 && (
<<<<<<< HEAD
        <div style={{ width: '100%', maxWidth: '340px', marginBottom: '22px' }}>
          <label className="form-label" style={{ textAlign: 'left' }}>📌 Attach session to today's task:</label>
=======
        <div style={{ width: '100%', maxWidth: '320px', marginBottom: '20px' }}>
          <label className="form-label" style={{ textAlign: 'left' }}>Focus on specific task:</label>
>>>>>>> ae2b701c0a8b9bf3ebc112e8ac3556b04166f003
          <select
            className="form-select"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
<<<<<<< HEAD
            <option value="">-- General Study / Open Session --</option>
            {dailyTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} {t.status === 'completed' ? '✓ (Completed)' : ''}
=======
            <option value="">-- General Study Session --</option>
            {dailyTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} {t.status === 'completed' ? '(Done)' : ''}
>>>>>>> ae2b701c0a8b9bf3ebc112e8ac3556b04166f003
              </option>
            ))}
          </select>
        </div>
      )}

<<<<<<< HEAD
      {/* Tactile Timer Buttons */}
      <div className="timer-controls">
        <button
          type="button"
          className={`btn-timer-action btn-timer-primary ${isRunning ? 'running' : ''}`}
          onClick={togglePlay}
        >
          {isRunning ? '⏸️ Pause Session' : '▶️ Start Focus'}
        </button>
        <button
          type="button"
          className="btn-timer-action btn-timer-secondary"
          onClick={resetTimer}
          title="Reset timer to start"
=======
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
>>>>>>> ae2b701c0a8b9bf3ebc112e8ac3556b04166f003
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default FocusScreen;
