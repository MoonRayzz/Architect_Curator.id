"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"; // Hook untuk ganti tema

export default function TopNavBar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Pastikan komponen sudah terpasang untuk menghindari hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Profile", path: "/profile" },
        { name: "Projects", path: "/projects" },
        { name: "Services", path: "/services" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none border-b border-outline-variant/5">
            <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                <Link href="/" className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 uppercase font-headline">
                    ArchitectCurator
                </Link>

                <div className="hidden md:flex space-x-8 items-center">
                    {navLinks.map((link) => {
                        const isActive =
                            link.path === "/"
                                ? pathname === "/"
                                : pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`pb-1 font-manrope tracking-tight text-sm font-semibold uppercase transition-colors duration-300 ${isActive
                                        ? "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                    {/* DARK MODE TOGGLE BUTTON */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center text-primary"
                        aria-label="Toggle Dark Mode"
                    >
                        {mounted && (
                            <span className="material-symbols-outlined text-[20px]">
                                {theme === "dark" ? "light_mode" : "dark_mode"}
                            </span>
                        )}
                    </button>
                </div>

                <Link href="/services#contact">
                    <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight hover:scale-95 transition-transform duration-200">
                        Get in Touch
                    </button>
                </Link>
            </div>
        </nav>
    );
}