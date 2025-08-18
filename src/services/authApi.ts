import { apiRequest, ApiError } from './api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

// Response type for login/signup
export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  emailVerificationRequired?: boolean;
}

export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('[authApi] Login response:', response);

    if (!response.user || !response.accessToken) {
      throw new ApiError('Invalid response from server', 500);
    }

    return response;
  },

  // Register new user
// In authApi.ts
signup: async (userData: SignupRequest): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  // Log the full response for debugging
  console.log('[authApi] Signup response:', response);

  if (!response || !response.user || !response.accessToken) {
    throw new ApiError('Invalid response from server', 500);
  }

  // Return the full AuthResponse object
  return response;
},



  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiRequest<User>('/api/auth/profile');
    console.log('[authApi] Profile response:', response);

    if (!response) {
      throw new ApiError('Invalid response from server', 500);
    }

    return response;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiRequest<User>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    console.log('[authApi] Update profile response:', response);

    if (!response) {
      throw new ApiError('Invalid response from server', 500);
    }

    return response;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    console.log('[authApi] Change password response:', response);
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    const response = await apiRequest('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    console.log('[authApi] Verify email response:', response);
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    const response = await apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    console.log('[authApi] Request password reset response:', response);
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    const response = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
    console.log('[authApi] Reset password response:', response);
  },
};
