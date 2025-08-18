// Request optimization utilities
import { useCallback, useRef, useState, useEffect } from 'react';

// Simple in-memory cache with TTL
class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

export const requestCache = new RequestCache();

// Debounce hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRan = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const now = Date.now();
      if (now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      } else {
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRan.current = Date.now();
        }, delay - (now - lastRan.current));
      }
    }) as T,
    [callback, delay]
  );
};

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

export const dedupeRequest = async <T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
};

// Retry logic with exponential backoff
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Optimized API request wrapper
export const optimizedApiRequest = async <T>(
  key: string,
  requestFn: () => Promise<T>,
  options: {
    cache?: boolean;
    cacheTTL?: number;
    retry?: boolean;
    maxRetries?: number;
    dedupe?: boolean;
  } = {}
): Promise<T> => {
  const {
    cache = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    retry = true,
    maxRetries = 3,
    dedupe = true
  } = options;

  // Check cache first
  if (cache) {
    const cached = requestCache.get(key);
    if (cached) {
      return cached;
    }
  }

  const executeRequest = async () => {
    const request = retry 
      ? () => withRetry(requestFn, maxRetries)
      : requestFn;

    const result = dedupe 
      ? await dedupeRequest(key, request)
      : await request();

    // Cache the result
    if (cache) {
      requestCache.set(key, result, cacheTTL);
    }

    return result;
  };

  return executeRequest();
};