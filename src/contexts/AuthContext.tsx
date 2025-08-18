import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authApi } from '../services/authApi';
import { ApiError } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeUser = async () => {
    if (token && !user && !isLoading) {
      setIsLoading(true);
      try {
        const userData = await authApi.getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Failed to get user profile:', err);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
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
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to update user:', err);
      setUser({ ...user, ...userData }); // optimistic update fallback
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, initializeUser, login, signup, logout, updateUser, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
