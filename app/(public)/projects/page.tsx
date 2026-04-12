"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import AnimateIn from "@/components/shared/AnimateIn";

interface Project {
    id: string;
    title: string;
    category: string;
    tags: string[];
    imageUrl?: string;
    imageUrls?: string[];
}

export default function PublicProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
                const snap = await getDocs(q);
                setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
            } catch (error) {
                console.error("Error fetching projects", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
            </div>
        );
    }

    return (
        <main className="pt-32 pb-24 max-w-7xl mx-auto px-8 min-h-screen">
            <AnimateIn delay={0.1}>
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary font-headline mb-6">Our Showcase</h1>
                    <p className="text-lg text-on-surface-variant">Eksplorasi kumpulan studi kasus, arsitektur sistem, dan inovasi digital yang telah kami bangun.</p>
                </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => {
                    const coverImage = (project.imageUrls && project.imageUrls.length > 0) ? project.imageUrls[0] : (project.imageUrl || "");
                    
                    return (
                        <AnimateIn key={project.id} delay={0.1 * index} direction="up">
                            <Link href={`/projects/${project.id}`} className="group block h-full flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="aspect-[4/3] overflow-hidden relative bg-surface-container">
                                    <img src={coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Icon Multiple Photo Tracker */}
                                    {(project.imageUrls && project.imageUrls.length > 1) && (
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">collections</span>
                                            {project.imageUrls.length}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">{project.category}</p>
                                    <h3 className="text-xl font-bold text-primary font-headline mb-4 group-hover:text-tertiary-fixed-dim transition-colors">{project.title}</h3>
                                    <div className="mt-auto flex flex-wrap gap-2">
                                        {project.tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant text-[9px] font-bold uppercase tracking-widest rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </AnimateIn>
                    );
                })}
            </div>
            {projects.length === 0 && (
                <div className="text-center py-20 text-outline uppercase tracking-widest font-bold text-xs border border-dashed rounded-3xl border-outline-variant/30">
                    Karya belum ditambahkan
                </div>
            )}
        </main>
    );
}