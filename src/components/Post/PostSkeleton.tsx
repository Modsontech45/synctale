import React from 'react';

const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
        </div>
        <div className="w-full h-64 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-6 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-6 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-6 animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-8 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;