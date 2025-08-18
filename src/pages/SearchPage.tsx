import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDebounce } from '../utils/requestOptimization';
import { Search, Users, FileText, Filter } from 'lucide-react';
import { User, Post } from '../types';
import { postsApi } from '../services/postsApi';
import { usersApi } from '../services/usersApi';
import PostCard from '../components/Post/PostCard';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchType, setSearchType] = useState<'all' | 'posts' | 'users'>('all');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query to prevent excessive API calls
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    // Define async function for API calls
    const performSearch = async () => {
      if (debouncedQuery.trim()) {
        setLoading(true);
        setError(null);
        
        try {
          // Search posts and users in parallel
          const [postsResponse, usersResponse] = await Promise.allSettled([
            postsApi.searchPosts(debouncedQuery, { page: 1, limit: 10 }),
            usersApi.searchUsers({ query: debouncedQuery, page: 1, limit: 10 })
          ]);
          
          // Handle posts response
          if (postsResponse.status === 'fulfilled') {
            setPosts(postsResponse.value.posts || []);
          } else {
            console.error('Failed to search posts:', postsResponse.reason);
            setPosts([]);
          }
          
          // Handle users response
          if (usersResponse.status === 'fulfilled') {
            setUsers(usersResponse.value.users || []);
          } else {
            console.error('Failed to search users:', usersResponse.reason);
            setUsers([]);
          }
          
        } catch (error) {
          console.error('Search failed:', error);
          // Fallback to mock data
          const filteredPosts = mockPosts.filter(post =>
            post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            post.preview.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(debouncedQuery.toLowerCase())
          );
          console.error('Search failed:', error);
          setError('Search failed. Please try again.');
          setPosts([]);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError(null);
        setPosts([]);
        setUsers([]);
      }
    };

    // Execute search with delay
    performSearch();
  }, [debouncedQuery]);

  const displayPosts = searchType === 'users' ? [] : posts;
  const displayUsers = searchType === 'posts' ? [] : users;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-6 h-6 text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Results
          </h1>
        </div>
        
        {query && (
          <p className="text-gray-600 dark:text-gray-400">
            Results for "<span className="font-medium text-primary-600 dark:text-primary-400">{query}</span>"
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setSearchType('all')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            searchType === 'all'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>All</span>
        </button>
        <button
          onClick={() => setSearchType('posts')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            searchType === 'posts'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Posts ({posts.length})</span>
        </button>
        <button
          onClick={() => setSearchType('users')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            searchType === 'users'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({users.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Searching...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Users Section */}
          {displayUsers.length > 0 && (
            <div>
              {searchType === 'all' && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Users</h2>
              )}
              <div className="grid gap-4">
                {displayUsers.map((user) => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.id}`}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            @{user.username}
                          </h3>
                          {user.isVerified && (
                            <span className="text-primary-500">✓</span>
                          )}
                        </div>
                        {user.bio && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                            {user.bio}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span>{user.followersCount || 0} followers</span>
                          <span>{user.postsCount || 0} posts</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {displayPosts.length > 0 && (
            <div>
              {searchType === 'all' && displayUsers.length > 0 && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Posts</h2>
              )}
              <div className="space-y-8">
                {displayPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && displayPosts.length === 0 && displayUsers.length === 0 && query && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!query && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Start searching</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Enter a search term to find posts and creators.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;