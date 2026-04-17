// app\(public)\page.tsx
// Fix: hapus referensi /videos/hero-desa.mp4 yang tidak ada
// Fix: tambah skeleton loading yang konsisten (tidak blank saat Firestore lambat)

"use client";

import Link from "next/link";
import AnimateIn from "@/components/shared/AnimateIn";
import VisitorTracker from "@/components/shared/VisitorTracker";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Project {
    id: string;
    title: string;
    category: string;
    tags: string[];
    description: string;
    imageUrl?: string;
    imageUrls?: string[];
}

interface ProfileData {
    headline: string;
    bio: string;
    status: string;
    imageUrl: string;
    skills: { category: string; tools: string[] }[];
}

interface ServiceItem {
    title: string;
    icon: string;
    description: string;
}

// Skeleton komponen reusable
function SkeletonBlock({ className }: { className?: string }) {
    return (
        <div className={`bg-surface-container-highest rounded-xl animate-pulse ${className ?? ""}`} />
    );
}

export default function HomePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [profileSnap, servicesSnap, projectSnap] = await Promise.all([
                    getDoc(doc(db, "portfolio_content", "profile")),
                    getDoc(doc(db, "portfolio_content", "services")),
                    getDocs(
                        query(
                            collection(db, "projects"),
                            where("featured", "==", true),
                            limit(2)
                        )
                    ),
                ]);

                if (profileSnap.exists()) setProfile(profileSnap.data() as ProfileData);
                if (servicesSnap.exists()) setServices(servicesSnap.data().items?.slice(0, 2) || []);

                setFeaturedProjects(
                    projectSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
                );
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // ── SKELETON LOADING STATE ──
    // Tampilkan skeleton daripada blank/spinner penuh
    if (isLoading) {
        return (
            <main className="animate-pulse">
                {/* Hero Skeleton */}
                <section className="max-w-7xl mx-auto px-8 py-20 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-7 space-y-6">
                            <SkeletonBlock className="h-6 w-48 rounded-full" />
                            <SkeletonBlock className="h-20 w-full" />
                            <SkeletonBlock className="h-20 w-3/4" />
                            <SkeletonBlock className="h-24 w-full" />
                            <div className="flex gap-4 pt-2">
                                <SkeletonBlock className="h-14 w-44 rounded-xl" />
                                <SkeletonBlock className="h-14 w-44 rounded-xl" />
                            </div>
                        </div>
                        <div className="md:col-span-5">
                            <SkeletonBlock className="aspect-square w-full rounded-3xl" />
                        </div>
                    </div>
                </section>

                {/* Services Skeleton */}
                <section className="bg-surface-container-low py-24">
                    <div className="max-w-7xl mx-auto px-8">
                        <SkeletonBlock className="h-10 w-64 mb-16" />
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-8">
                                <SkeletonBlock className="h-80 w-full rounded-3xl" />
                            </div>
                            <div className="md:col-span-4">
                                <SkeletonBlock className="h-80 w-full rounded-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Skeleton */}
                <section className="py-24 max-w-7xl mx-auto px-8">
                    <SkeletonBlock className="h-10 w-48 mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <SkeletonBlock className="aspect-[16/10] w-full rounded-3xl" />
                        <SkeletonBlock className="aspect-[16/10] w-full rounded-3xl" />
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <VisitorTracker />

            {/* ── HERO SECTION ── */}
            <section className="max-w-7xl mx-auto px-8 py-20 md:py-32 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

                    {/* Text Side */}
                    <div className="md:col-span-7 space-y-8">
                        <AnimateIn delay={0.1}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-xs font-bold tracking-wider uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-fixed-dim"></span>
                                </span>
                                {profile?.status || "Available for Projects"}
                            </div>
                        </AnimateIn>

                        <AnimateIn delay={0.2}>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.1] font-headline">
                                {profile?.headline.split(" ").slice(0, 3).join(" ")}{" "}
                                <span className="bg-gradient-to-r from-primary to-on-primary-container bg-clip-text text-transparent">
                                    {profile?.headline.split(" ").slice(3).join(" ")}
                                </span>
                            </h1>
                        </AnimateIn>

                        <AnimateIn delay={0.3}>
                            <p className="text-xl text-on-surface-variant max-w-xl font-body leading-relaxed">
                                {profile?.bio}
                            </p>
                        </AnimateIn>

                        <AnimateIn delay={0.4}>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/projects">
                                    <button className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/10 hover:translate-y-[-2px] transition-all">
                                        Lihat Karya Saya
                                    </button>
                                </Link>
                                <Link href="/services#contact">
                                    <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-high transition-all">
                                        Mari Berdiskusi
                                    </button>
                                </Link>
                            </div>
                        </AnimateIn>
                    </div>

                    {/* Visual Side */}
                    <div className="md:col-span-5 relative">
                        <AnimateIn delay={0.3} direction="left">
                            <div className="aspect-square rounded-3xl bg-surface-container-low overflow-hidden relative group shadow-2xl">
                                {profile?.imageUrl ? (
                                    <img
                                        alt="Profile"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        src={profile.imageUrl}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                                        <span className="material-symbols-outlined text-6xl text-outline-variant">person</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none"></div>

                                {/* Floating Tech Badge */}
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl border border-outline-variant/15 shadow-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                                                Active Tech Stack
                                            </p>
                                            <p className="font-headline font-bold text-primary text-sm truncate">
                                                {profile?.skills?.map(s => s.tools[0]).filter(Boolean).join(" • ") ||
                                                    "React • Next.js • Firebase"}
                                            </p>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                                            <span className="material-symbols-outlined text-lg">bolt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimateIn>
                    </div>
                </div>
            </section>

            {/* ── FEATURED EXPERTISE ── */}
            <section className="bg-surface-container-low py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-8">
                    <AnimateIn delay={0.1}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 font-headline">
                                    Keahlian yang Terkurasi
                                </h2>
                                <p className="text-on-surface-variant text-lg">
                                    Arsitektur perangkat lunak yang dirancang untuk performa tinggi dan skalabilitas masa depan.
                                </p>
                            </div>
                            <Link
                                href="/services"
                                className="text-primary font-bold inline-flex items-center gap-2 hover:gap-4 transition-all uppercase text-xs tracking-widest"
                            >
                                Eksplorasi Layanan{" "}
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                        </div>
                    </AnimateIn>

                    {services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {services.map((service, index) => {
                                const isFirst = index === 0;
                                return (
                                    <div key={index} className={isFirst ? "md:col-span-8" : "md:col-span-4"}>
                                        <AnimateIn delay={0.1 + index * 0.1} direction="up">
                                            <div
                                                className={`p-8 rounded-3xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between min-h-[320px] h-full ${
                                                    !isFirst
                                                        ? "bg-primary text-white"
                                                        : "bg-surface-container-lowest text-primary"
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div
                                                        className={`p-3 rounded-xl ${
                                                            !isFirst ? "bg-white/10" : "bg-secondary-container"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`material-symbols-outlined ${
                                                                !isFirst
                                                                    ? "text-tertiary-fixed-dim"
                                                                    : "text-on-secondary-container"
                                                            }`}
                                                        >
                                                            {service.icon}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`text-xs font-bold font-headline tracking-tighter ${
                                                            !isFirst ? "text-white/40" : "text-outline"
                                                        }`}
                                                    >
                                                        0{index + 1}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2 font-headline">
                                                        {service.title}
                                                    </h3>
                                                    <p
                                                        className={`leading-relaxed text-sm ${
                                                            !isFirst
                                                                ? "text-on-primary-container"
                                                                : "text-on-surface-variant"
                                                        }`}
                                                    >
                                                        {service.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </AnimateIn>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Fallback jika belum ada services
                        <div className="text-center py-16 text-outline text-xs font-bold uppercase tracking-widest">
                            Belum ada layanan ditambahkan
                        </div>
                    )}
                </div>
            </section>

            {/* ── FEATURED PROJECTS ── */}
            <section className="py-24 max-w-7xl mx-auto px-8 overflow-hidden">
                <AnimateIn delay={0.1}>
                    <h2 className="text-4xl font-extrabold text-primary mb-12 font-headline tracking-tight">
                        Proyek Pilihan
                    </h2>
                </AnimateIn>

                {featuredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {featuredProjects.map((project, index) => {
                            const coverImage =
                                project.imageUrls && project.imageUrls.length > 0
                                    ? project.imageUrls[0]
                                    : project.imageUrl || "";

                            return (
                                <AnimateIn key={project.id} delay={0.2 + index * 0.1}>
                                    <Link href={`/projects/${project.id}`} className="group cursor-pointer block">
                                        <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-surface-container relative mb-6 shadow-sm border border-outline-variant/10">
                                            {coverImage ? (
                                                <img
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    src={coverImage}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-5xl text-outline-variant">image</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                {project.tags?.slice(0, 2).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[9px] font-black uppercase text-primary tracking-tighter"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2 px-2">
                                            <h3 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors font-headline">
                                                {project.title}
                                            </h3>
                                            <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>
                                    </Link>
                                </AnimateIn>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 border border-dashed border-outline-variant/30 rounded-3xl text-outline text-xs font-bold uppercase tracking-widest">
                        Belum ada featured project
                    </div>
                )}
            </section>

            {/* ── CTA SECTION ── */}
            <section className="max-w-7xl mx-auto px-8 pb-24">
                <div className="bg-primary rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-headline tracking-tighter">
                            Siap Mewujudkan Ide Digital Anda?
                        </h2>
                        <p className="text-on-primary-container text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body">
                            Mari berdiskusi tentang bagaimana teknologi dapat membantu mencapai tujuan bisnis Anda
                            dengan solusi yang tepat guna.
                        </p>
                        <Link href="/services#contact">
                            <button className="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl shadow-tertiary-fixed/10 active:scale-95">
                                Mulai Konsultasi Gratis
                            </button>
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary-fixed/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                </div>
            </section>
        </main>
    );
}