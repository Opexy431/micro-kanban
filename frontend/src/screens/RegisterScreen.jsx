// src/screens/RegisterScreen.jsx
import { useState } from 'react';

export function RegisterScreen({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('study');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || isLoading) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await onRegister(name, email, password, mode);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Micro-Kanban</h1>
          <p>Create your student productivity account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="ada@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min 6 characters)</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Mode / Focus</label>
            <select
              className="form-select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              disabled={isLoading}
            >
              <option value="study">🎓 Study & Academics</option>
              <option value="work">💼 Work & Projects</option>
              <option value="business">🚀 Startup & Business</option>
              <option value="personal">🌱 Personal Growth</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
