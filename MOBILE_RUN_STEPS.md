# 📱 Run Sahaay Mobile App

## Prerequisites Checklist
- [ ] Android Studio installed
- [ ] Android SDK installed (API 30+)
- [ ] Java Development Kit (JDK 17+)
- [ ] Android phone with USB debugging OR Android emulator
- [ ] Phone and PC on same Wi-Fi (if using physical device)

---

## 🚀 Step-by-Step Guide

### Step 1: Find Your Computer's IP Address
Open PowerShell and run:
```powershell
ipconfig
```

**Look for "IPv4 Address"** under your active network adapter (e.g., `192.168.1.5`)

**Write it down:** `192.168.1._____`

---

### Step 2: Update Mobile API Configuration

1. Open file: `mobile\src\api\client.ts`
2. Find line 19-26 (the API_BASE_URL section)
3. Replace `192.168.1.5` with YOUR computer's IP address from Step 1
4. Save the file

**Example:**
```typescript
const API_BASE_URL = isDevelopment
  ? 'http://192.168.1.5:3000'  // ← Change this to YOUR IP
  : 'https://api.sahaay.com';
```

**Note:** If using Android Emulator instead of phone, use `http://10.0.2.2:3000`

---

### Step 3: Install Mobile Dependencies

Open PowerShell and run:
```powershell
cd D:\sahaay-new\sahaay-ui-redesign\mobile
npm install
```

Then install React Native specific dependencies:
```powershell
npm install @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

For iOS (if on macOS):
```bash
cd ios
pod install
cd ..
```

---

### Step 4: Setup Your Android Device

**Option A: Physical Phone**

1. **Enable Developer Options:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Go to Settings → Developer Options
   - Turn on "USB Debugging"

3. **Connect Phone:**
   - Connect phone to PC via USB cable
   - On phone, tap "Allow" when prompted for USB debugging
   - On PC, verify connection:
     ```powershell
     cd D:\sahaay-new\sahaay-ui-redesign\mobile
     npx react-native doctor
     ```

**Option B: Android Emulator**

1. Open Android Studio
2. Click "More Actions" → "Virtual Device Manager"
3. Click "Create Device"
4. Select a device (e.g., Pixel 5) → Next
5. Download and select system image (API 30+) → Next
6. Click Finish
7. Click ▶️ (Play) to start emulator

---

### Step 5: Start Backend Server

Open a **NEW PowerShell window**:
```powershell
cd D:\sahaay-new\sahaay-ui-redesign\backend
npm run dev
```

**Keep this window open!** You should see:
```
API listening on http://0.0.0.0:3000
```

---

### Step 6: Start Metro Bundler

Open **ANOTHER PowerShell window**:
```powershell
cd D:\sahaay-new\sahaay-ui-redesign\mobile
npm start
```

**Keep this window open!** Wait for Metro to start, you'll see:
```
Welcome to Metro
```

---

### Step 7: Run the App

Open **ANOTHER PowerShell window** (3rd window):
```powershell
cd D:\sahaay-new\sahaay-ui-redesign\mobile
npm run android
```

**First run takes 5-10 minutes** (building Android project)

The app will install and launch automatically! 🎉

---

## 🔧 Troubleshooting

### "No devices found"
```powershell
adb devices
```
Should show your phone/emulator. If not:
```powershell
adb kill-server
adb start-server
```

### "Unable to connect to development server"
1. Check Metro bundler is running (`npm start`)
2. Shake phone → "Settings" → change bundle location to: `YOUR_IP:8081`
3. Shake phone → "Reload"

### "Cannot connect to backend"
1. Verify backend is running: Open browser → `http://localhost:3000/health`
2. Check firewall isn't blocking port 3000
3. Verify IP address in `mobile/src/api/client.ts` is correct
4. Try turning off Windows Firewall temporarily

### "Build failed"
```powershell
cd D:\sahaay-new\sahaay-ui-redesign\mobile\android
.\gradlew clean
cd ..
npm run android
```

### App crashes on startup
1. Check Metro bundler logs for errors
2. Check backend logs
3. Clear app data: Settings → Apps → Sahaay → Clear Data

---

## 📋 Testing Checklist

Once app loads:

- [ ] Register new account
- [ ] Login works
- [ ] Submit mood check-in
- [ ] Send chat message
- [ ] View analytics
- [ ] Logout works

---

## 🎯 Quick Commands Reference

**Terminal 1 (Backend):**
```powershell
cd D:\sahaay-new\sahaay-ui-redesign\backend
npm run dev
```

**Terminal 2 (Metro):**
```powershell
cd D:\sahaay-new\sahaay-ui-redesign\mobile
npm start
```

**Terminal 3 (Run App):**
```powershell
cd D:\sahaay-new\sahaay-ui-redesign\mobile
npm run android
```

**Reload App:**
- Shake phone → "Reload"
- Or press `R` twice in Metro terminal

**Debug Menu:**
- Shake phone
- Or run: `adb shell input keyevent 82`

---

## 🏗️ Production Build (APK)

When ready to create standalone APK:

```powershell
cd D:\sahaay-new\sahaay-ui-redesign\mobile\android
.\gradlew assembleRelease
```

APK location: `mobile\android\app\build\outputs\apk\release\app-release.apk`

Transfer to phone and install!

---

**Need help?** Check Metro bundler logs and backend logs for error messages.
