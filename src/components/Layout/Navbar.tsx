import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSessionManager } from "../../hooks/useSessionManager";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  PenTool,
  Home,
  Coins,
  DollarSign,
  Globe,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout, refreshUserData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { updateActivity } = useSessionManager();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Refresh user data when component mounts
  useEffect(() => {
    if (user) {
      refreshUserData();
    }
  }, [user?.id, refreshUserData]); // Only refresh when user ID changes
  // Update activity on user interactions
  const handleUserActivity = () => {
    updateActivity();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserActivity();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
    setShowProfileMenu(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={user ? "/feed" : "/home"}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Synctale
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-lg mx-8 hidden md:block"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search creators, posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Navigation Links */}
                <Link
                  to="/feed"
                  className={`hidden md:block p-2 rounded-lg transition-colors ${
                    isActive("/feed")
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Home className="w-5 h-5" />
                </Link>

                <Link
                  to="/create"
                  className={`hidden md:block p-2 rounded-lg transition-colors ${
                    isActive("/create")
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                </Link>

                <Link
                  to="/coins"
                  className={`hidden md:block p-2 rounded-lg transition-colors ${
                    isActive("/coins")
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Coins className="w-5 h-5" />
                </Link>

                <Link
                  to="/earnings"
                  className={`hidden md:block p-2 rounded-lg transition-colors ${
                    isActive("/earnings")
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                </Link>

                <Link
                  to="/chat"
                  className={`hidden md:block p-2 rounded-lg transition-colors ${
                    isActive("/chat")
                      ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>

                <Link
                  to="/notifications"
                  className={`hidden md:block p-2 rounded-lg transition-colors relative ${
                    isActive("/notifications")
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {showMobileMenu ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>

                {/* Profile Menu */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <img
                      src={
                        user.profilePicture ||
                        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50"
                      }
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          @{user.username}
                          {user.isVerified && (
                            <span className="ml-1 text-primary-500">✓</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.balance} coins
                        </p>
                      </div>

                      <Link
                        to={`/profile/${user.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        {t("nav.profile")}
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        {t("nav.settings")}
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {t("nav.logout")}
                      </button>
                    </div>
                  )}
                </div>

                {/* Language Toggle */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                  {showLanguageMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                      <button
                        onClick={() => {
                          setLanguage("en");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          language === "en"
                            ? "text-green-600 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("fr");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          language === "fr"
                            ? "text-green-600 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Français
                      </button>
                    </div>
                  )}
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="hidden md:block p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>

                {/* Mobile Profile Avatar */}
                <div className="md:hidden">
                  <img
                    src={
                      user.profilePicture ||
                      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50"
                    }
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Theme Toggle for non-logged in users */}
                <button
                  onClick={toggleTheme}
                  className="hidden md:block p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>

                {/* Language Toggle for non-logged in users */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                  {showLanguageMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                      <button
                        onClick={() => {
                          setLanguage("en");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          language === "en"
                            ? "text-green-600 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("fr");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          language === "fr"
                            ? "text-green-600 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Français
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {t("nav.signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && user && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-2 space-y-1">
            {/* User Info */}
            <div className="flex items-center space-x-3 py-3 border-b border-gray-200 dark:border-gray-700">
              <img
                src={
                  user.profilePicture ||
                  "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50"
                }
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  @{user.username}
                  {user.isVerified && (
                    <span className="ml-1 text-primary-500">✓</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.balance} coins
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <Link
              to="/feed"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/feed")
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Home className="w-5 h-5" />
              <span>{t("nav.feed")}</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/create")
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <PenTool className="w-5 h-5" />
              <span>{t("nav.create")}</span>
            </Link>

            <Link
              to="/coins"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/coins")
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Coins className="w-5 h-5" />
              <span>{t("coins.balance")}</span>
            </Link>

            <Link
              to="/earnings"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/earnings")
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <DollarSign className="w-5 h-5" />
              <span>{t("earnings.dashboard")}</span>
            </Link>

            <Link
              to="/chat"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/chat")
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Messages</span>
            </Link>

            <Link
              to="/notifications"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors relative ${
                isActive("/notifications")
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Bell className="w-5 h-5" />
              <span>{t("nav.notifications")}</span>
              <span className="absolute left-8 top-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            <Link
              to={`/profile/${user.id}`}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(`/profile/${user.id}`)
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <User className="w-5 h-5" />
              <span>{t("nav.profile")}</span>
            </Link>

            <Link
              to="/settings"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/settings")
                  ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Settings className="w-5 h-5" />
              <span>{t("nav.settings")}</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setShowMobileMenu(false);
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>

            {/* Language Toggle */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <button
                onClick={() => {
                  setLanguage(language === "en" ? "fr" : "en");
                  setShowMobileMenu(false);
                }}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
              >
                <Globe className="w-5 h-5" />
                <span>{language === "en" ? "Français" : "English"}</span>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                handleLogout();
                setShowMobileMenu(false);
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>{t("nav.logout")}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;