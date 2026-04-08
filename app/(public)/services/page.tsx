"use client";

import { useEffect, useState } from "react";
import AnimateIn from "@/components/shared/AnimateIn";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ServiceItem {
    title: string;
    icon: string;
    description: string;
    tags: string[];
    imageUrl: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Mengambil data dari koleksi portfolio_content dengan ID services
                const docRef = doc(db, "portfolio_content", "services");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().items) {
                    setServices(docSnap.data().items as ServiceItem[]);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <main className="pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
            {/* Hero Section */}
            <header className="mb-20 text-center md:text-left max-w-3xl">
                <AnimateIn delay={0.1} direction="up">
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                        Technical Solutions
                    </span>
                </AnimateIn>
                <AnimateIn delay={0.2} direction="up">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-primary mb-6 leading-tight font-headline">
                        Architecting <span className="text-on-tertiary-container">Digital</span> Precision.
                    </h1>
                </AnimateIn>
                <AnimateIn delay={0.3} direction="up">
                    <p className="text-lg text-on-surface-variant leading-relaxed font-body max-w-2xl">
                        Kami menjembatani kesenjangan antara persyaratan teknik yang kompleks dan pengalaman estetika kelas atas. Mulai dari infrastruktur web hingga ekosistem IoT.
                    </p>
                </AnimateIn>
            </header>

            {/* Services Catalog: Dynamic Bento Grid Style */}
            {isLoading ? (
                <div className="py-24 flex flex-col justify-center items-center">
                    <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">progress_activity</span>
                    <p className="font-bold text-on-surface-variant uppercase tracking-widest text-xs">Architecting layout...</p>
                </div>
            ) : (
                <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-32">
                    {services.map((service, index) => {
                        /** * LOGIKA GRID DINAMIS (Bento Style)
                         * Index 0: Large (7 col)
                         * Index 1: Medium (5 col) - Primary Container Style
                         * Index 2: Medium (5 col)
                         * Index 3: Large (7 col) - Split Layout Style
                         * Seterusnya: Mengulang pola col-span
                         */
                        const isLarge = (index % 4 === 0 || index % 4 === 3);
                        const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";

                        // Khusus index 1 (ke-2) menggunakan tema biru/primary
                        const isPrimaryTheme = index === 1;

                        return (
                            <div key={index} className={colSpan}>
                                <AnimateIn delay={0.1 * (index % 3)} direction="up">
                                    <div className={`group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full flex flex-col ${isPrimaryTheme
                                        ? 'bg-primary-container text-on-primary'
                                        : 'bg-surface-container-lowest border border-outline-variant/10 shadow-sm'
                                        }`}>

                                        {/* Kondisi 1: Tampilkan Gambar Full Width (Jika ada dan bukan index ke-3 split) */}
                                        {service.imageUrl && (index % 4 !== 3) && (
                                            <div className="h-64 overflow-hidden">
                                                <img
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    src={service.imageUrl}
                                                    alt={service.title}
                                                />
                                            </div>
                                        )}

                                        <div className={`flex-1 flex ${index % 4 === 3 ? 'flex-col md:flex-row' : 'flex-col'}`}>

                                            {/* Area Konten Teks */}
                                            <div className={`p-8 flex-1 flex flex-col justify-between ${index % 4 === 3 ? 'md:w-1/2' : 'w-full'}`}>
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className={`text-2xl font-bold tracking-tight font-headline ${isPrimaryTheme ? 'text-white' : 'text-primary'}`}>
                                                            {service.title}
                                                        </h3>
                                                        <span className={`material-symbols-outlined ${isPrimaryTheme ? 'text-tertiary-fixed-dim' : 'text-tertiary'}`}>
                                                            {service.icon}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm leading-relaxed mb-6 ${isPrimaryTheme ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                                                        {service.description}
                                                    </p>
                                                </div>

                                                <div className="mt-auto">
                                                    <div className="flex gap-2 flex-wrap mb-4">
                                                        {service.tags.map(tag => (
                                                            <span key={tag} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-tighter rounded-full ${isPrimaryTheme
                                                                ? 'bg-white/10 text-white'
                                                                : 'bg-surface-container text-on-surface-variant'
                                                                }`}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {isPrimaryTheme ? (
                                                        <>
                                                            <div className="h-px bg-white/10 w-full mb-4"></div>
                                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-80">
                                                                <span>Explore Solutions</span>
                                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        isLarge && (
                                                            <span className="inline-flex items-center gap-2 text-tertiary font-bold text-sm">
                                                                View Blueprint <span className="material-symbols-outlined text-sm">settings_input_component</span>
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Kondisi 2: Tampilkan Gambar Split (Hanya untuk Index ke-3) */}
                                            {service.imageUrl && (index % 4 === 3) && (
                                                <div className="md:w-1/2 h-64 md:h-full">
                                                    <img
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                        src={service.imageUrl}
                                                        alt={service.title}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </AnimateIn>
                            </div>
                        );
                    })}
                </section>
            )}

            {/* Contact / Hire Me Section */}
            <section className="max-w-5xl mx-auto" id="contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div>
                        <AnimateIn delay={0.1} direction="right">
                            <h2 className="text-4xl font-extrabold tracking-tighter text-primary mb-4 font-headline">Let's build the future.</h2>
                            <p className="text-on-surface-variant leading-relaxed mb-8">
                                Siap untuk memulai proyek? Isi ringkasan di bawah ini dan tim teknis kami akan meninjau persyaratan Anda dalam waktu 24 jam.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">mail</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Us</p>
                                        <p className="font-semibold text-primary">arisftp2@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">chat_bubble</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">WhatsApp</p>
                                        <p className="font-semibold text-primary">+62 851 5724 4627</p>
                                    </div>
                                </div>
                            </div>
                        </AnimateIn>
                    </div>

                    <div className="bg-surface-container-low p-8 rounded-xl shadow-sm border border-outline-variant/10">
                        <AnimateIn delay={0.2} direction="left">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Full Name</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 placeholder:text-outline-variant text-primary font-medium transition-all"
                                            placeholder="John Architect"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Email/WhatsApp</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 placeholder:text-outline-variant text-primary font-medium transition-all"
                                            placeholder="hello@company.com"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Service Category</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 text-primary font-medium transition-all appearance-none">
                                            {services.map((s, i) => <option key={i}>{s.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Message/Brief</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 placeholder:text-outline-variant text-primary font-medium transition-all"
                                            placeholder="Tell us about your project requirements..."
                                            rows={4}
                                        ></textarea>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold tracking-tight shadow-xl hover:scale-[0.99] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    type="button"
                                >
                                    Send Brief
                                    <span className="material-symbols-outlined text-sm">send</span>
                                </button>
                            </form>
                        </AnimateIn>
                    </div>
                </div>
            </section>
        </main>
    );
}