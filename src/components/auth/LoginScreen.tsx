import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Users, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const demoCredentials = [
    { email: 'admin@campbellco.com', password: 'password123', role: 'Admin' },
    { email: 'john.smith@campbellco.com', password: 'password123', role: 'Salesperson' },
    { email: 'maria.garcia@campbellco.com', password: 'password123', role: 'Salesperson' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex transition-colors duration-200">
      {/* Left Panel - Hero Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Hero Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        
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
                  W.O.L.F. DEN
                </div>
                <div className="text-white/90 text-sm font-medium">
                  Campbell & Co. Sales Enablement
                </div>
              </div>
            </div>

            {/* Enhanced Tagline */}
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Elite Sales Intelligence for 
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
              <div className="text-2xl font-bold">W.O.L.F. DEN</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to access your elite sales intelligence platform</p>
          </div>

          {/* Demo Credentials */}
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="text-red-800 dark:text-red-300 text-sm">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick Login Buttons */}
          <div className="mt-6 space-y-2">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Login:</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEmail('admin@campbellco.com');
                  setPassword('password123');
                }}
                className="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => {
                  setEmail('john.smith@campbellco.com');
                  setPassword('password123');
                }}
                className="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Salesperson
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2024 Campbell & Co. All rights reserved.</p>
            <p className="mt-1">
              <span className="font-medium">W.O.L.F. Den:</span> Wisdom • Opportunity • Leadership • Focus
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;