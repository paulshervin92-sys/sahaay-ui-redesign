@echo off
echo ========================================
echo Sahaay Mobile App Initialization Script
echo ========================================
echo.

echo Step 1: Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo Step 2: Initializing React Native project...
echo This will create a new 'mobile' directory with React Native + TypeScript
echo.
npx react-native@latest init SahaayMobile --template react-native-template-typescript --skip-install

if errorlevel 1 (
    echo ERROR: Failed to initialize React Native project
    pause
    exit /b 1
)

echo.
echo Step 3: Renaming directory to 'mobile'...
if exist mobile (
    echo WARNING: 'mobile' directory already exists!
    echo Skipping rename...
) else (
    rename SahaayMobile mobile
    echo Renamed successfully!
)

echo.
echo Step 4: Installing dependencies...
cd mobile
call npm install

echo.
echo Step 5: Installing additional libraries...
call npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
call npm install react-native-screens react-native-safe-area-context
call npm install @tanstack/react-query
call npm install react-hook-form zod
call npm install date-fns
call npm install @react-native-async-storage/async-storage
call npm install react-native-vector-icons
call npm install -D @types/react-native-vector-icons
call npm install react-native-svg
call npm install react-native-gesture-handler
call npm install react-native-reanimated

echo.
echo ========================================
echo Mobile app initialized successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Install Android Studio from https://developer.android.com/studio
echo 2. Install JDK 17 from https://adoptium.net/temurin/releases/
echo 3. Configure Android SDK in Android Studio
echo 4. Set ANDROID_HOME and JAVA_HOME environment variables
echo 5. Run: cd mobile
echo 6. Run: npx react-native run-android
echo.
echo For detailed instructions, see MOBILE_APP_SETUP.md
echo.
pause
