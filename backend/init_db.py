import sqlite3
import os
from datetime import date

# ---------------------------------------------
# init_db.py
# Initialises the SQLite database for Micro-Kanban.
# Run this ONCE before starting the Flask server:
#   python init_db.py
#
# Safe to re-run — every table uses
# CREATE TABLE IF NOT EXISTS so existing
# data is never wiped.
# ---------------------------------------------

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH  = os.path.join(BASE_DIR, 'database.db')


def get_connection():
    """Return a connection with column-name row access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    # Enforce foreign-key constraints on every connection
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_database():
    conn   = get_connection()
    cursor = conn.cursor()

    # -- 1. USERS ------------------------------
    # Stores one row per registered student.
    # 'mode' is the onboarding answer (study / work / business / personal)
    # and will be used by the AI layer later.
    # 'social_proof_enabled' is OFF by default — opt-in only.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id                    INTEGER PRIMARY KEY AUTOINCREMENT,
            name                  TEXT    NOT NULL,
            email                 TEXT    NOT NULL UNIQUE,
            password_hash         TEXT    NOT NULL,
            mode                  TEXT    NOT NULL DEFAULT 'study',
            social_proof_enabled  INTEGER NOT NULL DEFAULT 0,
            created_at            TEXT    NOT NULL DEFAULT (date('now'))
        )
    ''')

    # -- 2. DAILY TASKS ------------------------
    # Simple one-off tasks that live on the daily board.
    # status is binary: 'pending' | 'completed'
    # user_id links every task to the owner.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS daily_tasks (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            title       TEXT    NOT NULL,
            status      TEXT    NOT NULL DEFAULT 'pending',
            created_at  TEXT    NOT NULL DEFAULT (date('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # -- 3. DURATED TASKS ---------------------
    # Goal-based tasks with a deadline.
    # 'duration_days' is how many days the student sets.
    # 'due_date'      is calculated: start_date + duration_days.
    # 'status' values: 'active' | 'completed' | 'missed'
    #   - active    → in progress
    #   - completed → student marked it done before deadline
    #   - missed    → deadline passed without completion
    # 'definition_of_done' is the optional one-line
    #   clarity prompt ("What does done look like?")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS durated_tasks (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id             INTEGER NOT NULL,
            title               TEXT    NOT NULL,
            definition_of_done  TEXT,
            duration_days       INTEGER NOT NULL,
            start_date          TEXT    NOT NULL DEFAULT (date('now')),
            due_date            TEXT    NOT NULL,
            status              TEXT    NOT NULL DEFAULT 'active',
            created_at          TEXT    NOT NULL DEFAULT (date('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # -- 4. STREAKS ----------------------------
    # One row per user per calendar day they were active.
    # 'tasks_completed' counts how many tasks (daily OR durated)
    # they finished that day — used for the progress chart.
    # The UNIQUE constraint prevents duplicate entries
    # for the same user on the same day.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS streaks (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id          INTEGER NOT NULL,
            date             TEXT    NOT NULL,
            tasks_completed  INTEGER NOT NULL DEFAULT 0,
            UNIQUE(user_id, date),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # -- 5. NOTIFICATIONS ----------------------
    # Stores scheduled reminders so Flask (or a background
    # worker) knows what to send and when.
    # 'type' values:
    #   'streak_reminder'   → daily nudge if no task done yet
    #   'durated_low'       → calm reminder, >50% time left
    #   'durated_mid'       → moderate urgency, 20-50% left
    #   'durated_high'      → urgent, <20% left
    #   'durated_final'     → due today
    #   'focus_end'         → timer finished
    #   'grace_warning'     → streak grace day about to expire
    # 'sent' flag stops duplicate sends.
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id       INTEGER NOT NULL,
            type          TEXT    NOT NULL,
            message       TEXT    NOT NULL,
            scheduled_at  TEXT    NOT NULL,
            sent          INTEGER NOT NULL DEFAULT 0,
            created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # -- 6. FOCUS SESSIONS ---------------------
    # Records completed focus timer sessions.
    # 'task_id' is optional (can be a general session).
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS focus_sessions (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id      INTEGER NOT NULL,
            task_id      INTEGER,
            duration_min INTEGER NOT NULL,
            completed_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')


    # -- Seed data (only if users table is empty) --
    # This gives you a working account to test with
    # immediately after running this script.
    # Password is stored as plain text HERE ONLY for
    # development convenience — the real app will
    # hash passwords with bcrypt before storing.
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:

        # Demo user
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, mode)
            VALUES (?, ?, ?, ?)
        ''', ("Ada Obi", "ada@demo.com", "dev_password_unhashed", "study"))

        demo_user_id = cursor.lastrowid

        # Two seed daily tasks for the demo user
        cursor.execute('''
            INSERT INTO daily_tasks (user_id, title, status)
            VALUES (?, ?, ?)
        ''', (demo_user_id, "Read chapter 5", "pending"))

        cursor.execute('''
            INSERT INTO daily_tasks (user_id, title, status)
            VALUES (?, ?, ?)
        ''', (demo_user_id, "Review lecture notes", "completed"))

        # One seed durated task — 7-day goal starting today
        today    = date.today().isoformat()          # e.g. "2026-09-06"
        due      = date.today().replace(             # 7 days from today
            day=date.today().day + 7
        ).isoformat() if date.today().day <= 24 else (
            # safe fallback using string math for edge cases
            date.fromisoformat(today).strftime('%Y-%m-') +
            str(date.today().day + 7 - 28).zfill(2)
        )

        # Simpler and safer due_date calculation
        from datetime import timedelta
        due_date = (date.today() + timedelta(days=7)).isoformat()

        cursor.execute('''
            INSERT INTO durated_tasks
                (user_id, title, definition_of_done, duration_days, start_date, due_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            demo_user_id,
            "Finish assignment draft",
            "First full draft written and saved to Google Docs",
            7,
            today,
            due_date
        ))

        # Seed a streak entry for today
        cursor.execute('''
            INSERT INTO streaks (user_id, date, tasks_completed)
            VALUES (?, ?, ?)
        ''', (demo_user_id, today, 1))

        print("  -> Demo user created: ada@demo.com / dev_password_unhashed")

    conn.commit()
    conn.close()

    print("")
    print("[OK] database.db initialised successfully")
    print("  Tables created: users, daily_tasks, durated_tasks, streaks, notifications")
    print("")


if __name__ == '__main__':
    init_database()