// Base API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
    this.name = 'ApiError';
  }
}

// Get auth token from localStorage
const getAuthToken = (): string | null => localStorage.getItem('token');

// Base fetch wrapper with full logging and error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[API Request] Fetching: ${url}`);
  console.log('[API Request] Config:', config);

  try {
    const response = await fetch(url, config);

    console.log('[API Response] Status:', response.status);
    console.log('[API Response] OK:', response.ok);
    console.log('[API Response] Headers:', Array.from(response.headers.entries()));

    let data: any;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    console.log('[API Response] Data:', data);

if (!response.ok) {
  // Use server-provided error message if available
  const errorMsg = data?.error || `HTTP ${response.status}: ${response.statusText}`;
  throw new ApiError(errorMsg, response.status, data);
}


    return data as T;
  } catch (error: any) {
    console.error(`[API Error] Request failed: ${url}`, error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error or server unavailable', 0, error);
  }
};
