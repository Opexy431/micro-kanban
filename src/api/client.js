// src/api/client.js
// Centralized API client communicating with the Flask backend

const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Could not connect to backend server. Make sure Flask is running on http://localhost:5000');
    }
    throw err;
  }
}

export const api = {
  // ── AUTH ──
  auth: {
    register: (name, email, password, mode = 'study') =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, mode }),
      }),

    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },

  // ── DAILY TASKS ──
  dailyTasks: {
    getAll: (userId) =>
      request(`/daily-tasks?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
      }),

    add: (userId, title) =>
      request('/daily-tasks', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, title }),
      }),

    toggle: (taskId, userId) =>
      request(`/daily-tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ user_id: userId }),
      }),

    delete: (taskId, userId) =>
      request(`/daily-tasks/${taskId}?user_id=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      }),
  },

  // ── DURATED TASKS ──
  duratedTasks: {
    getAll: (userId) =>
      request(`/durated-tasks?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
      }),

    add: (userId, title, durationDays, definitionOfDone) =>
      request('/durated-tasks', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          title,
          duration_days: durationDays,
          definition_of_done: definitionOfDone || null,
        }),
      }),

    complete: (taskId, userId) =>
      request(`/durated-tasks/${taskId}/complete`, {
        method: 'PUT',
        body: JSON.stringify({ user_id: userId }),
      }),
  },

  // ── STREAKS ──
  streaks: {
    get: (userId) =>
      request(`/streaks?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
      }),
  },

  // ── PROGRESS ──
  progress: {
    get: (userId) =>
      request(`/progress?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
      }),
  },
};

export default api;
