import React, { Component, ReactNode } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface TimerErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary specifically for timer-related components
 * Provides graceful degradation when timer components crash
 */
class TimerErrorBoundary extends Component<TimerErrorBoundaryProps, TimerErrorBoundaryState> {
  constructor(props: TimerErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TimerErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('TimerErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="text-center py-6 space-y-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Timer Error</span>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-mono text-gray-700">
              <Clock className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm text-red-700">
              Timer component encountered an error. Using basic mode.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TimerErrorBoundary;