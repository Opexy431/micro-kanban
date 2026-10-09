# 📋 Micro-Kanban Task Manager & Productivity Suite

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

A high-performance, full-stack productivity suite that bridges visual Kanban task tracking, Pomodoro focus sprints, and habit streak analytics. Built with a decoupled **React 19 + Vite** frontend and a robust **Python Flask + SQLite3** REST API.

---

## 🚀 Key Features

* **📋 Visual 3-Stage Kanban Board:** Organise your workflow across **To Do**, **In Progress**, and **Completed** columns with single-click card transitions and quick inline card creation.
* **⏱️ Background-Persistent Focus Timer:** Built-in Pomodoro timer that continues running across screen transitions and tab switches, with task-tagging and automated session logging.
* **🔥 Habit Streaks & Momentum:** Automatic streak calculation that tracks consecutive active days with grace-period logic and streak freeze protection.
* **🎯 Dual-Tier Task Management:**
  * **Daily Tasks:** Instant checklist items for today's operational priorities.
  * **Durated Goals:** Multi-day project targets (7-day, 14-day, 30-day) with custom Definitions of Done (DoD).
* **📊 Analytics & Progress Tracking:** Visual completion percentages, historical completion logs, and focus minutes breakdown.
* **💡 Curated Daily Motivation:** Seeded daily quotes covering grit, discipline, deep work, and culturally resonant African proverbs.
* **🔒 Secure Authentication:** Account registration and login powered by salted **Bcrypt** password hashing with user-scoped data isolation.

---

## 🏗️ Architecture & Monorepo Structure

```text
micro-kanban/
├── backend/
│   ├── app.py                 # Flask REST API server (CORS, bcrypt auth, routes)
│   ├── init_db.py             # Database initialiser & table schema definitions
│   ├── requirements.txt       # Python backend dependencies
│   ├── .env.example           # Backend environment template
│   └── database.db            # SQLite database file (local only, gitignored)
├── frontend/
│   ├── src/
│   │   ├── api/client.js      # Centralised API client with environment fallback
│   │   ├── components/        # Reusable UI components (BottomNav, StreakBar, etc.)
│   │   ├── hooks/             # Custom React hooks (useAuth, useDailyTasks, etc.)
│   │   ├── screens/           # Main views (Kanban, Dashboard, Focus, Progress, Streaks)
│   │   ├── data/quotes.js     # Curated motivation quote collection
│   │   ├── App.jsx            # Top-level state & screen router
│   │   └── index.css          # Editorial Parchment design system
│   ├── index.html             # HTML entry template
│   ├── vite.config.js         # Vite bundler configuration
│   ├── .env.example           # Frontend environment template
│   └── package.json           # Frontend dependencies & scripts
├── start-app.bat              # Windows double-click launcher
├── start-app.ps1              # PowerShell launcher
├── package.json               # Monorepo root scripts (concurrent execution)
├── .gitignore                 # Unified gitignore (node_modules, *.db, .env)
└── README.md                  # Project documentation
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
* **Node.js** (v18.0 or newer)
* **Python** (v3.10 or newer)
* **Git**

---

### Method A: One-Click Launch (Windows)
Double-click `start-app.bat` or run in PowerShell:
```powershell
.\start-app.ps1
```
This automatically initializes the SQLite database, boots the Flask API on port `5000`, starts Vite on port `5173`, and opens your browser.

---

### Method B: Monorepo Root Script
From the root directory:
```bash
# 1. Install root & frontend dependencies
npm install
npm --prefix frontend install

# 2. Install Python dependencies
pip install -r backend/requirements.txt

# 3. Initialise the SQLite database
python backend/init_db.py

# 4. Start both backend and frontend concurrently
npm run dev
```

---

### Method C: Manual Setup (Terminal by Terminal)

#### 1. Backend Setup
```bash
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialise database
python init_db.py

# Start Flask server
python app.py
```
> The backend runs at: `http://localhost:5000`  
> Health check: `http://localhost:5000/api/health`

#### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
> The frontend runs at: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```
*(In production, set this to your deployed backend URL, e.g. `https://your-api.onrender.com/api`)*

### Backend (`backend/.env`)
```ini
PORT=5000
FLASK_ENV=development
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/auth/register` | Register new user account (name, email, password, mode) |
| `POST` | `/api/auth/login` | Authenticate user credentials & receive session data |
| `GET` | `/api/daily-tasks?user_id=:id` | Fetch all daily tasks for the user |
| `POST` | `/api/daily-tasks` | Create a new daily task |
| `PUT` | `/api/daily-tasks/:id` | Update task status (`pending`, `in_progress`, `completed`) or toggle |
| `DELETE` | `/api/daily-tasks/:id?user_id=:id`| Delete a task |
| `GET` | `/api/durated-tasks?user_id=:id`| Fetch long-term / project goals |
| `POST` | `/api/durated-tasks` | Add goal with duration days and definition of done |
| `PUT` | `/api/durated-tasks/:id/complete`| Mark durated goal as accomplished |
| `GET` | `/api/streaks?user_id=:id` | Retrieve current streak, longest streak, and history |
| `GET` | `/api/progress?user_id=:id` | Retrieve completion rates and weekly performance data |
| `POST` | `/api/focus-sessions` | Record completed focus session duration linked to a task |

---

## 🚢 Deployment Guide

### Deploy Frontend on Vercel
1. Connect your GitHub repository on [Vercel](https://vercel.com/).
2. In project settings:
   * **Root Directory:** `frontend`
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
3. Under **Environment Variables**, add:
   * `VITE_API_BASE_URL` = `https://<your-backend-domain>.onrender.com/api`
4. Click **Deploy**.

### Deploy Backend on Render / Railway
1. Create a new **Web Service** on [Render](https://render.com/).
2. Select your GitHub repository.
3. Configure the service:
   * **Root Directory:** `backend`
   * **Environment:** Python 3
   * **Build Command:** `pip install -r requirements.txt && python init_db.py`
   * **Start Command:** `gunicorn app:app`
4. Under **Environment Variables**, set:
   * `FLASK_ENV` = `production`
   * `PORT` = `10000`
5. Click **Create Web Service**.

---

## 👨‍💻 Author

**Opeyemi Olaofe**  
* GitHub: [@Opexy431](https://github.com/Opexy431)  
* X / Twitter: [@OlaofeEmma89389](https://x.com/OlaofeEmma89389)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
