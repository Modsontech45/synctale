import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Post } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { usersApi } from "../services/usersApi";
import { postsApi } from "../services/postsApi";
import {
  Calendar,
  Edit,
  Settings,
  UserPlus,
  Users,
  FileText,
  Coins,
} from "lucide-react";
import PostCard from "../components/Post/PostCard";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, refreshUserData, isInitialized } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "posts" | "followers" | "following"
  >("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isInitialized) {
    return (
      <div className="text-center py-8">
        <p>Loading user...</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let profileData: User;
        
        if (isOwnProfile && currentUser) {
          // Use current user data for own profile
          profileData = currentUser;
          await refreshUserData(); // Refresh to get latest data
        } else {
          // Fetch other user's profile
          profileData = await usersApi.getUserProfile(id);
        }
        
        setUser(profileData);
        
        // Check if following this user (only for other users)
        if (!isOwnProfile && currentUser) {
          try {
            const followStatus = await usersApi.isFollowing(id);
            setIsFollowing(followStatus.isFollowing);
          } catch (err) {
            console.error('Failed to check follow status:', err);
          }
        }
        
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser, isOwnProfile, refreshUserData]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!id) return;
      
      setPostsLoading(true);
      try {
        const postsResponse = await postsApi.getUserPosts(id, 1, 10);
        setPosts(postsResponse.posts || []);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    if (user && activeTab === 'posts') {
      fetchPosts();
    }
  }, [id, user, activeTab]);

  const handleFollow = async () => {
    if (!user || !currentUser || isOwnProfile) return;
    
    try {
      const response = await usersApi.toggleFollow(user.id);
      setIsFollowing(response.isFollowing);
      setUser({
        ...user,
        followersCount: response.followersCount,
      });
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || "User not found"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          The user you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div className="text-center mb-6">
          <img
            src={
              user.profilePicture ||
              "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300"
            }
            alt={user.username}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary-100 dark:border-primary-900"
          />

          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              @{user.username}
            </h1>
            {user.isVerified && (
              <span className="text-primary-500 text-xl">✓</span>
            )}
          </div>

          {user.bio && (
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
              {user.bio}
            </p>
          )}

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Calendar className="w-4 h-4" />
            <span>Joined {new Date(user.createdAt || '2024-01-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>

          <div className="flex justify-center space-x-3">
            {isOwnProfile ? (
              <>
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </>
            ) : currentUser && (
              <button
                onClick={handleFollow}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    : "bg-primary-500 text-white hover:bg-primary-600"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{isFollowing ? "Following" : "Follow"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <FileText className="w-6 h-6 text-primary-500" />
              <span>{user.postsCount || 0}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <Users className="w-6 h-6 text-primary-500" />
              <span>{user.followersCount || 0}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Followers
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <Users className="w-6 h-6 text-primary-500" />
              <span>{user.followingCount || 0}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Following
            </p>
          </div>

          {isOwnProfile && (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
                <Coins className="w-6 h-6 text-yellow-500" />
                <span>{user.totalEarned || 0}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Coins</p>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'posts'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Posts</span>
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'followers'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Followers</span>
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'following'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Following</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div>
          {postsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isOwnProfile ? "Create your first post to get started!" : "This user hasn't posted anything yet."}
              </p>
              {isOwnProfile && (
                <Link
                  to="/create"
                  className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create Post</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'followers' && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Followers</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Followers list will be implemented here.
          </p>
        </div>
      )}

      {activeTab === 'following' && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Following</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Following list will be implemented here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
