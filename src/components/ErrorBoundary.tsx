import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * React Error Boundary. Catches render errors in the tree and shows a fallback
 * with a "Try again" action. Use at app root to prevent full-app crashes.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            fontFamily: 'var(--ds-font-family), sans-serif',
            backgroundColor: 'var(--ds-background, #fff)',
            color: 'var(--ds-text-primary, #222)',
            textAlign: 'center',
          }}
          role="alert"
        >
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--ds-text-secondary, #717171)', marginBottom: 24 }}>
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            style={{
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 400,
              fontFamily: 'inherit',
              color: '#fff',
              backgroundColor: 'var(--ds-accent, #FF0257)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
