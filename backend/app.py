import sqlite3
import os
import bcrypt
from datetime import date, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS

# ------------------------

app = Flask(__name__)
CORS(app)  # allows the React frontend (different port) to call this API

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH  = os.path.join(BASE_DIR, 'database.db')


# ---------------------------------------------
# DB HELPER
# ---------------------------------------------

def get_conn():
    """
    Opens and returns a database connection.
    row_factory = sqlite3.Row lets us access
    columns by name (row['title']) instead of
    index (row[1]) — much more readable.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# ---------------------------------------------
# AUTH ROUTES
# ---------------------------------------------

@app.route('/api/auth/register', methods=['POST'])
def register():
    """
    Creates a new user account.

    Expects JSON body:
        { "name": "Ada", "email": "ada@mail.com",
          "password": "secret", "mode": "study" }

    Returns the new user's id, name, email, mode.
    Password is hashed with bcrypt before storage —
    the raw password is never saved to the database.
    """
    data = request.get_json()

    # -- Validate required fields --
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')
    mode     = data.get('mode', 'study')

    if not name:
        return jsonify({"error": "Name is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password or len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if mode not in ('study', 'work', 'business', 'personal'):
        mode = 'study'  # safe default

    # -- Hash the password --
    # bcrypt.hashpw expects bytes, so we encode first.
    # The hash is decoded back to a string for DB storage.
    password_hash = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    conn = get_conn()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, mode)
            VALUES (?, ?, ?, ?)
        ''', (name, email, password_hash, mode))
        conn.commit()
        new_user_id = cursor.lastrowid

        return jsonify({
            "id":    new_user_id,
            "name":  name,
            "email": email,
            "mode":  mode
        }), 201

    except sqlite3.IntegrityError:
        # The UNIQUE constraint on email fired —
        # this email already exists in the database.
        return jsonify({"error": "An account with this email already exists"}), 409

    finally:
        conn.close()


@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Signs a user in.

    Expects JSON body:
        { "email": "ada@mail.com", "password": "secret" }

    Returns user data on success.
    Note: in production this would return a JWT token.
    For now it returns the user object so React can
    store it in state and use the id for subsequent calls.
    """
    data     = request.get_json()
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_conn()
    try:
        user = conn.execute(
            'SELECT * FROM users WHERE email = ?', (email,)
        ).fetchone()

        # We check the user exists AND the password matches
        # in the same branch — never reveal which one failed
        # (prevents email enumeration attacks).
        if user is None or not bcrypt.checkpw(
            password.encode('utf-8'),
            user['password_hash'].encode('utf-8')
        ):
            return jsonify({"error": "Invalid email or password"}), 401

        return jsonify({
            "id":                   user['id'],
            "name":                 user['name'],
            "email":                user['email'],
            "mode":                 user['mode'],
            "social_proof_enabled": bool(user['social_proof_enabled'])
        }), 200

    finally:
        conn.close()


# ---------------------------------------------
# DAILY TASKS ROUTES
# ---------------------------------------------

@app.route('/api/daily-tasks', methods=['GET'])
def get_daily_tasks():
    """
    Returns all daily tasks for a given user.

    Query param: ?user_id=1
    Returns tasks split into 'pending' and 'completed'
    so React can render both columns without filtering.
    """
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = get_conn()
    try:
        rows = conn.execute('''
            SELECT id, title, status, created_at
            FROM   daily_tasks
            WHERE  user_id = ?
            ORDER  BY created_at DESC
        ''', (user_id,)).fetchall()

        tasks = [dict(row) for row in rows]
        return jsonify(tasks), 200

    finally:
        conn.close()


@app.route('/api/daily-tasks', methods=['POST'])
def add_daily_task():
    """
    Adds a new daily task for a user.

    Expects JSON body:
        { "user_id": 1, "title": "Read chapter 5" }

    Title validation prevents empty tasks being saved.
    """
    data    = request.get_json()
    user_id = data.get('user_id')
    title   = data.get('title', '').strip()

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    if not title:
        return jsonify({"error": "Task title cannot be empty"}), 400

    conn = get_conn()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO daily_tasks (user_id, title)
            VALUES (?, ?)
        ''', (user_id, title))
        conn.commit()

        return jsonify({
            "id":      cursor.lastrowid,
            "user_id": user_id,
            "title":   title,
            "status":  "pending"
        }), 201

    finally:
        conn.close()


@app.route('/api/daily-tasks/<int:task_id>', methods=['PUT'])
def toggle_daily_task(task_id):
    """
    Toggles a daily task between 'pending' and 'completed'.

    Expects JSON body:
        { "user_id": 1 }

    user_id is checked to make sure a user can only
    toggle their own tasks — not someone else's.

    When a task is completed, we also update the
    streaks table for today so the progress chart stays accurate.
    """
    data    = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = get_conn()
    try:
        # Fetch task — confirm it exists and belongs to this user
        task = conn.execute('''
            SELECT id, status FROM daily_tasks
            WHERE id = ? AND user_id = ?
        ''', (task_id, user_id)).fetchone()

        if task is None:
            return jsonify({"error": "Task not found"}), 404

        # Determine new status: use explicit status if provided, else toggle
        target_status = data.get('status')
        if target_status in ('pending', 'in_progress', 'completed'):
            new_status = target_status
        else:
            new_status = 'completed' if task['status'] == 'pending' else 'pending'

        if new_status == task['status']:
            return jsonify({
                "id":     task_id,
                "status": new_status
            }), 200

        conn.execute('''
            UPDATE daily_tasks SET status = ?
            WHERE id = ?
        ''', (new_status, task_id))

        # -- Update streak for today --
        # Only adjust streak if completion state changed
        today = date.today().isoformat()

        if new_status == 'completed' and task['status'] != 'completed':
            conn.execute('''
                INSERT OR IGNORE INTO streaks (user_id, date, tasks_completed)
                VALUES (?, ?, 0)
            ''', (user_id, today))

            conn.execute('''
                UPDATE streaks SET tasks_completed = tasks_completed + 1
                WHERE user_id = ? AND date = ?
            ''', (user_id, today))

        elif new_status != 'completed' and task['status'] == 'completed':
            conn.execute('''
                UPDATE streaks
                SET    tasks_completed = MAX(0, tasks_completed - 1)
                WHERE  user_id = ? AND date = ?
            ''', (user_id, today))

        conn.commit()

        return jsonify({
            "id":     task_id,
            "status": new_status
        }), 200

    finally:
        conn.close()


@app.route('/api/daily-tasks/<int:task_id>', methods=['DELETE'])
def delete_daily_task(task_id):
    """
    Deletes a daily task.

    Query param: ?user_id=1
    Returns 404 if task doesn't exist or belongs to
    a different user.
    """
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = get_conn()
    try:
        # Confirm task exists and belongs to this user
        task = conn.execute('''
            SELECT id FROM daily_tasks
            WHERE id = ? AND user_id = ?
        ''', (task_id, user_id)).fetchone()

        if task is None:
            return jsonify({"error": "Task not found"}), 404

        conn.execute('DELETE FROM daily_tasks WHERE id = ?', (task_id,))
        conn.commit()

        return jsonify({"message": f"Task {task_id} deleted"}), 200

    finally:
        conn.close()


# ---------------------------------------------
# DURATED TASKS ROUTES
# ---------------------------------------------

@app.route('/api/durated-tasks', methods=['GET'])
def get_durated_tasks():
    """
    Returns all durated tasks for a user.

    Query param: ?user_id=1

    Also auto-marks any tasks where due_date has
    passed (and status is still 'active') as 'missed'
    before returning — so the frontend always sees
    accurate statuses without a separate cron job.
    """
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    today = date.today().isoformat()

    conn = get_conn()
    try:
        # Auto-expire overdue tasks before fetching
        conn.execute('''
            UPDATE durated_tasks
            SET    status = 'missed'
            WHERE  user_id = ?
            AND    status  = 'active'
            AND    due_date < ?
        ''', (user_id, today))
        conn.commit()

        rows = conn.execute('''
            SELECT id, title, definition_of_done,
                   duration_days, start_date, due_date,
                   status, created_at
            FROM   durated_tasks
            WHERE  user_id = ?
            ORDER  BY
                CASE status
                    WHEN 'active'    THEN 1
                    WHEN 'missed'    THEN 2
                    WHEN 'completed' THEN 3
                END,
                due_date ASC
        ''', (user_id,)).fetchall()

        tasks = []
        for row in rows:
            task = dict(row)

            # Calculate urgency level so React can
            # colour-code the card without extra logic.
            if task['status'] == 'active':
                due        = date.fromisoformat(task['due_date'])
                days_left  = (due - date.today()).days
                total_days = task['duration_days']

                if total_days > 0:
                    pct_left = days_left / total_days
                else:
                    pct_left = 0

                if pct_left > 0.5:
                    task['urgency'] = 'low'
                elif pct_left > 0.2:
                    task['urgency'] = 'mid'
                else:
                    task['urgency'] = 'high'

                task['days_left'] = max(0, days_left)
            else:
                task['urgency']  = 'none'
                task['days_left'] = 0

            tasks.append(task)

        return jsonify(tasks), 200

    finally:
        conn.close()


@app.route('/api/durated-tasks', methods=['POST'])
def add_durated_task():
    """
    Creates a new durated (goal-based) task.

    Expects JSON body:
        {
          "user_id":            1,
          "title":              "Finish assignment draft",
          "duration_days":      7,
          "definition_of_done": "Draft saved to Google Docs"  (optional)
        }

    due_date is calculated automatically as
    today + duration_days so the frontend never
    has to compute it.
    """
    data               = request.get_json()
    user_id            = data.get('user_id')
    title              = data.get('title', '').strip()
    duration_days      = data.get('duration_days')
    definition_of_done = data.get('definition_of_done', '').strip() or None

    # -- Validate --
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    if not title:
        return jsonify({"error": "Task title cannot be empty"}), 400
    if not duration_days or int(duration_days) < 1:
        return jsonify({"error": "duration_days must be at least 1"}), 400

    duration_days = int(duration_days)
    start_date    = date.today().isoformat()
    due_date      = (date.today() + timedelta(days=duration_days)).isoformat()

    conn = get_conn()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO durated_tasks
                (user_id, title, definition_of_done,
                 duration_days, start_date, due_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, title, definition_of_done,
              duration_days, start_date, due_date))
        conn.commit()

        return jsonify({
            "id":                  cursor.lastrowid,
            "user_id":             user_id,
            "title":               title,
            "definition_of_done":  definition_of_done,
            "duration_days":       duration_days,
            "start_date":          start_date,
            "due_date":            due_date,
            "status":              "active",
            "urgency":             "low",
            "days_left":           duration_days
        }), 201

    finally:
        conn.close()


@app.route('/api/durated-tasks/<int:task_id>/complete', methods=['PUT'])
def complete_durated_task(task_id):
    """
    Marks a durated task as 'completed' before its deadline.

    Expects JSON body:
        { "user_id": 1 }

    Also increments today's streak count — completing
    a goal-based task counts toward the daily streak
    just like a daily task.
    """
    data    = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = get_conn()
    try:
        task = conn.execute('''
            SELECT id, status FROM durated_tasks
            WHERE id = ? AND user_id = ?
        ''', (task_id, user_id)).fetchone()

        if task is None:
            return jsonify({"error": "Task not found"}), 404

        if task['status'] != 'active':
            return jsonify({
                "error": f"Task is already '{task['status']}'"
            }), 400

        conn.execute('''
            UPDATE durated_tasks SET status = 'completed'
            WHERE id = ?
        ''', (task_id,))

        # Update streak
        today = date.today().isoformat()
        conn.execute('''
            INSERT OR IGNORE INTO streaks (user_id, date, tasks_completed)
            VALUES (?, ?, 0)
        ''', (user_id, today))
        conn.execute('''
            UPDATE streaks SET tasks_completed = tasks_completed + 1
            WHERE user_id = ? AND date = ?
        ''', (user_id, today))

        conn.commit()

        return jsonify({
            "id":     task_id,
            "status": "completed"
        }), 200

    finally:
        conn.close()


# ---------------------------------------------
# STREAKS ROUTE
# ---------------------------------------------

@app.route('/api/streaks', methods=['GET'])
def get_streaks():
    """
    Returns streak data for a user.

    Query param: ?user_id=1

    Returns:
        current_streak  — consecutive days with at least
                          one task completed up to today
        longest_streak  — best streak the user has ever had
        today_count     — tasks completed today
        grace_available — True if they have a grace day
                          available this week (missed 1 day
                          but streak is protected)
    """
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = get_conn()
    try:
        # Fetch all streak rows for this user, newest first
        rows = conn.execute('''
            SELECT date, tasks_completed
            FROM   streaks
            WHERE  user_id = ?
            ORDER  BY date DESC
        ''', (user_id,)).fetchall()

        # Build a set of active days (days with at least 1 task done)
        active_days = {
            row['date']
            for row in rows
            if row['tasks_completed'] > 0
        }

        # -- Calculate current streak --
        # Walk backwards from today, counting consecutive active days.
        current_streak = 0
        check_date     = date.today()
        grace_used     = False

        while True:
            date_str = check_date.isoformat()

            if date_str in active_days:
                current_streak += 1
                check_date -= timedelta(days=1)
            elif not grace_used:
                # Allow one missed day per week as a grace day
                grace_used = True
                check_date -= timedelta(days=1)
            else:
                break

        # -- Calculate longest streak ever --
        sorted_days    = sorted(active_days)
        longest_streak = 0
        run            = 0
        prev           = None

        for d in sorted_days:
            current_day = date.fromisoformat(d)
            if prev and (current_day - prev).days == 1:
                run += 1
            else:
                run = 1
            longest_streak = max(longest_streak, run)
            prev = current_day

        # -- Today's count --
        today     = date.today().isoformat()
        today_row = conn.execute('''
            SELECT tasks_completed FROM streaks
            WHERE user_id = ? AND date = ?
        ''', (user_id, today)).fetchone()

        today_count = today_row['tasks_completed'] if today_row else 0

        return jsonify({
            "current_streak":  current_streak,
            "longest_streak":  longest_streak,
            "today_count":     today_count,
            "grace_available": grace_used and current_streak > 0
        }), 200

    finally:
        conn.close()


# ---------------------------------------------
# PROGRESS ROUTE
# ---------------------------------------------

@app.route('/api/progress', methods=['GET'])
def get_progress():
    """
    Returns weekly progress stats for the progress screen.

    Query param: ?user_id=1

    Returns:
        weekly_total      — total tasks completed this week
        completion_rate   — % of all tasks completed (vs total created)
        daily_activity    — list of {date, day_label, count}
# for Mon-Sun of the current week
        best_day          — the day with most completions this week
    """
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    # -- Build Mon-Sun range for current week --
    today      = date.today()
    # weekday() returns 0=Mon, 6=Sun
    week_start = today - timedelta(days=today.weekday())
    week_days  = [week_start + timedelta(days=i) for i in range(7)]

    conn = get_conn()
    try:
        # Fetch streak rows for this week
        streak_rows = conn.execute('''
            SELECT date, tasks_completed
            FROM   streaks
            WHERE  user_id = ?
            AND    date   >= ?
            AND    date   <= ?
        ''', (user_id,
              week_start.isoformat(),
              week_days[-1].isoformat())).fetchall()

        streak_by_date = {row['date']: row['tasks_completed']
                          for row in streak_rows}

        # Build daily activity array — one entry per day
        day_labels      = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        daily_activity  = []
        weekly_total    = 0
        best_day        = None
        best_count      = 0

        for i, day in enumerate(week_days):
            day_str = day.isoformat()
            count   = streak_by_date.get(day_str, 0)
            weekly_total += count

            daily_activity.append({
                "date":      day_str,
                "day_label": day_labels[i],
                "count":     count
            })

            if count > best_count:
                best_count = count
                best_day   = day_labels[i]

        # -- Completion rate --
        # Total tasks created vs total completed
        total_created = conn.execute('''
            SELECT
                (SELECT COUNT(*) FROM daily_tasks   WHERE user_id = ?) +
                (SELECT COUNT(*) FROM durated_tasks WHERE user_id = ?)
            AS total
        ''', (user_id, user_id)).fetchone()['total']

        total_completed = conn.execute('''
            SELECT
                (SELECT COUNT(*) FROM daily_tasks
                 WHERE user_id = ? AND status = 'completed') +
                (SELECT COUNT(*) FROM durated_tasks
                 WHERE user_id = ? AND status = 'completed')
            AS total
        ''', (user_id, user_id)).fetchone()['total']

        completion_rate = (
            round((total_completed / total_created) * 100)
            if total_created > 0 else 0
        )

        return jsonify({
            "weekly_total":     weekly_total,
            "completion_rate":  completion_rate,
            "daily_activity":   daily_activity,
            "best_day":         best_day or "None yet"
        }), 200

    finally:
        conn.close()


# ---------------------------------------------
# FOCUS SESSIONS ROUTES
# ---------------------------------------------

@app.route('/api/focus-sessions', methods=['POST'])
def log_focus_session():
    """
    Logs a completed focus session.
    Expects JSON body: { "user_id": 1, "task_id": 5 (optional), "duration_min": 25 }
    """
    data         = request.get_json()
    user_id      = data.get('user_id')
    task_id      = data.get('task_id')
    duration_min = data.get('duration_min')

    if not user_id or not duration_min:
        return jsonify({"error": "user_id and duration_min are required"}), 400

    conn = get_conn()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO focus_sessions (user_id, task_id, duration_min)
            VALUES (?, ?, ?)
        ''', (user_id, task_id, duration_min))
        conn.commit()

        return jsonify({"id": cursor.lastrowid, "message": "Session logged successfully"}), 201

    finally:
        conn.close()



@app.route('/', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for deployment monitoring."""
    return jsonify({
        "status": "healthy",
        "service": "micro-kanban-api",
        "version": "1.0.0"
    }), 200


# ---------------------------------------------
# RUN
# ---------------------------------------------

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    is_debug = os.environ.get("FLASK_ENV", "development").lower() == "development"
    app.run(host='0.0.0.0', port=port, debug=is_debug)
