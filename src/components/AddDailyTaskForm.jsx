// src/components/AddDailyTaskForm.jsx
import { useState } from 'react';

export function AddDailyTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(title);
      setTitle('');
    } catch {
      // Error handled in hook/parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <input
        type="text"
        className="form-input"
        placeholder="Add a task for today (e.g., Study Physics Ch. 3)..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
      />
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={!title.trim() || isSubmitting}
        style={{ whiteSpace: 'nowrap' }}
      >
        {isSubmitting ? 'Adding...' : '+ Add'}
      </button>
    </form>
  );
}

export default AddDailyTaskForm;
