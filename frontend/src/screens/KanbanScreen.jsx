// src/screens/KanbanScreen.jsx
import { useState } from 'react';

export function KanbanScreen({
  dailyTasks,
  duratedTasks,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onStartFocus,
}) {
  const [newTitle, setNewTitle] = useState('');
  const [targetColumn, setTargetColumn] = useState('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Handle adding a new task to a specific column
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const created = await onAddTask(newTitle.trim());
      // If user wanted it in another column than 'pending', move it
      if (created && targetColumn !== 'pending') {
        await onUpdateTaskStatus(created.id, targetColumn);
      }
      setNewTitle('');
    } catch (err) {
      console.error('Failed to create Kanban task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group tasks by their Kanban column
  // Note: tasks with status 'pending' go to To Do, 'in_progress' to In Progress, 'completed' to Done
  const todoTasks = dailyTasks.filter(
    (t) => !t.status || t.status === 'pending'
  );
  const inProgressTasks = dailyTasks.filter((t) => t.status === 'in_progress');
  const doneTasks = dailyTasks.filter((t) => t.status === 'completed');

  const columns = [
    {
      id: 'pending',
      title: 'To Do',
      icon: '📋',
      badgeClass: 'badge-todo',
      tasks: todoTasks,
      emptyText: 'No pending tasks. What are you tackling next?',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: '⚡',
      badgeClass: 'badge-progress',
      tasks: inProgressTasks,
      emptyText: 'Nothing in progress. Pick a task and start grinding!',
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: '✅',
      badgeClass: 'badge-done',
      tasks: doneTasks,
      emptyText: 'No completed tasks yet today. Finish one to build momentum!',
    },
  ];

  return (
    <div className="kanban-screen">
      {/* Board Header & Quick Add */}
      <div className="kanban-header-card">
        <div className="kanban-title-row">
          <div>
            <h2 className="kanban-title">📋 Kanban Board</h2>
            <p className="kanban-subtitle">
              Visual pipeline for today’s tasks. Move cards as you execute.
            </p>
          </div>
          <div className="kanban-total-pill">
            {doneTasks.length}/{dailyTasks.length} Done
          </div>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleCreateTask} className="kanban-add-form">
          <input
            type="text"
            className="form-input kanban-input"
            placeholder="Add new task (e.g. Build auth endpoint, Review lecture notes)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <select
            className="form-input kanban-select"
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="pending">📋 To Do</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="completed">✅ Done</option>
          </select>
          <button
            type="submit"
            className="btn btn-primary kanban-add-btn"
            disabled={!newTitle.trim() || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : '+ Add'}
          </button>
        </form>
      </div>

      {/* Kanban Columns Grid */}
      <div className="kanban-board-grid">
        {columns.map((col) => (
          <div key={col.id} className="kanban-column">
            {/* Column Header */}
            <div className="kanban-column-header">
              <div className="kanban-column-title">
                <span>{col.icon}</span>
                <span>{col.title}</span>
              </div>
              <span className={`kanban-col-count ${col.badgeClass}`}>
                {col.tasks.length}
              </span>
            </div>

            {/* Column Body */}
            <div className="kanban-column-body">
              {col.tasks.length === 0 ? (
                <div className="kanban-empty-dropzone">
                  <p>{col.emptyText}</p>
                </div>
              ) : (
                col.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`kanban-card ${
                      task.status === 'completed'
                        ? 'card-completed'
                        : task.status === 'in_progress'
                        ? 'card-progress'
                        : ''
                    }`}
                  >
                    <div className="kanban-card-header">
                      <span className="kanban-card-title">{task.title}</span>
                      <button
                        type="button"
                        className="btn-delete-task"
                        onClick={() => onDeleteTask(task.id)}
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Card Actions & Transition Controls */}
                    <div className="kanban-card-footer">
                      <div className="kanban-move-buttons">
                        {/* Move backwards */}
                        {col.id === 'in_progress' && (
                          <button
                            type="button"
                            className="kanban-btn-move"
                            onClick={() =>
                              onUpdateTaskStatus(task.id, 'pending')
                            }
                            title="Move back to To Do"
                          >
                            ⬅ To Do
                          </button>
                        )}
                        {col.id === 'completed' && (
                          <button
                            type="button"
                            className="kanban-btn-move"
                            onClick={() =>
                              onUpdateTaskStatus(task.id, 'in_progress')
                            }
                            title="Move back to In Progress"
                          >
                            ⬅ Doing
                          </button>
                        )}

                        {/* Move forwards */}
                        {col.id === 'pending' && (
                          <button
                            type="button"
                            className="kanban-btn-move kanban-btn-doing"
                            onClick={() =>
                              onUpdateTaskStatus(task.id, 'in_progress')
                            }
                            title="Start Working"
                          >
                            ⚡ Doing
                          </button>
                        )}
                        {col.id !== 'completed' && (
                          <button
                            type="button"
                            className="kanban-btn-move kanban-btn-done"
                            onClick={() =>
                              onUpdateTaskStatus(task.id, 'completed')
                            }
                            title="Mark as Done"
                          >
                            ✓ Done
                          </button>
                        )}
                      </div>

                      {/* Launch Focus Timer for this task */}
                      {col.id !== 'completed' && onStartFocus && (
                        <button
                          type="button"
                          className="kanban-btn-focus"
                          onClick={() => onStartFocus(task)}
                          title="Launch Focus Timer with this task"
                        >
                          ⏱️ Focus
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanScreen;
