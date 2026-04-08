"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, getDocs, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Project {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    createdAt?: any;
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Mengambil data dari Firebase
    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const projectsData: Project[] = [];
            querySnapshot.forEach((document) => {
                projectsData.push({ id: document.id, ...document.data() } as Project);
            });

            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Fungsi untuk menghapus project
    const handleDelete = async (id: string, title: string) => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus project "${title}"?`);
        if (!confirmDelete) return;

        setIsDeleting(id);
        try {
            await deleteDoc(doc(db, "projects", id));
            // Hapus project dari state lokal agar tabel langsung update tanpa refresh
            setProjects((prev) => prev.filter((project) => project.id !== id));
            alert("Project berhasil dihapus!");
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Gagal menghapus project.");
        } finally {
            setIsDeleting(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
                <p className="font-bold text-on-surface-variant tracking-widest uppercase text-xs">Memuat data projects...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tighter text-primary font-headline">Manajemen Project</h2>
                    <p className="text-on-surface-variant font-medium mt-1">Atur portofolio karya yang akan ditampilkan di halaman publik.</p>
                </div>
                <Link href="/admin/projects/new">
                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm tracking-tight hover:scale-95 transition-transform flex items-center gap-2 shadow-lg">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add New Project
                    </button>
                </Link>
            </header>

            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
                {projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">folder_open</span>
                        <p className="text-on-surface-variant font-semibold">Belum ada project yang ditambahkan.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto p-8">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                                <tr>
                                    <th className="pb-4">Project Name</th>
                                    <th className="pb-4">Category</th>
                                    <th className="pb-4 text-center">Status</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/5">
                                {projects.map((project) => (
                                    <tr key={project.id} className="group hover:bg-surface-container-low/50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                                                    <img alt={project.title} className="w-full h-full object-cover" src={project.imageUrl} />
                                                </div>
                                                <span className="font-bold text-primary truncate max-w-[200px] md:max-w-sm">{project.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm font-medium text-on-surface-variant">{project.category}</td>
                                        <td className="py-4 text-center">
                                            <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-3 py-1 rounded-full uppercase">Published</span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Tombol Edit (Akan mengarah ke [id]/page.tsx nanti) */}
                                                <Link href={`/admin/projects/${project.id}`}>
                                                    <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors" title="Edit Project">
                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                    </button>
                                                </Link>
                                                {/* Tombol Delete */}
                                                <button
                                                    onClick={() => handleDelete(project.id, project.title)}
                                                    disabled={isDeleting === project.id}
                                                    className="p-2 rounded-lg text-error hover:bg-error-container transition-colors disabled:opacity-50"
                                                    title="Hapus Project"
                                                >
                                                    {isDeleting === project.id ? (
                                                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}