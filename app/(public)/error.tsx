// ============================================================
// FILE 2: app\(public)\error.tsx
// Next.js built-in error boundary untuk public routes
// Otomatis menangkap error dari semua halaman di (public)
// ============================================================

"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function PublicError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error — di production ganti dengan Sentry.captureException(error)
        console.error("Public route error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-error text-4xl">
                        cloud_off
                    </span>
                </div>
                <h2 className="text-3xl font-extrabold text-primary font-headline mb-3 tracking-tight">
                    Koneksi Bermasalah
                </h2>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-2">
                    Gagal memuat konten. Kemungkinan koneksi internet terputus atau
                    server sedang tidak tersedia.
                </p>
                {/* Tampilkan digest untuk debugging — hanya di development */}
                {error.digest && (
                    <p className="text-[10px] font-mono text-outline mb-6">
                        Error ID: {error.digest}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
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


// ============================================================
// FILE 3: app\admin\error.tsx
// Error boundary khusus admin — pesan lebih teknikal
// ============================================================

// Buat file baru: app/admin/error.tsx dengan isi berikut:
//
// "use client";
//
// import { useEffect } from "react";
// import Link from "next/link";
//
// interface ErrorProps {
//     error: Error & { digest?: string };
//     reset: () => void;
// }
//
// export default function AdminError({ error, reset }: ErrorProps) {
//     useEffect(() => {
//         console.error("Admin route error:", error);
//     }, [error]);
//
//     return (
//         <div className="min-h-[60vh] flex items-center justify-center px-6">
//             <div className="text-center max-w-md mx-auto">
//                 <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
//                     <span className="material-symbols-outlined text-error text-4xl">
//                         bug_report
//                     </span>
//                 </div>
//                 <h2 className="text-2xl font-extrabold text-primary font-headline mb-3">
//                     Admin Error
//                 </h2>
//                 <p className="text-on-surface-variant text-sm leading-relaxed mb-2">
//                     {error.message || "Terjadi kesalahan pada panel admin."}
//                 </p>
//                 {error.digest && (
//                     <p className="text-[10px] font-mono text-outline mb-6">
//                         Digest: {error.digest}
//                     </p>
//                 )}
//                 <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
//                     <button
//                         onClick={reset}
//                         className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:scale-95 transition-transform flex items-center justify-center gap-2"
//                     >
//                         <span className="material-symbols-outlined text-sm">refresh</span>
//                         Coba Lagi
//                     </button>
//                     <Link href="/admin">
//                         <button className="px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
//                             <span className="material-symbols-outlined text-sm">dashboard</span>
//                             Ke Dashboard
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }


// ============================================================
// FIX #9 — TURBOPACK PANIC
// Di package.json, ubah script "dev":
//
// SEBELUM:
// "dev": "next dev --turbopack"
//
// SESUDAH:
// "dev": "next dev"
//
// Turbopack masih experimental di Next.js 16 dan sering panic crash
// seperti yang terlihat di log. Webpack (default) jauh lebih stabil
// untuk development. Performa build production tidak terpengaruh.
//
// Jika ingin coba Turbopack lagi nanti setelah update Next.js:
// "dev": "next dev --turbopack"
// ============================================================