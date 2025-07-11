import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useAppStore } from '@/store';

interface ModuleErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ModuleErrorBoundaryProps {
  children: React.ReactNode;
  moduleName: string;
  fallbackModule?: 'dashboard' | 'call-planner' | 'battle-card' | 'live-call' | 'post-game' | 'help-center' | 'profile' | 'resources';
}

class ModuleErrorBoundary extends React.Component<ModuleErrorBoundaryProps, ModuleErrorBoundaryState> {
  constructor(props: ModuleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ModuleErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.moduleName} module:`, error, errorInfo);
    this.setState({ errorInfo });
    
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Send to Sentry or similar service
      console.error('Production error:', {
        module: this.props.moduleName,
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleNavigateHome = () => {
    const { setCurrentModule } = useAppStore.getState();
    setCurrentModule(this.props.fallbackModule || 'dashboard');
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {this.props.moduleName} Module Error
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The {this.props.moduleName} module encountered an error. You can try again or return to the dashboard.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleNavigateHome}
                className="w-full flex items-center justify-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Dashboard
              </button>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <div className="mt-2 space-y-2">
                  <pre className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded overflow-auto max-h-40">
                    {this.state.error.message}
                  </pre>
                  {this.state.error.stack && (
                    <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/10 p-2 rounded overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ModuleErrorBoundary;