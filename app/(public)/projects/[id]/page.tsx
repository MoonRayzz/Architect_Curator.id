"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import AnimateIn from "@/components/shared/AnimateIn";
import Link from "next/link";

interface ProjectDetail {
    id: string;
    title: string;
    category: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    imageUrls?: string[];
    githubUrl?: string;
    websiteUrl?: string; // TAMBAHAN: Interface untuk Web URL
}

const GITHUB_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Dart: "#00B4AB",
    "C++": "#f34b7d",
    C: "#555555",
    Swift: "#F05138",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    CMake: "#DA3434",
    "C#": "#178600",
    Vue: "#41b883",
    Svelte: "#ff3e00",
    Other: "#ededed"
};

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [repoLanguages, setRepoLanguages] = useState<Record<string, number>>({});
    const [totalBytes, setTotalBytes] = useState(0);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!params.id) return;
            try {
                const docRef = doc(db, "projects", params.id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as ProjectDetail;
                    setProject(data);

                    if (data.githubUrl) {
                        const match = data.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
                        if (match) {
                            const owner = match[1];
                            const repo = match[2].replace('.git', '');

                            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
                            const langData = await res.json();

                            if (!langData.message) {
                                setRepoLanguages(langData);
                                const total = Object.values(langData).reduce((a: any, b: any) => a + b, 0) as number;
                                setTotalBytes(total);
                            }
                        }
                    }
                } else {
                    router.push("/projects");
                }
            } catch (error) {
                console.error("Error fetching detail:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [params.id, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
            </div>
        );
    }

    if (!project) return null;

    const galleryImages = (project.imageUrls && project.imageUrls.length > 0)
        ? project.imageUrls
        : (project.imageUrl ? [project.imageUrl] : []);

    return (
        <main className="pt-32 pb-24 max-w-5xl mx-auto px-8 min-h-screen">
            <AnimateIn delay={0.1}>
                <Link href="/projects" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-outline hover:text-primary transition-colors mb-10">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Gallery
                </Link>
            </AnimateIn>

            <AnimateIn delay={0.2}>
                <header className="mb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">{project.category}</span>
                        {project.tags?.map(tag => (
                            <span key={tag} className="bg-surface-container border border-outline-variant/10 text-on-surface-variant text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">{tag}</span>
                        ))}

                        {/* WADAH TOMBOL EXTERNAL LINKS */}
                        <div className="ml-auto flex items-center gap-3">
                            {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-surface-container-highest text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">code</span> Source
                                </a>
                            )}
                            {project.websiteUrl && (
                                <a href={project.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full hover:scale-105 shadow-md shadow-primary/20 transition-transform">
                                    <span className="material-symbols-outlined text-sm">open_in_new</span> Visit Web
                                </a>
                            )}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary font-headline leading-[1.1]">{project.title}</h1>
                </header>
            </AnimateIn>

            {galleryImages.length > 0 && (
                <AnimateIn delay={0.3} direction="up">
                    <div className="mb-16">
                        <div className="w-full max-h-[85vh] min-h-[50vh] rounded-3xl overflow-hidden bg-surface-container-highest relative shadow-lg flex items-center justify-center group">
                            <img
                                src={galleryImages[activeImageIndex]}
                                alt="Background Blur"
                                className="absolute inset-0 w-full h-full object-cover opacity-50 blur-3xl scale-125 transition-all duration-700"
                                key={`blur-${activeImageIndex}`}
                            />
                            <img
                                src={galleryImages[activeImageIndex]}
                                alt={`${project.title} - Image ${activeImageIndex + 1}`}
                                className="relative z-10 w-auto h-auto max-w-full max-h-[85vh] object-contain drop-shadow-2xl animate-fade-in"
                                key={activeImageIndex}
                            />
                        </div>

                        {galleryImages.length > 1 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto custom-scrollbar pb-4">
                                {galleryImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-primary ring-4 ring-primary/20 scale-95 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </AnimateIn>
            )}

            {/* SEKSI GITHUB LANGUAGES BARS */}
            {totalBytes > 0 && (
                <AnimateIn delay={0.35} direction="up">
                    <div className="mb-12 bg-surface-container-low/50 p-6 md:p-8 rounded-3xl border border-outline-variant/10">
                        <h3 className="text-sm font-bold text-primary font-headline mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">data_object</span> Languages Stack
                        </h3>

                        <div className="w-full h-3 rounded-full flex overflow-hidden mb-6 bg-surface-container-highest">
                            {Object.entries(repoLanguages).map(([lang, bytes]) => {
                                const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                                return (
                                    <div
                                        key={lang}
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: GITHUB_COLORS[lang] || GITHUB_COLORS.Other
                                        }}
                                        className="h-full hover:brightness-110 transition-all cursor-pointer"
                                        title={`${lang} ${percentage}%`}
                                    ></div>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                            {Object.entries(repoLanguages).map(([lang, bytes]) => {
                                const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                                return (
                                    <div key={lang} className="flex items-center gap-2">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: GITHUB_COLORS[lang] || GITHUB_COLORS.Other }}
                                        ></span>
                                        <span className="text-sm font-bold text-primary">{lang}</span>
                                        <span className="text-xs font-medium text-outline">{percentage}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </AnimateIn>
            )}

            <AnimateIn delay={0.4} direction="up">
                <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-a:text-tertiary-fixed-dim text-on-surface-variant leading-relaxed">
                    <p className="whitespace-pre-wrap">{project.description}</p>
                </article>
            </AnimateIn>

            <AnimateIn delay={0.5}>
                <div className="mt-24 p-10 bg-surface-container-low rounded-[2rem] text-center border border-outline-variant/10">
                    <h3 className="text-2xl font-bold font-headline text-primary mb-4">Tertarik membangun project serupa?</h3>
                    <Link href="/services#contact">
                        <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:scale-95 transition-transform shadow-xl shadow-primary/20">
                            Diskusikan Ide Anda
                        </button>
                    </Link>
                </div>
            </AnimateIn>
        </main>
    );
}