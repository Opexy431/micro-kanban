// src/hooks/useFocusTimer.js
import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'mk_timer';

export function useFocusTimer(onSessionComplete) {
  // Initialize state from localStorage if available
  const getInitialState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          durationMinutes: parsed.durationMinutes || 25,
          timeLeft: parsed.timeLeft || 25 * 60,
          mode: parsed.mode || 'focus',
          selectedTaskId: parsed.selectedTaskId || '',
          isRunning: false, // Always start paused on refresh
        };
      }
    } catch (err) {
      console.error("Failed to parse timer state", err);
    }
    return {
      durationMinutes: 25,
      timeLeft: 25 * 60,
      mode: 'focus',
      selectedTaskId: '',
      isRunning: false,
    };
  };

  const initialState = getInitialState();
  
  const [durationMinutes, setDurationMinutes] = useState(initialState.durationMinutes);
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  const [mode, setMode] = useState(initialState.mode); // 'focus' | 'shortBreak' | 'longBreak' | 'custom'
  const [selectedTaskId, setSelectedTaskId] = useState(initialState.selectedTaskId);
  const timerRef = useRef(null);

  // Persist state to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      durationMinutes,
      timeLeft,
      mode,
      selectedTaskId,
    }));
  }, [durationMinutes, timeLeft, mode, selectedTaskId]);

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

            // Instead of raw alert, call the callback to handle DB logging & modal
            if (onSessionComplete) {
              onSessionComplete({ durationMinutes, selectedTaskId, mode });
            }
            
            return durationMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, durationMinutes, mode, selectedTaskId, onSessionComplete]);

  const togglePlay = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
    localStorage.removeItem(STORAGE_KEY);
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
