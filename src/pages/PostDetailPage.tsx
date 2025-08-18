import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, Comment } from '../types';
import { Heart, MessageCircle, Share2, Gift, ThumbsDown, UserPlus, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { postsApi } from '../services/postsApi';
import { usersApi } from '../services/usersApi';
import GiftModal from '../components/Modals/GiftModal';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const postData = await postsApi.getPost(id);
        setPost(postData);
        setLikes(postData.likes || 0);
        setDislikes(postData.dislikes || 0);
        setIsLiked(postData.isLiked || false);
        setIsDisliked(postData.isDisliked || false);
        
        // Check if following the post creator (only if user is logged in and not viewing own post)
        if (user && user.id !== postData.creator.id) {
          try {
            const followStatus = await usersApi.isFollowing(postData.creator.id);
            setIsFollowing(followStatus.isFollowing);
          } catch (err) {
            console.error('Failed to check follow status:', err);
          }
        }
        
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      setCommentsLoading(true);
      try {
        const commentsResponse = await postsApi.getComments(id, 1, 20);
        setComments(commentsResponse.comments || []);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (post) {
      fetchComments();
    }
  }, [id, post]);

  const handleLike = async () => {
    if (!post || !user || actionLoading) return;
    
    setActionLoading(true);
    try {
      const response = await postsApi.likePost(post.id);
      setIsLiked(response.isLiked);
      setLikes(response.likes);
      
      // If we liked and were previously disliking, update dislike state
      if (response.isLiked && isDisliked) {
        setIsDisliked(false);
        setDislikes(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!post || !user || actionLoading) return;
    
    setActionLoading(true);
    try {
      const response = await postsApi.dislikePost(post.id);
      setIsDisliked(response.isDisliked);
      setDislikes(response.dislikes);
      
      // If we disliked and were previously liking, update like state
      if (response.isDisliked && isLiked) {
        setIsLiked(false);
        setLikes(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to dislike post:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!post || !user || actionLoading || user.id === post.creator.id) return;
    
    setActionLoading(true);
    try {
      const response = await usersApi.toggleFollow(post.creator.id);
      setIsFollowing(response.isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.preview,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !post || actionLoading) return;

    setActionLoading(true);
    try {
      const comment = await postsApi.createComment({
        text: newComment.trim(),
        postId: post.id
      });
      
      setComments([...comments, comment]);
      setNewComment('');
      
      // Update post comment count
      setPost({
        ...post,
        commentsCount: (post.commentsCount || 0) + 1
      });
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded mb-8"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || "Post not found"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {error || "The post you're looking for doesn't exist."}
        </p>
      </div>
    );
  }

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to={`/profile/${post.creator.id}`}>
              <img
                src={post.creator.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={post.creator.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Link
                  to={`/profile/${post.creator.id}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                >
                  @{post.creator.username}
                </Link>
                {post.creator.isVerified && (
                  <span className="text-primary-500">✓</span>
                )}
                {user && user.id !== post.creator.id && (
                  <button
                    onClick={handleFollow}
                    disabled={actionLoading}
                    className={`ml-2 flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                      isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>{actionLoading ? '...' : (isFollowing ? 'Following' : 'Follow')}</span>
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-8">
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
                  {paragraph.slice(2)}
                </h1>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
                  {paragraph.slice(3)}
                </h2>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <li key={index} className="text-gray-700 dark:text-gray-300 mb-1">
                  {paragraph.slice(2)}
                </li>
              );
            }
            if (paragraph.trim() === '') {
              return <br key={index} />;
            }
            return (
              <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between py-6 border-y border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={actionLoading}
              className={`flex items-center space-x-2 transition-colors disabled:opacity-50 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              disabled={actionLoading}
              className={`flex items-center space-x-2 transition-colors disabled:opacity-50 ${
                isDisliked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <ThumbsDown className={`w-6 h-6 ${isDisliked ? 'fill-current' : ''}`} />
              <span className="font-medium">{dislikes}</span>
            </button>

            <div className="flex items-center space-x-2 text-gray-500">
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{comments.length}</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-primary-500 transition-colors"
            >
              <Share2 className="w-6 h-6" />
              <span className="font-medium">Share</span>
            </button>
          </div>

          <button
            onClick={() => setShowGiftModal(true)}
            className="flex items-center space-x-2 text-gray-500 hover:text-yellow-500 transition-colors"
          >
            <Gift className="w-6 h-6" />
            <span className="font-medium">{post.gifts}</span>
          </button>
        </div>

        {/* Comments Section */}
        <div id="comments">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex space-x-4">
                <img
                  src={user.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || actionLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Comment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Loading comments...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <Link to={`/profile/${comment.creator.id}`}>
                      <img
                        src={comment.creator.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={comment.creator.username}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <Link
                            to={`/profile/${comment.creator.id}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            @{comment.creator.username}
                          </Link>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </article>

      {showGiftModal && (
        <GiftModal
          isOpen={showGiftModal}
          onClose={() => setShowGiftModal(false)}
          recipientId={post.creator.id}
          recipientUsername={post.creator.username}
        />
      )}
    </>
  );
};

export default PostDetailPage;