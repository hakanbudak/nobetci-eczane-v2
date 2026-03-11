"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[ErrorBoundary] Client-side exception caught:", error);
        console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-dark-900 text-dark-200 p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-dark-100 mb-2">Bir hata oluştu</h2>
                    <p className="text-sm text-dark-400 mb-6 max-w-md">
                        Sayfa yüklenirken beklenmeyen bir sorun meydana geldi. Lütfen sayfayı yenileyin.
                    </p>
                    <p className="text-xs text-dark-600 mb-4 font-mono max-w-md break-all">
                        {this.state.error?.message}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
                    >
                        Sayfayı Yenile
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
