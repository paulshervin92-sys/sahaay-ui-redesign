# 📦 Build APK for Distribution

## 🎯 Quick Steps

### 1️⃣ Update Production API URL

Open `mobile\src\api\client.ts` and update line 8:

```typescript
const PRODUCTION_API_URL = 'https://your-app.onrender.com'; // 👈 Your deployed backend URL
```

**Example:**
- Render: `https://sahaay-backend.onrender.com`
- Railway: `https://sahaay-backend.up.railway.app`
- Heroku: `https://sahaay-api.herokuapp.com`

### 2️⃣ Build the APK

Run the build script:
```powershell
cd mobile
.\build-apk.bat
```

**This takes 5-10 minutes!** ⏳

### 3️⃣ Get Your APK

APK will be created at:
```
mobile\android\app\build\outputs\apk\release\app-release.apk
```

The folder will open automatically when build completes! 🎉

---

## 📤 Distribute Your APK

### Option 1: Direct Share
1. Copy `app-release.apk` to Google Drive / Dropbox
2. Share download link with users
3. Users download APK to phone
4. Users enable "Install from Unknown Sources" in Settings
5. Users tap APK to install

### Option 2: Publish to Play Store
1. Create Google Play Developer account ($25 one-time fee)
2. Generate signed APK (see below)
3. Upload to Google Play Console
4. Submit for review
5. Users download from Play Store!

---

## 🔐 Generate Signed APK (Recommended for Play Store)

### Step 1: Generate Keystore

```powershell
cd mobile\android\app
keytool -genkeypair -v -storetype PKCS12 -keystore sahaay-release.keystore -alias sahaay -keyalg RSA -keysize 2048 -validity 10000
```

**Enter when prompted:**
- Password: (create a strong password - SAVE THIS!)
- Name, Organization, etc.: Your details

### Step 2: Configure Gradle

Create `mobile\android\gradle.properties` (if not exists) and add:

```properties
SAHAAY_UPLOAD_STORE_FILE=sahaay-release.keystore
SAHAAY_UPLOAD_KEY_ALIAS=sahaay
SAHAAY_UPLOAD_STORE_PASSWORD=your_keystore_password
SAHAAY_UPLOAD_KEY_PASSWORD=your_key_password
```

### Step 3: Update `android\app\build.gradle`

Add inside `android { }` block:

```gradle
signingConfigs {
    release {
        if (project.hasProperty('SAHAAY_UPLOAD_STORE_FILE')) {
            storeFile file(SAHAAY_UPLOAD_STORE_FILE)
            storePassword SAHAAY_UPLOAD_STORE_PASSWORD
            keyAlias SAHAAY_UPLOAD_KEY_ALIAS
            keyPassword SAHAAY_UPLOAD_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### Step 4: Build Signed APK

```powershell
cd mobile\android
.\gradlew assembleRelease
```

---

## 📱 Install APK on Phone

### Method 1: USB Transfer
1. Connect phone to PC
2. Copy `app-release.apk` to phone's Downloads folder
3. On phone: open Files app → Downloads → tap `app-release.apk`
4. Enable "Install from Unknown Sources" if prompted
5. Tap "Install"

### Method 2: Cloud Transfer
1. Upload APK to Google Drive / Dropbox
2. Share link or open on phone
3. Download on phone
4. Install as above

### Method 3: ADB Install
```powershell
cd mobile\android\app\build\outputs\apk\release
adb install app-release.apk
```

---

## 🎨 Customize App Before Building

### Change App Name
Edit `mobile\android\app\src\main\res\values\strings.xml`:
```xml
<resources>
    <string name="app_name">Sahaay</string>
</resources>
```

### Change App Icon
Replace files in `mobile\android\app\src\main\res\`:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

Or use online tool: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html

### Change Package Name (Optional)
Edit `mobile\android\app\build.gradle`:
```gradle
defaultConfig {
    applicationId "com.sahaay.app" // Change this
    ...
}
```

---

## 🐛 Troubleshooting

### Build Failed - "SDK not found"
Install Android SDK through Android Studio:
- Open Android Studio
- Tools → SDK Manager
- Install Android SDK 33

### Build Failed - "Java not found"
Install JDK 17:
```powershell
choco install openjdk17
```

### APK Too Large
Enable ProGuard in `android\app\build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
    }
}
```

### App Crashes on Install
Check `mobile\android\app\src\main\AndroidManifest.xml` has internet permission:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## ✅ Pre-Build Checklist

- [ ] Updated `PRODUCTION_API_URL` in `client.ts` with deployed backend URL
- [ ] Backend is deployed and accessible
- [ ] Tested app in development mode (`npm run android`)
- [ ] Changed app name/icon (optional)
- [ ] Created keystore for signed build (if publishing)

---

## 📊 APK Size Optimization

**Current size:** ~30-50 MB (initial build)

**To reduce size:**

1. **Enable ProGuard** (already in steps above)
2. **Remove unused dependencies** in `package.json`
3. **Build App Bundle** instead of APK (for Play Store):
   ```powershell
   cd android
   .\gradlew bundleRelease
   ```
   Output: `android\app\build\outputs\bundle\release\app-release.aab`

---

## 🚀 Publishing to Google Play Store

1. **Create account:** https://play.google.com/console ($25 fee)
2. **Create app** in Play Console
3. **Upload signed APK or AAB**
4. **Fill in app details:**
   - Title, description, screenshots
   - Privacy policy URL
   - Content rating
5. **Submit for review** (takes 2-7 days)
6. **App goes live!**

---

**Now run `.\build-apk.bat` and share your app with the world! 🌍**
