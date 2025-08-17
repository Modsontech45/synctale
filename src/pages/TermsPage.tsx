import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, DollarSign, Shield, Users } from 'lucide-react';

const TermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <FileText className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Last updated: January 13, 2025
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            Revenue Sharing & Platform Fees
          </h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
              Creator Earnings
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Synctale rewards creators for their quality content. When users gift coins to creators, those creators earn money that can be withdrawn once they reach the minimum payout threshold.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Coin System & Conversion
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>1 USD = 78 coins (fixed conversion rate)</li>
            <li>Minimum payout threshold: $5.00 USD</li>
            <li>Payouts processed within 3-5 business days</li>
            <li>All transactions are final and non-refundable</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            User Responsibilities
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Content Guidelines
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>Create original, high-quality content</li>
            <li>Respect intellectual property rights</li>
            <li>No spam, harassment, or inappropriate content</li>
            <li>Follow community guidelines and standards</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Account Security
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li>Maintain secure login credentials</li>
            <li>Report suspicious activity immediately</li>
            <li>One account per person</li>
            <li>Accurate profile information required</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 text-purple-600 mr-2" />
            Platform Rights & Limitations
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Service Availability
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Synctale reserves the right to modify, suspend, or discontinue any part of the service at any time. 
            We strive to provide 99.9% uptime but cannot guarantee uninterrupted service.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Content Moderation
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We reserve the right to review, moderate, or remove content that violates our community guidelines. 
            Repeated violations may result in account suspension or termination.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Limitation of Liability
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Synctale is not liable for any indirect, incidental, or consequential damages arising from the use of our platform. 
            Our total liability is limited to the amount paid by the user in the past 12 months.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            By using Synctale, you agree to these terms and conditions. 
            If you have questions, please contact our support team.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            These terms are effective as of January 13, 2025 and may be updated periodically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;