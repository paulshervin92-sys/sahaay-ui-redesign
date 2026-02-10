import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const result = await apiFetch<{ user: { userId: string; email: string; displayName: string } }>(
          "/api/auth/login",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          },
        );
        setUser({
          uid: result.user.userId,
          email: result.user.email,
          displayName: result.user.displayName,
        });
      },
      signUp: async (email, password, displayName) => {
        const result = await apiFetch<{ user: { userId: string; email: string; displayName: string } }>(
          "/api/auth/register",
          {
            method: "POST",
            body: JSON.stringify({ email, password, displayName }),
          },
        );
        setUser({
          uid: result.user.userId,
          email: result.user.email,
          displayName: result.user.displayName,
        });
      },
      logOut: async () => {
        await apiFetch("/api/auth/logout", { method: "POST" });
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
