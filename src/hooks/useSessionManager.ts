import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SessionManager from '../utils/sessionManager';

export const useSessionManager = () => {
  const { user, logout } = useAuth();

  const handleSessionExpired = useCallback(() => {
    console.warn('Session expired, logging out user');
    logout();
  }, [logout]);

  useEffect(() => {
    if (!user) return;

    // Start activity tracking
    const cleanup = SessionManager.startActivityTracking(handleSessionExpired);

    // Periodic session check (every 5 minutes)
    const intervalId = setInterval(() => {
      if (SessionManager.isSessionExpired()) {
        handleSessionExpired();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      cleanup();
      clearInterval(intervalId);
    };
  }, [user, handleSessionExpired]);

  // Update activity on component mount
  useEffect(() => {
    if (user) {
      SessionManager.updateActivity();
    }
  }, [user]);

  return {
    updateActivity: SessionManager.updateActivity,
    isSessionExpired: SessionManager.isSessionExpired,
    clearSession: SessionManager.clearSession
  };
};

export default useSessionManager;