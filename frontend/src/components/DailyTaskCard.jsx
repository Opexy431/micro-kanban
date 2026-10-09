// src/components/DailyTaskCard.jsx
export function DailyTaskCard({ task, onToggle, onDelete }) {
  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <div 
        className="task-left" 
        onClick={() => onToggle(task.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(task.id);
          }
        }}
      >
        <div className="task-checkbox">
          {isCompleted && '✓'}
        </div>
        <span className="task-title">{task.title}</span>
      </div>

      <button
        type="button"
        className="btn-delete-task"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        title="Delete task"
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  );
}

export default DailyTaskCard;
