// Base API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
import { optimizedApiRequest, requestCache } from '../utils/requestOptimization';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Get auth token from localStorage
const getAuthToken = (): string | null => localStorage.getItem("token");

// Clear cache when user logs out
export const clearApiCache = () => {
  requestCache.clear();
};

// Base fetch wrapper with logging and improved error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[API Request] URL: ${url}`);

  try {
    const response = await fetch(url, config);


    let data: any = {};
    try {
      data = await response.json();
    } catch {
      // Silent handling for non-JSON responses
    }


    if (!response.ok) {
      // Use server-provided error or fallback to status text
      const errorMsg =
        data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMsg, response.status, data);
    }

    // If response is valid, return it as T
    return data as T;
  } catch (err: any) {

    if (err instanceof ApiError) {
      throw err; // Already handled server error
    }

    // Log network errors less verbosely
    console.warn(`[API] Network error for ${endpoint}:`, err.message);

    // Wrap network/fetch errors in ApiError
    throw new ApiError(
      "Unable to connect to server. Please check your connection.",
      0,
      err
    );
  }
};

// Optimized API request with caching and retry logic
export const cachedApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  cacheOptions?: {
    cache?: boolean;
    cacheTTL?: number;
    retry?: boolean;
    maxRetries?: number;
  }
): Promise<T> => {
  const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
  
  return optimizedApiRequest(
    cacheKey,
    () => apiRequest<T>(endpoint, options),
    cacheOptions
  );
};