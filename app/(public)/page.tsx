"use client";

import Link from "next/link";
import AnimateIn from "@/components/shared/AnimateIn";
import VisitorTracker from "@/components/shared/VisitorTracker"; 
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// PERBAIKAN 1: Tambahkan imageUrls (Array) pada Interface
interface Project {
    id: string;
    title: string;
    category: string;
    tags: string[];
    description: string;
    imageUrl?: string;
    imageUrls?: string[]; // <-- Ini yang baru
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

export default function HomePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // 1. Ambil Data Profil untuk Hero Section
                const profileSnap = await getDoc(doc(db, "portfolio_content", "profile"));
                if (profileSnap.exists()) {
                    setProfile(profileSnap.data() as ProfileData);
                }

                // 2. Ambil Data Layanan untuk Section Keahlian (Ambil 2 teratas)
                const servicesSnap = await getDoc(doc(db, "portfolio_content", "services"));
                if (servicesSnap.exists()) {
                    setServices(servicesSnap.data().items.slice(0, 2) || []);
                }

                // 3. Ambil Proyek Pilihan (featured == true)
                const q = query(
                    collection(db, "projects"),
                    where("featured", "==", true),
                    limit(2)
                );
                const projectSnap = await getDocs(q);
                const projectsData = projectSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
                setFeaturedProjects(projectsData);

            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
                <p className="mt-4 font-black uppercase tracking-[0.3em] text-[10px] text-primary">Initializing Experience...</p>
            </div>
        );
    }

    return (
        <main>
            {/* Sensor Tak Terlihat untuk Merekam Data Kunjungan Asli */}
            <VisitorTracker />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-8 py-20 md:py-32 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

                    {/* Text Side (60%) */}
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

                    {/* Visual Side (40%) */}
                    <div className="md:col-span-5 relative">
                        <AnimateIn delay={0.3} direction="left">
                            <div className="aspect-square rounded-3xl bg-surface-container-low overflow-hidden relative group shadow-2xl">
                                <img
                                    alt="Profile/Hero"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    src={profile?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAsXpxv0kpJP_8JDTWDGWGWZjQx-QE_DVznnyMihLt_xlHU1e7lhYW0BRCD3mFSgbG23AiRNPLIVaChEX_R_VRwsKmFY7oONLMkT9saE3V3ZYXmeauGno9eY7FRgBEKJviYmy192rB3Og5y1kNsYrgaMD1vM60ygtNPPpT4HbHXzaKGIqVp4Po713eige-m1X1b2LhjvVH5wl8uX6QyjaSjyXfuOnLXG_TCQDE4RKAgFzVagbi01XQTgEezSKmz_Vw6g_Eo-HhiNsI"}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none"></div>

                                {/* Floating Tech Badge (Dinamis dari Skills) */}
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl border border-outline-variant/15 shadow-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                                                Active Tech Stack
                                            </p>
                                            <p className="font-headline font-bold text-primary text-sm truncate">
                                                {profile?.skills?.map(s => s.tools[0]).filter(Boolean).join(" • ") || "React • Next.js • Firebase"}
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

            {/* Featured Expertise (Dinamis dari portfolio_content/services) */}
            <section className="bg-surface-container-low py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-8">
                    <AnimateIn delay={0.1}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 font-headline">Keahlian yang Terkurasi</h2>
                                <p className="text-on-surface-variant text-lg">
                                    Arsitektur perangkat lunak yang dirancang untuk performa tinggi dan skalabilitas masa depan.
                                </p>
                            </div>
                            <Link href="/services" className="text-primary font-bold inline-flex items-center gap-2 hover:gap-4 transition-all uppercase text-xs tracking-widest">
                                Eksplorasi Layanan <span className="material-symbols-outlined">arrow_forward</span>
                            </Link>
                        </div>
                    </AnimateIn>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {services.map((service, index) => {
                            const isFirst = index === 0;
                            return (
                                <div key={index} className={isFirst ? "md:col-span-8" : "md:col-span-4"}>
                                    <AnimateIn delay={0.1 + (index * 0.1)} direction="up">
                                        <div className={`p-8 rounded-3xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between min-h-[320px] h-full ${!isFirst ? "bg-primary text-white" : "bg-surface-container-lowest text-primary"
                                            }`}>
                                            <div className="flex justify-between items-start">
                                                <div className={`p-3 rounded-xl ${!isFirst ? "bg-white/10" : "bg-secondary-container"}`}>
                                                    <span className={`material-symbols-outlined ${!isFirst ? "text-tertiary-fixed-dim" : "text-on-secondary-container"}`}>
                                                        {service.icon}
                                                    </span>
                                                </div>
                                                <span className={`text-xs font-bold font-headline tracking-tighter ${!isFirst ? "text-white/40" : "text-outline"}`}>
                                                    0{index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 font-headline">{service.title}</h3>
                                                <p className={`leading-relaxed text-sm ${!isFirst ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                                                    {service.description}
                                                </p>
                                            </div>
                                        </div>
                                    </AnimateIn>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Selected Projects (Ditarik dari Firebase Collection) */}
            <section className="py-24 max-w-7xl mx-auto px-8 overflow-hidden">
                <AnimateIn delay={0.1}>
                    <h2 className="text-4xl font-extrabold text-primary mb-12 font-headline tracking-tight">Proyek Pilihan</h2>
                </AnimateIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {featuredProjects.map((project, index) => {
                        // PERBAIKAN 2: Logika pengecekan gambar (Ambil gambar pertama jika ada array)
                        const coverImage = (project.imageUrls && project.imageUrls.length > 0) 
                            ? project.imageUrls[0] 
                            : (project.imageUrl || "");

                        return (
                            <AnimateIn key={project.id} delay={0.2 + (index * 0.1)}>
                                {/* PERBAIKAN 3: Link sekarang mengarah spesifik ke ID project tersebut */}
                                <Link href={`/projects/${project.id}`} className="group cursor-pointer block">
                                    <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-surface-container relative mb-6 shadow-sm border border-outline-variant/10">
                                        <img
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            src={coverImage} // <-- Gunakan variabel coverImage
                                        />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            {project.tags?.slice(0, 2).map((tag) => (
                                                <span key={tag} className="px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[9px] font-black uppercase text-primary tracking-tighter">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 px-2">
                                        <h3 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors font-headline">{project.title}</h3>
                                        <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                </Link>
                            </AnimateIn>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-8 pb-24">
                <div className="bg-primary rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-headline tracking-tighter">Siap Mewujudkan Ide Digital Anda?</h2>
                        <p className="text-on-primary-container text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body">
                            Mari berdiskusi tentang bagaimana teknologi dapat membantu mencapai tujuan bisnis Anda dengan solusi yang tepat guna.
                        </p>
                        <Link href="/services#contact">
                            <button className="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl shadow-tertiary-fixed/10 active:scale-95">
                                Mulai Konsultasi Gratis
                            </button>
                        </Link>
                    </div>
                    {/* Background Visual Patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary-fixed/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                </div>
            </section>
        </main>
    );
}