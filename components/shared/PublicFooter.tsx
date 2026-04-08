"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PublicFooter() {
    const [socialMedia, setSocialMedia] = useState({
        github: "",
        linkedin: "",
        instagram: "",
        twitter: "",
        facebook: "" // Tambahan Facebook
    });

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                // Mengambil data profile dari Firestore
                const docSnap = await getDoc(doc(db, "portfolio_content", "profile"));
                if (docSnap.exists() && docSnap.data().socialMedia) {
                    setSocialMedia(docSnap.data().socialMedia);
                }
            } catch (error) {
                console.error("Error fetching social media:", error);
            }
        };
        fetchSocials();
    }, []);

    return (
        <footer className="bg-surface-container-lowest border-t border-outline-variant/10 pt-16 pb-8 mt-auto relative z-10">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

                    {/* Brand / Logo Area */}
                    <div className="text-left">
                        <h2 className="font-headline font-black text-xl text-primary tracking-widest uppercase">ArchitectCurator</h2>
                        <p className="text-on-surface-variant text-xs mt-2 font-bold uppercase tracking-widest opacity-70">
                            Digital Precision & Engineering.
                        </p>
                    </div>

                    {/* DYNAMIC SOCIAL MEDIA LINKS (BENTUK KAPSUL DENGAN TEKS) */}
                    <div className="flex flex-wrap items-center gap-3">

                        {/* GitHub */}
                        {socialMedia.github && (
                            <a href={socialMedia.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm border border-outline-variant/5">
                                <span className="material-symbols-outlined text-base">code</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
                            </a>
                        )}

                        {/* LinkedIn */}
                        {socialMedia.linkedin && (
                            <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm border border-outline-variant/5">
                                <span className="material-symbols-outlined text-base">work</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
                            </a>
                        )}

                        {/* Instagram */}
                        {socialMedia.instagram && (
                            <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm border border-outline-variant/5">
                                <span className="material-symbols-outlined text-base">photo_camera</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
                            </a>
                        )}

                        {/* Twitter / X */}
                        {socialMedia.twitter && (
                            <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm border border-outline-variant/5">
                                <span className="material-symbols-outlined text-base">alternate_email</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Twitter</span>
                            </a>
                        )}

                        {/* Facebook (BARU DITAMBAHKAN) */}
                        {socialMedia.facebook && (
                            <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-sm border border-outline-variant/5">
                                <span className="material-symbols-outlined text-base">public</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Facebook</span>
                            </a>
                        )}

                    </div>
                </div>

                <div className="h-px w-full bg-outline-variant/10 my-8"></div>

                {/* Copyright & Links */}
                <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-outline uppercase tracking-[0.2em] gap-4">
                    <p>&copy; {new Date().getFullYear()} ArchitectCurator. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
                        <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}