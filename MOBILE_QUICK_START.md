# 🚀 Quick Start - Run Mobile App on Your Phone

## ⚡ Super Quick (3 Steps)

### 1️⃣ Find Your IP
```powershell
ipconfig
```
Look for **IPv4 Address** (e.g., `192.168.1.5`)

### 2️⃣ Update API URL
Open `mobile\src\api\client.ts` line 19:
```typescript
const API_BASE_URL = isDevelopment
  ? 'http://YOUR_IP_HERE:3000'  // ← Put your IP from step 1
  : 'https://api.sahaay.com';
```

### 3️⃣ Run Commands

**Terminal 1 - Backend:**
```powershell
.\start-backend.bat
```

**Terminal 2 - Metro:**
```powershell
cd mobile
.\start-mobile.bat
```

**Terminal 3 - Install App:**
1. Connect phone via USB (enable USB debugging in Developer Options)
2. Run:
```powershell
cd mobile
npm run android
```

**First run takes 5-10 minutes to build!** ⏳

---

## 📱 Using Android Emulator Instead?

1. Keep API URL as `http://10.0.2.2:3000` (no change needed)
2. Open Android Studio → Device Manager → Start emulator
3. Run the 3 terminals above

---

## 🔍 Full Instructions

See **[MOBILE_RUN_STEPS.md](MOBILE_RUN_STEPS.md)** for:
- Complete setup with screenshots
- Troubleshooting guide
- Production APK build
- All device connection issues

---

## ✅ Quick Checklist

- [ ] Android phone with USB debugging enabled
- [ ] Phone and PC on same Wi-Fi
- [ ] Backend running (`.\start-backend.bat`)
- [ ] Metro running (`cd mobile && .\start-mobile.bat`)
- [ ] IP address updated in `mobile/src/api/client.ts`
- [ ] Run `npm run android` in mobile folder

**App crashes?** Check Metro terminal and backend terminal for errors!

---

**Need help?** Open [MOBILE_RUN_STEPS.md](MOBILE_RUN_STEPS.md) for detailed troubleshooting.
