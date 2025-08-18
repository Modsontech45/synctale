import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { Heart, MessageCircle, Share2, Gift, ThumbsDown, MoreHorizontal, UserPlus, Eye, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
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

  if (!post || !post.creator) return null; // Prevent undefined crashes

  // ----------------- Handlers -----------------
  const handleSendMessage = () => {
    if (!user) return navigate('/home');
    window.location.href = `/chat/new?user=${post.creator.id}`;
  };

  const handleFollow = () => {
    if (!user) return navigate('/home');
    setIsFollowing(!isFollowing);
  };

  const handleLike = () => {
    if (!user) return navigate('/home');
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    if (!isLiked && isDisliked) {
      setIsDisliked(false);
      setDislikes((prev) => prev - 1);
    }
    
    // Call API in real implementation
    // postsApi.likePost(post.id).catch(console.error);
  };

  const handleDislike = () => {
    if (!user) return navigate('/home');
    setIsDisliked(!isDisliked);
    setDislikes((prev) => (isDisliked ? prev - 1 : prev + 1));
    if (!isDisliked && isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    }
    
    // Call API in real implementation
    // postsApi.dislikePost(post.id).catch(console.error);
  };

const username = post.user?.username || post.creator?.username || "Unknown";

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
              <Link to={`/profile/${post.creator.id}`}>
                <img
                  src={post.creator.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={post.user?.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/profile/${post.creator.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400"
                  >
                    @{post.user?.username || 'Unknown'}
                  </Link>
                  {post.creator.isVerified && <span className="text-green-500 text-sm">✓</span>}
                  {user?.id !== post.creator.id && (
                    <button
                      onClick={handleFollow}
                      className={`ml-2 flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        isFollowing
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>{isFollowing ? t('post.following') : t('post.follow')}</span>
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
                    <span>{post.views || 0} {t('post.views')}</span>
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
                className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <button
                onClick={handleDislike}
                className={`flex items-center space-x-1 transition-colors ${isDisliked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
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
                <span className="text-sm font-medium">{t('post.share')}</span>
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
          recipientId={post.creator.id}
          recipientUsername={post.creator.username}
        />
      )}
    </>
  );
};

export default PostCard;
