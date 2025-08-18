import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, Comment } from '../types';
import { Heart, MessageCircle, Share2, Gift, ThumbsDown, UserPlus, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GiftModal from '../components/Modals/GiftModal';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data
  const mockPost: Post = {
    id: 'p101',
    title: '5 Ways to Save Money This Year',
    category: 'Finance',
    preview: 'Learn the top 5 strategies that helped me save over $10,000 last year.',
    content: `# 5 Ways to Save Money This Year

Money management is one of the most important skills you can develop. After years of trial and error, I've discovered these five powerful strategies that helped me save over $10,000 last year.

## 1. Create a Detailed Budget

The foundation of saving money is knowing exactly where your money goes. I recommend:

- Track every expense for at least one month
- Use apps like Mint or YNAB to categorize spending
- Set realistic limits for each category
- Review and adjust monthly

## 2. Automate Your Savings

Make saving effortless by automating it:

- Set up automatic transfers to your savings account
- Start with just $50 per week if you're a beginner
- Increase the amount by $10 every month
- Treat savings like a non-negotiable bill

## 3. Cut Subscription Services

Most people pay for subscriptions they don't use:

- Audit all your monthly subscriptions
- Cancel anything you haven't used in 30 days
- Consider sharing family plans with friends or family
- Use free alternatives when possible

## 4. Cook More Meals at Home

Eating out is one of the biggest budget killers:

- Plan your meals for the week
- Buy groceries with a list and stick to it
- Batch cook on weekends
- Learn 5-10 simple recipes you enjoy

## 5. Use the 24-Hour Rule

Before making any non-essential purchase over $50:

- Wait 24 hours before buying
- Ask yourself if you really need it
- Consider if you have something similar already
- Think about your long-term financial goals

These strategies might seem simple, but consistency is key. Start with one or two strategies and gradually implement the others. Your future self will thank you!`,
    images: ['https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=800'],
    likes: 24,
    dislikes: 2,
    commentsCount: 5,
    gifts: 120,
    creator: {
      id: 'u123',
      username: 'coolcreator',
      profilePicture: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
      isVerified: true
    },
    createdAt: '2025-01-13T10:30:00Z',
    isLiked: false,
    isDisliked: false
  };

  const mockComments: Comment[] = [
    {
      id: 'c501',
      text: 'Great tips! I especially love the 24-hour rule. It has saved me so much money on impulse purchases.',
      creator: {
        id: 'u456',
        username: 'financeguru',
        profilePicture: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      createdAt: '2025-01-13T11:00:00Z'
    },
    {
      id: 'c502',
      text: 'I started using these strategies and saved $2,000 in just 3 months. The automated savings tip changed my life!',
      creator: {
        id: 'u789',
        username: 'savvyspender',
        profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      createdAt: '2025-01-13T11:05:00Z'
    },
    {
      id: 'c503',
      text: 'The subscription audit was eye-opening! I was paying for 6 services I forgot I had. Just cancelled 4 of them.',
      creator: {
        id: 'u101',
        username: 'budgetmaster',
        profilePicture: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      createdAt: '2025-01-13T12:30:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPost(mockPost);
      setComments(mockComments);
      setLikes(mockPost.likes);
      setDislikes(mockPost.dislikes);
      setIsLiked(mockPost.isLiked || false);
      setIsDisliked(mockPost.isDisliked || false);
      setLoading(false);
    }, 1000);
  }, [id]);

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
    
    // Call API in real implementation
    // postsApi.likePost(post.id).catch(console.error);
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
    
    // Call API in real implementation
    // postsApi.dislikePost(post.id).catch(console.error);
  };

  const handleShare = async () => {
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: 'c' + Date.now(),
      text: newComment.trim(),
      creator: {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture
      },
      createdAt: new Date().toISOString()
    };

    setComments([...comments, comment]);
    setNewComment('');
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

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
        <p className="text-gray-600 dark:text-gray-400">The post you're looking for doesn't exist.</p>
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
                {user?.id !== post.creator.id && (
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`ml-2 flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
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
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center space-x-2 transition-colors ${
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
                      disabled={!newComment.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
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
            ))}
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

export default PostDetailPage;