import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Payout } from '../types';
import { coinsToUSD, platformCutUSD, creatorNetUSD } from '../utils/coinConversion';
import { DollarSign, Coins, TrendingUp, Calendar, Download } from 'lucide-react';

const EarningsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockPayouts: Payout[] = [
    {
      id: '1',
      creatorId: user?.id || '',
      coins: 780,
      usd: 10.00,
      platformFee: 6.00,
      netPayout: 4.00,
      status: 'Paid',
      date: '2025-01-01'
    },
    {
      id: '2',
      creatorId: user?.id || '',
      coins: 1560,
      usd: 20.00,
      platformFee: 12.00,
      netPayout: 8.00,
      status: 'Pending',
      date: '2025-01-05'
    },
    {
      id: '3',
      creatorId: user?.id || '',
      coins: 390,
      usd: 5.00,
      platformFee: 3.00,
      netPayout: 2.00,
      status: 'Paid',
      date: '2024-12-28'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPayouts(mockPayouts);
      setLoading(false);
    }, 1000);
  }, []);

  const totalEarned = user?.totalEarned || 0;
  const totalNet = creatorNetUSD(totalEarned);

  const handleRequestPayout = () => {
    alert('Payout request submitted! You will receive payment within 3-5 business days.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('earnings.dashboard')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your earnings and manage payouts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Coins className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('earnings.totalEarned')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalEarned.toLocaleString()}
              </p>
            </div>
          </div>
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-primary-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalNet}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Available for Payout
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalNet >= 50 ? totalNet.toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Min. $50.00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Payout Button */}
      {totalNet >= 50 && (
        <div className="mb-8">
          <button
            onClick={handleRequestPayout}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>{t('earnings.requestPayout')}</span>
          </button>
        </div>
      )}

      {/* Payouts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payout History
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">{t('general.loading')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('earnings.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('earnings.coinsEarned')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('earnings.status')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(payout.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payout.coins.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${payout.netPayout.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Terms Notice */}
      <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> Minimum payout is $50.00 USD. Payouts are processed within 3-5 business days.
        </p>
      </div>
    </div>
  );
};

export default EarningsPage;