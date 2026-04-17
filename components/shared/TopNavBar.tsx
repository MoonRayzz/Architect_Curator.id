"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export default function TopNavBar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Tutup drawer saat route berubah
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Cegah scroll body saat drawer terbuka
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Profile", path: "/profile" },
        { name: "Projects", path: "/projects" },
        { name: "Services", path: "/services" },
    ];

    const isActive = (path: string) =>
        path === "/" ? pathname === "/" : pathname.startsWith(path);

    return (
        <>
            {/* ─── NAVBAR ─── */}
            <nav className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none border-b border-outline-variant/5">
                <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 uppercase font-headline"
                    >
                        ArchitectCurator
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`pb-1 font-manrope tracking-tight text-sm font-semibold uppercase transition-colors duration-300 ${
                                    isActive(link.path)
                                        ? "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Dark Mode Toggle — Desktop */}
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

                    {/* Kanan: CTA + Dark Mode Mobile + Hamburger */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Dark Mode Toggle — Mobile only */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="md:hidden p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center text-primary"
                            aria-label="Toggle Dark Mode"
                        >
                            {mounted && (
                                <span className="material-symbols-outlined text-[20px]">
                                    {theme === "dark" ? "light_mode" : "dark_mode"}
                                </span>
                            )}
                        </button>

                        {/* CTA Button */}
                        <Link href="/services#contact">
                            <button className="bg-primary text-on-primary px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight hover:scale-95 transition-transform duration-200">
                                Get in Touch
                            </button>
                        </Link>

                        {/* Hamburger — Mobile only */}
                        <button
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="md:hidden p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center text-primary"
                            aria-label="Toggle Menu"
                        >
                            <span className="material-symbols-outlined text-[22px]">
                                {mobileOpen ? "close" : "menu"}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── MOBILE DRAWER OVERLAY ─── */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-72 md:hidden bg-slate-50 dark:bg-slate-950 shadow-2xl border-l border-outline-variant/10 flex flex-col transition-transform duration-300 ease-in-out ${
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                    <span className="font-headline font-black text-sm uppercase tracking-widest text-primary">
                        Menu
                    </span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high transition-colors"
                        aria-label="Close menu"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                                isActive(link.path)
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-surface-container hover:text-slate-900 dark:hover:text-white"
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {link.name === "Home"
                                    ? "home"
                                    : link.name === "Profile"
                                    ? "person"
                                    : link.name === "Projects"
                                    ? "folder_special"
                                    : "design_services"}
                            </span>
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Drawer Footer */}
                <div className="px-4 py-6 border-t border-outline-variant/10">
                    <Link href="/services#contact" onClick={() => setMobileOpen(false)}>
                        <button className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                            Get in Touch
                        </button>
                    </Link>
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-outline mt-4">
                        ArchitectCurator © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </>
    );
}