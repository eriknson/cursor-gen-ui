"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary for wrapping dynamically generated components
 * Catches errors and displays user-friendly fallback UI
 */
export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('Component Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <motion.div
          className="md:max-w-[452px] max-w-full w-full pb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-800 dark:text-red-200 mb-2">
                  {this.props.componentName 
                    ? `Error rendering ${this.props.componentName}` 
                    : 'Component Error'}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Sorry, something went wrong while rendering this component.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-xs text-red-600 dark:text-red-400 mt-2">
                    <summary className="cursor-pointer font-medium mb-1">
                      Error details (development only)
                    </summary>
                    <pre className="mt-2 p-2 bg-red-100 dark:bg-red-950 rounded overflow-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo && (
                        <>
                          {'\n\n'}
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper (for functional components)
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  return function ComponentWithErrorBoundary(props: P) {
    return (
      <ComponentErrorBoundary componentName={componentName}>
        <Component {...props} />
      </ComponentErrorBoundary>
    );
  };
}

