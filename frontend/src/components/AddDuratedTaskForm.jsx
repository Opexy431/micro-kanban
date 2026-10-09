// src/components/AddDuratedTaskForm.jsx
import { useState } from 'react';

export function AddDuratedTaskForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [durationDays, setDurationDays] = useState(7);
  const [definitionOfDone, setDefinitionOfDone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !durationDays || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(title, Number(durationDays), definitionOfDone);
      setTitle('');
      setDurationDays(7);
      setDefinitionOfDone('');
      setIsOpen(false);
    } catch {
      // Error handled in hook/parent
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className="btn"
        style={{
          width: '100%',
          backgroundColor: 'var(--color-bg)',
          border: '1px dashed var(--color-border)',
          color: 'var(--color-primary)',
          marginBottom: '16px',
        }}
        onClick={() => setIsOpen(true)}
      >
        + Add Long-Term Goal / Durated Task
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '16px', border: '1px solid var(--color-primary)' }}>
      <div className="section-title" style={{ marginBottom: '8px' }}>
        <span>🎯 New Durated Goal</span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Goal Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Build Micro-Kanban React Frontend"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Target Duration (Days) *</label>
          <input
            type="number"
            min="1"
            max="365"
            className="form-input"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Definition of Done (Optional clarity prompt)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Deployed to Vercel and tests passing"
            value={definitionOfDone}
            onChange={(e) => setDefinitionOfDone(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDuratedTaskForm;
