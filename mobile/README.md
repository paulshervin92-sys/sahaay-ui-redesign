# Sahaay Mobile - React Native TypeScript

Native Android mobile application for Sahaay mental health platform.

## Quick Start

### Prerequisites
- Node.js 18+
- JDK 17
- Android Studio with SDK 33
- Android device or emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install pods (for iOS in future):
```bash
cd ios && pod install && cd ..
```

3. Start Metro bundler:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

## Development

### Project Structure
```
src/
├── api/          # API client and services
├── components/   # Reusable UI components
├── screens/      # Screen components
├── navigation/   # Navigation configuration
├── contexts/     # React contexts (Auth, User)
├── hooks/        # Custom hooks
├── theme/        # Theme and styling
├── types/        # TypeScript types
└── utils/        # Utility functions
```

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (future)
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### API Configuration

The app connects to the Sahaay Express backend:
- **Development**: http://10.0.2.2:3000 (Android emulator)
- **Production**: Configure in `.env` file

### Building Release APK

1. Generate signing key:
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore sahaay-release-key.keystore -alias sahaay-key -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure `android/gradle.properties`

3. Build:
```bash
cd android
./gradlew assembleRelease
```

APK: `android/app/build/outputs/apk/release/app-release.apk`

## Features

- ✅ Native Android UI
- ✅ Token-based authentication
- ✅ Offline data persistence
- ✅ Push notifications
- ✅ Mood check-ins
- ✅ AI-powered chat
- ✅ Coping tools
- ✅ Journaling
- ✅ Safety plan
- ✅ Analytics dashboard

## Tech Stack

- React Native 0.73+
- TypeScript
- React Navigation
- TanStack Query
- AsyncStorage
- React Native Firebase
- React Hook Form + Zod

## License

Private - Sahaay Platform
