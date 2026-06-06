import sqlite3 # imposts the sqlite3 library to interact with SQLite databases
import os

def init_database():
    # Connects to a local file called database.db (next to this file) and creates it if it doesn't exist
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(BASE_DIR, 'database.db')
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    
    # Create the tasks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT DEFAULT 'pending'
        )
    ''')
    
    # Add some initial tasks if the table is empty
    cursor.execute("SELECT COUNT(*) FROM tasks")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO tasks (title, status) VALUES (?, ?)", 
                       ("Learn SQLite Integration", "completed"))
        cursor.execute("INSERT INTO tasks (title, status) VALUES (?, ?)", 
                       ("Build React Frontend Container", "pending"))
    
    connection.commit()
    connection.close()
    print("Database initialized successfully!")
#it initializes the database by creating a connection, setting up the tasks table, 
# and inserting some initial tasks if the table is empty. Finally, it commits the changes and closes the connection.
if __name__ == '__main__':
    init_database()