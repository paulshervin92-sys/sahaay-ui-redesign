@echo off
echo ========================================
echo   Building Sahaay Mobile APK
echo ========================================
echo.

cd /d "%~dp0"

REM Check if android folder exists
if not exist "android" (
    echo ERROR: android folder not found!
    echo Make sure you're in the mobile directory.
    pause
    exit /b 1
)

echo Step 1: Cleaning previous builds...
cd android
call gradlew clean
cd ..
echo.

echo Step 2: Building release APK...
echo This will take 5-10 minutes...
echo.
cd android
call gradlew assembleRelease
cd ..
echo.

if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo ========================================
    echo ✅ SUCCESS! APK built successfully!
    echo ========================================
    echo.
    echo APK Location:
    echo %cd%\android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo File size:
    for %%A in ("android\app\build\outputs\apk\release\app-release.apk") do echo %%~zA bytes
    echo.
    echo ========================================
    echo NEXT STEPS:
    echo 1. Transfer app-release.apk to your phone
    echo 2. Enable "Install from Unknown Sources"
    echo 3. Open the APK file to install
    echo 4. Share the APK with others!
    echo ========================================
    echo.
    
    REM Open folder containing APK
    explorer "android\app\build\outputs\apk\release"
) else (
    echo ========================================
    echo ❌ BUILD FAILED
    echo ========================================
    echo Check the error messages above.
    echo.
)

pause
