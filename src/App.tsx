import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import CoinsPage from './pages/CoinsPage';
import EarningsPage from './pages/EarningsPage';
import TermsPage from './pages/TermsPage';
import SettingsPage from './pages/SettingsPage';
import ChatPage from './pages/ChatPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<FeedPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  
                  <Route path="/feed" element={<FeedPage />} />
                  
                  <Route path="/create" element={
                    <ProtectedRoute>
                      <CreatePostPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/post/:id" element={<PostDetailPage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/coins" element={
                    <ProtectedRoute>
                      <CoinsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/earnings" element={
                    <ProtectedRoute>
                      <EarningsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/chat/:id" element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;