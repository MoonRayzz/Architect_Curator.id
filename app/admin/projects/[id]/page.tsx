"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import AnimateIn from "@/components/shared/AnimateIn";

interface ProjectData {
    title: string;
    category: string;
    githubUrl: string;
    demoUrl: string;
    description: string;
    techStack: string; // Kita simpan sebagai string di form, lalu convert ke array saat simpan
    imageUrl: string;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrapping params sesuai standar Next.js 15/16
    const { id } = use(params);
    const router = useRouter();

    const [formData, setFormData] = useState<ProjectData>({
        title: "",
        category: "Web",
        githubUrl: "",
        demoUrl: "",
        description: "",
        techStack: "",
        imageUrl: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 1. Ambil data projek lama dari Firebase
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        title: data.title || "",
                        category: data.category || "Web",
                        githubUrl: data.githubUrl || "",
                        demoUrl: data.demoUrl || "",
                        description: data.description || "",
                        // Ubah array techStack ["React", "Next"] kembali ke string "React, Next" untuk input
                        techStack: data.techStack ? data.techStack.join(", ") : "",
                        imageUrl: data.imageUrl || "",
                    });
                    setImagePreview(data.imageUrl || "");
                } else {
                    alert("Projek tidak ditemukan!");
                    router.push("/admin/projects");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // 2. Fungsi Simpan Perubahan (Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let finalImageUrl = formData.imageUrl;

            // Upload ke Cloudinary jika ada file baru dipilih
            if (imageFile) {
                finalImageUrl = await uploadImageToCloudinary(imageFile);
            }

            // Convert techStack string ke Array
            const techStackArray = formData.techStack
                .split(",")
                .map((tech) => tech.trim())
                .filter((tech) => tech !== "");

            // Update di Firestore
            const docRef = doc(db, "projects", id);
            await updateDoc(docRef, {
                title: formData.title,
                category: formData.category,
                githubUrl: formData.githubUrl,
                demoUrl: formData.demoUrl,
                description: formData.description,
                techStack: techStackArray,
                imageUrl: finalImageUrl,
                updatedAt: serverTimestamp(),
            });

            alert("Projek berhasil diperbarui!");
            router.push("/admin/projects");
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Gagal mengemas kini projek.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
                <p className="font-bold text-on-surface-variant tracking-widest uppercase text-xs">Memuat data projek...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <AnimateIn delay={0.1} direction="down">
                <header className="mb-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-4 font-bold text-sm"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Kembali
                    </button>
                    <h2 className="text-3xl font-extrabold tracking-tighter text-primary font-headline">Edit Project</h2>
                    <p className="text-on-surface-variant font-medium mt-1">Kemaskini butiran mahakarya anda.</p>
                </header>
            </AnimateIn>

            <AnimateIn delay={0.2} direction="up">
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Gambar Pratinjau */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Thumbnail Projek</label>
                            <div className="relative aspect-video w-full md:w-1/2 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-outline-variant">
                                        <span className="material-symbols-outlined text-4xl">image</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tajuk Projek</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Kategori</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all appearance-none"
                                >
                                    <option value="Web">Web</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="IoT">IoT</option>
                                    <option value="Backend">Backend</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">GitHub URL</label>
                                <input
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all"
                                    type="url"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Live Demo URL</label>
                                <input
                                    name="demoUrl"
                                    value={formData.demoUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all"
                                    type="url"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tech Stack (Pisahkan dengan koma)</label>
                            <input
                                name="techStack"
                                value={formData.techStack}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all"
                                placeholder="Next.js, Tailwind, Firebase"
                                type="text"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Penerangan Projek</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium leading-relaxed transition-all"
                                rows={5}
                            ></textarea>
                        </div>

                        <div className="pt-6 border-t border-outline-variant/10 flex justify-end gap-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`px-8 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all ${isSaving ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:scale-[0.98] shadow-lg shadow-primary/20"
                                    }`}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-sm">save</span>
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </AnimateIn>
        </div>
    );
}