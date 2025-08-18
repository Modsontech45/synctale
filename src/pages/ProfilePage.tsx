import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Post } from "../types";
import { useAuth } from "../contexts/AuthContext";
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
import { authApi } from "../services/authApi";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, refreshUserData, isInitialized } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "posts" | "followers" | "following"
  >("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  if (!isInitialized) {
    return (
      <div className="text-center py-8">
        <p>Loading user...</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === id;
  console.log("User ID:", id);
  console.log("Profile ID:", user?.id);
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await authApi.getProfile();
        setUser(profileData.user);
        setPosts([]); // Replace with actual posts API call if available
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    if (isOwnProfile && currentUser) {
      refreshUserData();
    }
  }, [id, currentUser, isOwnProfile, refreshUserData]);

  const handleFollow = () => {
    if (!user) return;
    setIsFollowing(!isFollowing);
    setUser({
      ...user,
      followersCount: isFollowing
        ? user.followersCount - 1
        : user.followersCount + 1,
    });
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

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          User not found
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
              user.avatar ||
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
            <span>Joined January 2024</span>
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
            ) : (
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
              <span>{user.postsCount}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <Users className="w-6 h-6 text-primary-500" />
              <span>{user.followersCount}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Followers
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <Users className="w-6 h-6 text-primary-500" />
              <span>{user.followingCount}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Following
            </p>
          </div>

          {isOwnProfile && (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
                <Coins className="w-6 h-6 text-yellow-500" />
                <span>{user.totalEarned}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Coins</p>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation & Content (optional, can add later) */}
    </div>
  );
};

export default ProfilePage;
