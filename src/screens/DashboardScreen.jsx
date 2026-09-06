// src/screens/DashboardScreen.jsx
import { QuoteDisplay } from '../components/QuoteDisplay';
import { StreakBar } from '../components/StreakBar';
import { DailyTaskCard } from '../components/DailyTaskCard';
import { AddDailyTaskForm } from '../components/AddDailyTaskForm';
import { DuratedTaskCard } from '../components/DuratedTaskCard';
import { AddDuratedTaskForm } from '../components/AddDuratedTaskForm';

export function DashboardScreen({
  dailyTasks,
  duratedTasks,
  streakData,
  onAddDailyTask,
  onToggleDailyTask,
  onDeleteDailyTask,
  onAddDuratedTask,
  onCompleteDuratedTask,
}) {
  const pendingDaily = dailyTasks.filter((t) => t.status !== 'completed');
  const completedDaily = dailyTasks.filter((t) => t.status === 'completed');

  const activeDurated = duratedTasks.filter((t) => t.status === 'active');
  const finishedDurated = duratedTasks.filter((t) => t.status !== 'active');

  return (
    <div>
      {/* 1. Motivational Daily Quote */}
      <QuoteDisplay />

      {/* 2. Streak Summary Banner */}
      <StreakBar
        currentStreak={streakData.current_streak}
        longestStreak={streakData.longest_streak}
        todayCount={streakData.today_count}
        graceAvailable={streakData.grace_available}
      />

      {/* 3. Daily Tasks Section */}
      <div className="card">
        <div className="section-title">
          <span>📅 Today's Tasks</span>
          <span className="count-badge">
            {completedDaily.length}/{dailyTasks.length} Done
          </span>
        </div>

        <AddDailyTaskForm onAdd={onAddDailyTask} />

        {dailyTasks.length === 0 ? (
          <div className="empty-state">
            ✨ No tasks for today yet. Add your first task above!
          </div>
        ) : (
          <div>
            {pendingDaily.map((task) => (
              <DailyTaskCard
                key={task.id}
                task={task}
                onToggle={onToggleDailyTask}
                onDelete={onDeleteDailyTask}
              />
            ))}

            {completedDaily.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                  COMPLETED TODAY ({completedDaily.length})
                </div>
                {completedDaily.map((task) => (
                  <DailyTaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleDailyTask}
                    onDelete={onDeleteDailyTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Durated / Goal-Based Tasks Section */}
      <div className="card">
        <div className="section-title">
          <span>🎯 Long-Term & Durated Goals</span>
          <span className="count-badge">{activeDurated.length} Active</span>
        </div>

        <AddDuratedTaskForm onAdd={onAddDuratedTask} />

        {duratedTasks.length === 0 ? (
          <div className="empty-state">
            No long-term goals yet. Set a 7-day or 14-day target above!
          </div>
        ) : (
          <div>
            {activeDurated.map((task) => (
              <DuratedTaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteDuratedTask}
              />
            ))}

            {finishedDurated.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                  PAST GOALS ({finishedDurated.length})
                </div>
                {finishedDurated.map((task) => (
                  <DuratedTaskCard
                    key={task.id}
                    task={task}
                    onComplete={onCompleteDuratedTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardScreen;
