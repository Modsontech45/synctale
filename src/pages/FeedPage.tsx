import React, { useState, useEffect } from 'react';
import PostCard from '../components/Post/PostCard';
import PostSkeleton from '../components/Post/PostSkeleton';
import { useLanguage } from '../contexts/LanguageContext';
import { Post } from '../types';
import { TrendingUp, Clock } from 'lucide-react';

const FeedPage: React.FC = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'trending'>('recent');

  // Mock data
  const mockPosts: Post[] = [
    {
      id: 'p101',
      title: '5 Ways to Save Money This Year',
      category: 'Finance',
      preview: 'Learn the top 5 strategies that helped me save over $10,000 last year. These simple tips can transform your financial future...',
      content: 'Full blog content goes here...',
      images: ['https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=800'],
      views: 543,
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
    },
    {
      id: 'p102',
      title: 'Why Laughter is the Best Medicine',
      category: 'Motivational',
      preview: 'Discover the incredible health benefits of laughter and how it can improve your mental and physical wellbeing...',
      content: 'Full blog content goes here...',
      images: ['https://images.pexels.com/photos/1367269/pexels-photo-1367269.jpeg?auto=compress&cs=tinysrgb&w=800'],
      views: 876,
      likes: 56,
      dislikes: 1,
      commentsCount: 12,
      gifts: 75,
      creator: {
        id: 'u456',
        username: 'healthguru',
        profilePicture: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: false
      },
      createdAt: '2025-01-12T14:15:00Z',
      isLiked: true,
      isDisliked: false
    },
    {
      id: 'p103',
      title: 'Building Strong Relationships in 2025',
      category: 'Relationship',
      preview: 'The key principles for creating lasting, meaningful connections with the people who matter most in your life...',
      content: 'Full blog content goes here...',
      images: ['https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800'],
      views: 1234,
      likes: 89,
      dislikes: 3,
      commentsCount: 18,
      gifts: 200,
      creator: {
        id: 'u789',
        username: 'relationshipcoach',
        profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        isVerified: true
      },
      createdAt: '2025-01-11T09:22:00Z',
      isLiked: false,
      isDisliked: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1500);
  }, []);

  const trendingPosts = [...posts].sort((a, b) => (b.likes + b.gifts) - (a.likes + a.gifts));
  const displayPosts = activeTab === 'trending' ? trendingPosts : posts;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'recent'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t('general.recent')}</span>
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'trending'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t('general.trending')}</span>
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-8">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {!loading && displayPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found.</p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;