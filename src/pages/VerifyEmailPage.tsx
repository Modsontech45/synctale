import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  const email = location.state?.email || '';
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('loading');
      setMessage('Please check your email for the verification link.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      await authApi.verifyEmail(verificationToken);
      setStatus('success');
      setMessage('Your email has been verified successfully! You can now log in.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Email verification failed:', error);
      if (error.status === 400) {
        setStatus('expired');
        setMessage('This verification link has expired or is invalid.');
      } else {
        setStatus('error');
        setMessage('Failed to verify email. Please try again.');
      }
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setMessage('Email address not found. Please sign up again.');
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerificationEmail(email);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Failed to resend verification:', error);
      setMessage('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      default:
        return <Mail className="w-16 h-16 text-primary-500 mx-auto mb-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
      case 'expired':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-primary-600 dark:text-primary-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {getStatusIcon()}
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {status === 'success' ? 'Email Verified!' : 'Verify Your Email'}
          </h2>
          
          <div className="mt-4">
            <p className={`text-sm ${getStatusColor()}`}>
              {message}
            </p>
            
            {email && status !== 'success' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Sent to: {email}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            {status === 'success' && (
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Continue to Login
              </Link>
            )}

            {(status === 'expired' || status === 'error') && email && (
              <button
                onClick={resendVerification}
                disabled={isResending}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>Resend Verification Email</span>
              </button>
            )}

            <Link
              to="/signup"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Back to Sign Up
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or{' '}
              <Link to="/contact" className="text-primary-600 dark:text-primary-400 hover:text-primary-500">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;