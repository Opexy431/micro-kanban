import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  // 1. READ logic: Fetch tasks immediately when the web page load
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Database connection failed:", err));
  }, []);

  // 2. CREATE logic: Send text inputs to Flask endpoint
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });
      const freshTask = await response.json();
      // Update the interface state array with the new task from SQLite
      setTasks([...tasks, freshTask]);
      setNewTitle('');
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

    // 3. DELETE logic: Send ID to Flask to remove from database
    const handleDeleteTask = async (id) => {
      try {
        await fetch(`http://localhost:5000/api/tasks/${id}`, {
          method: 'DELETE',
        });
        // Update the React interface instantly by filtering out the deleted ID
        setTasks(tasks.filter((task) => task.id !== id));
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }; 

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>Micro-Kanban Board</h2>
      
      {/* Input Interface */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new goal..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      {/* Task Board Column */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
        <h3>To-Do Items ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p>No tasks remaining!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map((task) => (
              <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '12px', marginBottom: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span>{task.title}</span>
                <span style={{ fontSize: '12px', color: task.status === 'completed' ? 'green' : 'orange' }}>
                  [{task.status}]
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;