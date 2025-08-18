// Session management utilities
export class SessionManager {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly USER_KEY = 'user';
  private static readonly ACTIVITY_KEY = 'lastActivity';
  private static readonly TOKEN_KEY = 'token';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  // SessionStorage utilities
  static saveToSession(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  }

  static getFromSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get from sessionStorage:', error);
      return null;
    }
  }

  static removeFromSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
    }
  }

  // LocalStorage utilities (for tokens)
  static saveToLocal(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static getFromLocal(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  }

  static removeFromLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  // User session management
  static saveUserSession(user: any, token: string, refreshToken: string): void {
    this.saveToSession(this.USER_KEY, user);
    this.saveToSession(this.ACTIVITY_KEY, Date.now());
    this.saveToLocal(this.TOKEN_KEY, token);
    this.saveToLocal(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getUserSession(): { user: any; token: string | null; isValid: boolean } {
    const user = this.getFromSession(this.USER_KEY);
    const lastActivity = this.getFromSession<number>(this.ACTIVITY_KEY);
    const token = this.getFromLocal(this.TOKEN_KEY);

    if (!user || !lastActivity || !token) {
      return { user: null, token: null, isValid: false };
    }

    const now = Date.now();
    const isValid = (now - lastActivity) <= this.SESSION_TIMEOUT;

    return { user, token, isValid };
  }

  static updateActivity(): void {
    this.saveToSession(this.ACTIVITY_KEY, Date.now());
  }

  static clearSession(): void {
    this.removeFromSession(this.USER_KEY);
    this.removeFromSession(this.ACTIVITY_KEY);
    this.removeFromLocal(this.TOKEN_KEY);
    this.removeFromLocal(this.REFRESH_TOKEN_KEY);
  }

  static isSessionExpired(): boolean {
    const lastActivity = this.getFromSession<number>(this.ACTIVITY_KEY);
    if (!lastActivity) return true;

    const now = Date.now();
    return (now - lastActivity) > this.SESSION_TIMEOUT;
  }

  // Activity tracking
  static startActivityTracking(onSessionExpired: () => void): () => void {
    const updateActivity = () => {
      if (!this.isSessionExpired()) {
        this.updateActivity();
      } else {
        onSessionExpired();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (this.isSessionExpired()) {
          onSessionExpired();
        } else {
          updateActivity();
        }
      }
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }
}

export default SessionManager;