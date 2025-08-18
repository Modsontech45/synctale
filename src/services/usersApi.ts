import { apiRequest, cachedApiRequest } from './api';
import { User } from '../types';
import { mapUserData } from '../utils/userDataMapper';

export interface SearchUsersParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FollowResponse {
  isFollowing: boolean;
  followersCount: number;
}

export const usersApi = {
  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await cachedApiRequest<User>(
      `/api/users/${id}`,
      {},
      { cacheTTL: 5 * 60 * 1000 } // Cache user data for 5 minutes
    );
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return mapUserData(response.data);
  },

  // Search users
  searchUsers: async (params: SearchUsersParams): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append('q', params.query);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await apiRequest<UsersResponse>(`/api/users/search?${searchParams}`);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return {
      ...response.data,
      users: response.data.users?.map(mapUserData) || []
    };
  },

  // Follow/unfollow user
  toggleFollow: async (userId: string): Promise<FollowResponse> => {
    const response = await apiRequest<FollowResponse>(`/api/follows/${userId}`, {
      method: 'POST',
    });
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Get user's followers
  getFollowers: async (userId: string, page = 1, limit = 20): Promise<UsersResponse> => {
    const response = await apiRequest<UsersResponse>(`/api/follows/${userId}/followers?page=${page}&limit=${limit}`);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return {
      ...response.data,
      users: response.data.users?.map(mapUserData) || []
    };
  },

  // Get user's following
  getFollowing: async (userId: string, page = 1, limit = 20): Promise<UsersResponse> => {
    const response = await apiRequest<UsersResponse>(`/api/follows/${userId}/following?page=${page}&limit=${limit}`);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return {
      ...response.data,
      users: response.data.users?.map(mapUserData) || []
    };
  },

  // Check if following user
  isFollowing: async (userId: string): Promise<{ isFollowing: boolean }> => {
    const response = await apiRequest<{ isFollowing: boolean }>(`/api/follows/${userId}/status`);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Get user profile by ID
  getUserProfile: async (id: string): Promise<User> => {
    const response = await cachedApiRequest<User>(
      `/api/users/${id}/profile`,
      {},
      { cacheTTL: 3 * 60 * 1000 } // Cache profile for 3 minutes
    );
    
    if (!response) {
      throw new Error('Invalid response from server');
    }
    
    return mapUserData(response);
  },
};