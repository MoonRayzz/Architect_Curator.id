// ============================================================
// FILE 3: app\admin\error.tsx
// Error boundary khusus admin — pesan lebih teknikal
// ============================================================

"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("Admin route error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-error text-4xl">
                        bug_report
                    </span>
                </div>
                <h2 className="text-2xl font-extrabold text-primary font-headline mb-3">
                    Admin Error
                </h2>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-2">
                    {error.message || "Terjadi kesalahan pada panel admin."}
                </p>
                {error.digest && (
                    <p className="text-[10px] font-mono text-outline mb-6">
                        Digest: {error.digest}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Coba Lagi
                    </button>
                    <Link href="/admin">
                        <button className="px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">dashboard</span>
                            Ke Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

