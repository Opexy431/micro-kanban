@echo off
title Micro-Kanban Launcher
echo ======================================================
echo          Launching Micro-Kanban (Full Stack)
echo ======================================================
echo.

set ROOT_DIR=%~dp0

echo [1/3] Initializing SQLite database...
cd /d "%ROOT_DIR%backend"
python init_db.py

echo.
echo [2/3] Starting Flask Backend Server (Port 5000)...
start "Micro-Kanban Backend" cmd /k "cd /d ""%ROOT_DIR%backend"" && python app.py"

echo.
echo [3/3] Starting React Frontend Server (Port 5173)...
start "Micro-Kanban Frontend" cmd /k "cd /d ""%ROOT_DIR%frontend"" && npm run dev"

echo.
echo ======================================================
echo  Servers are starting up!
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo ======================================================
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:5173
