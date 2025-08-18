import { apiRequest } from './api';

export interface CoinPackage {
  id: number;
  coins: number;
  price: number;
  bonus: number;
  popular?: boolean;
}

export interface PurchaseCoinsRequest {
  packageId: number;
  paymentMethodId: string;
}

export interface GiftCoinsRequest {
  recipientId: string;
  amount: number;
  message?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  transactionType: 'purchase' | 'gift_sent' | 'gift_received' | 'payout';
  amount: number;
  usdAmount?: number;
  relatedUserId?: string;
  relatedPostId?: string;
  stripePaymentIntentId?: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const coinsApi = {
  // Get available coin packages
  getPackages: async (): Promise<CoinPackage[]> => {
    const response = await apiRequest<CoinPackage[]>('/api/coins/packages');
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Purchase coins
  purchaseCoins: async (purchaseData: PurchaseCoinsRequest): Promise<{ message: string; coins: number; paymentIntentId: string }> => {
    const response = await apiRequest<{ message: string; coins: number; paymentIntentId: string }>('/api/coins/purchase', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Gift coins to another user
  giftCoins: async (giftData: GiftCoinsRequest): Promise<{ message: string; amount: number; recipient: string }> => {
    const response = await apiRequest<{ message: string; amount: number; recipient: string }>('/api/coins/gift', {
      method: 'POST',
      body: JSON.stringify(giftData),
    });
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Get user's transaction history
  getTransactions: async (page = 1, limit = 20): Promise<TransactionsResponse> => {
    const response = await apiRequest<TransactionsResponse>(`/api/coins/transactions?page=${page}&limit=${limit}`);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  // Get user's coin balance
  getBalance: async (): Promise<{ balance: number; totalEarned: number }> => {
    const response = await apiRequest<{ balance: number; totalEarned: number }>('/api/coins/balance');
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },
};