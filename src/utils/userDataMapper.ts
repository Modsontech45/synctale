import { User } from '../types';

/**
 * Maps backend user data to frontend format for backward compatibility
 */
export const mapUserData = (backendUser: any): User => {
  return {
    // Backend fields
    id: backendUser.id,
    email: backendUser.email,
    username: backendUser.username,
    bio: backendUser.bio,
    avatar: backendUser.avatar,
    coinsBalance: backendUser.coinsBalance || 0,
    totalEarned: backendUser.totalEarned || 0,
    followersCount: backendUser.followersCount || 0,
    followingCount: backendUser.followingCount || 0,
    postsCount: backendUser.postsCount || 0,
    isVerified: backendUser.isVerified || false,
    createdAt: backendUser.createdAt,
    
    // Legacy mappings for backward compatibility
    profilePicture: backendUser.avatar || backendUser.profilePicture,
    balance: backendUser.coinsBalance || backendUser.balance || 0,
    emailVerified: backendUser.emailVerified,
    updatedAt: backendUser.updatedAt,
  };
};

/**
 * Maps backend post data to frontend format for backward compatibility
 */
export const mapPostData = (backendPost: any): any => {
  return {
    // Backend fields
    id: backendPost.id,
    title: backendPost.title,
    content: backendPost.content,
    preview: backendPost.preview,
    category: backendPost.category,
    images: backendPost.images || [],
    views: backendPost.views || 0,
    likes: backendPost.likes || 0,
    dislikes: backendPost.dislikes || 0,
    commentsCount: backendPost.commentsCount || 0,
    gifts: backendPost.gifts || 0,
    isPublished: backendPost.isPublished,
    publishedAt: backendPost.publishedAt,
    createdAt: backendPost.createdAt,
    user: mapUserData(backendPost.user),
    
    // Legacy mappings for backward compatibility
    creator: {
      id: backendPost.user?.id,
      username: backendPost.user?.username,
      profilePicture: backendPost.user?.avatar || backendPost.user?.profilePicture,
      isVerified: backendPost.user?.isVerified || false,
    },
    isLiked: backendPost.isLiked,
    isDisliked: backendPost.isDisliked,
    updatedAt: backendPost.updatedAt,
  };
};

/**
 * Maps backend comment data to frontend format for backward compatibility
 */
export const mapCommentData = (backendComment: any): any => {
  return {
    // Backend fields
    id: backendComment.id,
    text: backendComment.text,
    likes: backendComment.likes || 0,
    createdAt: backendComment.createdAt,
    user: mapUserData(backendComment.user),
    
    // Legacy mappings for backward compatibility
    creator: {
      id: backendComment.user?.id,
      username: backendComment.user?.username,
      profilePicture: backendComment.user?.avatar || backendComment.user?.profilePicture,
    },
    parentId: backendComment.parentId,
    updatedAt: backendComment.updatedAt,
  };
};

/**
 * Maps backend notification data to frontend format for backward compatibility
 */
export const mapNotificationData = (backendNotification: any): any => {
  return {
    // Backend fields
    id: backendNotification.id,
    type: backendNotification.type,
    title: backendNotification.title,
    message: backendNotification.message,
    isRead: backendNotification.isRead,
    createdAt: backendNotification.createdAt,
    sourceUser: mapUserData(backendNotification.sourceUser),
    post: backendNotification.post ? mapPostData(backendNotification.post) : undefined,
    
    // Legacy mappings for backward compatibility
    creator: {
      id: backendNotification.sourceUser?.id,
      username: backendNotification.sourceUser?.username,
      profilePicture: backendNotification.sourceUser?.avatar || backendNotification.sourceUser?.profilePicture,
    },
    relatedPostId: backendNotification.post?.id,
  };
};