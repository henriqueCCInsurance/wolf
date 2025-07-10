import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Users, TrendingUp, Target, Mail, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [betaCode, setBetaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | 'apple' | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        // Import authService for sign up
        const { authService } = await import('@/services/authService');
        await authService.signUp(email, password, name, 'salesperson', betaCode);
        setMessage('Welcome to W.O.L.F. Den! Your beta account has been created successfully.');
        // Don't switch to login - keep them logged in
      } else {
        await login({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${isSignUp ? 'Sign up' : 'Login'} failed`);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github' | 'apple') => {
    setError('');
    setMessage('');
    setSocialLoading(provider);

    try {
      const { authService } = await import('@/services/authService');
      
      if (provider === 'google') {
        await authService.signInWithGoogle();
      } else if (provider === 'github') {
        await authService.signInWithGitHub();
      } else {
        await authService.signInWithApple();
      }
      
      // The user will be redirected to the OAuth provider
      const providerName = provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'Apple';
      setMessage(`Redirecting to ${providerName}...`);
    } catch (err) {
      // If we get here, it means the redirect is happening or there was an error
      if (err instanceof Error && err.message.includes('Redirecting')) {
        // This is expected - the redirect is happening
        setMessage(err.message);
      } else {
        setError(err instanceof Error ? err.message : `${provider} sign-in failed`);
      }
      setSocialLoading(null);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setForgotPasswordLoading(true);

    try {
      const { authService } = await import('@/services/authService');
      await authService.resetPassword(forgotPasswordEmail);
      setMessage('Password reset email sent! Check your inbox for instructions.');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'admin@campbellco.com', password: 'password123', role: 'Admin' },
    { email: 'john.smith@campbellco.com', password: 'password123', role: 'Salesperson' },
    { email: 'maria.garcia@campbellco.com', password: 'password123', role: 'Salesperson' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex transition-colors duration-200">
      {/* Left Panel - Abstract Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Professional Abstract Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] to-[#2c3e50]">
          {/* Decorative gradient overlays for depth */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-500/30 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-600/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-white/5 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`
          }}></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Modern Logo Section */}
            <div className="mb-16">
              <div className="text-center">
                {/* Wolf Logo */}
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
                    <img src="/wolf-logo-firefox-style.svg" alt="W.O.L.F Logo" className="w-full h-full drop-shadow-lg" />
                  </div>
                </div>
                
                {/* App Name with Text Shadow */}
                <div className="mb-4">
                  <h1 className="text-7xl font-black text-white mb-2 tracking-tight" 
                      style={{ 
                        fontVariationSettings: "'wght' 900",
                        textShadow: '2px 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)'
                      }}>
                    W.O.L.F
                  </h1>
                  <div className="text-white/90 text-lg font-semibold tracking-wider uppercase" 
                       style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.7)' }}>
                    Campbell & Co. Sales Enablement
                  </div>
                </div>
              </div>
            </div>

            {/* Impactful Tagline */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl mb-6 leading-tight font-bold text-white" 
                  style={{ 
                    fontVariationSettings: "'wght' 700",
                    textShadow: '2px 4px 8px rgba(0,0,0,0.6)'
                  }}>
                Sales Intelligence for 
                <span className="block text-primary-300 text-5xl mt-3 font-black" 
                      style={{ 
                        fontVariationSettings: "'wght' 900",
                        textShadow: '2px 4px 8px rgba(0,0,0,0.6)'
                      }}>
                  Strategic Confidence
                </span>
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium" 
                 style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.8)' }}>
                Transform cold call preparation from anxiety into competitive advantage with persona-driven intelligence and battle card generation
              </p>
            </div>

            {/* Features with Enhanced Styling */}
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
              >
                <Target className="w-8 h-8 text-primary-300 mb-3 mx-auto drop-shadow-lg" />
                <div className="text-base font-semibold text-white" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.7)' }}>Smart Targeting</div>
                <div className="text-xs text-white/70 mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>AI-powered insights</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
              >
                <TrendingUp className="w-8 h-8 text-primary-300 mb-3 mx-auto drop-shadow-lg" />
                <div className="text-base font-semibold text-white" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.7)' }}>Performance Insights</div>
                <div className="text-xs text-white/70 mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Real-time analytics</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
              >
                <Users className="w-8 h-8 text-primary-300 mb-3 mx-auto drop-shadow-lg" />
                <div className="text-base font-semibold text-white" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.7)' }}>Team Collaboration</div>
                <div className="text-xs text-white/70 mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Share & learn together</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
              >
                <Shield className="w-8 h-8 text-primary-300 mb-3 mx-auto drop-shadow-lg" />
                <div className="text-base font-semibold text-white" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.7)' }}>Secure Platform</div>
                <div className="text-xs text-white/70 mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Enterprise-grade security</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-3xl p-6 inline-block mb-4 shadow-xl">
              <img src="/wolf-logo-firefox-style.svg" alt="W.O.L.F Logo" className="w-12 h-12 mx-auto mb-2" />
              <div className="text-2xl font-bold tracking-normal" style={{ fontVariationSettings: "'wght' 700" }}>W.O.L.F</div>
            </div>
            <h1 className="text-3xl text-gray-900 dark:text-gray-100 font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-10">
            <h1 className="text-4xl text-gray-900 dark:text-gray-100 mb-3 font-bold" style={{ fontVariationSettings: "'wght' 700" }}>Welcome Back</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Sign in to access your sales intelligence platform</p>
          </div>

          {/* Welcome Message for Beta Users */}
          {isSignUp && (
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-primary-900 dark:text-primary-200 mb-2">🐺 Join the W.O.L.F. Pack!</h3>
              <p className="text-sm text-primary-800 dark:text-primary-300">
                Create your beta account to access the full W.O.L.F. Den sales enablement platform. 
                Beta users get early access to new features and can provide feedback to shape the product.
              </p>
            </div>
          )}
          
          {/* Demo Credentials - Only show for login */}
          {!isSignUp && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 mb-8 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-blue-900 dark:text-blue-200 text-lg">Demo Accounts</h3>
              </div>
              <div className="space-y-2">
                {demoCredentials.map((cred, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-sm text-blue-800 dark:text-blue-300 font-medium">{cred.email}</span>
                    <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full">{cred.role}</span>
                  </div>
                ))}
                <div className="text-blue-700 dark:text-blue-400 text-sm mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                  Password for all accounts: <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded text-blue-900 dark:text-blue-100">password123</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Login/Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="text-red-800 dark:text-red-300 text-sm">{error}</div>
              </div>
            )}

            {message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="text-green-800 dark:text-green-300 text-sm">{message}</div>
              </div>
            )}

            {isSignUp && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 text-base hover:border-gray-400 dark:hover:border-gray-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="betaCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Beta Access Code <span className="text-xs text-gray-500">(Optional for early access)</span>
                  </label>
                  <input
                    id="betaCode"
                    type="text"
                    value={betaCode}
                    onChange={(e) => setBetaCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-mono"
                    placeholder="WOLF-BETA-2025"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 text-base hover:border-gray-400 dark:hover:border-gray-500"
                  placeholder={isSignUp ? "Choose a strong password (min 8 characters)" : "Enter your password"}
                  required
                  minLength={isSignUp ? 8 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || socialLoading !== null}
              size="lg"
            >
              {isLoading ? `${isSignUp ? 'Creating Account...' : 'Signing In...'}` : `${isSignUp ? 'Create Account' : 'Sign In'}`}
            </Button>

            {/* Forgot Password Link - Only show for login */}
            {!isSignUp && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Social Auth Options - Only show for login */}
            {!isSignUp && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('google')}
                    disabled={socialLoading !== null || isLoading}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {socialLoading === 'google' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-100"></div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('github')}
                    disabled={socialLoading !== null || isLoading}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {socialLoading === 'github' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-100"></div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                        </svg>
                        GitHub
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('apple')}
                    disabled={socialLoading !== null || isLoading}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {socialLoading === 'apple' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-100"></div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        Apple
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setMessage('');
                }}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>
          </form>

          {/* Quick Login Buttons - Only show for login */}
          {!isSignUp && (
            <div className="mt-6 space-y-2">
              <div className="text-center text-sm text-gray-600 dark:text-gray-300 mb-3">Quick Login:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEmail('admin@campbellco.com');
                    setPassword('password123');
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                >
                  Admin
                </button>
                <button
                  onClick={() => {
                    setEmail('john.smith@campbellco.com');
                    setPassword('password123');
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                >
                  Salesperson
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <img src="/wolf-logo.svg" alt="W.O.L.F" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Campbell & Co. Group Benefits</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">© 2025 Campbell & Co. All rights reserved.</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-primary-600 dark:text-primary-400">W.O.L.F:</span> 
              <span className="text-gray-500 dark:text-gray-400">Wisdom • Opportunity • Leadership • Focus</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reset Password</h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail('');
                  setError('');
                  setMessage('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail('');
                    setError('');
                    setMessage('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Email'}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <p>Enter your email address and we'll send you a link to reset your password.</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;