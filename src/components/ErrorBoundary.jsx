import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-card text-center">
            <FiAlertCircle className="text-5xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We encountered an error. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-secondary transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

