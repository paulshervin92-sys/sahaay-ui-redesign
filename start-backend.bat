@echo off
echo ========================================
echo   Starting Sahaay Backend Server
echo ========================================
echo.

cd /d "%~dp0backend"

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    echo.
)

echo Starting backend on http://0.0.0.0:3000
echo Mobile devices can connect to this server!
echo Keep this window open!
echo.

call npm run dev
