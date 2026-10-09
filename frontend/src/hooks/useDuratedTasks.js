// src/hooks/useDuratedTasks.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export function useDuratedTasks(userId, onTaskCompleted) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.duratedTasks.getAll(userId);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addDuratedTask = async (title, durationDays, definitionOfDone) => {
    if (!title.trim() || !userId) return;
    try {
      const newTask = await api.duratedTasks.add(userId, title.trim(), durationDays, definitionOfDone);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeDuratedTask = async (taskId) => {
    if (!userId) return;
    try {
      const result = await api.duratedTasks.complete(taskId, userId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: result.status, urgency: 'none', days_left: 0 } : t))
      );
      if (onTaskCompleted) {
        onTaskCompleted();
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addDuratedTask,
    completeDuratedTask,
    refreshTasks: fetchTasks,
  };
}
