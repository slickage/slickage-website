'use client';

import React, { Component, type ReactNode } from 'react';
import { logger } from '@/lib/utils/logger';
import posthog from 'posthog-js';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);

    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture('error_boundary_triggered', {
        error_type: 'component_error',
        error_message: error.message,
        error_stack: error.stack?.slice(0, 500),
        component_stack: errorInfo.componentStack?.slice(0, 500),
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong.</h2>
            <p className="mb-4 text-gray-400">An unexpected error occurred. Please try again.</p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Try Again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
