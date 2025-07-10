import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Users } from 'lucide-react';
import Button from './Button';

interface ContactLockingErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
  onReset?: () => void;
}

interface ContactLockingErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error boundary specifically for contact locking operations
 * Provides graceful recovery when contact batch operations fail
 */
class ContactLockingErrorBoundary extends Component<ContactLockingErrorBoundaryProps, ContactLockingErrorBoundaryState> {
  constructor(props: ContactLockingErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ContactLockingErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ContactLockingErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Report to monitoring service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Contact locking error: ${error.message}`,
        fatal: false
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unknown error occurred';
      const isTimeoutError = errorMessage.includes('timeout');
      const isNetworkError = errorMessage.includes('network') || errorMessage.includes('fetch');
      const isBatchSizeError = errorMessage.includes('Too many contacts');

      return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Contact Locking Failed
              </h3>
              <p className="text-sm text-red-700">
                {isTimeoutError && "The operation timed out. This usually happens with large contact lists."}
                {isNetworkError && "Network connection issue. Please check your internet connection."}
                {isBatchSizeError && "Too many contacts selected. Please try with fewer contacts."}
                {!isTimeoutError && !isNetworkError && !isBatchSizeError && "An unexpected error occurred while processing your contacts."}
              </p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-red-100 rounded border border-red-200">
            <p className="text-sm text-red-800 font-mono">
              {errorMessage}
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-red-700">
              <p className="font-medium mb-2">Suggested solutions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Try selecting fewer contacts (maximum 50 at a time)</li>
                <li>Check your internet connection</li>
                <li>Reload the page and try again</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>

            <div className="flex space-x-3 pt-3">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              {this.props.onReset && (
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Reset Selection
                </Button>
              )}
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 p-3 bg-gray-100 rounded border">
              <summary className="text-sm font-medium cursor-pointer">Debug Info (Development)</summary>
              <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
                {this.state.error?.stack}
                {'\n\nComponent Stack:'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ContactLockingErrorBoundary;