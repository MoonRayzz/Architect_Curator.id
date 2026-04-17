// app\(public)\profile\page.tsx
// Fix #5: Ganti <img> → next/image untuk optimasi LCP & lazy loading
// Fix #6: Tambah skeleton loader saat data Firestore belum datang

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimateIn from "@/components/shared/AnimateIn";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Skill {
    category: string;
    icon: string;
    tools: string[];
}

interface Milestone {
    year: string;
    title: string;
    desc: string;
}

interface ProfileData {
    headline: string;
    bio: string;
    location: string;
    status: string;
    imageUrl: string;
    skills: Skill[];
    milestones: Milestone[];
}

function SkeletonBlock({ className }: { className?: string }) {
    return (
        <div className={`bg-surface-container-highest rounded-xl animate-pulse ${className ?? ""}`} />
    );
}

function ProfileSkeleton() {
    return (
        <main className="pb-24 px-6 md:px-12 max-w-7xl mx-auto animate-pulse">
            {/* Hero Skeleton */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-32 pt-8">
                <div className="md:col-span-5 flex justify-center">
                    <SkeletonBlock className="w-64 h-64 md:w-80 md:h-80 rounded-full" />
                </div>
                <div className="md:col-span-7 space-y-6">
                    <SkeletonBlock className="h-16 w-full" />
                    <SkeletonBlock className="h-16 w-3/4" />
                    <SkeletonBlock className="h-24 w-full" />
                    <div className="flex gap-3 flex-wrap">
                        <SkeletonBlock className="h-10 w-36 rounded-full" />
                        <SkeletonBlock className="h-10 w-40 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Skills Skeleton */}
            <section className="mb-32">
                <SkeletonBlock className="h-10 w-56 mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonBlock key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            </section>

            {/* Milestones Skeleton */}
            <section className="mb-32">
                <SkeletonBlock className="h-10 w-64 mx-auto mb-16" />
                <div className="max-w-4xl mx-auto space-y-12">
                    {[...Array(3)].map((_, i) => (
                        <SkeletonBlock key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const docRef = doc(db, "portfolio_content", "profile");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data() as ProfileData);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (isLoading) return <ProfileSkeleton />;

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">person_off</span>
                <p className="font-bold text-on-surface-variant">Data profil belum tersedia.</p>
                <Link href="/" className="mt-6 text-primary font-bold text-sm hover:underline">
                    Kembali ke Beranda
                </Link>
            </div>
        );
    }

    return (
        <main className="pb-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">

            {/* ── PROFILE HERO ── */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-32">
                <div className="md:col-span-5 flex justify-center md:justify-start">
                    <AnimateIn delay={0.1} direction="right">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-tertiary-fixed-dim/20 rounded-full blur-2xl group-hover:bg-tertiary-fixed-dim/30 transition duration-500" />
                            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-surface-container-lowest shadow-2xl overflow-hidden ring-8 ring-surface-container-low">
                                {profile.imageUrl ? (
                                    <Image
                                        src={profile.imageUrl}
                                        alt={profile.headline || "Profile"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 256px, 320px"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                                        <span className="material-symbols-outlined text-6xl text-outline-variant">person</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </AnimateIn>
                </div>

                <div className="md:col-span-7">
                    <AnimateIn delay={0.2} direction="left">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-on-surface font-headline">
                            {profile.headline.split(" ")[0]}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {profile.headline.split(" ").slice(1).join(" ")}
                            </span>
                        </h1>
                    </AnimateIn>
                    <AnimateIn delay={0.3} direction="left">
                        <p className="text-xl text-on-surface-variant leading-relaxed mb-8 max-w-2xl">
                            {profile.bio}
                        </p>
                    </AnimateIn>
                    <AnimateIn delay={0.4} direction="up">
                        <div className="flex flex-wrap gap-4">
                            {profile.location && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <span className="text-sm font-medium text-on-surface-variant">
                                        {profile.location}
                                    </span>
                                </div>
                            )}
                            {profile.status && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
                                    <span className="material-symbols-outlined text-primary">verified</span>
                                    <span className="text-sm font-medium text-on-surface-variant">
                                        {profile.status}
                                    </span>
                                </div>
                            )}
                        </div>
                    </AnimateIn>
                </div>
            </section>

            {/* ── TECHNICAL ECOSYSTEM ── */}
            {profile.skills && profile.skills.length > 0 && (
                <section className="mb-32">
                    <AnimateIn delay={0.1}>
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2 font-headline">
                                    Technical Ecosystem
                                </h2>
                                <p className="text-on-surface-variant">
                                    The tools I use to build scalable architectural solutions.
                                </p>
                            </div>
                            <div className="h-[2px] flex-grow mx-8 bg-surface-container-highest hidden md:block" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                Tech Stack 2024
                            </span>
                        </div>
                    </AnimateIn>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {profile.skills.map((skill, index) => (
                            <AnimateIn key={index} delay={0.2 + index * 0.1} direction="up">
                                <div className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-highest transition-all duration-300 transform hover:-translate-y-1 h-full">
                                    <span className="material-symbols-outlined text-3xl mb-6 text-primary">
                                        {skill.icon}
                                    </span>
                                    <h3 className="text-lg font-bold mb-4 font-headline">{skill.category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skill.tools.map((tool, tIndex) => (
                                            <span
                                                key={tIndex}
                                                className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold rounded-full"
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </AnimateIn>
                        ))}
                    </div>
                </section>
            )}

            {/* ── MILESTONES ── */}
            {profile.milestones && profile.milestones.length > 0 && (
                <section className="mb-32">
                    <AnimateIn delay={0.1}>
                        <h2 className="text-3xl font-bold tracking-tight mb-16 text-center font-headline">
                            Milestones & Certifications
                        </h2>
                    </AnimateIn>
                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-0 md:left-1/2 h-full w-[2px] bg-surface-container-highest -translate-x-1/2" />

                        {profile.milestones.map((item, index) => {
                            const isLeft = index % 2 !== 0;
                            const colorClass =
                                index === 0
                                    ? "bg-primary"
                                    : index === 1
                                    ? "bg-tertiary-fixed-dim"
                                    : "bg-secondary";

                            return (
                                <div
                                    key={index}
                                    className={`relative flex flex-col ${isLeft ? "md:flex-row-reverse" : "md:flex-row"} items-start mb-20`}
                                >
                                    <div className={`md:w-1/2 ${isLeft ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                                        <AnimateIn delay={0.2} direction={isLeft ? "left" : "right"}>
                                            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest uppercase bg-surface-container-highest text-on-surface-variant rounded-full">
                                                {item.year}
                                            </span>
                                            <h3 className="text-xl font-bold mb-2 font-headline">{item.title}</h3>
                                            <p className="text-on-surface-variant text-sm">{item.desc}</p>
                                        </AnimateIn>
                                    </div>
                                    <div className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 mt-2 ring-4 ring-surface ${colorClass}`} />
                                    <div className={`md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"}`} />
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ── CTA ── */}
            <AnimateIn delay={0.2} direction="up">
                <section className="bg-primary-container rounded-3xl p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none" />
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl font-extrabold text-white mb-6 font-headline">
                            Let's build something structural.
                        </h2>
                        <p className="text-on-primary-container text-lg mb-8 leading-relaxed">
                            Looking for a curator to bring technical depth to your next digital product? My inbox
                            is always open for complex challenges.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/services#contact">
                                <button className="bg-tertiary-fixed text-on-tertiary-fixed px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-300">
                                    Start a Project
                                </button>
                            </Link>
                            <Link href="/projects">
                                <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    View Portfolio
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </AnimateIn>
        </main>
    );
}