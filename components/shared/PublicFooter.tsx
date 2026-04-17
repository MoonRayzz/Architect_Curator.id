// components\shared\PublicFooter.tsx
// Fix #7: Tambah skeleton loading saat social media links belum fetch
// Cegah layout shift (CLS) saat footer collapse → expand

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SocialMedia {
    github: string;
    linkedin: string;
    instagram: string;
    twitter: string;
    facebook: string;
}

const SOCIAL_LINKS: {
    key: keyof SocialMedia;
    label: string;
    icon: string;
}[] = [
    { key: "github", label: "GitHub", icon: "code" },
    { key: "linkedin", label: "LinkedIn", icon: "work" },
    { key: "instagram", label: "Instagram", icon: "photo_camera" },
    { key: "twitter", label: "Twitter", icon: "alternate_email" },
    { key: "facebook", label: "Facebook", icon: "public" },
];

export default function PublicFooter() {
    const [socialMedia, setSocialMedia] = useState<SocialMedia>({
        github: "",
        linkedin: "",
        instagram: "",
        twitter: "",
        facebook: "",
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const docSnap = await getDoc(doc(db, "portfolio_content", "profile"));
                if (docSnap.exists() && docSnap.data().socialMedia) {
                    setSocialMedia(prev => ({
                        ...prev,
                        ...docSnap.data().socialMedia,
                    }));
                }
            } catch (error) {
                console.error("Error fetching social media:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSocials();
    }, []);

    // Hitung berapa link yang aktif untuk skeleton placeholder
    // Kita pakai 3 skeleton pill sebagai placeholder ukuran rata-rata
    const SKELETON_COUNT = 3;

    return (
        <footer className="bg-surface-container-lowest border-t border-outline-variant/10 pt-16 pb-8 mt-auto relative z-10">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

                    {/* Brand */}
                    <div className="text-left">
                        <h2 className="font-headline font-black text-xl text-primary tracking-widest uppercase">
                            ArchitectCurator
                        </h2>
                        <p className="text-on-surface-variant text-xs mt-2 font-bold uppercase tracking-widest opacity-70">
                            Digital Precision & Engineering.
                        </p>
                    </div>

                    {/* Social Links — dengan skeleton saat loading */}
                    <div className="flex flex-wrap items-center gap-3 min-h-[40px]">
                        {isLoading ? (
                            // Skeleton: placeholder pills dengan lebar tetap
                            // agar footer tidak collapse saat data belum ada
                            <>
                                {[...Array(SKELETON_COUNT)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-10 w-28 rounded-full bg-surface-container-high animate-pulse"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    />
                                ))}
                            </>
                        ) : (
                            // Data sudah ada — render link yang terisi saja
                            SOCIAL_LINKS.map(({ key, label, icon }) =>
                                socialMedia[key] ? (
                                    <a
                                        key={key}
                                        href={socialMedia[key]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm border border-outline-variant/5"
                                    >
                                        <span className="material-symbols-outlined text-base">{icon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {label}
                                        </span>
                                    </a>
                                ) : null
                            )
                        )}
                    </div>
                </div>

                <div className="h-px w-full bg-outline-variant/10 my-8" />

                {/* Copyright & Links */}
                <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-outline uppercase tracking-[0.2em] gap-4">
                    <p>&copy; {new Date().getFullYear()} ArchitectCurator. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/services" className="hover:text-primary transition-colors">
                            Services
                        </Link>
                        <Link href="/projects" className="hover:text-primary transition-colors">
                            Projects
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}