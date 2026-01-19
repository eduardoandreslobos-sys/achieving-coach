/**
 * Centralized logging utility for the application.
 * In development, logs to console.
 * In production, can be extended to send to external services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === 'development';

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (isDev) {
      console.debug(formatMessage('debug', message, context));
    }
  },

  info(message: string, context?: LogContext): void {
    if (isDev) {
      console.info(formatMessage('info', message, context));
    }
    // In production, you could send to analytics or monitoring service
  },

  warn(message: string, context?: LogContext): void {
    console.warn(formatMessage('warn', message, context));
    // In production, you could send to monitoring service
  },

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    };

    console.error(formatMessage('error', message, errorContext));

    // In production, send to error tracking service
    if (!isDev && typeof window !== 'undefined') {
      // Example: Sentry.captureException(error, { extra: context });
      // Example: LogRocket.captureException(error);

      // For now, we could store errors in sessionStorage for debugging
      try {
        const errors = JSON.parse(sessionStorage.getItem('app_errors') || '[]');
        errors.push({
          timestamp: new Date().toISOString(),
          message,
          error: errorContext.errorMessage,
          context,
        });
        // Keep only last 10 errors
        if (errors.length > 10) errors.shift();
        sessionStorage.setItem('app_errors', JSON.stringify(errors));
      } catch {
        // Ignore storage errors
      }
    }
  },

  // Specific error loggers for common scenarios
  apiError(endpoint: string, error: Error | unknown, context?: LogContext): void {
    this.error(`API Error: ${endpoint}`, error, { ...context, endpoint });
  },

  authError(action: string, error: Error | unknown, context?: LogContext): void {
    this.error(`Auth Error: ${action}`, error, { ...context, action });
  },

  firebaseError(operation: string, error: Error | unknown, context?: LogContext): void {
    this.error(`Firebase Error: ${operation}`, error, { ...context, operation });
  },
};

export default logger;
