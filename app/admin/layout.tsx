// app\admin\layout.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    // Tutup sidebar saat route berubah (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Cegah scroll saat sidebar mobile terbuka
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary">
                    progress_activity
                </span>
            </div>
        );
    }

    const navLinks = [
        { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
        { href: "/profile", label: "Lihat Web Publik", icon: "visibility", external: true },
    ];

    const contentLinks = [
        { href: "/admin/projects", label: "Projects", icon: "folder_special" },
        { href: "/admin/profile", label: "Profile Bio", icon: "person" },
        { href: "/admin/services", label: "Services", icon: "design_services" },
    ];

    const dataLinks = [
        { href: "/admin/inbox", label: "Inbox Pesan", icon: "inbox" },
    ];

    const isActive = (href: string, exact = false) =>
        exact ? pathname === href : pathname.includes(href);

    const linkClass = (href: string, exact = false) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
            isActive(href, exact)
                ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        }`;

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="mb-8 px-2 flex items-center justify-between">
                <div>
                    <h1 className="font-manrope text-lg font-black tracking-widest uppercase">
                        ArchitectCurator
                    </h1>
                    <p className="text-xs opacity-60 font-semibold tracking-wider">Management Suite</p>
                </div>
                {/* Tutup sidebar — mobile only */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
                    aria-label="Close sidebar"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                {navLinks.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        className={linkClass(link.href, link.exact)}
                    >
                        <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                        <span>{link.label}</span>
                    </Link>
                ))}

                <div className="pt-4 pb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-outline px-4">
                        Content
                    </p>
                </div>

                {contentLinks.map(link => (
                    <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                        <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                        <span>{link.label}</span>
                    </Link>
                ))}

                <div className="pt-4 pb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-outline px-4">
                        Data & Insights
                    </p>
                </div>

                {dataLinks.map(link => (
                    <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                        <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer Sidebar */}
            <div className="mt-auto pt-6 border-t border-outline-variant/10">
                <Link href="/admin/projects/new">
                    <button className="w-full py-4 bg-primary text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Project
                    </button>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-error/10 text-error hover:bg-error/20 rounded-xl font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 mb-4"
                >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Logout
                </button>
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-xs truncate">Administrator</p>
                        <p className="text-[10px] opacity-50 truncate">{user.email}</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="bg-surface text-on-surface min-h-screen flex">

            {/* ── DESKTOP SIDEBAR (fixed, always visible lg+) ── */}
            <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 flex-col p-6 space-y-4 font-inter text-sm font-medium z-40 shadow-sm border-r border-outline-variant/10">
                <SidebarContent />
            </aside>

            {/* ── MOBILE SIDEBAR OVERLAY ── */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
                    sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Mobile Drawer */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 lg:hidden bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 flex flex-col p-6 space-y-4 font-inter text-sm font-medium shadow-2xl border-r border-outline-variant/10 transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <SidebarContent />
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="lg:ml-64 min-h-screen w-full bg-background flex flex-col">

                {/* Mobile Top Bar */}
                <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high transition-colors flex items-center gap-2"
                        aria-label="Open sidebar"
                    >
                        <span className="material-symbols-outlined text-[22px]">menu</span>
                    </button>
                    <span className="font-headline font-black text-sm uppercase tracking-widest text-primary">
                        ArchitectCurator
                    </span>
                    <Link href="/admin/projects/new">
                        <button className="p-2 rounded-xl bg-primary text-white hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </Link>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}