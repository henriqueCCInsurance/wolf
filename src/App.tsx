import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import LoginScreen from '@/components/auth/LoginScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ShortcutsHelp from '@/components/common/ShortcutsHelp';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThemeProvider from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';

// Lazy load modules for code splitting
const Dashboard = lazy(() => import('@/components/modules/Dashboard'));
const IntegratedCallPlanner = lazy(() => import('@/components/planning/IntegratedCallPlanner'));
const CallGuide = lazy(() => import('@/components/modules/BattleCard'));
const LiveCallAssistance = lazy(() => import('@/components/callflow/LiveCallAssistance'));
const EnhancedPostGame = lazy(() => import('@/components/analytics/EnhancedPostGame'));
const HelpCenter = lazy(() => import('@/components/modules/HelpCenter'));
const Profile = lazy(() => import('@/components/modules/Profile'));
const Resources = lazy(() => import('@/components/modules/Resources'));
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));

type AppView = 'main' | 'admin';

function AppContent() {
  const { currentModule } = useAppStore();
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('main');
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderCurrentModule = () => {
    const ModuleLoader = (
      <div className="animate-fadeIn">
        <SkeletonLoader variant="card" />
        <div className="mt-6">
          <SkeletonLoader variant="list" lines={3} />
        </div>
      </div>
    );

    return (
      <Suspense fallback={ModuleLoader}>
        {(() => {
          switch (currentModule) {
            case 'dashboard':
              return <Dashboard />;
            case 'call-planner':
              return <IntegratedCallPlanner />;
            case 'battle-card':
              return <CallGuide />;
            case 'live-call':
              return <LiveCallAssistance />;
            case 'post-game':
              return <EnhancedPostGame />;
            case 'help-center':
              return <HelpCenter />;
            case 'profile':
              return <Profile />;
            case 'resources':
              return <Resources />;
            default:
              return <Dashboard />;
          }
        })()}
      </Suspense>
    );
  };

  const handleNavigateToAdmin = () => {
    setCurrentView('admin');
  };

  const handleNavigateToMain = () => {
    setCurrentView('main');
  };

  // Admin Dashboard View
  if (currentView === 'admin') {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50">
          {/* Admin Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                        <div className="text-white font-bold text-sm">🐺</div>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-gray-900">W.O.L.F Admin</h1>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleNavigateToMain}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Back to Sales Tools
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Admin Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<LoadingSpinner size="lg" message="Loading admin dashboard..." />}>
              <AdminDashboard />
            </Suspense>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  // Main Sales Tools View
  return (
    <Layout onNavigateToAdmin={user?.role === 'admin' ? handleNavigateToAdmin : undefined}>
      {renderCurrentModule()}
      <ShortcutsHelp />
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;