import { apiRequest } from './api';
import { ChatConversation, ChatMessage } from '../types';

export interface CreateConversationRequest {
  participantId: string;
}

export interface SendMessageRequest {
  conversationId: string;
  message: string;
  messageType?: 'text' | 'image' | 'file';
}

export interface MessagesResponse {
  messages: ChatMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const chatApi = {
  // Get user's conversations
  getConversations: async (): Promise<{ conversations: ChatConversation[] }> => {
    const response = await apiRequest<{ conversations: ChatConversation[] }>('/api/chat/conversations');
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Get messages from a conversation
  getMessages: async (conversationId: string, page = 1, limit = 50): Promise<MessagesResponse> => {
    const response = await apiRequest<MessagesResponse>(`/api/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Create new conversation
  createConversation: async (participantData: CreateConversationRequest): Promise<{ conversation: ChatConversation }> => {
    const response = await apiRequest<{ conversation: ChatConversation }>('/api/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(participantData),
    });
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Send message
  sendMessage: async (messageData: SendMessageRequest): Promise<ChatMessage> => {
    const response = await apiRequest<ChatMessage>('/api/chat/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (conversationId: string): Promise<void> => {
    await apiRequest(`/api/chat/conversations/${conversationId}/read`, {
      method: 'POST',
    });
  },

  // Delete conversation
  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiRequest(`/api/chat/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<void> => {
    await apiRequest(`/api/chat/messages/${messageId}`, {
      method: 'DELETE',
    });
  },
};