import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Coins, CreditCard, Gift, History, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const CoinsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'buy' | 'history'>('buy');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const coinPackages = [
    { id: 1, coins: 100, price: 4.99, bonus: 0, popular: false },
    { id: 2, coins: 250, price: 9.99, bonus: 25, popular: false },
    { id: 3, coins: 500, price: 19.99, bonus: 75, popular: true },
    { id: 4, coins: 1000, price: 34.99, bonus: 200, popular: false },
    { id: 5, coins: 2500, price: 79.99, bonus: 600, popular: false },
    { id: 6, coins: 5000, price: 149.99, bonus: 1500, popular: false },
  ];

  const transactionHistory = [
    {
      id: 't1',
      type: 'purchase',
      amount: 500,
      price: 19.99,
      date: '2025-01-13T10:30:00Z',
      description: 'Bought 500 coins'
    },
    {
      id: 't2',
      type: 'gift_sent',
      amount: -25,
      recipient: 'financeguru',
      date: '2025-01-12T15:45:00Z',
      description: 'Sent gift to @financeguru'
    },
    {
      id: 't3',
      type: 'gift_received',
      amount: 50,
      sender: 'budgetmaster',
      date: '2025-01-11T09:20:00Z',
      description: 'Received gift from @budgetmaster'
    },
    {
      id: 't4',
      type: 'gift_sent',
      amount: -10,
      recipient: 'moneyexpert',
      date: '2025-01-10T18:15:00Z',
      description: 'Sent gift to @moneyexpert'
    }
  ];

  const handlePurchase = async (packageId: number) => {
    const selectedPkg = coinPackages.find(pkg => pkg.id === packageId);
    if (!selectedPkg || !user) return;

    setIsLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const totalCoins = selectedPkg.coins + selectedPkg.bonus;
    updateUser({ balance: user.balance + totalCoins });
    
    setIsLoading(false);
    setSelectedPackage(null);
    
    alert(`Successfully purchased ${totalCoins} coins!`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'gift_sent':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'gift_received':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      default:
        return <Coins className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Coins className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coins</h1>
        </div>
        
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Your Balance</p>
            <div className="flex items-center justify-center space-x-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{user.balance}</span>
              <span className="text-lg text-gray-500 dark:text-gray-400">coins</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              ≈ ${(user.balance * 0.04).toFixed(2)} USD
            </p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'buy'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Buy Coins</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>

      {/* Buy Coins Tab */}
      {activeTab === 'buy' && (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Choose a Package</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Support your favorite creators by gifting them coins. The more you buy, the more bonus coins you get!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {coinPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white dark:bg-gray-800 rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
                  pkg.popular
                    ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
                    : selectedPackage === pkg.id
                    ? 'border-primary-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Coins className="w-6 h-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {pkg.coins + pkg.bonus}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-lg text-gray-600 dark:text-gray-400">{pkg.coins} coins</span>
                    {pkg.bonus > 0 && (
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                        +{pkg.bonus} bonus coins
                      </div>
                    )}
                  </div>

                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ${(pkg.price / (pkg.coins + pkg.bonus)).toFixed(3)} per coin
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPackage && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h3>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {coinPackages.find(pkg => pkg.id === selectedPackage)?.coins} coins
                    {coinPackages.find(pkg => pkg.id === selectedPackage)?.bonus > 0 && (
                      <span className="text-green-600 dark:text-green-400 ml-2">
                        +{coinPackages.find(pkg => pkg.id === selectedPackage)?.bonus} bonus
                      </span>
                    )}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Total: {(coinPackages.find(pkg => pkg.id === selectedPackage)?.coins || 0) + 
                           (coinPackages.find(pkg => pkg.id === selectedPackage)?.bonus || 0)} coins
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${coinPackages.find(pkg => pkg.id === selectedPackage)?.price}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchase(selectedPackage)}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Purchase Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Transaction History</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {transactionHistory.length > 0 ? (
              transactionHistory.map((transaction) => (
                <div key={transaction.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {transaction.description}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.amount > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} coins
                      </p>
                      {transaction.price && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          ${transaction.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <History className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Your coin transactions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinsPage;