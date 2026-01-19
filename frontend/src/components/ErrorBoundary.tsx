'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to monitoring service (can be extended to send to Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // In production, you could send this to an error tracking service
      // Example: Sentry.captureException(error, { extra: { errorInfo } });
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle
            className="w-12 h-12 text-orange-500 dark:text-orange-400 mb-4"
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
            Algo salió mal
          </h2>
          <p className="text-sm text-[var(--fg-muted)] text-center mb-4 max-w-md">
            Ha ocurrido un error inesperado. Por favor, intenta recargar la página o contacta soporte si el problema persiste.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            aria-label="Intentar de nuevo"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Intentar de nuevo
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 w-full max-w-lg">
              <summary className="cursor-pointer text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)]">
                Detalles del error (solo desarrollo)
              </summary>
              <pre className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-800 dark:text-red-300 overflow-auto">
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
