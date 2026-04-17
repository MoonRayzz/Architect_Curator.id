// app\admin\projects\[id]\page.tsx
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
    websiteUrl: string;
    description: string;
    tags: string;
    featured: boolean;
}

// Gambar yang sudah ada di Cloudinary (URL string)
type ExistingImage = { type: "existing"; url: string };
// Gambar baru yang baru dipilih user (File object)
type NewImage = { type: "new"; file: File; previewUrl: string };
type GalleryImage = ExistingImage | NewImage;

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [formData, setFormData] = useState<ProjectData>({
        title: "",
        category: "Web Development",
        githubUrl: "",
        websiteUrl: "",
        description: "",
        tags: "",
        featured: false,
    });

    // Gallery: gabungan gambar lama (URL) + gambar baru (File)
    const [gallery, setGallery] = useState<GalleryImage[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingNew, setIsUploadingNew] = useState(false);

    // --- FETCH DATA EXISTING ---
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    setFormData({
                        title: data.title || "",
                        category: data.category || "Web Development",
                        githubUrl: data.githubUrl || "",
                        websiteUrl: data.websiteUrl || data.demoUrl || "",
                        description: data.description || "",
                        tags: data.tags
                            ? data.tags.join(", ")
                            : (data.techStack ? data.techStack.join(", ") : ""),
                        featured: data.featured || false,
                    });

                    // Load semua gambar yang ada
                    const existingUrls: string[] =
                        data.imageUrls && data.imageUrls.length > 0
                            ? data.imageUrls
                            : data.imageUrl
                            ? [data.imageUrl]
                            : [];

                    setGallery(existingUrls.map(url => ({ type: "existing", url } as ExistingImage)));
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

    // Cleanup object URLs saat component unmount untuk cegah memory leak
    useEffect(() => {
        return () => {
            gallery.forEach(img => {
                if (img.type === "new") URL.revokeObjectURL(img.previewUrl);
            });
        };
    }, []);

    // --- HANDLERS FORM TEKS ---
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- HANDLERS GALLERY ---

    // Tambah gambar baru ke gallery (tidak langsung upload)
    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newImages: NewImage[] = Array.from(e.target.files).map(file => ({
            type: "new",
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setGallery(prev => [...prev, ...newImages]);
        // Reset input agar bisa pilih file yang sama lagi
        e.target.value = "";
    };

    // Hapus gambar dari gallery (baik yang lama maupun baru)
    const handleRemoveImage = (index: number) => {
        const img = gallery[index];
        if (img.type === "new") URL.revokeObjectURL(img.previewUrl);
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    // Jadikan gambar sebagai cover (pindah ke index 0)
    const handleSetCover = (index: number) => {
        if (index === 0) return;
        setGallery(prev => {
            const updated = [...prev];
            const [selected] = updated.splice(index, 1);
            updated.unshift(selected);
            return updated;
        });
    };

    // Ambil preview URL untuk render
    const getPreviewUrl = (img: GalleryImage): string => {
        return img.type === "existing" ? img.url : img.previewUrl;
    };

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (gallery.length === 0) {
            alert("Projek harus memiliki minimal 1 gambar.");
            return;
        }

        setIsSaving(true);
        setIsUploadingNew(true);

        try {
            // Upload hanya gambar BARU ke Cloudinary secara paralel
            const finalUrls: string[] = await Promise.all(
                gallery.map(async img => {
                    if (img.type === "existing") return img.url;
                    // Upload gambar baru
                    return await uploadImageToCloudinary(img.file);
                })
            );

            setIsUploadingNew(false);

            const tagsArray = formData.tags
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag !== "");

            await updateDoc(doc(db, "projects", id), {
                title: formData.title,
                category: formData.category,
                githubUrl: formData.githubUrl,
                websiteUrl: formData.websiteUrl,
                description: formData.description,
                tags: tagsArray,
                featured: formData.featured,
                imageUrls: finalUrls,
                updatedAt: serverTimestamp(),
            });

            alert("Projek berhasil diperbarui!");
            router.push("/admin/projects");
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Gagal memperbarui projek. Silakan coba lagi.");
            setIsUploadingNew(false);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">
                    progress_activity
                </span>
                <p className="font-bold text-on-surface-variant tracking-widest uppercase text-xs">
                    Memuat data projek...
                </p>
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
                    <h2 className="text-3xl font-extrabold tracking-tighter text-primary font-headline">
                        Edit Project
                    </h2>
                    <p className="text-on-surface-variant font-medium mt-1">
                        Kemaskini butiran mahakarya anda.
                    </p>
                </header>
            </AnimateIn>

            <AnimateIn delay={0.2} direction="up">
                <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10 space-y-8">

                    {/* ============================================================
                        GALLERY SECTION — MULTI IMAGE DENGAN FULL CONTROL
                        ============================================================ */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                Project Gallery
                            </label>
                            <span className="text-[10px] font-bold text-primary">
                                {gallery.length} Gambar
                                {gallery.some(img => img.type === "new") && (
                                    <span className="ml-2 text-tertiary-fixed-dim">
                                        ({gallery.filter(img => img.type === "new").length} baru akan diupload)
                                    </span>
                                )}
                            </span>
                        </div>

                        {/* Tombol Tambah Gambar */}
                        <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-6 text-center hover:bg-surface-container-low transition-colors relative cursor-pointer mb-6">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleAddImages}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <span className="material-symbols-outlined text-3xl text-outline mb-2">add_photo_alternate</span>
                            <p className="text-sm font-bold text-primary">Tambah Gambar Baru</p>
                            <p className="text-xs text-on-surface-variant mt-1">Gambar lama tetap tersimpan</p>
                        </div>

                        {/* Grid Pratinjau Gallery */}
                        {gallery.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {gallery.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`aspect-square rounded-xl overflow-hidden bg-surface-container relative shadow-sm border transition-all duration-300 group ${
                                            index === 0
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-outline-variant/10 hover:border-primary/50"
                                        }`}
                                    >
                                        <img
                                            src={getPreviewUrl(img)}
                                            alt={`Image ${index}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                        {/* Badge Cover */}
                                        {index === 0 && (
                                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary text-white text-[8px] font-black px-2 py-1 rounded-full uppercase shadow-md">
                                                <span className="material-symbols-outlined text-[10px]">star</span>
                                                Cover
                                            </div>
                                        )}

                                        {/* Badge: Gambar Baru */}
                                        {img.type === "new" && (
                                            <div className="absolute top-2 right-2 bg-tertiary-fixed text-on-tertiary-fixed text-[8px] font-black px-2 py-1 rounded-full uppercase">
                                                Baru
                                            </div>
                                        )}

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            {index !== 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetCover(index)}
                                                    className="bg-white text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
                                                >
                                                    Jadikan Cover
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="bg-error text-white p-1.5 rounded-full hover:scale-105 transition-transform shadow-lg"
                                                title="Hapus gambar"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 text-center">
                                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">image_not_supported</span>
                                <p className="text-xs font-bold text-outline uppercase tracking-widest">
                                    Belum ada gambar. Tambahkan minimal 1 gambar.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ============================================================
                        FORM FIELDS
                        ============================================================ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                                Judul Projek
                            </label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all outline-none"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                                Kategori
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all appearance-none outline-none"
                            >
                                <option value="Web Development">Web Development</option>
                                <option value="Mobile App">Mobile App</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="System Architecture">System Architecture</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                                GitHub URL
                            </label>
                            <input
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all outline-none"
                                type="url"
                                placeholder="https://github.com/username/repo"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                                Live Demo URL
                            </label>
                            <input
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all outline-none"
                                type="url"
                                placeholder="https://yourproject.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                            Tags (Pisahkan dengan koma)
                        </label>
                        <input
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all outline-none"
                            placeholder="Next.js, Tailwind, Firebase"
                            type="text"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                            Deskripsi Projek
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium leading-relaxed transition-all outline-none"
                            rows={5}
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                            id="featured"
                            className="w-5 h-5 accent-primary cursor-pointer"
                        />
                        <label htmlFor="featured" className="text-sm font-bold text-primary cursor-pointer">
                            Tampilkan di Beranda (Featured Project)
                        </label>
                    </div>

                    {/* Upload progress indicator */}
                    {isUploadingNew && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-tertiary-fixed/20 text-on-tertiary-fixed text-sm font-medium">
                            <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                            <span>Mengupload {gallery.filter(img => img.type === "new").length} gambar baru ke server...</span>
                        </div>
                    )}

                    <div className="pt-6 border-t border-outline-variant/10 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-8 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all ${
                                isSaving
                                    ? "bg-primary/50 cursor-not-allowed"
                                    : "bg-primary hover:scale-[0.98] shadow-lg shadow-primary/20"
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
            </AnimateIn>
        </div>
    );
}