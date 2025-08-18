import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PenTool, Users, TrendingUp, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user, token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Share Your Stories,
            <span className="text-primary-500 block">Earn Rewards</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the social blogging platform where creators get rewarded for quality content. 
            Write, share, and earn coins from your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Creating
            </Link>
            <Link
              to="/login"
              className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Synctale?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Writing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Rich text editor with image support and beautiful formatting options.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Social Features</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Follow creators, like posts, comment, and build your community.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Trending Content</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover popular posts and trending topics in your feed.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Earn Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get coins from readers who appreciate your content.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators sharing their stories and earning rewards.
          </p>
          <Link
            to="/signup"
            className="bg-white text-primary-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;