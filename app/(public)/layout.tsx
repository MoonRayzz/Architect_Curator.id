import React from "react";
import TopNavBar from "@/components/shared/TopNavBar"; // <-- 1. Import Navbar
import PublicFooter from "@/components/shared/PublicFooter"; // <-- 2. Import Footer

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">

            {/* 3. Render Navbar (Akan selalu menempel di atas karena fixed) */}
            <TopNavBar />

            {/* 4. Konten Halaman Utama */}
            {/* Kita tambahkan pt-24 (padding-top) agar konten tidak tertutup oleh Navbar yang fixed */}
            <div className="flex-1 pt-24">
                {children}
            </div>

            {/* 5. Render Footer Dinamis di paling bawah */}
            <PublicFooter />

        </div>
    );
}