"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import AnimateIn from "@/components/shared/AnimateIn";

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

interface SocialMedia {
    github: string;
    linkedin: string;
    instagram: string;
    twitter: string;
    facebook: string;
}

interface ProfileData {
    headline: string;
    bio: string;
    location: string;
    status: string;
    imageUrl: string;
    skills: Skill[];
    milestones: Milestone[];
    socialMedia: SocialMedia;
}

export default function AdminProfilePage() {
    // 1. Pastikan inisialisasi state SANGAT LENGKAP agar tidak ada yang undefined
    const [formData, setFormData] = useState<ProfileData>({
        headline: "",
        bio: "",
        location: "",
        status: "",
        imageUrl: "",
        skills: [],
        milestones: [],
        socialMedia: {
            github: "",
            linkedin: "",
            instagram: "",
            twitter: "",
            facebook: ""
        }
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            const docRef = doc(db, "portfolio_content", "profile");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    headline: data.headline || "",
                    bio: data.bio || "",
                    location: data.location || "",
                    status: data.status || "",
                    imageUrl: data.imageUrl || "",
                    skills: data.skills || [],
                    milestones: data.milestones || [],
                    socialMedia: {
                        github: data.socialMedia?.github || "",
                        linkedin: data.socialMedia?.linkedin || "",
                        instagram: data.socialMedia?.instagram || "",
                        twitter: data.socialMedia?.twitter || "",
                        facebook: data.socialMedia?.facebook || ""
                    }
                });
                setImagePreview(data.imageUrl || "");
            }
        }
        fetchProfile();
    }, []);

    // --- HANDLERS BERSAMA ---
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    // --- HANDLER KHUSUS SOCIAL MEDIA ---
    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            socialMedia: {
                ...formData.socialMedia,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
        const newSkills = [...formData.skills];
        if (field === "tools") {
            newSkills[index].tools = value.split(",").map(t => t.trim());
        } else {
            newSkills[index][field] = value as string;
        }
        setFormData({ ...formData, skills: newSkills });
    };

    const addSkill = () => setFormData({ ...formData, skills: [...formData.skills, { category: "New Skill", icon: "code", tools: [] }] });
    const removeSkill = (index: number) => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });

    const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
        const newMs = [...formData.milestones];
        newMs[index][field] = value;
        setFormData({ ...formData, milestones: newMs });
    };

    const addMilestone = () => setFormData({ ...formData, milestones: [...formData.milestones, { year: "2024", title: "New Role", desc: "Description" }] });
    const removeMilestone = (index: number) => setFormData({ ...formData, milestones: formData.milestones.filter((_, i) => i !== index) });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let finalImageUrl = formData.imageUrl;
            if (imageFile) finalImageUrl = await uploadImageToCloudinary(imageFile);

            await updateDoc(doc(db, "portfolio_content", "profile"), {
                ...formData,
                imageUrl: finalImageUrl,
                updatedAt: serverTimestamp(),
            });

            alert("Profil Publik & Link Sosial Media berhasil diperbarui!");
            setFormData(prev => ({ ...prev, imageUrl: finalImageUrl }));
            setImageFile(null);
        } catch (error) {
            console.error("Save error:", error);
            alert("Gagal menyimpan profil.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <AnimateIn delay={0.1} direction="down">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tighter text-primary font-headline">Master Profile</h2>
                        <p className="text-on-surface-variant font-medium mt-1">Kontrol penuh identitas digital, keahlian, dan karir Anda.</p>
                    </div>
                    <button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50">
                        {isSaving ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : <span className="material-symbols-outlined text-sm">save</span>}
                        Simpan Semua Data
                    </button>
                </header>
            </AnimateIn>

            <AnimateIn delay={0.2} direction="up">
                <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-outline-variant/10 space-y-14">

                    {/* 1. INFORMASI DASAR */}
                    <section>
                        <h3 className="text-lg font-bold text-primary border-b border-outline-variant/10 pb-3 mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">person</span> 1. Informasi Dasar
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container ring-4 ring-surface-container-low flex-shrink-0 relative group cursor-pointer shadow-inner">
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-outline-variant">person</span>}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" title="Ubah Foto" />
                                <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none"><span className="material-symbols-outlined text-white">photo_camera</span></div>
                            </div>

                            <div className="flex-1 w-full space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Headline / Posisi</label>
                                    {/* 2. Tambahkan fallback || "" di setiap input */}
                                    <input name="headline" value={formData.headline || ""} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-primary font-bold transition-all outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Lokasi Domisili</label>
                                        <input name="location" value={formData.location || ""} onChange={handleTextChange} className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-primary font-medium transition-all outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Status Pekerjaan</label>
                                        <input name="status" value={formData.status || ""} onChange={handleTextChange} placeholder="Available for Projects" className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-primary font-medium transition-all outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Biografi Singkat</label>
                                    <textarea name="bio" value={formData.bio || ""} onChange={handleTextChange} rows={4} className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-on-surface-variant font-medium leading-relaxed outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. SOCIAL MEDIA LINKS */}
                    <section>
                        <h3 className="text-lg font-bold text-primary border-b border-outline-variant/10 pb-3 mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">link</span> 2. Social Media Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">GitHub URL</label>
                                <input name="github" value={formData.socialMedia.github || ""} onChange={handleSocialChange} placeholder="https://github.com/username" className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none text-primary font-medium outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">LinkedIn URL</label>
                                <input name="linkedin" value={formData.socialMedia.linkedin || ""} onChange={handleSocialChange} placeholder="https://linkedin.com/in/username" className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none text-primary font-medium outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Instagram URL</label>
                                <input name="instagram" value={formData.socialMedia.instagram || ""} onChange={handleSocialChange} placeholder="https://instagram.com/username" className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none text-primary font-medium outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Twitter / X URL</label>
                                <input name="twitter" value={formData.socialMedia.twitter || ""} onChange={handleSocialChange} placeholder="https://x.com/username" className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none text-primary font-medium outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Facebook URL</label>
                                <input name="facebook" value={formData.socialMedia.facebook || ""} onChange={handleSocialChange} placeholder="https://facebook.com/username" className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none text-primary font-medium outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30" />
                            </div>
                        </div>
                    </section>

                    {/* 3. KEAHLIAN (SKILLS) */}
                    <section>
                        <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3 mb-6">
                            <h3 className="text-lg font-bold text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">code</span> 3. Technical Ecosystem (Skills)
                            </h3>
                            <button type="button" onClick={addSkill} className="text-[10px] font-bold uppercase tracking-widest text-tertiary bg-tertiary-fixed px-3 py-1.5 rounded-full flex items-center gap-1 hover:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-sm">add</span> Add Skill Group
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.skills.map((skill, index) => (
                                <div key={index} className="p-6 bg-surface-container-low rounded-2xl relative group border border-outline-variant/10">
                                    <button type="button" onClick={() => removeSkill(index)} className="absolute top-4 right-4 text-error opacity-0 group-hover:opacity-100 bg-error/10 p-1.5 rounded-lg hover:bg-error hover:text-white transition-all"><span className="material-symbols-outlined text-sm">delete</span></button>
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Category</label>
                                            <input value={skill.category || ""} onChange={(e) => handleSkillChange(index, "category", e.target.value)} placeholder="e.g. Frontend" className="w-full bg-transparent border-b border-outline-variant/30 text-sm font-bold text-primary outline-none focus:border-primary pb-1" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Material Icon</label>
                                            <input value={skill.icon || ""} onChange={(e) => handleSkillChange(index, "icon", e.target.value)} placeholder="e.g. terminal" className="w-full bg-transparent border-b border-outline-variant/30 text-sm font-medium text-on-surface-variant outline-none focus:border-primary pb-1" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Tools (Comma separated)</label>
                                        <input value={skill.tools ? skill.tools.join(", ") : ""} onChange={(e) => handleSkillChange(index, "tools", e.target.value)} placeholder="React, Next.js, Tailwind..." className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl text-xs font-bold text-tertiary outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 border border-outline-variant/5" />
                                    </div>
                                </div>
                            ))}
                            {formData.skills.length === 0 && <div className="col-span-full py-6 text-center text-xs font-bold text-outline uppercase tracking-widest border border-dashed rounded-xl border-outline-variant/30">Belum ada skill ditambahkan</div>}
                        </div>
                    </section>

                    {/* 4. SEJARAH KARIR (MILESTONES) */}
                    <section>
                        <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3 mb-6">
                            <h3 className="text-lg font-bold text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">military_tech</span> 4. Milestones & Certifications
                            </h3>
                            <button type="button" onClick={addMilestone} className="text-[10px] font-bold uppercase tracking-widest text-tertiary bg-tertiary-fixed px-3 py-1.5 rounded-full flex items-center gap-1 hover:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-sm">add</span> Add Milestone
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.milestones.map((ms, index) => (
                                <div key={index} className="p-6 bg-surface-container-low rounded-2xl relative group flex flex-col md:flex-row gap-6 border border-outline-variant/10">
                                    <button type="button" onClick={() => removeMilestone(index)} className="absolute top-4 right-4 text-error opacity-0 group-hover:opacity-100 bg-error/10 p-1.5 rounded-lg hover:bg-error hover:text-white transition-all"><span className="material-symbols-outlined text-sm">delete</span></button>

                                    <div className="md:w-32">
                                        <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Year</label>
                                        <input value={ms.year || ""} onChange={(e) => handleMilestoneChange(index, "year", e.target.value)} placeholder="e.g. 2024" className="w-full bg-transparent border-b border-outline-variant/30 text-lg font-bold text-primary outline-none focus:border-primary pb-1" />
                                    </div>
                                    <div className="flex-1 space-y-4 pr-8">
                                        <div>
                                            <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Title / Position</label>
                                            <input value={ms.title || ""} onChange={(e) => handleMilestoneChange(index, "title", e.target.value)} placeholder="Full Stack Developer at Company" className="w-full bg-transparent border-b border-outline-variant/30 text-sm font-bold text-primary outline-none focus:border-primary pb-1" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Brief Description</label>
                                            <input value={ms.desc || ""} onChange={(e) => handleMilestoneChange(index, "desc", e.target.value)} placeholder="Leading a team to build..." className="w-full bg-transparent border-b border-outline-variant/30 text-xs font-medium text-on-surface-variant outline-none focus:border-primary pb-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {formData.milestones.length === 0 && <div className="py-6 text-center text-xs font-bold text-outline uppercase tracking-widest border border-dashed rounded-xl border-outline-variant/30">Belum ada milestone ditambahkan</div>}
                        </div>
                    </section>

                </div>
            </AnimateIn>
        </div>
    );
}