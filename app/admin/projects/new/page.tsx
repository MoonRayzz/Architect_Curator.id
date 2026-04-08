"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import AnimateIn from "@/components/shared/AnimateIn";

export default function AddNewProjectPage() {
    const router = useRouter();

    // State untuk status proses
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk input teks
    const [formData, setFormData] = useState({
        title: "",
        category: "Web",
        githubUrl: "",
        demoUrl: "",
        description: "",
        techStack: "", // Diinput sebagai string dipisah koma, disimpan sebagai array
        featured: false,
    });

    // State untuk file gambar dan preview
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    // Handler input teks
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handler pilih file & buat preview lokal
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handler Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            alert("Mohon pilih gambar thumbnail terlebih dahulu.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload ke Cloudinary
            const imageUrl = await uploadImageToCloudinary(imageFile);

            // 2. Olah Tech Stack menjadi array
            const techStackArray = formData.techStack
                .split(",")
                .map((tech) => tech.trim())
                .filter((tech) => tech !== "");

            // 3. Simpan ke Firebase Firestore
            await addDoc(collection(db, "projects"), {
                title: formData.title,
                category: formData.category,
                githubUrl: formData.githubUrl,
                demoUrl: formData.demoUrl,
                description: formData.description,
                techStack: techStackArray,
                imageUrl: imageUrl, // URL hasil upload Cloudinary
                featured: formData.featured,
                tags: [formData.category], // Default tag adalah kategorinya
                createdAt: serverTimestamp(),
            });

            alert("Project baru berhasil dipublikasikan!");
            router.push("/admin/projects"); // Redirect ke daftar project

        } catch (error) {
            console.error("Error adding project: ", error);
            alert("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <AnimateIn delay={0.1} direction="down">
                <header className="mb-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-4 font-bold text-sm"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Batal & Kembali
                    </button>
                    <h2 className="text-4xl font-extrabold tracking-tighter text-primary font-headline">Add New Project</h2>
                    <p className="text-on-surface-variant font-medium mt-1">Siapkan detail mahakarya terbaru Anda untuk dipamerkan.</p>
                </header>
            </AnimateIn>

            <AnimateIn delay={0.2} direction="up">
                {/* Kontainer Utama menggunakan Tonal Layering sesuai DESIGN.md */}
                <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl shadow-sm border border-outline-variant/10">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Sesi Foto Thumbnail */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Project Thumbnail</label>
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="relative aspect-video w-full md:w-64 rounded-2xl overflow-hidden bg-surface-container-low border border-dashed border-outline-variant/30 flex items-center justify-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-outline-variant">
                                            <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                                            <p className="text-[10px] font-bold uppercase mt-1">No Image Selected</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer transition-all"
                                    />
                                    <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
                                        Gunakan gambar berkualitas tinggi (Rekomendasi 16:9). Gambar akan di-hosting secara aman di Cloudinary.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sesi Detail Teks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Project Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/40 text-primary font-medium transition-all"
                                    placeholder="Misal: SmartCampus Hub"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/40 text-primary font-medium transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Web">Web Development</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="IoT">IoT Solutions</option>
                                    <option value="Backend">Backend / Infrastructure</option>
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
                                    className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/40 text-primary font-medium transition-all"
                                    placeholder="https://github.com/username/repo"
                                    type="url"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Live Demo URL</label>
                                <input
                                    name="demoUrl"
                                    value={formData.demoUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/40 text-primary font-medium transition-all"
                                    placeholder="https://your-project-demo.com"
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
                                required
                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/40 text-primary font-medium transition-all"
                                placeholder="Next.js, Tailwind CSS, Firebase, MQTT"
                                type="text"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/40 text-primary font-medium leading-relaxed transition-all"
                                placeholder="Jelaskan masalah yang Anda selesaikan dan teknologi utama yang Anda gunakan..."
                                rows={5}
                            ></textarea>
                        </div>

                        {/* Opsi Tampilkan di Home */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low/50">
                            <input
                                id="featured"
                                name="featured"
                                type="checkbox"
                                checked={formData.featured}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-none bg-surface-container-highest text-primary focus:ring-offset-0 focus:ring-2 focus:ring-tertiary-fixed-dim"
                            />
                            <label htmlFor="featured" className="text-sm font-bold text-primary cursor-pointer">
                                Tampilkan sebagai "Proyek Pilihan" di Beranda
                            </label>
                        </div>

                        <div className="pt-8 border-t border-outline-variant/10 flex justify-end gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-10 py-4 rounded-2xl font-bold text-sm text-white flex items-center gap-3 transition-all shadow-xl shadow-primary/10 ${isSubmitting
                                        ? "bg-primary/50 cursor-not-allowed"
                                        : "bg-gradient-to-r from-primary to-primary-container hover:scale-[0.98] active:scale-95"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-sm">cloud_upload</span>
                                        Publish Project
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