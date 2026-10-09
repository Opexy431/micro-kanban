# start-app.ps1 - PowerShell launcher for Micro-Kanban
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "         Launching Micro-Kanban (Full Stack)          " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Initializing SQLite database..." -ForegroundColor Yellow
Set-Location -Path "$scriptDir\backend"
python init_db.py

Write-Host ""
Write-Host "[2/3] Starting Flask Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; python app.py"

Write-Host ""
Write-Host "[3/3] Starting React Frontend Server (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; npm run dev"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host " Servers are running!" -ForegroundColor Green
Write-Host " Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
