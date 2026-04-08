"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (loading || !user) {
        return <div className="min-h-screen bg-background flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span></div>;
    }

    return (
        <div className="bg-surface text-on-surface min-h-screen flex">
            {/* SideNavBar Component */}
            <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 flex flex-col p-6 space-y-4 font-inter text-sm font-medium z-40 shadow-sm border-r border-outline-variant/10">
                <div className="mb-8 px-2">
                    <h1 className="font-manrope text-lg font-black tracking-widest uppercase">ArchitectCurator</h1>
                    <p className="text-xs opacity-60 font-semibold tracking-wider">Management Suite</p>
                </div>
                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                    <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${pathname === '/admin' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50'}`}>
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/profile" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 transition-all duration-200">
                        <span className="material-symbols-outlined">visibility</span>
                        <span>Lihat Web Publik</span>
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-outline px-4">Content</p>
                    </div>

                    <Link href="/admin/projects" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${pathname.includes('/admin/projects') ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50'}`}>
                        <span className="material-symbols-outlined">folder_special</span>
                        <span>Projects</span>
                    </Link>
                    <Link href="/admin/profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${pathname.includes('/admin/profile') ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50'}`}>
                        <span className="material-symbols-outlined">person</span>
                        <span>Profile Bio</span>
                    </Link>
                    <Link href="/admin/services" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${pathname.includes('/admin/services') ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50'}`}>
                        <span className="material-symbols-outlined">design_services</span>
                        <span>Services</span>
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-outline px-4">Data & Insights</p>
                    </div>

                    <Link href="/admin/inbox" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${pathname.includes('/admin/inbox') ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50'}`}>
                        <span className="material-symbols-outlined">inbox</span>
                        <span>Inbox Pesan</span>
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-outline-variant/10">
                    <Link href="/admin/projects/new">
                        <button className="w-full py-4 bg-primary text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4 shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-sm">add</span>
                            New Project
                        </button>
                    </Link>
                    <button onClick={handleLogout} className="w-full py-3 bg-error/10 text-error hover:bg-error/20 rounded-xl font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Logout
                    </button>
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-xs truncate">Administrator</p>
                            <p className="text-[10px] opacity-50 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Canvas */}
            <main className="ml-64 p-10 min-h-screen w-full bg-background">
                {children}
            </main>
        </div>
    );
}