import { apiRequest } from './api';
import { Post, Comment } from '../types';

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  images?: string[];
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  sort?: 'recent' | 'trending' | 'popular';
  search?: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateCommentRequest {
  text: string;
  postId: string;
  parentId?: string;
}

export const postsApi = {
  /** Get posts with optional pagination and filters */
  getPosts: (params: GetPostsParams = {}): Promise<PostsResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString());
    });

    return apiRequest<PostsResponse>(`/api/posts?${searchParams.toString()}`);
  },

  /** Get a single post by ID */
  getPost: (id: string): Promise<Post> => apiRequest<Post>(`/api/posts/${id}`),

  /** Create a new post */
  createPost: (postData: CreatePostRequest): Promise<Post> =>
    apiRequest<Post>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  /** Update an existing post */
  updatePost: (id: string, postData: Partial<CreatePostRequest>): Promise<Post> =>
    apiRequest<Post>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),

  /** Delete a post */
  deletePost: (id: string): Promise<void> =>
    apiRequest(`/api/posts/${id}`, { method: 'DELETE' }),

  /** Like/unlike a post */
  toggleLike: (id: string): Promise<{ isLiked: boolean; likes: number }> =>
    apiRequest(`/api/posts/${id}/like`, { method: 'POST' }),

  /** Dislike/undislike a post */
  toggleDislike: (id: string): Promise<{ isDisliked: boolean; dislikes: number }> =>
    apiRequest(`/api/posts/${id}/dislike`, { method: 'POST' }),

  /** Get comments for a post with optional pagination */
  getComments: (postId: string, page = 1, limit = 20): Promise<{ comments: Comment[]; pagination: any }> =>
    apiRequest(`/api/posts/${postId}/comments?page=${page}&limit=${limit}`),

  /** Create a new comment */
  createComment: (commentData: CreateCommentRequest): Promise<Comment> =>
    apiRequest('/api/comments', { method: 'POST', body: JSON.stringify(commentData) }),

  /** Delete a comment */
  deleteComment: (id: string): Promise<void> =>
    apiRequest(`/api/comments/${id}`, { method: 'DELETE' }),

  /** Get posts created by a specific user */
  getUserPosts: (userId: string, page = 1, limit = 10): Promise<PostsResponse> =>
    apiRequest(`/api/users/${userId}/posts?page=${page}&limit=${limit}`),

  /** Search posts by query */
  searchPosts: (query: string, page = 1, limit = 10): Promise<PostsResponse> =>
    apiRequest(`/api/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`),
};
