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
  refreshUserData: () => Promise<void>;
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
      
      // Set cached user data immediately for better UX
      if (savedUser && token && !user) {
        setUser(savedUser);
        saveToSession('lastActivity', Date.now());
      }
      
      // If we have a token, fetch fresh user data from server
      if (token) {
        try {
          console.log('[AuthContext] Fetching fresh user data from server...');
          const userData = await authApi.getProfile();
          
          // Check if email is verified
          if (!userData.emailVerified) {
            console.warn('User email not verified');
          }
          
          console.log('[AuthContext] Fresh user data received:', userData);
          setUser(userData);
          saveToSession('user', userData);
          saveToSession('lastActivity', Date.now());
        } catch (err: any) {
          console.error('Failed to get user profile:', err);
          
          // If token is invalid, clear it
          if (err.status === 401 || err.status === 403) {
            console.warn('[AuthContext] Token invalid, clearing session');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            removeFromSession('user');
            removeFromSession('lastActivity');
            setToken(null);
            setUser(null);
          }
        }
      } else {
        console.log('[AuthContext] No token found, user not authenticated');
      }
    } catch (err) {
      console.error('Failed to initialize user:', err);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  // Refresh user data function for manual calls
  const refreshUserData = async () => {
    if (!token) return;
    
    try {
      console.log('[AuthContext] Manually refreshing user data...');
      const userData = await authApi.getProfile();
      setUser(userData);
      saveToSession('user', userData);
      saveToSession('lastActivity', Date.now());
      console.log('[AuthContext] User data refreshed successfully');
    } catch (err: any) {
      console.error('Failed to refresh user data:', err);
      
      // If token is invalid during refresh, logout
      if (err.status === 401 || err.status === 403) {
        console.warn('[AuthContext] Token invalid during refresh, logging out');
        logout();
      }
    }
  };
  const login = async (email: string, password: string): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[AuthContext] Attempting login for:', email);
      const response = await authApi.login({ email, password });
      
      // Check if email verification is required
      if (response.emailVerificationRequired) {
        console.log('[AuthContext] Email verification required');
        // Don't set tokens or user data if email verification is required
        return response;
      }
      
      // Check if user email is verified
      if (!response.user.emailVerified) {
        console.warn('[AuthContext] User email not verified');
        setError('Please verify your email address before logging in');
        return null;
      }
      
      console.log('[AuthContext] Login successful, saving session data');
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
      console.log('[AuthContext] Attempting signup for:', email);
      const response = await authApi.signup({ email, username, password });
      
      // Only set tokens and user if email verification is not required
      if (!response.emailVerificationRequired) {
        console.log('[AuthContext] Signup successful, saving session data');
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        saveToSession('user', response.user);
        saveToSession('lastActivity', Date.now());
        setToken(response.accessToken);
        setUser(response.user);
      } else {
        console.log('[AuthContext] Signup successful, email verification required');
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
    console.log('[AuthContext] Logging out user');
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
      console.log('[AuthContext] Updating user data:', userData);
      const updatedUser = await authApi.updateProfile(userData);
      setUser(updatedUser);
      saveToSession('user', updatedUser);
      saveToSession('lastActivity', Date.now());
      console.log('[AuthContext] User data updated successfully');
    } catch (err) {
      console.error('Failed to update user:', err);
      console.log('[AuthContext] Using optimistic update as fallback');
      const optimisticUser = { ...user, ...userData };
      setUser(optimisticUser); // optimistic update fallback
      saveToSession('user', optimisticUser);
      saveToSession('lastActivity', Date.now());
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        token, 
        isInitialized, 
        initializeUser, 
        refreshUserData,
        login, 
        signup, 
        logout, 
        updateUser, 
        isLoading, 
        error 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
