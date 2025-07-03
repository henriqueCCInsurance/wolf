import React, { useState } from 'react';
import { FileText, BarChart3, Database, Activity, User, LogOut, Settings, Shield, Calendar, Phone, LayoutDashboard, HelpCircle, Zap, Gauge, BookOpen, Menu } from 'lucide-react';
import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import DataManager from './DataManager';
import AdvancedAnalytics from './AdvancedAnalytics';
import ThemeToggle from './ThemeToggle';
import Toggle from './Toggle';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  onNavigateToAdmin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToAdmin }) => {
  const { currentModule, setCurrentModule, advancedMode, setAdvancedMode } = useAppStore();
  const { user, logout } = useAuth();
  const [showDataManager, setShowDataManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const modules = [
    { id: 'dashboard' as const, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'call-planner' as const, name: 'Call Planner', icon: Calendar },
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
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            <div className="flex items-center space-x-3">
              {/* Professional Wolf Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15 9L22 10L17 14.5L19 22L12 18L5 22L7 14.5L2 10L9 9L12 2Z"/>
                </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">The W.O.L.F. Den</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">Elite Sales Intelligence Platform</p>
              </div>
            </div>
            {/* Professional Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-full border border-primary-200 dark:border-primary-800">
              <Shield size={14} className="text-primary-600 dark:text-primary-400" />
              <span className="text-primary-700 dark:text-primary-300 text-xs font-semibold truncate max-w-[150px]">Elite Sales Intelligence</span>
            </div>
          </div>

          {/* Module Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-2">
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
                        : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    <span className="hidden sm:inline truncate">{module.name}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Mode Selector */}
            <div className="border-l border-gray-200 dark:border-gray-700 pl-3 pr-3 flex items-center">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {advancedMode ? (
                  <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                ) : (
                  <Gauge className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
                <Toggle
                  enabled={advancedMode}
                  onChange={setAdvancedMode}
                  label={advancedMode ? "Advanced" : "Simple"}
                  size="sm"
                />
              </div>
            </div>
            
            {/* Help, Resources, Analytics, Data Management, and User Menu */}
            <div className="border-l border-gray-200 dark:border-gray-700 pl-2 flex items-center space-x-1">
              <button
                onClick={() => setCurrentModule('resources')}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Marketing Resources"
              >
                <BookOpen size={16} />
                <span className="hidden lg:inline">Resources</span>
              </button>
              
              <button
                onClick={() => setCurrentModule('help-center')}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Help Center"
              >
                <HelpCircle size={16} />
                <span className="hidden lg:inline">Help</span>
              </button>
              
              <button
                onClick={() => setShowAnalytics(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Advanced Analytics"
              >
                <Activity size={16} />
                <span className="hidden lg:inline">Analytics</span>
              </button>
              
              <button
                onClick={() => setShowDataManager(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Data Management"
              >
                <Database size={16} />
                <span className="hidden lg:inline">Data</span>
              </button>
              
              <ThemeToggle className="ml-2" />
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                      <div className="text-gray-500 dark:text-gray-300 text-xs">{user?.email}</div>
                      <div className="text-gray-500 dark:text-gray-300 text-xs capitalize">{user?.role}</div>
                    </div>
                    
                    {user?.role === 'admin' && onNavigateToAdmin && (
                      <button
                        onClick={() => {
                          onNavigateToAdmin();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Shield size={16} className="mr-2" />
                        Admin Dashboard
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setCurrentModule('profile');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings size={16} className="mr-2" />
                      Profile & Settings
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
      
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onNavigateToAdmin={onNavigateToAdmin}
      />
    </header>
  );
};

export default Header;