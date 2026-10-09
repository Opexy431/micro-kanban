// src/components/DuratedTaskCard.jsx
export function DuratedTaskCard({ task, onComplete }) {
  const isCompleted = task.status === 'completed';
  const isMissed = task.status === 'missed';
  const urgencyClass = `urgency-${task.urgency || 'low'}`;

  return (
    <div className={`durated-card ${isCompleted ? 'completed' : ''} ${urgencyClass}`}>
      <div className="durated-header">
        <span className="durated-title">{task.title}</span>
        {task.status === 'active' && (
          <span className={`urgency-tag ${task.urgency || 'low'}`}>
            {task.days_left}d left ({task.urgency} urgency)
          </span>
        )}
        {isCompleted && (
          <span className="urgency-tag low">Completed ✓</span>
        )}
        {isMissed && (
          <span className="urgency-tag high">Missed Deadline</span>
        )}
      </div>

      {task.definition_of_done && (
        <div className="durated-dod">
          <strong>Done looks like:</strong> {task.definition_of_done}
        </div>
      )}

      <div className="durated-footer">
        <span>Due: {task.due_date} ({task.duration_days}d goal)</span>
        {task.status === 'active' && (
          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={() => onComplete(task.id)}
          >
            Mark Done ✓
          </button>
        )}
      </div>
    </div>
  );
}

export default DuratedTaskCard;
