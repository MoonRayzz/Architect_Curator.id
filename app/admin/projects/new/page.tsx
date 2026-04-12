"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useRouter } from "next/navigation";
import AnimateIn from "@/components/shared/AnimateIn";

export default function NewProjectPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        tags: "",
        githubUrl: "", 
        websiteUrl: "", // TAMBAHAN: State untuk Link Website / Live Demo
        featured: false,
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFilesArray = Array.from(e.target.files);
            const newPreviewsArray = newFilesArray.map(file => URL.createObjectURL(file));
            
            setImageFiles(prev => [...prev, ...newFilesArray]);
            setImagePreviews(prev => [...prev, ...newPreviewsArray]);
        }
    };

    const setAsCover = (selectedIndex: number) => {
        if (selectedIndex === 0) return;
        const updatedFiles = [...imageFiles];
        const [selectedFile] = updatedFiles.splice(selectedIndex, 1);
        updatedFiles.unshift(selectedFile);
        setImageFiles(updatedFiles);

        const updatedPreviews = [...imagePreviews];
        const [selectedPreview] = updatedPreviews.splice(selectedIndex, 1);
        updatedPreviews.unshift(selectedPreview);
        setImagePreviews(updatedPreviews);
    };

    const removeImage = (indexToRemove: number) => {
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageFiles.length === 0) {
            alert("Mohon unggah setidaknya 1 gambar.");
            return;
        }

        setIsSaving(true);
        try {
            const uploadPromises = imageFiles.map(file => uploadImageToCloudinary(file));
            const uploadedUrls = await Promise.all(uploadPromises);

            const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

            await addDoc(collection(db, "projects"), {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                tags: tagsArray,
                githubUrl: formData.githubUrl,
                websiteUrl: formData.websiteUrl, // Simpan Link Web ke Firebase
                featured: formData.featured,
                imageUrls: uploadedUrls, 
                createdAt: serverTimestamp(),
            });

            alert("Project berhasil dipublikasikan!");
            router.push("/admin/projects");
        } catch (error) {
            console.error("Save error:", error);
            alert("Gagal menyimpan project.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <AnimateIn delay={0.1} direction="down">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tighter text-primary font-headline">Upload New Project</h2>
                        <p className="text-on-surface-variant font-medium mt-1">Tambahkan karya arsitektur digital terbaru Anda.</p>
                    </div>
                </header>
            </AnimateIn>

            <AnimateIn delay={0.2} direction="up">
                <form onSubmit={handleSave} className="bg-surface-container-lowest p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-outline-variant/10 space-y-8">
                    
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Project Gallery</label>
                            {imagePreviews.length > 0 && <span className="text-[10px] font-bold text-primary">{imagePreviews.length} Gambar Dipilih</span>}
                        </div>
                        
                        <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 text-center hover:bg-surface-container-low transition-colors relative cursor-pointer">
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <span className="material-symbols-outlined text-4xl text-outline mb-2">collections</span>
                            <p className="text-sm font-bold text-primary">Klik atau Drag gambar ke sini</p>
                            <p className="text-xs text-on-surface-variant mt-1">Bisa pilih lebih dari 1 gambar (JPG, PNG)</p>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {imagePreviews.map((preview, index) => (
                                    <div key={preview} className={`aspect-square rounded-xl overflow-hidden bg-surface-container relative shadow-sm border transition-all duration-300 group ${index === 0 ? 'border-primary ring-2 ring-primary/20 scale-100' : 'border-outline-variant/10 hover:border-primary/50'}`}>
                                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            {index !== 0 && (
                                                <button type="button" onClick={() => setAsCover(index)} className="bg-white text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                                                    Jadikan Cover
                                                </button>
                                            )}
                                            <button type="button" onClick={() => removeImage(index)} className="bg-error text-white p-1.5 rounded-full hover:scale-105 transition-transform shadow-lg" title="Hapus gambar">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>

                                        {index === 0 && (
                                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary text-white text-[8px] font-black px-2 py-1 rounded-full uppercase shadow-md">
                                                <span className="material-symbols-outlined text-[10px]">star</span>
                                                Cover
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Project Title</label>
                            <input name="title" value={formData.title} onChange={handleTextChange} placeholder="e.g. Modern E-Commerce Web" required className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-primary font-bold outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleTextChange} required className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-primary font-bold outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30">
                                <option value="" disabled>Pilih Kategori</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Mobile App">Mobile App</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="System Architecture">System Architecture</option>
                            </select>
                        </div>
                    </div>

                    {/* TAMBAHAN INPUT LINK EXTERNAL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">code</span> Repository URL (Opsional)
                            </label>
                            <input name="githubUrl" value={formData.githubUrl} onChange={handleTextChange} placeholder="https://github.com/username/repository" className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-primary font-medium outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">language</span> Live Demo / Web URL (Opsional)
                            </label>
                            <input name="websiteUrl" value={formData.websiteUrl} onChange={handleTextChange} placeholder="https://yourproject.com" className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-primary font-medium outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Tags (Pisahkan dengan koma)</label>
                        <input name="tags" value={formData.tags} onChange={handleTextChange} placeholder="Next.js, Tailwind, Firebase..." className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-primary font-medium outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Full Description</label>
                        <textarea name="description" value={formData.description} onChange={handleTextChange} rows={5} placeholder="Ceritakan latar belakang, tantangan, dan solusi dari project ini..." required className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-on-surface-variant font-medium leading-relaxed outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                    </div>

                    <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl">
                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleTextChange} id="featured" className="w-5 h-5 accent-primary cursor-pointer" />
                        <label htmlFor="featured" className="text-sm font-bold text-primary cursor-pointer">Tampilkan di Beranda (Featured Project)</label>
                    </div>

                    <div className="pt-4 border-t border-outline-variant/10 flex justify-end gap-4">
                        <button type="button" onClick={() => router.back()} className="px-8 py-4 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Batal</button>
                        <button type="submit" disabled={isSaving} className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:scale-95 transition-transform flex items-center gap-2 disabled:opacity-50">
                            {isSaving ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : <span className="material-symbols-outlined text-sm">publish</span>}
                            Publish Project
                        </button>
                    </div>
                </form>
            </AnimateIn>
        </div>
    );
}