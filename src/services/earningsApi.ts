import { apiRequest } from './api';
import { Payout } from '../types';

export interface EarningsData {
  totalEarnedCoins: number;
  totalEarnedUSD: number;
  availableForPayout: number;
  minimumPayout: number;
  payouts: Payout[];
}

export interface PayoutRequest {
  amount?: number; // Optional, will use all available if not specified
}

export const earningsApi = {
  // Get earnings dashboard data
  getEarnings: async (): Promise<EarningsData> => {
    const response = await apiRequest<EarningsData>('/api/earnings');
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Request payout
  requestPayout: async (payoutData: PayoutRequest = {}): Promise<{ message: string; payout: Payout }> => {
    const response = await apiRequest<{ message: string; payout: Payout }>('/api/earnings/payout', {
      method: 'POST',
      body: JSON.stringify(payoutData),
    });
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Get payout history
  getPayouts: async (page = 1, limit = 10): Promise<{ payouts: Payout[]; pagination: any }> => {
    const response = await apiRequest<{ payouts: Payout[]; pagination: any }>(`/api/earnings/payouts?page=${page}&limit=${limit}`);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Cancel pending payout
  cancelPayout: async (payoutId: string): Promise<void> => {
    await apiRequest(`/api/earnings/payouts/${payoutId}/cancel`, {
      method: 'POST',
    });
  },
};