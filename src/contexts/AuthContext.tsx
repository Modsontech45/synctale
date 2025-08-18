import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  initializeUser: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, username: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  emailVerificationRequired?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const REFRESH_INTERVAL = 60 * 1000; // 1 minute
  let lastRefresh = 0;

  // ----------------- Session Utilities -----------------
  const saveToSession = (key: string, value: any) => {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  const getFromSession = (key: string) => {
    try { const item = sessionStorage.getItem(key); return item ? JSON.parse(item) : null; } 
    catch { return null; }
  };

  const removeFromSession = (key: string) => {
    try { sessionStorage.removeItem(key); } catch {}
  };

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    removeFromSession('user');
    removeFromSession('lastActivity');
    setToken(null);
    setUser(null);
  };

  // ----------------- Initialize User -----------------
  const initializeUser = async () => {
    if (isInitialized) return; // prevent multiple runs
    setIsLoading(true);
    try {
      const savedUser = getFromSession('user');
      const lastActivity = getFromSession('lastActivity');
      const now = Date.now();
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24h

      if (savedUser && lastActivity && (now - lastActivity > sessionTimeout)) {
        clearSession();
      } else if (savedUser && token && !user) {
        setUser(savedUser);
        saveToSession('lastActivity', now);
      }

      if (token) {
        try {
          const freshUser = await authApi.getProfile();
          setUser(freshUser);
          saveToSession('user', freshUser);
          saveToSession('lastActivity', now);
        } catch (err: any) {
          if ([401, 403].includes(err.status)) clearSession();
        }
      }
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  // ----------------- Refresh User Data (Throttled) -----------------
  const refreshUserData = async () => {
    if (!token) return;
    const now = Date.now();
    if (now - lastRefresh < REFRESH_INTERVAL) return;
    lastRefresh = now;

    try {
      const freshUser = await authApi.getProfile();
      setUser(freshUser);
      saveToSession('user', freshUser);
      saveToSession('lastActivity', now);
    } catch (err: any) {
      if ([401, 403].includes(err.status)) logout();
    }
  };

  // ----------------- Visibility / Focus Handling -----------------
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) refreshUserData();
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  useEffect(() => { initializeUser(); }, []);

  // ----------------- Login / Signup -----------------
  const handleAuthResponse = async (response: AuthResponse) => {
    if (response.emailVerificationRequired) return response;
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    saveToSession('user', response.user);
    saveToSession('lastActivity', Date.now());
    setToken(response.accessToken);
    setUser(response.user);
    return response;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      if (!response.user.emailVerified) throw new Error('Please verify your email before logging in');
      return await handleAuthResponse(response);
    } finally { setIsLoading(false); }
  };

  const signup = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup({ email, username, password });
      return await handleAuthResponse(response);
    } finally { setIsLoading(false); }
  };

  // ----------------- Logout -----------------
  const logout = () => {
    if (token) authApi.logout().catch(() => {});
    clearSession();
  };

  // ----------------- Update User -----------------
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setUser(updatedUser);
      saveToSession('user', updatedUser);
      saveToSession('lastActivity', Date.now());
    } catch {
      const optimisticUser = { ...user, ...userData };
      setUser(optimisticUser);
      saveToSession('user', optimisticUser);
      saveToSession('lastActivity', Date.now());
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isInitialized, initializeUser, refreshUserData, login, signup, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
