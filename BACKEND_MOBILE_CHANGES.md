# Backend Modifications for Mobile App Support

This document outlines the necessary changes to the Express backend to support both web and mobile clients.

## Required Changes

### 1. Authentication Middleware - Support Token-Based Auth

**File:** `backend/src/middlewares/authMiddleware.ts`

**Current implementation** uses cookies (works for web only).
**Required:** Support both cookies (web) and Bearer tokens (mobile).

```typescript
import type { Request, Response, NextFunction } from "express";
import { getFirestore } from "../config/firebase.js";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let sessionToken: string | undefined;

    // 1. Try to get token from cookie (web app)
    sessionToken = req.cookies?.session;

    // 2. If no cookie, check Authorization header (mobile app)
    if (!sessionToken && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!sessionToken) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    // Verify session token from Firestore
    const sessionDoc = await getFirestore()
      .collection("sessions")
      .doc(sessionToken)
      .get();

    if (!sessionDoc.exists) {
      return res.status(401).json({ error: "Unauthorized - Invalid session" });
    }

    const sessionData = sessionDoc.data();
    
    // Check if session is expired
    if (sessionData?.expiresAt && new Date(sessionData.expiresAt) < new Date()) {
      await sessionDoc.ref.delete();
      return res.status(401).json({ error: "Unauthorized - Session expired" });
    }

    req.userId = sessionData?.userId;
    req.userEmail = sessionData?.userEmail;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
```

### 2. Login Response - Include Token in Body

**File:** `backend/src/controllers/authController.ts`

**Modify login and signup controllers** to return token in response body for mobile clients:

```typescript
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // ... existing validation and authentication logic ...

  const sessionId = await createSession(user.uid, user.email);
  
  // Set cookie for web clients
  res.cookie("session", sessionId, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Also return token in response body for mobile clients
  return res.json({
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
    },
    token: sessionId,  // ADD THIS - Mobile app will use this
    session: sessionId, // Keep for compatibility
  });
};

export const signup = async (req: Request, res: Response) => {
  // ... existing signup logic ...

  const sessionId = await createSession(user.uid, user.email);
  
  res.cookie("session", sessionId, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
    },
    token: sessionId,  // ADD THIS
    session: sessionId,
  });
};
```

### 3. CORS Configuration - Allow Mobile App

**File:** `backend/src/app.ts`

**Update CORS** to handle mobile requests:

```typescript
import cors from "cors";
import { env } from "./config/env.js";

// Update CORS configuration
app.use(cors({ 
  origin: [
    env.CORS_ORIGIN,              // Web frontend
    'http://localhost:8081',      // React Native Metro bundler
    'capacitor://localhost',      // Capacitor (if used)
    'http://10.0.2.2:8081',      // Android emulator
    // Add production mobile app origins when deployed
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());
```

### 4. Environment Variables

**File:** `backend/.env`

Add mobile-specific configuration:

```env
# Existing variables...
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Mobile app origins
MOBILE_APP_ORIGIN=http://10.0.2.2:8081
ALLOW_MOBILE_AUTH=true
```

### 5. Session Creation - Longer Expiry for Mobile

**File:** `backend/src/services/auth/sessionService.ts`

Add longer session duration option for mobile apps:

```typescript
export const createSession = async (
  userId: string,
  userEmail: string,
  options?: { isMobile?: boolean }
) => {
  const sessionId = crypto.randomBytes(32).toString("hex");
  
  // Mobile sessions last longer (30 days vs 7 days for web)
  const expiryDays = options?.isMobile ? 30 : 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  await getFirestore()
    .collection("sessions")
    .doc(sessionId)
    .set({
      userId,
      userEmail,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      deviceType: options?.isMobile ? 'mobile' : 'web',
    });

  return sessionId;
};
```

Update login controller to detect mobile:

```typescript
export const login = async (req: Request, res: Response) => {
  // ... authentication logic ...

  // Detect if request is from mobile app
  const isMobile = req.headers['user-agent']?.includes('okhttp') || 
                   req.headers.authorization?.startsWith('Bearer');

  const sessionId = await createSession(user.uid, user.email, { isMobile });
  
  // ... rest of response ...
};
```

### 6. Add Device Info Endpoint (Optional)

**File:** `backend/src/controllers/authController.ts`

Add endpoint for mobile apps to register device tokens for push notifications:

```typescript
export const registerDevice = async (req: AuthRequest, res: Response) => {
  const { deviceToken, platform } = req.body;
  
  if (!deviceToken || !platform) {
    return res.status(400).json({ error: "Device token and platform required" });
  }

  await getFirestore()
    .collection("users")
    .doc(req.userId!)
    .update({
      devices: admin.firestore.FieldValue.arrayUnion({
        token: deviceToken,
        platform,
        registeredAt: new Date().toISOString(),
      }),
    });

  return res.json({ success: true });
};
```

**Add route:**

```typescript
// backend/src/routes/authRoutes.ts
import { registerDevice } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

router.post("/register-device", authMiddleware, asyncHandler(registerDevice));
```

---

## Testing Backend Changes

### 1. Test with cURL (Mobile-style request)

```bash
# Login with token response
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return:
# {
#   "user": {...},
#   "token": "abc123...",
#   "session": "abc123..."
# }
```

### 2. Test Bearer Token Authentication

```bash
# Use returned token
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return user profile
```

### 3. Test CORS

```bash
# Preflight request
curl -X OPTIONS http://localhost:3000/api/checkins \
  -H "Origin: http://10.0.2.2:8081" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization,Content-Type"

# Should return CORS headers
```

---

## Summary of Changes

| File | Change | Status |
|------|--------|--------|
| `authMiddleware.ts` | Support Bearer token auth | ⚠️ Required |
| `authController.ts` | Return token in response body | ⚠️ Required |
| `app.ts` | Update CORS for mobile | ⚠️ Required |
| `sessionService.ts` | Longer mobile sessions | ✅ Optional |
| `.env` | Add mobile origins | ✅ Optional |
| `authRoutes.ts` | Device registration endpoint | ✅ Optional |

---

## Deployment Considerations

### Development
- Web: `http://localhost:5173`
- Mobile: `http://10.0.2.2:3000` (Android emulator)
- Backend: `http://localhost:3000`

### Production
- Web: `https://app.sahaay.com`
- Mobile: Native app (uses production API)
- Backend: `https://api.sahaay.com`

**Security Notes:**
- Use HTTPS in production
- Validate JWT tokens properly
- Implement rate limiting
- Add device fingerprinting
- Rotate session tokens periodically
- Implement refresh token mechanism (recommended)

---

## Next Steps After Backend Changes

1. ✅ Update `authMiddleware.ts` to support Bearer tokens
2. ✅ Modify login/signup responses to include token
3. ✅ Update CORS configuration
4. ✅ Test with mobile app
5. ✅ Deploy backend changes to staging
6. ✅ Update mobile app to use new endpoints
7. ✅ Test end-to-end authentication flow
