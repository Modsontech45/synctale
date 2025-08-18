export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  avatar?: string;
  coinsBalance: number;
  totalEarned: number;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  createdAt: string;
  
  // Legacy fields for backward compatibility
  profilePicture?: string; // Maps to avatar
  balance?: number; // Maps to coinsBalance
  emailVerified?: boolean;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  preview?: string;
  category: 'Finance' | 'Motivational' | 'Relationship' | 'Health' | 'Technology' | 'Travel' | 'Food' | 'Lifestyle' | 'Education' | 'Entertainment';
  images: string[];
  views: number;
  likes: number;
  dislikes: number;
  commentsCount: number;
  gifts: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  user: User;
  
  // Legacy fields for backward compatibility
  creator?: {
    id: string;
    username: string;
    profilePicture?: string;
    isVerified?: boolean;
  };
  isLiked?: boolean;
  isDisliked?: boolean;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  text: string;
  likes: number;
  createdAt: string;
  user: User;
  
  // Legacy fields for backward compatibility
  creator?: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  parentId?: string;
  updatedAt?: string;
}

export interface CoinTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  sender: User;
  receiver: User;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sourceUser: User;
  post?: Post;
  
  // Legacy fields for backward compatibility
  creator?: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  relatedPostId?: string;
}

export interface ApiError {
  error: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

export interface ValidationError {
  error: string;
  code: string;
  details: string[];
}

export interface Payout {
  id: string;
  creatorId: string;
  coins: number;
  usd: number;
  platformFee: number;
  netPayout: number;
  status: 'Pending' | 'Paid' | 'Cancelled';
  date: string;
  requestedAt?: string;
  processedAt?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  messageType?: 'text' | 'image' | 'file';
  updatedAt?: string;
}

export interface ChatConversation {
  id: string;
  participants: {
    id: string;
    username: string;
    profilePicture?: string;
    isVerified?: boolean;
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
  createdAt?: string;
}