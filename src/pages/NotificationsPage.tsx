import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, Gift, MessageCircle, UserPlus, Check, CheckCheck } from 'lucide-react';
import { Notification } from '../types';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockNotifications: Notification[] = [
    {
      id: 'n1',
      type: 'gift',
      message: 'financeguru sent you 25 coins for your post "5 Ways to Save Money"',
      creator: {
        id: 'u456',
        username: 'financeguru',
        profilePicture: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      createdAt: '2025-01-13T14:30:00Z',
      isRead: false
    },
    {
      id: 'n2',
      type: 'like',
      message: 'budgetmaster liked your post "Building an Emergency Fund"',
      creator: {
        id: 'u789',
        username: 'budgetmaster',
        profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      createdAt: '2025-01-13T12:15:00Z',
      isRead: false
    },
    {
      id: 'n3',
      type: 'comment',
      message: 'moneyexpert commented on your post "5 Ways to Save Money"',
      creator: {
        id: 'u101',
        username: 'moneyexpert',
        profilePicture: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      createdAt: '2025-01-13T10:45:00Z',
      isRead: true
    },
    {
      id: 'n4',
      type: 'follow',
      message: 'savingsqueen started following you',
      creator: {
        id: 'u202',
        username: 'savingsqueen',
        profilePicture: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      createdAt: '2025-01-12T16:20:00Z',
      isRead: true
    },
    {
      id: 'n5',
      type: 'gift',
      message: 'wealthbuilder sent you 50 coins for your post "Building an Emergency Fund"',
      creator: {
        id: 'u303',
        username: 'wealthbuilder',
        profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      createdAt: '2025-01-12T09:30:00Z',
      isRead: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'gift':
        return <Gift className="w-5 h-5 text-yellow-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-gray-600 dark:text-gray-400">
              You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </p>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                !notification.isRead ? 'bg-primary-50 dark:bg-primary-900/10' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Notification Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Creator Avatar */}
                <div className="flex-shrink-0">
                  {notification.creator ? (
                    <Link to={`/profile/${notification.creator.id}`}>
                      <img
                        src={notification.creator.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={notification.creator.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white text-sm">
                    {notification.message}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                {/* Mark as Read Button */}
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-primary-500 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-gray-500 dark:text-gray-400">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;