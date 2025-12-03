import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-slate-900">
          <div className="max-w-2xl w-full bg-slate-800/70 rounded-2xl p-8 border border-slate-700">
            <h1 className="text-3xl font-bold mb-4 text-rose-400">Something went wrong</h1>
            <p className="text-slate-300 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <pre className="text-xs text-slate-400 overflow-auto">
                {this.state.error?.stack}
              </pre>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

