import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Calendar, FileText, Phone, BarChart3, HelpCircle, Settings, LogOut, Shield, BookOpen, Activity, Database, Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import DataManager from './DataManager';
import AdvancedAnalytics from './AdvancedAnalytics';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigateToAdmin }) => {
  const { currentModule, setCurrentModule } = useAppStore();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDataManager, setShowDataManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const modules = [
    { id: 'dashboard' as const, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'call-planner' as const, name: 'Planner', icon: Calendar },
    { id: 'battle-card' as const, name: 'Guide', icon: FileText },
    { id: 'live-call' as const, name: 'Call', icon: Phone },
    { id: 'post-game' as const, name: 'Results', icon: BarChart3 }
  ];

  const handleModuleClick = (moduleId: typeof currentModule) => {
    setCurrentModule(moduleId);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15 9L22 10L17 14.5L19 22L12 18L5 22L7 14.5L2 10L9 9L12 2Z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-gray-100">W.O.L.F</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sales Intelligence</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
            
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = currentModule === module.id;
                
                return (
                  <button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{module.name}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Tools & Support */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                Tools & Support
              </div>
              
              <button
                onClick={() => {
                  setCurrentModule('resources');
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BookOpen size={20} />
                <span className="font-medium">Resources</span>
              </button>
              
              <button
                onClick={() => {
                  setCurrentModule('help-center');
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HelpCircle size={20} />
                <span className="font-medium">Help Center</span>
              </button>
              
              <button
                onClick={() => {
                  setShowAnalytics(true);
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Activity size={20} />
                <span className="font-medium">Analytics</span>
              </button>
              
              <button
                onClick={() => {
                  setShowDataManager(true);
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Database size={20} />
                <span className="font-medium">Data Management</span>
              </button>
              
              <button
                onClick={() => {
                  toggleTheme();
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
                <span className="font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>
            
            {/* Account & Settings */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                Account & Settings
              </div>
              
              <button
                onClick={() => {
                  setCurrentModule('profile');
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings size={20} />
                <span className="font-medium">Profile & Settings</span>
              </button>
              
              {user?.role === 'admin' && onNavigateToAdmin && (
                <button
                  onClick={() => {
                    onNavigateToAdmin();
                    onClose();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Shield size={20} />
                  <span className="font-medium">Admin Dashboard</span>
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
      
      {/* Analytics Modal */}
      <AdvancedAnalytics 
        isOpen={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
      />
      
      {/* Data Manager Modal */}
      <DataManager 
        isOpen={showDataManager} 
        onClose={() => setShowDataManager(false)} 
      />
    </AnimatePresence>
  );
};

export default MobileMenu;