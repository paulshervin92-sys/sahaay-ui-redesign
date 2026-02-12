# Sahaay Native Mobile App Setup Guide

## Overview
This guide will help you set up a **native React Native Android app** for Sahaay that works independently with the existing Express backend.

---

## Prerequisites

### Required Software
1. **Node.js** (v18 or later) - Already installed ✅
2. **Java Development Kit (JDK)** - Version 17 (required for React Native)
3. **Android Studio** - Latest stable version
4. **React Native CLI** - Install globally

### Installation Steps

#### 1. Install JDK 17
Download from: https://adoptium.net/temurin/releases/
```bash
# Verify installation
java -version
```

#### 2. Install Android Studio
Download from: https://developer.android.com/studio

**Important Android Studio Setup:**
- During installation, ensure these are checked:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (AVD)
  - Performance (Intel HAXM) (for emulator)

**SDK Configuration:**
- Open Android Studio → More Actions → SDK Manager
- Install the following under "SDK Platforms":
  - Android 13.0 (Tiramisu) - API Level 33
  - Android 12.0 (S) - API Level 31
  
- Under "SDK Tools" tab, install:
  - Android SDK Build-Tools
  - Android SDK Command-line Tools
  - Android Emulator
  - Android SDK Platform-Tools
  - Google Play services

#### 3. Set Environment Variables

**Windows (add to System Environment Variables):**
```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot
```

**Add to PATH:**
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%JAVA_HOME%\bin
```

Verify:
```bash
adb --version
```

#### 4. Install React Native CLI
```bash
npm install -g react-native-cli
```

---

## Project Structure

```
sahaay-ui-redesign/
├── backend/              # Express API (existing) ✅
├── src/                  # Web frontend (existing) ✅
├── mobile/               # NEW: React Native Android app
│   ├── android/          # Native Android code
│   ├── ios/              # (Future iOS support)
│   ├── src/
│   │   ├── api/          # API client (connects to backend)
│   │   ├── components/   # React Native UI components
│   │   ├── screens/      # App screens (Dashboard, Chat, etc.)
│   │   ├── navigation/   # React Navigation setup
│   │   ├── contexts/     # Auth, User contexts (shared logic)
│   │   ├── hooks/        # Custom hooks
│   │   ├── theme/        # Colors, typography
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Helper functions
│   ├── package.json
│   └── tsconfig.json
└── shared/               # NEW: Shared code between web & mobile
    ├── types/            # Shared TypeScript interfaces
    ├── utils/            # Shared utilities
    └── constants/        # Shared constants
```

---

## Creating the Mobile App

### Step 1: Initialize React Native Project

Navigate to your project root:
```bash
cd D:\sahaay-new\sahaay-ui-redesign
```

Create the mobile app:
```bash
npx react-native@latest init SahaayMobile --template react-native-template-typescript
```

Rename the folder:
```bash
move SahaayMobile mobile
```

### Step 2: Install Essential Dependencies

Navigate to mobile directory:
```bash
cd mobile
```

Install navigation and core libraries:
```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# Dependencies for navigation
npm install react-native-screens react-native-safe-area-context

# State management & data fetching
npm install @tanstack/react-query

# Forms & validation
npm install react-hook-form zod

# Date handling
npm install date-fns

# Firebase (for authentication)
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore

# Storage (like IndexedDB for web)
npm install @react-native-async-storage/async-storage

# Icons
npm install react-native-vector-icons
npm install -D @types/react-native-vector-icons

# Charts (for analytics)
npm install react-native-svg react-native-chart-kit

# Notifications
npm install @react-native-firebase/messaging

# Gesture handler
npm install react-native-gesture-handler

# Reanimated (for animations)
npm install react-native-reanimated
```

### Step 3: Configure Android Build

#### Update `android/build.gradle`:
```gradle
buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 24        // Minimum Android 7.0
        compileSdkVersion = 33    // Android 13
        targetSdkVersion = 33
        ndkVersion = "25.1.8937393"
        kotlinVersion = "1.8.0"
    }
    dependencies {
        classpath("com.android.tools.build:gradle:7.4.2")
        classpath("com.google.gms:google-services:4.3.15")
    }
}
```

#### Update `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        applicationId "com.sahaay.mobile"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        debug {
            buildConfigField "String", "API_BASE_URL", "\"http://10.0.2.2:3000\""  // Android emulator
        }
        release {
            buildConfigField "String", "API_BASE_URL", "\"https://api.sahaay.com\""
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 4: Project Configuration Files

Create `.env` file in mobile directory:
```env
API_BASE_URL=http://10.0.2.2:3000
FIREBASE_PROJECT_ID=your-firebase-project-id
```

### Step 5: Build and Run

```bash
# Start Metro bundler
npx react-native start

# In a new terminal, run Android
npx react-native run-android
```

**Or using Android Studio:**
1. Open `mobile/android` folder in Android Studio
2. Wait for Gradle sync to complete
3. Click "Run" button or press Shift+F10
4. Select virtual device or connected phone

---

## Key Differences from Web App

### 1. **API Client**
Mobile app uses `fetch` with different base URL configuration:
```typescript
// mobile/src/api/client.ts
import Config from 'react-native-config';

const API_BASE_URL = Config.API_BASE_URL || 'http://10.0.2.2:3000';

export const apiFetch = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  // Store auth tokens in AsyncStorage instead of cookies
  const token = await AsyncStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options?.headers,
    },
    ...options,
  });
  
  // Handle response...
};
```

### 2. **Navigation**
Web uses React Router, mobile uses React Navigation:
```typescript
// mobile/src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);
```

### 3. **Storage**
Web uses IndexedDB, mobile uses AsyncStorage:
```typescript
// mobile/src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  async setItem(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  
  async getItem<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
```

### 4. **UI Components**
Web uses shadcn/ui, mobile uses React Native components:
```typescript
// mobile/src/components/Button.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Button = ({ title, onPress, variant = 'primary' }) => (
  <TouchableOpacity 
    style={[styles.button, styles[variant]]} 
    onPress={onPress}
  >
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);
```

---

## Backend API Modifications Required

### 1. **Authentication Changes**
Mobile apps can't use cookies efficiently. Update backend to support **JWT tokens**:

```typescript
// backend/src/middlewares/authMiddleware.ts
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Support both cookie-based (web) and token-based (mobile) auth
  let token = req.cookies?.session;
  
  // Check Authorization header for mobile
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '');
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Validate token...
};
```

### 2. **CORS Configuration**
Update to allow mobile app requests:

```typescript
// backend/src/app.ts
app.use(cors({ 
  origin: [
    env.CORS_ORIGIN,           // Web frontend
    'sahaay://app',            // Mobile deep links
  ], 
  credentials: true 
}));
```

---

## Shared Code Strategy

Create a `shared` directory for code reuse:

```
shared/
├── types/
│   ├── auth.types.ts
│   ├── checkin.types.ts
│   ├── chat.types.ts
│   └── index.ts
├── utils/
│   ├── date.utils.ts
│   ├── validation.utils.ts
│   └── mood.utils.ts
└── constants/
    ├── moods.ts
    └── copingTools.ts
```

Reference in both projects:
```json
// web package.json & mobile package.json
{
  "dependencies": {
    "sahaay-shared": "file:../shared"
  }
}
```

---

## Development Workflow

### Running Both Apps Simultaneously

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Web Frontend:**
```bash
npm run dev
```

**Terminal 3 - Mobile App:**
```bash
cd mobile
npx react-native start
```

**Terminal 4 - Android Build:**
```bash
cd mobile
npx react-native run-android
```

---

## Building Release APK

### Generate Signing Key
```bash
cd mobile/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore sahaay-release-key.keystore -alias sahaay-key -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Gradle
Edit `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=sahaay-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=sahaay-key
MYAPP_RELEASE_STORE_PASSWORD=your-password
MYAPP_RELEASE_KEY_PASSWORD=your-password
```

### Build APK
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

---

## Testing

### Emulator Testing
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_33
```

### Physical Device Testing
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `adb devices` to verify connection
5. Run: `npx react-native run-android`

---

## Next Steps

1. ✅ Install prerequisites (JDK, Android Studio, SDKs)
2. ✅ Initialize React Native project
3. ✅ Set up navigation and core dependencies
4. ✅ Create API client that connects to your Express backend
5. ✅ Build screen components (Dashboard, Chat, Journal, etc.)
6. ✅ Implement authentication flow with token-based auth
7. ✅ Add Firebase for push notifications
8. ✅ Configure Android build for release
9. ✅ Test on emulator and physical devices
10. ✅ Build and sign APK for distribution

---

## Advantages of This Approach

✅ **Truly Native** - Not a WebView wrapper, uses native Android components
✅ **Shared Business Logic** - Reuse TypeScript code between web and mobile
✅ **Same Backend** - Both apps use the same Express API
✅ **Better Performance** - Native rendering, faster than hybrid apps
✅ **Offline Support** - AsyncStorage for local data persistence
✅ **Native Features** - Camera, notifications, biometric auth, etc.
✅ **Android Studio Integration** - Full debugging and profiling tools
✅ **Independent Deployment** - Mobile app doesn't depend on web deployment

---

## Support & Resources

- React Native Docs: https://reactnative.dev/docs/getting-started
- React Navigation: https://reactnavigation.org/
- React Native Firebase: https://rnfirebase.io/
- Android Studio: https://developer.android.com/studio/intro

