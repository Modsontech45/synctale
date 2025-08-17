import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  balance: number;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Mock getting user data from token
      const mockUser: User = {
        id: 'u123',
        username: 'coolcreator',
        email: 'user@example.com',
        profilePicture: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Content creator passionate about finance and motivation',
        balance: 500,
        totalEarned: 2340,
        followersCount: 1243,
        followingCount: 89,
        postsCount: 23,
        isVerified: true
      };
      setUser(mockUser);
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const mockToken = 'jwt-token-example';
      const mockUser: User = {
        id: 'u123',
        username: 'coolcreator',
        email,
        profilePicture: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Content creator passionate about finance and motivation',
        balance: 500,
        totalEarned: 2340,
        followersCount: 1243,
        followingCount: 89,
        postsCount: 23,
        isVerified: true
      };
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && username && password) {
      const mockToken = 'jwt-token-example';
      const mockUser: User = {
        id: 'u' + Date.now(),
        username,
        email,
        profilePicture: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: '',
        balance: 100,
        totalEarned: 0,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        isVerified: false
      };
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    updateUser,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};