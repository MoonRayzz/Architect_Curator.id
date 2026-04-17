// app\not-found.tsx
// Halaman ini otomatis ditampilkan Next.js untuk semua route yang tidak ada

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="text-center max-w-lg mx-auto">

                {/* Error Code */}
                <div className="relative mb-8 select-none">
                    <p className="text-[10rem] md:text-[14rem] font-black font-headline text-surface-container-highest leading-none tracking-tighter">
                        404
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-primary opacity-80">
                            search_off
                        </span>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-primary font-headline mb-4">
                    Halaman Tidak Ditemukan
                </h1>
                <p className="text-on-surface-variant leading-relaxed mb-10 text-lg">
                    Sepertinya halaman yang kamu cari tidak ada atau sudah dipindahkan.
                    Cek kembali URL-nya atau kembali ke beranda.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-sm tracking-tight hover:scale-95 transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">home</span>
                            Kembali ke Beranda
                        </button>
                    </Link>
                    <Link href="/projects">
                        <button className="w-full sm:w-auto px-8 py-4 bg-surface-container-highest text-on-surface rounded-xl font-bold text-sm tracking-tight hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">folder_special</span>
                            Lihat Projects
                        </button>
                    </Link>
                </div>

                {/* Subtle branding */}
                <p className="mt-16 text-[10px] font-black uppercase tracking-[0.3em] text-outline">
                    ArchitectCurator
                </p>
            </div>
        </div>
    );
}