// src/hooks/useFocusTimer.js
import { useState, useEffect, useRef } from 'react';

export function useFocusTimer() {
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak' | 'custom'
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            
            // Audio/alert notification
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              osc.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.5);
            } catch {
              // Ignore audio context errors
            }

            alert(mode.includes('Break') ? '⏰ Break is over! Ready to focus?' : '🎉 Focus session completed! Great job!');
            return durationMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, durationMinutes, mode]);

  const togglePlay = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
  };

  const setPreset = (presetMode, minutes) => {
    setIsRunning(false);
    setMode(presetMode);
    setDurationMinutes(minutes);
    setTimeLeft(minutes * 60);
  };

  const setCustomMinutes = (minutes) => {
    const validMins = Math.max(1, Math.min(240, Number(minutes) || 25));
    setIsRunning(false);
    setMode('custom');
    setDurationMinutes(validMins);
    setTimeLeft(validMins * 60);
  };

  return {
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
  };
}
