import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { Heart, MessageCircle, Share2, Gift, ThumbsDown, MoreHorizontal, UserPlus, Eye, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { postsApi } from '../../services/postsApi';
import { usersApi } from '../../services/usersApi';
import GiftModal from '../Modals/GiftModal';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(post.isDisliked || false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Handle both new backend format (post.user) and legacy format (post.creator)
  const creator = post.user || post.creator;
  if (!post || !creator) return null; // Prevent undefined crashes

  // ----------------- Handlers -----------------
  const handleSendMessage = () => {
    if (!user) return navigate('/home');
    window.location.href = `/chat/new?user=${creator.id}`;
  };

  const handleFollow = async () => {
    if (!user) return navigate('/home');
    if (followLoading) return;
    
    setFollowLoading(true);
    try {
      const response = await usersApi.toggleFollow(creator.id);
      setIsFollowing(response.isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/home');
    if (likeLoading) return;
    
    setLikeLoading(true);
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
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!user) return navigate('/home');
    if (likeLoading) return;
    
    setLikeLoading(true);
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
      setLikeLoading(false);
    }
  };

  const handleGiftClick = () => {
    if (!user) return navigate('/home');
    setShowGiftModal(true);
  };

  const handleCommentClick = () => {
    if (!user) return navigate('/home');
    navigate(`/post/${post.id}#comments`);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.preview, url });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      // Show a toast or alert that link was copied
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) return `${Math.floor(diffTime / (1000 * 60))}m ago`;
      return `${diffHours}h ago`;
    } else if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  // ----------------- JSX -----------------
  return (
    <>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${creator.id}`}>
                <img
                  src={creator.avatar || creator.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={creator.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/profile/${creator.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400"
                  >
                    @{creator.username}
                  </Link>
                  {creator.isVerified && <span className="text-green-500 text-sm">✓</span>}
                  {user?.id !== creator.id && (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`ml-2 flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                        isFollowing
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>{followLoading ? '...' : (isFollowing ? 'Following' : 'Follow')}</span>
                    </button>
                  )}
                  <button
                    onClick={handleSendMessage}
                    className="ml-2 flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Message</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views || 0} views</span>
                  </div>
                  <span>•</span>
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                    {post.category || 'General'}
                  </span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <Link to={`/post/${post.id}`}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              {post.title || 'Untitled'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.preview || ''}</p>
          </Link>
          {post.images?.length > 0 && (
            <Link to={`/post/${post.id}`}>
              <img
                src={post.images[0]}
                alt={post.title || 'Post Image'}
                className="w-full h-64 object-cover rounded-lg mb-4 hover:opacity-95 transition-opacity"
              />
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center space-x-1 transition-colors disabled:opacity-50 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <button
                onClick={handleDislike}
                disabled={likeLoading}
                className={`flex items-center space-x-1 transition-colors disabled:opacity-50 ${isDisliked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{dislikes}</span>
              </button>

              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCommentClick();
                }}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{post.commentsCount || 0}</span>
              </Link>

              <button
                onClick={handleShare}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>

            <button
              onClick={handleGiftClick}
              className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition-colors"
            >
              <Gift className="w-5 h-5" />
              <span className="text-sm font-medium">{post.gifts || 0}</span>
            </button>
          </div>
        </div>
      </article>

      {showGiftModal && (
        <GiftModal
          isOpen={showGiftModal}
          onClose={() => setShowGiftModal(false)}
          recipientId={creator.id}
          recipientUsername={creator.username}
          postId={post.id}
        />
      )}
    </>
  );
};

export default PostCard;
