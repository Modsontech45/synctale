export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  balance: number;
  totalEarned: number;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  createdAt?: string;
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
  category: string;
  preview?: string;
  content: string;
  images?: string[];
  views: number;
  likes: number;
  dislikes: number;
  commentsCount: number;
  gifts: number;
  creator: {
    id: string;
    username: string;
    profilePicture?: string;
    isVerified?: boolean;
  };
  createdAt: string;
  updatedAt?: string;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export interface Comment {
  id: string;
  text: string;
  creator: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt?: string;
  likes?: number;
  parentId?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'gift' | 'comment' | 'follow';
  message: string;
  creator?: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  isRead: boolean;
  relatedPostId?: string;
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