"use client";
import { useState, useEffect } from "react";
import AnimateIn from "@/components/shared/AnimateIn";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Interface untuk data dari Firebase
interface Project {
    id: string;
    title: string;
    category: string;
    tags: string[];
    techStack: string[];
    description: string;
    githubUrl: string;
    demoUrl: string;
    imageUrl: string;
    detailImageUrl?: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Ambil data dari Firebase saat halaman dimuat
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const projectsData: Project[] = [];
                querySnapshot.forEach((doc) => {
                    projectsData.push({ id: doc.id, ...doc.data() } as Project);
                });

                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const openModal = (project: Project) => {
        setSelectedProject(project);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <main className="pb-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
            {/* Editorial Header Section */}
            <header className="mb-16">
                <AnimateIn delay={0.1}>
                    <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-primary mb-6">
                        Project Showcase
                    </h1>
                </AnimateIn>
                <AnimateIn delay={0.2}>
                    <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                        A curated selection of technical solutions, architectural software designs, and IoT ecosystems engineered for high-performance environments.
                    </p>
                </AnimateIn>
            </header>

            {/* Filter Controls (Opsional, UI Statis sementara) */}
            <AnimateIn delay={0.3}>
                <div className="flex flex-wrap gap-3 mb-12 items-center">
                    <button className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm transition-all duration-200">All</button>
                    <button className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface font-medium text-sm hover:bg-surface-container-high transition-all duration-200">Web</button>
                    <button className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface font-medium text-sm hover:bg-surface-container-high transition-all duration-200">Mobile App</button>
                    <button className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface font-medium text-sm hover:bg-surface-container-high transition-all duration-200">IoT</button>
                </div>
            </AnimateIn>

            {/* Dynamic Grid dari Firebase */}
            {isLoading ? (
                <div className="py-24 flex flex-col justify-center items-center">
                    <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
                    <p className="font-bold text-on-surface-variant">Memuat database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {projects.map((project, index) => {
                        // Menentukan ukuran card berdasarkan urutan (agar asimetris seperti desain)
                        const isLarge = index % 3 === 0; // Card ke 1, 4, 7 jadi besar
                        const spanClass = isLarge ? "md:col-span-8" : "md:col-span-4";
                        const aspectClass = isLarge ? "aspect-video" : "aspect-square";

                        return (
                            <div key={project.id} className={spanClass}>
                                <AnimateIn delay={0.1 * (index % 3)} direction="up">
                                    <div
                                        onClick={() => openModal(project)}
                                        className="group relative bg-surface-container-low rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 cursor-pointer h-full flex flex-col"
                                    >
                                        <div className={`${aspectClass} w-full overflow-hidden`}>
                                            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={project.imageUrl} alt={project.title} />
                                        </div>
                                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-headline text-xl md:text-2xl font-bold text-primary mb-2">{project.title}</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.tags?.map(tag => (
                                                                <span key={tag} className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-on-surface-variant max-w-lg line-clamp-3">{project.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </AnimateIn>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail View Modal (Overlay) */}
            {selectedProject && (
                <section className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-md flex items-center justify-center p-4">
                    <AnimateIn delay={0} direction="up" duration={0.4}>
                        <div className="bg-surface rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl custom-scrollbar">
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 z-10 bg-surface-container-highest p-2 rounded-full hover:bg-surface-container-high transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Image Slider Container */}
                                <div className="relative bg-surface-container-low aspect-square lg:aspect-auto">
                                    <img className="w-full h-full object-cover" src={selectedProject.detailImageUrl || selectedProject.imageUrl} alt={selectedProject.title} />
                                </div>
                                {/* Content Detail */}
                                <div className="p-10 lg:p-14">
                                    <div className="mb-8">
                                        <span className="text-on-tertiary-fixed-variant font-bold text-xs uppercase tracking-widest mb-2 block">
                                            Case Study • {selectedProject.category}
                                        </span>
                                        <h2 className="font-headline text-4xl font-extrabold text-primary mb-4 leading-tight">{selectedProject.title}</h2>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {selectedProject.techStack?.map(tech => (
                                                <span key={tech} className="bg-surface-container-highest px-3 py-1 rounded text-xs font-semibold text-primary">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6 text-on-surface-variant mb-10">
                                        <p className="leading-relaxed">
                                            {selectedProject.description}
                                        </p>
                                    </div>
                                    {/* Action Links */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-surface-container">
                                        {selectedProject.demoUrl && (
                                            <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white py-4 px-6 rounded-xl font-bold hover:bg-primary-container transition-all">
                                                <span className="material-symbols-outlined">open_in_new</span>
                                                Live Demo / Download
                                            </a>
                                        )}
                                        {selectedProject.githubUrl && (
                                            <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 bg-surface-container-highest text-primary py-4 px-6 rounded-xl font-bold hover:bg-surface-container-high transition-all">
                                                <span className="material-symbols-outlined">code</span>
                                                Lihat Source Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimateIn>
                </section>
            )}
        </main>
    );
}