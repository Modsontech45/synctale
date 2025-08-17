import React from 'react';
import { Shield, Mail, Phone, MapPin, Eye, Database, Lock } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Last updated: January 13, 2025
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Eye className="w-6 h-6 text-blue-600 mr-2" />
            Information We Collect
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Personal Information
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>Email address (required for account creation and communication)</li>
            <li>Username and profile information</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Content you create (posts, comments, messages)</li>
            <li>Usage data and analytics</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Automatically Collected Information
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on the platform</li>
            <li>Interaction data (likes, comments, views)</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Database className="w-6 h-6 text-green-600 mr-2" />
            How We Use Your Information
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Primary Uses
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>Provide and maintain the Synctale platform</li>
            <li>Process payments and manage your coin balance</li>
            <li>Enable communication between users</li>
            <li>Personalize your experience and content recommendations</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>

          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Marketing Communications
            </h3>
            <p className="text-primary-700 dark:text-primary-300 mb-4">
              <strong>Important Notice:</strong> By creating an account with Synctale, you consent to receive marketing communications from us via email. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-primary-700 dark:text-primary-300">
              <li>Platform updates and new feature announcements</li>
              <li>Tips for content creation and monetization</li>
              <li>Special promotions and coin package offers</li>
              <li>Community highlights and success stories</li>
              <li>Newsletter with platform insights and trends</li>
            </ul>
            <p className="text-primary-700 dark:text-primary-300 mt-4">
              You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email or by contacting us directly.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Lock className="w-6 h-6 text-purple-600 mr-2" />
            Data Protection & Security
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Security Measures
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>End-to-end encryption for sensitive data</li>
            <li>Secure payment processing through Stripe</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication protocols</li>
            <li>Data backup and recovery systems</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Sharing
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With trusted service providers (under strict confidentiality agreements)</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Rights & Choices
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Control
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Portability:</strong> Export your data in a readable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Cookie Policy
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can manage cookie preferences through your browser settings.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Contact Information
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary-600" />
              <span className="text-gray-700 dark:text-gray-300">tandemodson2@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary-600" />
              <span className="text-gray-700 dark:text-gray-300">+228 93 94 60 43</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span className="text-gray-700 dark:text-gray-300">Togo</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This Privacy Policy is effective as of January 13, 2025 and may be updated periodically. 
            We will notify you of any significant changes via email or platform notification.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            By continuing to use Synctale, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;