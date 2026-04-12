"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import AnimateIn from "@/components/shared/AnimateIn";

interface Project {
    id: string;
    title: string;
    category: string;
    featured: boolean;
    imageUrl?: string; // Fallback data lama
    imageUrls?: string[]; // Data baru
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Yakin ingin menghapus project ini permanen?")) {
            await deleteDoc(doc(db, "projects", id));
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    if (isLoading) return null; // Menggunakan loading.tsx bawaan

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <AnimateIn delay={0.1} direction="down">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tighter text-primary font-headline">Project Management</h2>
                        <p className="text-on-surface-variant font-medium mt-1">Kelola seluruh portofolio karya Anda.</p>
                    </div>
                    <Link href="/admin/projects/new">
                        <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:scale-95 transition-transform flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">add</span> New Project
                        </button>
                    </Link>
                </header>
            </AnimateIn>

            <AnimateIn delay={0.2} direction="up">
                <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/10 overflow-hidden">
                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-outline border-b border-outline-variant/10">
                                    <th className="p-6">Project Title</th>
                                    <th className="p-6">Category</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/5">
                                {projects.map((project) => {
                                    // LOGIKA COVER GAMBAR: Ambil dari array pertama, jika kosong ambil data lama
                                    const coverImage = (project.imageUrls && project.imageUrls.length > 0) ? project.imageUrls[0] : (project.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAsXpxv0kpJP_8JDTWDGWGWZjQx-QE_DVznnyMihLt_xlHU1e7lhYW0BRCD3mFSgbG23AiRNPLIVaChEX_R_VRwsKmFY7oONLMkT9saE3V3ZYXmeauGno9eY7FRgBEKJviYmy192rB3Og5y1kNsYrgaMD1vM60ygtNPPpT4HbHXzaKGIqVp4Po713eige-m1X1b2LhjvVH5wl8uX6QyjaSjyXfuOnLXG_TCQDE4RKAgFzVagbi01XQTgEezSKmz_Vw6g_Eo-HhiNsI");

                                    return (
                                        <tr key={project.id} className="hover:bg-surface-container-low/30 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl bg-surface-container overflow-hidden border border-outline-variant/10 flex-shrink-0 relative">
                                                        <img alt={project.title} className="w-full h-full object-cover" src={coverImage} />
                                                        {(project.imageUrls && project.imageUrls.length > 1) && (
                                                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">+{project.imageUrls.length - 1}</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-primary text-sm line-clamp-1">{project.title}</span>
                                                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1 block">ID: {project.id.slice(0,6)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{project.category}</td>
                                            <td className="p-6">
                                                {project.featured ? 
                                                    <span className="bg-primary/10 text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">Featured</span> : 
                                                    <span className="bg-surface-container-high text-on-surface text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">Standard</span>
                                                }
                                            </td>
                                            <td className="p-6 text-right space-x-2">
                                                <Link href={`/projects/${project.id}`} target="_blank">
                                                    <button className="p-2 text-outline hover:text-primary transition-colors bg-surface-container hover:bg-surface-container-high rounded-xl"><span className="material-symbols-outlined text-sm">visibility</span></button>
                                                </Link>
                                                <Link href={`/admin/projects/${project.id}`}>
                                                    <button className="p-2 text-outline hover:text-primary transition-colors bg-surface-container hover:bg-surface-container-high rounded-xl"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                </Link>
                                                <button onClick={() => handleDelete(project.id)} className="p-2 text-error hover:bg-error hover:text-white transition-colors bg-error/10 rounded-xl"><span className="material-symbols-outlined text-sm">delete</span></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {projects.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-outline text-xs uppercase tracking-widest font-bold">Belum ada project.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AnimateIn>
        </div>
    );
}