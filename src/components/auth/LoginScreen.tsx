import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Users, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        // Import authService for sign up
        const { authService } = await import('@/services/authService');
        await authService.signUp(email, password, name);
        setMessage('Account created successfully! Please check your email to confirm your account.');
        setIsSignUp(false);
      } else {
        await login({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `${isSignUp ? 'Sign up' : 'Login'} failed`);
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
            {/* Logo */}
            <div className="mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <div className="text-4xl font-bold text-white mb-2">
                  W.O.L.F
                </div>
                <div className="text-white/90 text-sm font-medium">
                  Campbell & Co. Sales Enablement
                </div>
              </div>
            </div>

            {/* Enhanced Tagline */}
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Sales Intelligence for 
              <span className="text-primary-200"> Strategic Confidence</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
              Transform cold call preparation from anxiety into competitive advantage with persona-driven intelligence and battle card generation
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Target className="w-6 h-6 text-primary-200 mb-2 mx-auto" />
                <div className="text-sm font-medium">Smart Targeting</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <TrendingUp className="w-6 h-6 text-primary-200 mb-2 mx-auto" />
                <div className="text-sm font-medium">Performance Insights</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Users className="w-6 h-6 text-primary-200 mb-2 mx-auto" />
                <div className="text-sm font-medium">Team Collaboration</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Shield className="w-6 h-6 text-primary-200 mb-2 mx-auto" />
                <div className="text-sm font-medium">Secure Platform</div>
              </div>
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
            <div className="bg-primary-600 text-white rounded-lg p-4 inline-block mb-4">
              <div className="text-2xl font-bold">W.O.L.F</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to access your sales intelligence platform</p>
          </div>

          {/* Demo Credentials - Only show for login */}
          {!isSignUp && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Demo Credentials:</h3>
              <div className="space-y-1 text-sm">
                {demoCredentials.map((cred, index) => (
                  <div key={index} className="flex justify-between text-blue-800 dark:text-blue-300">
                    <span>{cred.email}</span>
                    <span className="font-medium">{cred.role}</span>
                  </div>
                ))}
                <div className="text-blue-700 dark:text-blue-400 text-xs mt-2">
                  Password: <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">password123</span>
                </div>
              </div>
            </div>
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
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={isSignUp ? "Choose a strong password (min 6 characters)" : "Enter your password"}
                  required
                  minLength={isSignUp ? 6 : undefined}
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
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? `${isSignUp ? 'Creating Account...' : 'Signing In...'}` : `${isSignUp ? 'Create Account' : 'Sign In'}`}
            </Button>

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
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-300">
            <p>© 2025 Campbell & Co. All rights reserved.</p>
            <p className="mt-1">
              <span className="font-medium">W.O.L.F:</span> Wisdom • Opportunity • Leadership • Focus
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;