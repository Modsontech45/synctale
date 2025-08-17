import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(post.isDisliked || false);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleSendMessage = () => {
    // Navigate to chat with this user
    window.location.href = `/chat/new?user=${post.creator.id}`;
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
      if (isDisliked) {
        setDislikes(dislikes - 1);
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikes(dislikes - 1);
      setIsDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      setIsDisliked(true);
      if (isLiked) {
        setLikes(likes - 1);
        setIsLiked(false);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.preview,
          url: window.location.origin + `/post/${post.id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays}d ago`;
    }
  };

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
                  alt={post.creator.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/profile/${post.creator.id}`}
                    className="font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400"
                  >
                    @{post.creator.username}
                  </Link>
                  {post.creator.isVerified && (
                    <span className="text-green-500 text-sm">✓</span>
                  )}
                  {user?.id !== post.creator.id && (
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
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
                    <span>{post.views} {t('post.views')}</span>
                  </div>
                  <span>•</span>
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
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
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {post.preview}
            </p>
          </Link>

          {post.images && post.images.length > 0 && (
            <Link to={`/post/${post.id}`}>
              <img
                src={post.images[0]}
                alt={post.title}
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
                className={`flex items-center space-x-1 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <button
                onClick={handleDislike}
                className={`flex items-center space-x-1 transition-colors ${
                  isDisliked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{dislikes}</span>
              </button>

              <Link
                to={`/post/${post.id}#comments`}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{post.commentsCount}</span>
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
              onClick={() => setShowGiftModal(true)}
              className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500 transition-colors"
            >
              <Gift className="w-5 h-5" />
              <span className="text-sm font-medium">{post.gifts}</span>
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