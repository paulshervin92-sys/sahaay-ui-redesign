@echo off
echo ========================================
echo   Sahaay Mobile - Quick Run Script
echo ========================================
echo.

REM Get local IP address
echo Finding your computer's IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP:~1%
echo.
echo ========================================
echo YOUR COMPUTER'S IP ADDRESS: %IP%
echo ========================================
echo.
echo IMPORTANT: Update this IP in mobile\src\api\client.ts
echo Change line 19 from 'http://10.0.2.2:3000' to 'http://%IP%:3000'
echo.
pause
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Metro Bundler...
echo Keep this window open!
echo.
echo ========================================
echo NEXT STEPS:
echo 1. Open a NEW terminal
echo 2. cd D:\sahaay-new\sahaay-ui-redesign\mobile
echo 3. Run: npm run android
echo ========================================
echo.

call npm start
