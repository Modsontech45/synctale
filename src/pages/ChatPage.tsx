import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChatConversation, ChatMessage } from '../types';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const mockConversations: ChatConversation[] = [
    {
      id: 'conv1',
      participants: [
        {
          id: 'u456',
          username: 'financeguru',
          profilePicture: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150',
          isVerified: false
        }
      ],
      lastMessage: {
        id: 'msg1',
        senderId: 'u456',
        receiverId: user?.id || '',
        message: 'Thanks for the great post about saving money!',
        createdAt: '2025-01-13T15:30:00Z',
        isRead: false
      },
      unreadCount: 2,
      updatedAt: '2025-01-13T15:30:00Z'
    },
    {
      id: 'conv2',
      participants: [
        {
          id: 'u789',
          username: 'budgetmaster',
          profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
          isVerified: true
        }
      ],
      lastMessage: {
        id: 'msg2',
        senderId: user?.id || '',
        receiverId: 'u789',
        message: 'I appreciate your feedback on my latest article.',
        createdAt: '2025-01-12T14:20:00Z',
        isRead: true
      },
      unreadCount: 0,
      updatedAt: '2025-01-12T14:20:00Z'
    }
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: 'msg1',
      senderId: 'u456',
      receiverId: user?.id || '',
      message: 'Hey! I really enjoyed your post about saving money.',
      createdAt: '2025-01-13T15:00:00Z',
      isRead: true
    },
    {
      id: 'msg2',
      senderId: user?.id || '',
      receiverId: 'u456',
      message: 'Thank you! I\'m glad you found it helpful.',
      createdAt: '2025-01-13T15:05:00Z',
      isRead: true
    },
    {
      id: 'msg3',
      senderId: 'u456',
      receiverId: user?.id || '',
      message: 'Do you have any tips for investing in stocks?',
      createdAt: '2025-01-13T15:25:00Z',
      isRead: true
    },
    {
      id: 'msg4',
      senderId: 'u456',
      receiverId: user?.id || '',
      message: 'Thanks for the great post about saving money!',
      createdAt: '2025-01-13T15:30:00Z',
      isRead: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConversations(mockConversations);
      if (id) {
        const conversation = mockConversations.find(conv => conv.id === id);
        setActiveConversation(conversation || null);
        setMessages(mockMessages);
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !user) return;

    const message: ChatMessage = {
      id: 'msg' + Date.now(),
      senderId: user.id,
      receiverId: activeConversation.participants[0].id,
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(conversations.map(conv =>
      conv.id === activeConversation.id
        ? { ...conv, lastMessage: message, updatedAt: message.createdAt }
        : conv
    ));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-8"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Messages</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex h-96 md:h-[600px]">
          {/* Conversations List */}
          <div className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 ${activeConversation ? 'hidden md:block' : ''}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversations</h2>
            </div>
            
            <div className="overflow-y-auto h-full">
              {conversations.length > 0 ? (
                conversations.map((conversation) => {
                  const otherUser = conversation.participants[0];
                  return (
                    <Link
                      key={conversation.id}
                      to={`/chat/${conversation.id}`}
                      className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors ${
                        activeConversation?.id === conversation.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={otherUser.profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                            alt={otherUser.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              @{otherUser.username}
                            </p>
                            {otherUser.isVerified && (
                              <span className="text-primary-500 text-sm">✓</span>
                            )}
                          </div>
                          
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
                              {conversation.lastMessage.message}
                            </p>
                          )}
                          
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDate(conversation.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : ''}`}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/chat"
                      className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                    
                    <img
                      src={activeConversation.participants[0].profilePicture || 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={activeConversation.participants[0].username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    
                    <div>
                      <div className="flex items-center space-x-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          @{activeConversation.participants[0].username}
                        </h3>
                        {activeConversation.participants[0].isVerified && (
                          <span className="text-primary-500">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
                    </div>
                  </div>
                  
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"subject
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;