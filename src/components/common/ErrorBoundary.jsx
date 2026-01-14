import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Critical Runtime Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Something went wrong</h1>
                        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                            The Averqon OS encountered an unexpected error. Don't worry, your data is safe.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                            >
                                <RefreshCcw size={18} /> Reload OS
                            </button>
                            <a
                                href="/"
                                className="w-full py-4 bg-slate-50 text-slate-500 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                            >
                                <Home size={18} /> Return Home
                            </a>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-slate-50 rounded-2xl text-left overflow-auto max-h-40 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Debug Info</p>
                                <code className="text-[10px] text-red-400 font-mono leading-tight">{this.state.error?.toString()}</code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
