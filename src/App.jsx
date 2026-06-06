import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  // 1. READ Action: Fetch records instantly when the page loads
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Database connection failed:", err));
  }, []);

  // 2. CREATE Action: Send a typed task string to Flask
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
      
      setTasks([...tasks, freshTask]);
      setNewTitle('');
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  // 3. DELETE Action: Fire specific ID removal requests over to Flask
  const handleDeleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // 4. UPDATE Action: Send ID to Flask to flip status in the database
  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
      });
      const updatedData = await response.json();
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status: updatedData.status } : task
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>Micro-Kanban Board</h2>
      
      {/* Input Action Panel Form */}
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

      {/* Main Task Feed Board Display */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
        <h3>To-Do Items ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p>No tasks remaining!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map((task) => (
              <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px', marginBottom: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                
                {/* Clickable Area: Clicking the task title will toggle its status */}
                <div onClick={() => handleToggleStatus(task.id)} style={{ cursor: 'pointer', flex: 1 }}>
                  <span style={{ 
                    marginRight: '10px', 
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? '#888' : '#000'
                  }}>
                    {task.title}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: task.status === 'completed' ? 'green' : 'orange' }}>
                    [{task.status}]
                  </span>
                </div>
                
                {/* Delete Trigger Mechanism */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the row click from firing when clicking delete
                    handleDeleteTask(task.id);
                  }} 
                  style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
                >
                  Delete
                </button>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;