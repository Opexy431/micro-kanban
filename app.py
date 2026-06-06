import sqlite3
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Database file path (placed next to this file)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database.db')

def get_db_connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn # access columns by name instead of index

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Retrieves all tasks and returns them as JSON."""
    conn = get_db_connect()
    db_tasks = conn.execute('SELECT * FROM tasks').fetchall()
    conn.close() # connects to database, runs SELECT query,
    # and closes connection before returning data.
    task_list = []
    for row in db_tasks:
        task_list.append({'id': row['id'],
                          'title': row['title'],
                          'status': row['status']})
    return jsonify(task_list)

@app.route('/api/tasks', methods=['POST'])
def add_task(): # handles POST requests to add a new task to the database.
    """Inserts a new task payload into the database rows."""
    data = request.get_json()
    title = data.get('title')
    status = data.get('status', 'pending')
    conn = get_db_connect()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO tasks (title, status) VALUES (?, ?)',
        (title, status)
    )
    conn.commit()
    new_task_id = cursor.lastrowid # stores newly created row ID
    conn.close()

    return jsonify({'id': new_task_id,
                    'title': title,
                    'status': status}), 201

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Deletes a selected task item matching the integer ID."""
    conn = get_db_connect()
    conn.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": f"Task {task_id} deleted successfully."})

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def toggle_task_status(task_id):
    conn = get_db_connect()

    # 1. Fetch the current status of the target task
    task = conn.execute('SELECT status FROM tasks WHERE id = ?', (task_id,)).fetchone()

    if task is None:
        conn.close()
        return jsonify({"error": "Task not found"}), 404

    # 2. Toggle the status value dynamically
    new_status = 'completed' if task['status'] == 'pending' else 'pending'

    # 3. Update the database record on disk
    conn.execute('UPDATE tasks SET status = ? WHERE id = ?', (new_status, task_id))
    conn.commit()
    conn.close()

    # Return the new status so React can sync its interface state
    return jsonify({"id": task_id, "status": new_status})

if __name__ == '__main__':
    app.run(debug=True, port=5000)