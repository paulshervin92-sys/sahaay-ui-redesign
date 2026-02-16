import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

export interface AuthUser {
  uid: string;
  email?: string;
  displayName?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "sahaay_session_token";

// Store token in localStorage for production cross-origin scenarios
const storeToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.warn("Failed to store token:", e);
  }
};

const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn("Failed to clear token:", e);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ userId: string }>("/api/auth/me")
      .then((data) => {
        setUser({ uid: data.userId });
      })
      .catch(() => {
        setUser(null);
        clearToken(); // Clear invalid token
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const result = await apiFetch<{ user: { userId: string; email: string; displayName: string }; token: string }>(
          "/api/auth/login",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          },
        );
        // Store token for subsequent API calls
        if (result.token) {
          storeToken(result.token);
        }
        setUser({
          uid: result.user.userId,
          email: result.user.email,
          displayName: result.user.displayName,
        });
      },
      signUp: async (email, password, displayName) => {
        const result = await apiFetch<{ user: { userId: string; email: string; displayName: string }; token: string }>(
          "/api/auth/register",
          {
            method: "POST",
            body: JSON.stringify({ email, password, displayName }),
          },
        );
        // Store token for subsequent API calls
        if (result.token) {
          storeToken(result.token);
        }
        setUser({
          uid: result.user.userId,
          email: result.user.email,
          displayName: result.user.displayName,
        });
      },
      signInWithGoogle: async () => {
        const credential = await signInWithPopup(auth, googleProvider);
        const idToken = await credential.user.getIdToken();
        const result = await apiFetch<{ user: { userId: string; email: string; displayName: string }; token: string }>(
          "/api/auth/google",
          {
            method: "POST",
            body: JSON.stringify({ idToken }),
          },
        );
        if (result.token) {
          storeToken(result.token);
        }
        setUser({
          uid: result.user.userId,
          email: result.user.email,
          displayName: result.user.displayName,
        });
      },
      logOut: async () => {
        await apiFetch("/api/auth/logout", { method: "POST" });
        clearToken();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
