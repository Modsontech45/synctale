import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SessionManager from '../utils/sessionManager';

export const useSessionManager = () => {
  const { user, logout, refreshUserData } = useAuth();

  const handleSessionExpired = useCallback(() => {
    console.warn('Session expired, logging out user');
    logout();
  }, [logout]);

  const handleUserActivity = useCallback(() => {
    if (user) {
      SessionManager.updateActivity();
    }
  }, [user]);
  useEffect(() => {
    if (!user) return;

    // Start activity tracking
    const cleanup = SessionManager.startActivityTracking(handleSessionExpired);

    // Periodic session check (every 5 minutes)
    const intervalId = setInterval(() => {
      if (SessionManager.isSessionExpired()) {
        handleSessionExpired();
      } else {
        // Refresh user data every 10 minutes to keep it fresh
        refreshUserData();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      cleanup();
      clearInterval(intervalId);
    };
  }, [user, handleSessionExpired, refreshUserData]);

  // Update activity on component mount
  useEffect(() => {
    if (user) {
      SessionManager.updateActivity();
    }
  }, [user]);

  return {
    updateActivity: handleUserActivity,
    isSessionExpired: SessionManager.isSessionExpired,
    clearSession: SessionManager.clearSession,
    refreshUserData
  };
};

export default useSessionManager;