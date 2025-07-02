import React, { useState } from 'react';
import { Target, FileText, BarChart3, Database, Activity, User, LogOut, Settings, Shield, Calendar, Phone } from 'lucide-react';
import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import DataManager from './DataManager';
import AdvancedAnalytics from './AdvancedAnalytics';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onNavigateToAdmin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToAdmin }) => {
  const { currentModule, setCurrentModule } = useAppStore();
  const { user, logout } = useAuth();
  const [showDataManager, setShowDataManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const modules = [
    { id: 'hunt-planner' as const, name: 'Hunt Planner', icon: Target },
    { id: 'call-sequence' as const, name: 'Call Sequence', icon: Calendar },
    { id: 'battle-card' as const, name: 'Call Guide', icon: FileText },
    { id: 'live-call' as const, name: 'Live Call', icon: Phone },
    { id: 'post-game' as const, name: 'Call Results', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Professional Wolf Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-white font-bold text-lg transform -rotate-12">🐺</div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🎯</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">The W.O.L.F. Den</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Campbell & Co. Elite Sales Command</p>
              </div>
            </div>
            {/* Professional Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-primary-50 to-primary-100 rounded-full border border-primary-200">
              <span className="text-primary-700 text-xs font-semibold">✨ Elite Sales Intelligence</span>
            </div>
          </div>

          {/* Module Navigation */}
          <div className="flex items-center space-x-2">
            <nav className="flex space-x-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = currentModule === module.id;
                
                return (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModule(module.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-300 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{module.name}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Analytics, Data Management, and User Menu */}
            <div className="border-l border-gray-200 dark:border-gray-700 pl-2 flex items-center space-x-1">
              <button
                onClick={() => setShowAnalytics(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Advanced Analytics"
              >
                <Activity size={16} />
                <span className="hidden lg:inline">Analytics</span>
              </button>
              
              <button
                onClick={() => setShowDataManager(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Data Management"
              >
                <Database size={16} />
                <span className="hidden lg:inline">Data</span>
              </button>
              
              <ThemeToggle className="ml-2" />
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="hidden lg:inline">{user?.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">{user?.email}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs capitalize">{user?.role}</div>
                    </div>
                    
                    {user?.role === 'admin' && onNavigateToAdmin && (
                      <button
                        onClick={() => {
                          onNavigateToAdmin();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Shield size={16} className="mr-2" />
                        Admin Dashboard
                      </button>
                    )}
                    
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
    </header>
  );
};

export default Header;