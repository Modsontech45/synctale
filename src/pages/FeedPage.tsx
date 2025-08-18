import React, { useState, useEffect } from "react";
import PostCard from "../components/Post/PostCard";
import PostSkeleton from "../components/Post/PostSkeleton";
import { useLanguage } from "../contexts/LanguageContext";
import { Post, Pagination } from "../types";
import { postsApi } from "../services/postsApi";
import { TrendingUp, Clock } from "lucide-react";

const FeedPage: React.FC = () => {
  const { t } = useLanguage();

  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "trending">("recent");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      const sortParam = activeTab === "trending" ? "trending" : "recent";

      try {
        console.log(`[FeedPage] Fetching posts, tab: ${activeTab}`);

        let response;
        if (activeTab === "trending") {
          response = await postsApi.getTrendingPosts({
            page: 1,
            limit: 10,
          });
        } else {
          response = await postsApi.getPosts({
            page: 1,
            limit: 10,
          });
        }

        console.log("[FeedPage] Raw API response:", response);

        // Ensure each post has a creator object
        const postsArray: Post[] = (response.posts ?? []).map((p) => ({
          ...p,
          creator: p.creator ?? { id: "unknown", username: "Unknown", profilePicture: "", isVerified: false },
          likes: p.likes ?? 0,
          dislikes: p.dislikes ?? 0,
          commentsCount: p.commentsCount ?? 0,
          gifts: p.gifts ?? 0,
          views: p.views ?? 0,
          images: p.images ?? [],
          category: p.category ?? "General",
          createdAt: p.createdAt ?? new Date().toISOString(),
          title: p.title ?? "Untitled",
          preview: p.preview ?? "",
          isLiked: p.isLiked ?? false,
          isDisliked: p.isDisliked ?? false,
        }));

        setPosts(postsArray);
        setPagination(response.pagination ?? null);

      } catch (apiError: any) {
        console.error(
          "[FeedPage] API not available, using fallback mode:",
          apiError?.message || apiError
        );
        setUsingFallback(true);
        setError("Unable to load posts from server.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  const handleTabChange = (tab: "recent" | "trending") => {
    if (tab !== activeTab) setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {usingFallback && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Demo Mode:</strong> Backend server not available. Showing no posts.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => handleTabChange("recent")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "recent"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Recent</span>
        </button>
        <button
          onClick={() => handleTabChange("trending")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "trending"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Trending</span>
        </button>
      </div>

      {/* Posts */}
      {error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="space-y-8">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post, index) => (
            <PostCard key={post.id || index} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found.</p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
