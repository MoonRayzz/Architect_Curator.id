"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import AnimateIn from "@/components/shared/AnimateIn";

interface ServiceItem {
    title: string;
    icon: string;
    description: string;
    tags: string[];
    imageUrl: string;
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    // Fetch data dari Firebase saat komponen dimuat
    useEffect(() => {
        async function fetchServices() {
            try {
                const docRef = doc(db, "portfolio_content", "services");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setServices(data.items || []);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchServices();
    }, []);

    // Handler Tambah Slot
    const addNewService = () => {
        const newService: ServiceItem = {
            title: "New Service Title",
            icon: "settings",
            description: "Describe the high-end value of this service...",
            tags: ["Keyword 1"],
            imageUrl: ""
        };
        setServices([...services, newService]);
    };

    // Handler Hapus Slot
    const removeService = (indexToRemove: number) => {
        if (confirm("Hapus slot layanan ini secara permanen?")) {
            const filtered = services.filter((_, index) => index !== indexToRemove);
            setServices(filtered);
        }
    };

    // Handler Input Teks Dinamis
    const handleTextChange = (index: number, field: keyof ServiceItem, value: string) => {
        const updatedServices = [...services];
        if (field === "tags") {
            // Bersihkan spasi dan abaikan tag yang kosong
            updatedServices[index][field] = value.split(",").map(t => t.trim()).filter(t => t !== "");
        } else {
            (updatedServices[index] as any)[field] = value;
        }
        setServices(updatedServices);
    };

    // Handler Upload Gambar per Index
    const handleImageUpload = async (index: number, file: File) => {
        setUploadingIndex(index);
        try {
            const url = await uploadImageToCloudinary(file);
            const updatedServices = [...services];
            updatedServices[index].imageUrl = url;
            setServices(updatedServices);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Gagal mengunggah gambar ke sistem.");
        } finally {
            setUploadingIndex(null);
        }
    };

    // Handler Simpan ke Firestore
    const saveAllServices = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, "portfolio_content", "services");
            await updateDoc(docRef, {
                items: services,
                updatedAt: serverTimestamp()
            });
            alert("Perubahan layanan berhasil dipublikasikan!");
        } catch (error) {
            console.error("Error saving services:", error);
            alert("Gagal menyimpan data ke database.");
        } finally {
            setIsSaving(false);
        }
    };

    // State Loading Client-Side
    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
                <p className="font-bold text-on-surface-variant uppercase tracking-widest text-xs font-manrope">Syncing Architecture...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <AnimateIn delay={0.1} direction="down">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tighter text-primary font-headline">Service Architecture</h2>
                        <p className="text-on-surface-variant font-medium mt-1">Manage the core pillars of your professional digital solutions.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={addNewService}
                            className="flex-1 md:flex-none px-6 py-4 rounded-2xl font-bold text-sm bg-surface-container-highest text-primary hover:bg-surface-dim transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">add</span>
                            Add New Slot
                        </button>
                        <button
                            onClick={saveAllServices}
                            disabled={isSaving}
                            className={`flex-1 md:flex-none px-10 py-4 rounded-2xl font-bold text-sm text-white shadow-xl shadow-primary/10 transition-all ${isSaving
                                    ? "bg-primary/50 cursor-not-allowed"
                                    : "bg-gradient-to-r from-primary to-primary-container hover:scale-[0.98] active:scale-95"
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span>
                                    Saving...
                                </>
                            ) : (
                                "Save All Changes"
                            )}
                        </button>
                    </div>
                </header>
            </AnimateIn>

            <div className="grid grid-cols-1 gap-10">
                {services.length === 0 ? (
                    <div className="bg-surface-container-low p-20 rounded-3xl text-center border border-dashed border-outline-variant/30 flex flex-col items-center">
                        <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">design_services</span>
                        <p className="font-bold text-on-surface-variant">No service slots found. Create your first one.</p>
                    </div>
                ) : (
                    services.map((service, index) => (
                        <AnimateIn key={index} delay={0.05 * index} direction="up">
                            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-sm relative group transition-all hover:shadow-xl hover:shadow-primary/5">

                                {/* Tombol Hapus (Warna Error sesuai globals.css) */}
                                <button
                                    onClick={() => removeService(index)}
                                    className="absolute top-6 right-6 p-3 bg-error/10 text-error rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-error hover:text-on-error z-10 cursor-pointer"
                                    title="Remove this slot"
                                >
                                    <span className="material-symbols-outlined text-sm font-bold">delete</span>
                                </button>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                    <div className="space-y-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Icon Identity</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 flex-shrink-0">
                                                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                                                </div>
                                                <input
                                                    value={service.icon}
                                                    onChange={(e) => handleTextChange(index, "icon", e.target.value)}
                                                    className="flex-1 px-4 py-3 rounded-xl bg-surface-container-low border-none text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 transition-all"
                                                    placeholder="Icon name (e.g. database)"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Image Visual</label>
                                            <div className="aspect-[4/3] rounded-3xl bg-surface-container-low overflow-hidden relative border border-dashed border-outline-variant/40 flex items-center justify-center group/img">
                                                {service.imageUrl ? (
                                                    <img src={service.imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
                                                ) : (
                                                    <div className="text-center text-outline-variant px-6">
                                                        <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                                                        <p className="text-[10px] font-bold uppercase tracking-tighter">No Visual Set</p>
                                                    </div>
                                                )}
                                                {uploadingIndex === index && (
                                                    <div className="absolute inset-0 bg-primary/60 backdrop-blur-md flex items-center justify-center">
                                                        <span className="material-symbols-outlined animate-spin text-white text-3xl">progress_activity</span>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files && handleImageUpload(index, e.target.files[0])}
                                                className="mt-4 block w-full text-[10px] font-bold text-primary cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-primary file:text-white hover:file:bg-primary-container transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 space-y-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">Service Title</label>
                                            <input
                                                value={service.title}
                                                onChange={(e) => handleTextChange(index, "title", e.target.value)}
                                                placeholder="e.g. Web Development"
                                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-2xl font-bold text-primary outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 font-headline transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">Description</label>
                                            <textarea
                                                value={service.description}
                                                onChange={(e) => handleTextChange(index, "description", e.target.value)}
                                                rows={4}
                                                placeholder="Describe the architectural complexity..."
                                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-on-surface-variant font-medium leading-relaxed outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">Tags (Comma separated)</label>
                                            <input
                                                value={service.tags.join(", ")}
                                                onChange={(e) => handleTextChange(index, "tags", e.target.value)}
                                                placeholder="React, Next.js, IoT"
                                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none text-sm font-bold text-tertiary outline-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimateIn>
                    ))
                )}
            </div>
        </div>
    );
}