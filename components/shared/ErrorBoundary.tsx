// ============================================================
// FILE 1: components\shared\ErrorBoundary.tsx
// Reusable class component — wraps children, tangkap error runtime
// ============================================================

"use client";

import React from "react";
import Link from "next/link";

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: "" };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            errorMessage: error.message || "Terjadi kesalahan yang tidak diketahui.",
        };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Di production, kirim ke logging service (Sentry, dll)
        console.error("ErrorBoundary caught:", error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, errorMessage: "" });
    };

    render() {
        if (this.state.hasError) {
            // Jika ada custom fallback, tampilkan itu
            if (this.props.fallback) {
                return <>{this.props.fallback}</>;
            }

            // Default fallback UI
            return (
                <div className="min-h-[60vh] flex items-center justify-center px-6">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-error text-4xl">
                                error_outline
                            </span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-primary font-headline mb-3">
                            Terjadi Kesalahan
                        </h2>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                            Komponen ini mengalami error. Ini bukan salah kamu — coba refresh
                            halaman atau kembali ke beranda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Coba Lagi
                            </button>
                            <Link href="/">
                                <button className="px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">home</span>
                                    Ke Beranda
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}