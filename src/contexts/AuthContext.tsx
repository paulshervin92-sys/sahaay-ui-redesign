import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  authenticateUser,
  createUser,
  getCurrentUser,
  setCurrentUser,
  type LocalUser,
} from "@/lib/localStore";

interface AuthContextValue {
  user: LocalUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const nextUser = authenticateUser(email, password);
        setUser(nextUser);
      },
      signUp: async (email, password, displayName) => {
        const nextUser = createUser(email, password, displayName);
        setUser(nextUser);
      },
      logOut: async () => {
        setCurrentUser(null);
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
