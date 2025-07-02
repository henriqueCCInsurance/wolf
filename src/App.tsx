import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import LoginScreen from '@/components/auth/LoginScreen';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ShortcutsHelp from '@/components/common/ShortcutsHelp';
import ThemeProvider from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';

// Lazy load modules for code splitting
const HuntPlanner = lazy(() => import('@/components/modules/HuntPlanner'));
const CallSequencePlanner = lazy(() => import('@/components/planning/CallSequencePlanner'));
const CallGuide = lazy(() => import('@/components/modules/BattleCard'));
const LiveCallAssistance = lazy(() => import('@/components/callflow/LiveCallAssistance'));
const EnhancedPostGame = lazy(() => import('@/components/analytics/EnhancedPostGame'));
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      </div>
    );

    return (
      <Suspense fallback={ModuleLoader}>
        {(() => {
          switch (currentModule) {
            case 'hunt-planner':
              return <HuntPlanner />;
            case 'call-sequence':
              return <CallSequencePlanner />;
            case 'battle-card':
              return <CallGuide />;
            case 'live-call':
              return <LiveCallAssistance />;
            case 'post-game':
              return <EnhancedPostGame />;
            default:
              return <HuntPlanner />;
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
                      <h1 className="text-lg font-bold text-gray-900">W.O.L.F. Den Admin</h1>
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
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
                </div>
              </div>
            }>
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