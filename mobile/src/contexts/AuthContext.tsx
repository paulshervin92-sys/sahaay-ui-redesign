import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { login, signup, logout, verifyAuth, LoginCredentials, SignupData, AuthResponse } from '../api/auth.service';

// NOTE: Install @react-native-async-storage/async-storage before using
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
}

interface User {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await verifyAuth();
      if (isAuth) {
        // Fetch user data
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const response = await login(credentials);
      setUser(response.user);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleSignup = async (data: SignupData) => {
    try {
      const response = await signup(data);
      setUser(response.user);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
