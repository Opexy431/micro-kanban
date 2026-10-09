// src/hooks/useStreak.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export function useStreak(userId) {
  const [streakData, setStreakData] = useState({
    current_streak: 0,
    longest_streak: 0,
    today_count: 0,
    grace_available: true,
  });
  const [progressData, setProgressData] = useState({
    weekly_chart: [],
    completion_rate: 0,
    best_day: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const [streakRes, progressRes] = await Promise.all([
        api.streaks.get(userId),
        api.progress.get(userId),
      ]);
      setStreakData(streakRes);
      setProgressData(progressRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    streakData,
    progressData,
    loading,
    error,
    refreshStats: fetchStats,
  };
}
