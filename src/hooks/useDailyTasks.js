// src/hooks/useDailyTasks.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export function useDailyTasks(userId, onTaskCompleted) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.dailyTasks.getAll(userId);
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

  const addTask = async (title) => {
    if (!title.trim() || !userId) return;
    try {
      const newTask = await api.dailyTasks.add(userId, title.trim());
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleTask = async (taskId) => {
    if (!userId) return;
    try {
      const result = await api.dailyTasks.toggle(taskId, userId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: result.status } : t))
      );
      if (result.status === 'completed' && onTaskCompleted) {
        onTaskCompleted();
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    if (!userId) return;
    try {
      await api.dailyTasks.delete(taskId, userId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    refreshTasks: fetchTasks,
  };
}
