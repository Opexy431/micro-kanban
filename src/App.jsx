// src/App.jsx
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useDailyTasks } from './hooks/useDailyTasks';
import { useDuratedTasks } from './hooks/useDuratedTasks';
import { useStreak } from './hooks/useStreak';

import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { FocusScreen } from './screens/FocusScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { StreakScreen } from './screens/StreakScreen';
import { BottomNav } from './components/BottomNav';

function App() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeScreen, setActiveScreen] = useState('dashboard'); // 'dashboard' | 'focus' | 'progress' | 'streaks'

  // Hooks for logged in user data
  const {
    streakData,
    progressData,
    refreshStats,
  } = useStreak(user?.id);

  const {
    tasks: dailyTasks,
    addTask: addDailyTask,
    toggleTask: toggleDailyTask,
    deleteTask: deleteDailyTask,
  } = useDailyTasks(user?.id, refreshStats);

  const {
    tasks: duratedTasks,
    addDuratedTask,
    completeDuratedTask,
  } = useDuratedTasks(user?.id, refreshStats);

  // ── Unauthenticated Flow ──
  if (!isAuthenticated) {
    return (
      <div className="app-container">
        {authView === 'login' ? (
          <LoginScreen
            onLogin={login}
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterScreen
            onRegister={register}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </div>
    );
  }

  // ── Authenticated Flow ──
  return (
    <div className="app-container">
      {/* Top App Header */}
      <header className="app-header">
        <div className="app-brand">
          <span>⚡</span>
          <span>Micro-Kanban</span>
        </div>

        <div className="user-badge">
          <span>{user?.name}</span>
          <button
            type="button"
            className="btn-logout"
            onClick={logout}
            title="Log out of account"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main Screen Body */}
      <main className="main-content">
        {activeScreen === 'dashboard' && (
          <DashboardScreen
            dailyTasks={dailyTasks}
            duratedTasks={duratedTasks}
            streakData={streakData}
            onAddDailyTask={addDailyTask}
            onToggleDailyTask={toggleDailyTask}
            onDeleteDailyTask={deleteDailyTask}
            onAddDuratedTask={addDuratedTask}
            onCompleteDuratedTask={completeDuratedTask}
          />
        )}

        {activeScreen === 'focus' && (
          <FocusScreen
            dailyTasks={dailyTasks}
            onTaskCompleted={refreshStats}
          />
        )}

        {activeScreen === 'progress' && (
          <ProgressScreen
            progressData={progressData}
            streakData={streakData}
          />
        )}

        {activeScreen === 'streaks' && (
          <StreakScreen
            streakData={streakData}
          />
        )}
      </main>

      {/* Persistent Bottom Nav */}
      <BottomNav
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
      />
    </div>
  );
}

export default App;