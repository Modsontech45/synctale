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
    this.name = "ApiError";
  }
}

// Get auth token from localStorage
const getAuthToken = (): string | null => localStorage.getItem("token");

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
  console.log("[API Request] Config:", config);

  try {
    const response = await fetch(url, config);

    console.log("[API Response] Status:", response.status);
    console.log("[API Response] OK:", response.ok);
    console.log("[API Response] Headers:", Array.from(response.headers.entries()));

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      console.warn("[API Response] No JSON body returned");
    }

    console.log("[API Response] Data:", data);

    if (!response.ok) {
      // Use server-provided error or fallback to status text
      const errorMsg =
        data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMsg, response.status, data);
    }

    // If response is valid, return it as T
    return data as T;
  } catch (err: any) {
    console.error(`[API Error] Request failed: ${url}`, err);

    if (err instanceof ApiError) {
      throw err; // Already handled server error
    }

    // Wrap network/fetch errors in ApiError
    throw new ApiError(
      err?.message || "Network error or server unavailable",
      0,
      err
    );
  }
};
