// src/screens/FocusScreen.jsx
import { useState, useEffect } from 'react';
import { api } from '../api/client';

export function FocusScreen({
  dailyTasks,
  timerState,
  user,
  toggleDailyTask,
  sessionCompleteInfo,
  setSessionCompleteInfo
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
  const [isLoggingSession, setIsLoggingSession] = useState(false);

  // Effect to automatically log session when it pops up
  useEffect(() => {
    if (sessionCompleteInfo && user?.id && !isLoggingSession) {
      setIsLoggingSession(true);
      api.focusSessions.log(
        user.id,
        sessionCompleteInfo.selectedTaskId,
        sessionCompleteInfo.durationMinutes
      ).catch(err => {
        console.error("Failed to log focus session to DB", err);
      }).finally(() => {
        setIsLoggingSession(false);
      });
    }
  }, [sessionCompleteInfo, user]);

  const handleModalClose = () => {
    setSessionCompleteInfo(null);
  };

  const handleModalCompleteTask = async () => {
    if (sessionCompleteInfo?.selectedTaskId) {
      await toggleDailyTask(parseInt(sessionCompleteInfo.selectedTaskId, 10));
    }
    setSessionCompleteInfo(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

  // Find linked task if any
  const linkedTask = sessionCompleteInfo?.selectedTaskId 
    ? dailyTasks?.find(t => t.id === parseInt(sessionCompleteInfo.selectedTaskId, 10))
    : null;

  return (
    <div className="focus-container">
      {/* Session Complete Modal */}
      {sessionCompleteInfo && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '90%', maxWidth: '400px', backgroundColor: 'var(--color-bg)' }}>
            <h3 style={{ marginTop: 0 }}>🎉 Focus Session Complete!</h3>
            <p>Great job! You stayed focused for {sessionCompleteInfo.durationMinutes} minutes.</p>
            
            {linkedTask && linkedTask.status !== 'completed' ? (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--color-surface)', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 15px 0' }}>Did you finish <strong>{linkedTask.title}</strong>?</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleModalCompleteTask}>
                    Yes, mark complete!
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleModalClose}>
                    Keep going
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleModalClose}>Awesome</button>
              </div>
            )}
          </div>
        </div>
      )}
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
        >
          25m Focus
        </button>
        <button
          type="button"
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
      </div>

      {/* Linked Task Selector */}
      {dailyTasks && dailyTasks.length > 0 && (
        <div style={{ width: '100%', maxWidth: '340px', marginBottom: '22px' }}>
          <label className="form-label" style={{ textAlign: 'left' }}>📌 Attach session to today's task:</label>
          <select
            className="form-select"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <option value="">-- General Study / Open Session --</option>
            {dailyTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} {t.status === 'completed' ? '✓ (Completed)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

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
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default FocusScreen;
