// src/components/BottomNav.jsx
export function BottomNav({ activeScreen, onSelectScreen }) {
  const navItems = [
    { id: 'dashboard', label: 'Board', icon: '📋' },
    { id: 'focus', label: 'Focus', icon: '⏱️' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'streaks', label: 'Streaks', icon: '🔥' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-item ${activeScreen === item.id ? 'active' : ''}`}
          onClick={() => onSelectScreen(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
