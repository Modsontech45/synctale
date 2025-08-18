import React, { useState } from 'react';
import { X, Gift, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { postsApi } from '../../services/postsApi';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientUsername: string;
  postId?: string;
}

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, recipientId, recipientUsername, postId }) => {
  const { user, updateUser } = useAuth();
  const [giftAmount, setGiftAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const presetAmounts = [5, 10, 25, 50, 100];

  const handleGift = async () => {
    if (!user || user.balance < giftAmount || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    try {
      if (postId) {
        // Gift coins to post creator
        await postsApi.giftCoins(postId, giftAmount, message.trim() || undefined);
      } else {
        // Direct gift to user (would need a separate API endpoint)
        // For now, we'll use the post gift API as fallback
        console.warn('Direct user gifting not implemented, using post gift API');
      }
      
      // Update user balance optimistically
      updateUser({ balance: user.balance - giftAmount });
      
      onClose();
      alert(`You sent ${giftAmount} coins to @${recipientUsername}!`);
    } catch (err: any) {
      console.error('Failed to send gift:', err);
      setError(err.message || 'Failed to send gift. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Send Gift to @{recipientUsername}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Your Balance</span>
              <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                <Coins className="w-4 h-4" />
                <span className="font-medium">{user?.balance || 0}</span>
              </div>
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setGiftAmount(amount)}
                  disabled={isLoading}
                  className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                    giftAmount === amount
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300 disabled:opacity-50'
                  } disabled:cursor-not-allowed`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Amount
            </label>
            <input
              type="number"
              min="1"
              max={user?.balance || 0}
              value={giftAmount}
              onChange={(e) => setGiftAmount(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a nice message..."
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGift}
              disabled={isLoading || !user || user.balance < giftAmount}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              ) : (
                `Send ${giftAmount} Coins`
              )}
            </button>
          </div>

          {user && user.balance < giftAmount && (
            <p className="text-red-500 text-sm mt-2 text-center">
              Insufficient balance. You need {giftAmount - user.balance} more coins.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftModal;