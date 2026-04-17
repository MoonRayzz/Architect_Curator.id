// app\admin\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    getDocs,
    orderBy,
    limit,
    getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    category: string;
    imageUrl?: string;
    imageUrls?: string[];
    createdAt?: any;
}

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: any;
}

interface LocationStat {
    country: string;
    city: string;
    percentage: number;
}

interface SiteStats {
    totalVisits: number;
    visitData: number[];
    topLocations: LocationStat[];
}

// Batas maksimal dokumen visits yang diambil.
// Cukup untuk analytics ringan, tanpa baca ribuan dokumen sekaligus.
const VISITS_FETCH_LIMIT = 500;

export default function AdminDashboard() {
    const [projectCount, setProjectCount] = useState(0);
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [messageCount, setMessageCount] = useState(0);
    const [recentMessages, setRecentMessages] = useState<Message[]>([]);
    const [stats, setStats] = useState<SiteStats>({
        totalVisits: 0,
        visitData: [0, 0, 0, 0, 0, 0, 0],
        topLocations: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    // Indikator apakah visits melebihi limit fetch
    const [isVisitsTruncated, setIsVisitsTruncated] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // ─────────────────────────────────────────────────────────────
                // 1. PROJECTS
                // getCountFromServer: 1 read saja untuk total count (efisien)
                // getDocs dengan limit 5: untuk tabel recent projects
                // Total: 2 reads (bukan 2 full collection fetch seperti sebelumnya)
                // ─────────────────────────────────────────────────────────────
                const projectsRef = collection(db, "projects");
                const [projectCountSnap, recentProjectsSnap] = await Promise.all([
                    getCountFromServer(projectsRef),
                    getDocs(query(projectsRef, orderBy("createdAt", "desc"), limit(5))),
                ]);

                setProjectCount(projectCountSnap.data().count);
                setRecentProjects(
                    recentProjectsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
                );

                // ─────────────────────────────────────────────────────────────
                // 2. MESSAGES
                // Sama: getCountFromServer + limit 4 untuk inbox preview
                // Total: 2 reads
                // ─────────────────────────────────────────────────────────────
                const messagesRef = collection(db, "messages");
                const [messageCountSnap, recentMessagesSnap] = await Promise.all([
                    getCountFromServer(messagesRef),
                    getDocs(query(messagesRef, orderBy("createdAt", "desc"), limit(4))),
                ]);

                setMessageCount(messageCountSnap.data().count);
                setRecentMessages(
                    recentMessagesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Message))
                );

                // ─────────────────────────────────────────────────────────────
                // 3. VISITS — dibatasi VISITS_FETCH_LIMIT dokumen
                // Jika visits sangat banyak (>500), kita ambil 500 terbaru
                // dan tampilkan catatan bahwa data analytics bersifat sample.
                // ─────────────────────────────────────────────────────────────
                const visitsSnap = await getDocs(
                    query(
                        collection(db, "visits"),
                        orderBy("visitedAt", "desc"),
                        limit(VISITS_FETCH_LIMIT)
                    )
                );

                const visitsData = visitsSnap.docs.map(d => d.data());
                const fetchedCount = visitsData.length;

                // Cek apakah ada lebih dari yang kita fetch
                // (jika fetch limit tercapai, kemungkinan ada lebih)
                setIsVisitsTruncated(fetchedCount === VISITS_FETCH_LIMIT);

                // Untuk total visits yang akurat, pakai getCountFromServer
                const visitsTotalSnap = await getCountFromServer(collection(db, "visits"));
                const totalVisits = visitsTotalSnap.data().count;

                // Kalkulasi demografi dari sample yang ada
                const locationCounts: Record<string, number> = {};
                visitsData.forEach(v => {
                    const key = `${v.country || "Unknown"}|${v.city || "Unknown"}`;
                    locationCounts[key] = (locationCounts[key] || 0) + 1;
                });

                const topLocations = Object.entries(locationCounts)
                    .map(([key, count]) => {
                        const [country, city] = key.split("|");
                        return {
                            country,
                            city,
                            // Persentase relatif terhadap total seluruh visits (akurat)
                            percentage: Math.round((count / Math.max(totalVisits, 1)) * 100),
                        };
                    })
                    .sort((a, b) => b.percentage - a.percentage)
                    .slice(0, 4);

                // Kalkulasi grafik 7 hari terakhir (dari sample)
                const last7Days = Array(7).fill(0);
                const now = new Date();

                visitsData.forEach(v => {
                    if (!v.visitedAt) return;
                    const visitDate = v.visitedAt.toDate();
                    const diffTime = now.getTime() - visitDate.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays >= 0 && diffDays < 7) {
                        last7Days[6 - diffDays]++;
                    }
                });

                const maxVisitsPerDay = Math.max(...last7Days, 1);
                const visitDataGraph = last7Days.map(v =>
                    Math.round((v / maxVisitsPerDay) * 100)
                );

                setStats({ totalVisits, visitData: visitDataGraph, topLocations });
            } catch (error) {
                console.error("Error fetching dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getDayLabels = () => {
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
        }
        return labels;
    };
    const dayLabels = getDayLabels();

    if (isLoading) return null;

    return (
        <div className="pb-10">
            {/* Header */}
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tighter text-primary font-headline">
                        System Overview
                    </h2>
                    <p className="text-on-surface-variant font-medium mt-1">
                        Real-time performance analytics and architectural management.
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Real-Time Tracking Active
                    </span>
                </div>
            </header>

            {/* Statistics Bento Grid */}
            <div className="grid grid-cols-12 gap-6 mb-8">

                {/* Stat 1: Projects */}
                <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-3xl flex flex-col justify-between group hover:bg-surface-container-highest transition-all duration-300 border border-outline-variant/10">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-primary text-white rounded-2xl material-symbols-outlined">
                            architecture
                        </span>
                        <span className="text-green-600 text-[10px] font-black bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                            Live Database
                        </span>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-5xl font-black font-headline text-primary">{projectCount}</h3>
                        <p className="text-on-surface-variant font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                            Active Projects
                        </p>
                    </div>
                </div>

                {/* Stat 2: Messages */}
                <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-3xl flex flex-col justify-between group hover:bg-surface-container-highest transition-all duration-300 border border-outline-variant/10">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl material-symbols-outlined">
                            mail
                        </span>
                        <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-tighter">
                            Total Incoming
                        </span>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-5xl font-black font-headline text-primary">{messageCount}</h3>
                        <p className="text-on-surface-variant font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                            Client Inquiries
                        </p>
                    </div>
                </div>

                {/* Stat 3: Web Visits */}
                <div className="col-span-12 md:col-span-4 bg-primary text-white p-8 rounded-3xl flex flex-col justify-between overflow-hidden relative shadow-lg shadow-primary/20">
                    <div className="relative z-10 flex justify-between items-start">
                        <span className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl material-symbols-outlined">
                            radar
                        </span>
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                            {isVisitsTruncated ? "Accurate Count" : "Real Data"}
                        </span>
                    </div>
                    <div className="relative z-10 mt-8">
                        <h3 className="text-5xl font-black font-headline tracking-tighter">
                            {stats.totalVisits.toLocaleString()}
                        </h3>
                        <p className="text-white/70 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                            Total Authentic Visits
                        </p>
                        {isVisitsTruncated && (
                            <p className="text-white/50 text-[9px] mt-1 font-medium">
                                Analytics dari {VISITS_FETCH_LIMIT} kunjungan terbaru
                            </p>
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-tertiary-fixed-dim/20 blur-3xl rounded-full translate-x-10 translate-y-10"></div>
                </div>

                {/* Grafik 7 Hari Terakhir */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="font-bold text-lg tracking-tight font-headline text-primary">
                            Live Engagement
                        </h4>
                        <span className="text-[10px] font-black uppercase text-outline tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Last 7 Days
                        </span>
                    </div>
                    <div className="h-56 flex items-end justify-between gap-3 md:gap-6 flex-1">
                        {stats.visitData.map((height, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-surface-container-low hover:bg-primary transition-all duration-500 rounded-t-xl relative group"
                                style={{ height: `${Math.max(height, 2)}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-black bg-primary text-white px-2 py-1 rounded transition-all whitespace-nowrap">
                                    {height}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between px-2 text-[10px] font-black text-outline tracking-[0.3em] uppercase">
                        {dayLabels.map(day => (
                            <span key={day}>{day}</span>
                        ))}
                    </div>
                </div>

                {/* Demografi Wilayah */}
                <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="font-bold text-lg tracking-tight font-headline text-primary">
                            Audience Demographics
                        </h4>
                        <span className="material-symbols-outlined text-outline">public</span>
                    </div>
                    <div className="space-y-6 flex-1 justify-center flex flex-col">
                        {stats.topLocations.length > 0 ? (
                            stats.topLocations.map((loc, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="max-w-[70%]">
                                            <p className="text-sm font-bold text-primary truncate">{loc.country}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant truncate">
                                                {loc.city}
                                            </p>
                                        </div>
                                        <span className="text-xs font-black text-tertiary-fixed-dim">
                                            {loc.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${loc.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 opacity-30">
                                <span className="material-symbols-outlined text-4xl mb-2">location_off</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">
                                    Belum ada kunjungan direkam
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Priority Inbox */}
                <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-col border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="font-bold text-lg tracking-tight font-headline text-primary">
                            Priority Inbox
                        </h4>
                        <Link
                            className="text-primary text-[10px] font-black uppercase hover:underline tracking-widest bg-surface-container px-3 py-1.5 rounded-full"
                            href="/admin/inbox"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {recentMessages.length === 0 ? (
                            <div className="text-center py-10 opacity-30">
                                <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">No Messages</p>
                            </div>
                        ) : (
                            recentMessages.map(msg => (
                                <div
                                    key={msg.id}
                                    className="flex gap-4 group cursor-pointer border-b border-outline-variant/5 pb-4 last:border-0"
                                >
                                    <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-black text-xs flex-shrink-0 shadow-inner">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <p className="font-bold text-sm text-primary truncate group-hover:text-tertiary-fixed-dim transition-colors">
                                            {msg.name}
                                        </p>
                                        <p className="text-xs text-on-surface-variant truncate italic mt-0.5">
                                            "{msg.message}"
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Tabel Recent Projects */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="font-bold text-lg tracking-tight font-headline text-primary">
                            Recent Project Management
                        </h4>
                        <Link
                            href="/admin/projects"
                            className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:scale-95 transition-transform shadow-lg shadow-primary/20"
                        >
                            Manage All
                        </Link>
                    </div>

                    {recentProjects.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-30 py-10">
                            <span className="material-symbols-outlined text-5xl mb-2">folder_off</span>
                            <p className="text-[10px] font-black tracking-widest uppercase">
                                No projects in database
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-outline border-b border-outline-variant/10">
                                        <th className="pb-4">Project Details</th>
                                        <th className="pb-4 hidden md:table-cell">Category</th>
                                        <th className="pb-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5">
                                    {recentProjects.map(project => {
                                        const coverImage =
                                            project.imageUrls && project.imageUrls.length > 0
                                                ? project.imageUrls[0]
                                                : project.imageUrl || "";

                                        return (
                                            <tr
                                                key={project.id}
                                                className="group hover:bg-surface-container-low/50 transition-colors"
                                            >
                                                <td className="py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden border border-outline-variant/10 flex-shrink-0">
                                                            <img
                                                                alt={project.title}
                                                                className="w-full h-full object-cover"
                                                                src={coverImage}
                                                            />
                                                        </div>
                                                        <span className="font-bold text-primary text-sm line-clamp-1">
                                                            {project.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest hidden md:table-cell">
                                                    {project.category}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="bg-green-50 border border-green-200 text-green-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                                        Published
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}