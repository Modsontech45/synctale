import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.feed': 'Feed',
    'nav.create': 'Create',
    'nav.notifications': 'Notifications',
    'nav.profile': 'My Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.search': 'Search creators, posts...',
    'nav.messages': 'Messages',
    'nav.chat': 'Chat',
    
    // Authentication
    'auth.welcome': 'Welcome back',
    'auth.createAccount': 'Create your account',
    'auth.email': 'Email address',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.signin': 'Sign in',
    'auth.createAccountButton': 'Create Account',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.fillAllFields': 'Please fill in all fields',
    'auth.passwordsDoNotMatch': 'Passwords do not match',
    'auth.passwordTooShort': 'Password must be at least 6 characters long',
    'auth.emailVerificationSent': 'Verification email sent! Please check your inbox.',
    'auth.emailVerified': 'Email verified successfully!',
    'auth.passwordResetSent': 'Password reset instructions sent to your email.',
    'auth.passwordResetSuccess': 'Password reset successfully!',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.verifyEmail': 'Verify Email',
    'auth.resendVerification': 'Resend Verification',
    'auth.backToLogin': 'Back to Login',
    'auth.checkEmail': 'Check Your Email',
    
    // Posts
    'post.like': 'Like',
    'post.dislike': 'Dislike',
    'post.comment': 'Comment',
    'post.share': 'Share',
    'post.gift': 'Gift',
    'post.follow': 'Follow',
    'post.following': 'Following',
    'post.views': 'views',
    'post.readMore': 'Read More',
    'post.sendMessage': 'Send Message',
    'post.message': 'Message',
    'post.writeComment': 'Write a comment...',
    'post.noComments': 'No comments yet',
    'post.addComment': 'Add Comment',
    
    // Profile
    'profile.posts': 'Posts',
    'profile.followers': 'Followers',
    'profile.following': 'Following',
    'profile.coins': 'Coins',
    'profile.earnings': 'Earnings',
    'profile.editProfile': 'Edit Profile',
    'profile.noPosts': 'No posts yet',
    'profile.createFirstPost': 'Create Your First Post',
    'profile.joined': 'Joined',
    'profile.verified': 'Verified',
    
    // Coins
    'coins.balance': 'Your Balance',
    'coins.buyCoins': 'Buy Coins',
    'coins.giftCoins': 'Gift Coins',
    'coins.sendGift': 'Send Gift',
    'coins.purchaseNow': 'Purchase Now',
    'coins.selectPackage': 'Choose a Package',
    'coins.mostPopular': 'Most Popular',
    'coins.bonusCoins': 'bonus coins',
    'coins.perCoin': 'per coin',
    'coins.transactionHistory': 'Transaction History',
    'coins.noTransactions': 'No transactions yet',
    'coins.purchased': 'Purchased',
    'coins.sent': 'Sent',
    'coins.received': 'Received',
    
    // Earnings
    'earnings.dashboard': 'Earnings Dashboard',
    'earnings.totalEarned': 'Total Earned',
    'earnings.requestPayout': 'Request Payout',
    'earnings.date': 'Date',
    'earnings.coinsEarned': 'Coins Earned',
    'earnings.status': 'Status',
    'earnings.availableForPayout': 'Available for Payout',
    'earnings.minimumPayout': 'Min. $50.00',
    'earnings.payoutHistory': 'Payout History',
    'earnings.totalEarnings': 'Total Earnings',
    'earnings.paid': 'Paid',
    'earnings.pending': 'Pending',
    'earnings.cancelled': 'Cancelled',
    
    // Chat
    'chat.messages': 'Messages',
    'chat.conversations': 'Conversations',
    'chat.noConversations': 'No conversations yet',
    'chat.selectConversation': 'Select a conversation',
    'chat.chooseConversation': 'Choose a conversation from the list to start messaging',
    'chat.typeMessage': 'Type a message...',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.today': 'Today',
    'chat.yesterday': 'Yesterday',
    'chat.you': 'You',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark all read',
    'notifications.noNotifications': 'No notifications',
    'notifications.allCaughtUp': "You're all caught up! New notifications will appear here.",
    'notifications.unreadCount': 'You have {count} unread notification{plural}',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.account': 'Account',
    'settings.privacy': 'Privacy',
    'settings.notifications': 'Notifications',
    'settings.profileInformation': 'Profile Information',
    'settings.accountSettings': 'Account Settings',
    'settings.privacySettings': 'Privacy Settings',
    'settings.notificationPreferences': 'Notification Preferences',
    'settings.saveChanges': 'Save Changes',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    
    // Search
    'search.results': 'Search Results',
    'search.resultsFor': 'Results for',
    'search.noResults': 'No results found',
    'search.tryDifferent': 'Try searching with different keywords or check your spelling.',
    'search.startSearching': 'Start searching',
    'search.enterTerm': 'Enter a search term to find posts and creators.',
    'search.all': 'All',
    'search.users': 'Users',
    'search.posts': 'Posts',
    
    // General
    'general.loading': 'Loading...',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
    'general.create': 'Create',
    'general.search': 'Search',
    'general.trending': 'Trending',
    'general.recent': 'Recent',
    'general.submit': 'Submit',
    'general.close': 'Close',
    'general.confirm': 'Confirm',
    'general.back': 'Back',
    'general.next': 'Next',
    'general.previous': 'Previous',
    'general.yes': 'Yes',
    'general.no': 'No',
    'general.or': 'or',
    'general.and': 'and',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.feed': 'Fil',
    'nav.create': 'Créer',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Mon Profil',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    'nav.signup': "S'inscrire",
    'nav.search': 'Rechercher créateurs, posts...',
    'nav.messages': 'Messages',
    'nav.chat': 'Chat',
    
    // Authentication
    'auth.welcome': 'Bon retour',
    'auth.createAccount': 'Créez votre compte',
    'auth.email': 'Adresse e-mail',
    'auth.username': "Nom d'utilisateur",
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.signin': 'Se connecter',
    'auth.createAccountButton': 'Créer un compte',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte?',
    'auth.dontHaveAccount': "Vous n'avez pas de compte?",
    'auth.invalidCredentials': 'Email ou mot de passe invalide',
    'auth.fillAllFields': 'Veuillez remplir tous les champs',
    'auth.passwordsDoNotMatch': 'Les mots de passe ne correspondent pas',
    'auth.passwordTooShort': 'Le mot de passe doit contenir au moins 6 caractères',
    'auth.emailVerificationSent': 'Email de vérification envoyé ! Vérifiez votre boîte de réception.',
    'auth.emailVerified': 'Email vérifié avec succès !',
    'auth.passwordResetSent': 'Instructions de réinitialisation envoyées à votre email.',
    'auth.passwordResetSuccess': 'Mot de passe réinitialisé avec succès !',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.resetPassword': 'Réinitialiser le mot de passe',
    'auth.verifyEmail': 'Vérifier l\'email',
    'auth.resendVerification': 'Renvoyer la vérification',
    'auth.backToLogin': 'Retour à la connexion',
    'auth.checkEmail': 'Vérifiez votre email',
    
    // Posts
    'post.like': 'Aimer',
    'post.dislike': 'Ne pas aimer',
    'post.comment': 'Commenter',
    'post.share': 'Partager',
    'post.gift': 'Cadeau',
    'post.follow': 'Suivre',
    'post.following': 'Suivi',
    'post.views': 'vues',
    'post.readMore': 'Lire la suite',
    'post.sendMessage': 'Envoyer un message',
    'post.message': 'Message',
    'post.writeComment': 'Écrire un commentaire...',
    'post.noComments': 'Aucun commentaire pour le moment',
    'post.addComment': 'Ajouter un commentaire',
    
    // Profile
    'profile.posts': 'Posts',
    'profile.followers': 'Abonnés',
    'profile.following': 'Abonnements',
    'profile.coins': 'Pièces',
    'profile.earnings': 'Gains',
    'profile.editProfile': 'Modifier le profil',
    'profile.noPosts': 'Aucun post pour le moment',
    'profile.createFirstPost': 'Créer votre premier post',
    'profile.joined': 'Rejoint',
    'profile.verified': 'Vérifié',
    
    // Coins
    'coins.balance': 'Votre solde',
    'coins.buyCoins': 'Acheter des pièces',
    'coins.giftCoins': 'Offrir des pièces',
    'coins.sendGift': 'Envoyer un cadeau',
    'coins.purchaseNow': 'Acheter maintenant',
    'coins.selectPackage': 'Choisir un forfait',
    'coins.mostPopular': 'Le plus populaire',
    'coins.bonusCoins': 'pièces bonus',
    'coins.perCoin': 'par pièce',
    'coins.transactionHistory': 'Historique des transactions',
    'coins.noTransactions': 'Aucune transaction pour le moment',
    'coins.purchased': 'Acheté',
    'coins.sent': 'Envoyé',
    'coins.received': 'Reçu',
    
    // Earnings
    'earnings.dashboard': 'Tableau de bord des gains',
    'earnings.totalEarned': 'Total gagné',
    'earnings.requestPayout': 'Demander un paiement',
    'earnings.date': 'Date',
    'earnings.coinsEarned': 'Pièces gagnées',
    'earnings.status': 'Statut',
    'earnings.availableForPayout': 'Disponible pour le paiement',
    'earnings.minimumPayout': 'Min. 50,00 $',
    'earnings.payoutHistory': 'Historique des paiements',
    'earnings.totalEarnings': 'Gains totaux',
    'earnings.paid': 'Payé',
    'earnings.pending': 'En attente',
    'earnings.cancelled': 'Annulé',
    
    // Chat
    'chat.messages': 'Messages',
    'chat.conversations': 'Conversations',
    'chat.noConversations': 'Aucune conversation pour le moment',
    'chat.selectConversation': 'Sélectionner une conversation',
    'chat.chooseConversation': 'Choisissez une conversation dans la liste pour commencer à envoyer des messages',
    'chat.typeMessage': 'Tapez un message...',
    'chat.online': 'En ligne',
    'chat.offline': 'Hors ligne',
    'chat.today': "Aujourd'hui",
    'chat.yesterday': 'Hier',
    'chat.you': 'Vous',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Tout marquer comme lu',
    'notifications.noNotifications': 'Aucune notification',
    'notifications.allCaughtUp': 'Vous êtes à jour ! Les nouvelles notifications apparaîtront ici.',
    'notifications.unreadCount': 'Vous avez {count} notification{plural} non lue{plural}',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.profile': 'Profil',
    'settings.account': 'Compte',
    'settings.privacy': 'Confidentialité',
    'settings.notifications': 'Notifications',
    'settings.profileInformation': 'Informations du profil',
    'settings.accountSettings': 'Paramètres du compte',
    'settings.privacySettings': 'Paramètres de confidentialité',
    'settings.notificationPreferences': 'Préférences de notification',
    'settings.saveChanges': 'Sauvegarder les modifications',
    'settings.darkMode': 'Mode sombre',
    'settings.lightMode': 'Mode clair',
    
    // Search
    'search.results': 'Résultats de recherche',
    'search.resultsFor': 'Résultats pour',
    'search.noResults': 'Aucun résultat trouvé',
    'search.tryDifferent': 'Essayez de rechercher avec des mots-clés différents ou vérifiez votre orthographe.',
    'search.startSearching': 'Commencer la recherche',
    'search.enterTerm': 'Entrez un terme de recherche pour trouver des posts et des créateurs.',
    'search.all': 'Tout',
    'search.users': 'Utilisateurs',
    'search.posts': 'Posts',
    
    // General
    'general.loading': 'Chargement...',
    'general.save': 'Sauvegarder',
    'general.cancel': 'Annuler',
    'general.delete': 'Supprimer',
    'general.edit': 'Modifier',
    'general.create': 'Créer',
    'general.search': 'Rechercher',
    'general.trending': 'Tendance',
    'general.recent': 'Récent',
    'general.submit': 'Soumettre',
    'general.close': 'Fermer',
    'general.confirm': 'Confirmer',
    'general.back': 'Retour',
    'general.next': 'Suivant',
    'general.previous': 'Précédent',
    'general.yes': 'Oui',
    'general.no': 'Non',
    'general.or': 'ou',
    'general.and': 'et',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key as keyof typeof translations[typeof language]];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};