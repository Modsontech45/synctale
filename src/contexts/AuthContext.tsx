import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import { authApi } from '../services/authApi';
import { ApiError } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  initializeUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResponse | null>;
  signup: (email: string, username: string, password: string) => Promise<AuthResponse | null>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  // Storage utilities for session management
  const saveToSession = (key: string, value: any) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  };

  const getFromSession = (key: string) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get from sessionStorage:', error);
      return null;
    }
  };

  const removeFromSession = (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
    }
  };

  // Initialize user on app start
  useEffect(() => {
    initializeUser();
  }, []);

  // Save user data to sessionStorage whenever user changes
  useEffect(() => {
    if (user) {
      saveToSession('user', user);
      saveToSession('lastActivity', Date.now());
    } else {
      removeFromSession('user');
      removeFromSession('lastActivity');
    }
  }, [user]);

  // Check session validity on focus/visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        // Check if session is still valid when user returns to tab
        const lastActivity = getFromSession('lastActivity');
        const now = Date.now();
        const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        
        if (lastActivity && (now - lastActivity) > sessionTimeout) {
          // Session expired, logout user
          logout();
        } else {
          // Update last activity
          saveToSession('lastActivity', now);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [user]);

  const initializeUser = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Try to get user from sessionStorage first
      const savedUser = getFromSession('user');
      const lastActivity = getFromSession('lastActivity');
      
      // Check session validity
      if (savedUser && lastActivity) {
        const now = Date.now();
        const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        
        if ((now - lastActivity) > sessionTimeout) {
          // Session expired, clear data
          removeFromSession('user');
          removeFromSession('lastActivity');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setToken(null);
          setUser(null);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }
      }
      
      if (savedUser && token) {
        setUser(savedUser);
        saveToSession('lastActivity', Date.now());
      }
      
      // If we have a token, fetch fresh user data from server
      if (token) {
        try {
          const userData = await authApi.getProfile();
          
          // Check if email is verified
          if (!userData.emailVerified) {
            console.warn('User email not verified');
          }
          
          setUser(userData);
          saveToSession('user', userData);
          saveToSession('lastActivity', Date.now());
        } catch (err: any) {
          console.error('Failed to get user profile:', err);
          
          // If token is invalid, clear it
          if (err.status === 401 || err.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            removeFromSession('user');
            removeFromSession('lastActivity');
            setToken(null);
            setUser(null);
          }
        }
      }
    } catch (err) {
      console.error('Failed to initialize user:', err);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      
      // Check if email verification is required
      if (response.emailVerificationRequired) {
        // Don't set tokens or user data if email verification is required
        return response;
      }
      
      // Check if user email is verified
      if (!response.user.emailVerified) {
        setError('Please verify your email address before logging in');
        return null;
      }
      
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      saveToSession('user', response.user);
      saveToSession('lastActivity', Date.now());
      setToken(response.accessToken);
      setUser(response.user);
      return response;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.response?.error || err?.message || 'Login failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.signup({ email, username, password });
      
      // Only set tokens and user if email verification is not required
      if (!response.emailVerificationRequired) {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        saveToSession('user', response.user);
        saveToSession('lastActivity', Date.now());
        setToken(response.accessToken);
        setUser(response.user);
      }
      
      return response;
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.response?.error || err?.message || 'Signup failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Call backend logout endpoint (optional - for session cleanup)
    if (token) {
      authApi.logout().catch(err => console.error('Logout API call failed:', err));
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    removeFromSession('user');
    removeFromSession('lastActivity');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setUser(updatedUser);
      saveToSession('user', updatedUser);
      saveToSession('lastActivity', Date.now());
    } catch (err) {
      console.error('Failed to update user:', err);
      const optimisticUser = { ...user, ...userData };
      setUser(optimisticUser); // optimistic update fallback
      saveToSession('user', optimisticUser);
      saveToSession('lastActivity', Date.now());
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isInitialized, initializeUser, login, signup, logout, updateUser, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
