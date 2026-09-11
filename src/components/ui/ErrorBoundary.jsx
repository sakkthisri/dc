import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Visualizer Error Boundary caught an exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-950/30 border border-red-800/80 rounded-xl p-6 flex flex-col items-center text-center space-y-4 my-6">
          <div className="p-3 bg-red-900/40 rounded-full text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-200">Visualizer Render Failure</h3>
            <p className="text-xs text-red-300/80 mt-1 max-w-md">
              An unhandled exception occurred inside this visualizer component. The platform remains stable.
            </p>
            {this.state.error && (
              <pre className="mt-3 p-2 bg-black/50 border border-red-900/50 rounded text-[11px] font-mono text-red-400 text-left overflow-x-auto max-w-lg">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Visualizer Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
