import { apiRequest } from './api';
import { Notification } from '../types';

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

export const notificationsApi = {
  // Get user's notifications
  getNotifications: async (page = 1, limit = 20): Promise<NotificationsResponse> => {
    const response = await apiRequest<NotificationsResponse>(`/api/notifications?page=${page}&limit=${limit}`);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    await apiRequest(`/api/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await apiRequest('/api/notifications/read-all', {
      method: 'POST',
    });
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiRequest(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiRequest<{ count: number }>('/api/notifications/unread-count');
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },
};