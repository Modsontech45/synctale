import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-6 text-sm">
            <Link 
              to="/terms" 
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              to="/privacy" 
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Contact
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Synctale. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
            Powered by Synctuario
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;