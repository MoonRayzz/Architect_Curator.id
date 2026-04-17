// app\(public)\services\page.tsx
"use client";

import { useEffect, useState } from "react";
import AnimateIn from "@/components/shared/AnimateIn";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ServiceItem {
    title: string;
    icon: string;
    description: string;
    tags: string[];
    imageUrl: string;
}

// State untuk form contact
interface ContactForm {
    name: string;
    email: string;
    category: string;
    message: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function ServicesPage() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE CONTACT FORM ---
    const [formData, setFormData] = useState<ContactForm>({
        name: "",
        email: "",
        category: "",
        message: "",
    });
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const docRef = doc(db, "portfolio_content", "services");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().items) {
                    const items = docSnap.data().items as ServiceItem[];
                    setServices(items);
                    // Set default category dari service pertama
                    if (items.length > 0) {
                        setFormData(prev => ({ ...prev, category: items[0].title }));
                    }
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    // --- HANDLER FORM ---
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- VALIDASI SEDERHANA ---
    const validateForm = (): string | null => {
        if (!formData.name.trim()) return "Nama tidak boleh kosong.";
        if (!formData.email.trim()) return "Email/WhatsApp tidak boleh kosong.";
        if (!formData.message.trim()) return "Pesan tidak boleh kosong.";
        if (formData.message.trim().length < 10) return "Pesan terlalu singkat (minimal 10 karakter).";
        return null;
    };

    // --- SUBMIT KE FIRESTORE ---
    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setErrorMsg(validationError);
            setSubmitStatus("error");
            return;
        }

        setSubmitStatus("loading");
        setErrorMsg("");

        try {
            await addDoc(collection(db, "messages"), {
                name: formData.name.trim(),
                email: formData.email.trim(),
                category: formData.category,
                message: formData.message.trim(),
                createdAt: serverTimestamp(),
            });

            setSubmitStatus("success");
            // Reset form setelah sukses
            setFormData({
                name: "",
                email: "",
                category: services.length > 0 ? services[0].title : "",
                message: "",
            });
        } catch (error) {
            console.error("Error sending message:", error);
            setErrorMsg("Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung.");
            setSubmitStatus("error");
        }
    };

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
                        const isLarge = (index % 4 === 0 || index % 4 === 3);
                        const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
                        const isPrimaryTheme = index === 1;

                        return (
                            <div key={index} className={colSpan}>
                                <AnimateIn delay={0.1 * (index % 3)} direction="up">
                                    <div className={`group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full flex flex-col ${isPrimaryTheme
                                        ? 'bg-primary-container text-on-primary'
                                        : 'bg-surface-container-lowest border border-outline-variant/10 shadow-sm'
                                        }`}>

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

            {/* ============================================
                Contact / Hire Me Section — FULLY FUNCTIONAL
                ============================================ */}
            <section className="max-w-5xl mx-auto" id="contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    {/* Info Kiri */}
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

                    {/* Form Kanan */}
                    <div className="bg-surface-container-low p-8 rounded-xl shadow-sm border border-outline-variant/10">
                        <AnimateIn delay={0.2} direction="left">

                            {/* SUCCESS STATE */}
                            {submitStatus === "success" ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-primary font-headline">Pesan Terkirim!</h3>
                                    <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                                        Terima kasih telah menghubungi kami. Kami akan merespons dalam waktu 24 jam.
                                    </p>
                                    <button
                                        onClick={() => setSubmitStatus("idle")}
                                        className="mt-4 px-6 py-2.5 border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                                    >
                                        Kirim Pesan Lain
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* ERROR BANNER */}
                                    {submitStatus === "error" && errorMsg && (
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-error-container text-on-error-container text-sm font-medium">
                                            <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
                                            <span>{errorMsg}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Nama */}
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                                                Full Name <span className="text-error">*</span>
                                            </label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 placeholder:text-outline-variant text-primary font-medium transition-all outline-none"
                                                placeholder="John Architect"
                                                type="text"
                                            />
                                        </div>

                                        {/* Email / WhatsApp */}
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                                                Email / WhatsApp <span className="text-error">*</span>
                                            </label>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 placeholder:text-outline-variant text-primary font-medium transition-all outline-none"
                                                placeholder="hello@company.com"
                                                type="text"
                                            />
                                        </div>

                                        {/* Service Category */}
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                                                Service Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 text-primary font-medium transition-all appearance-none outline-none"
                                            >
                                                {services.map((s, i) => (
                                                    <option key={i} value={s.title}>{s.title}</option>
                                                ))}
                                                {services.length === 0 && (
                                                    <option value="General Inquiry">General Inquiry</option>
                                                )}
                                            </select>
                                        </div>

                                        {/* Pesan */}
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                                                Message / Brief <span className="text-error">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border-none focus:ring-2 focus:ring-tertiary-fixed-dim/30 placeholder:text-outline-variant text-primary font-medium transition-all outline-none resize-none"
                                                placeholder="Tell us about your project requirements..."
                                                rows={4}
                                            />
                                            <p className="text-[10px] text-outline mt-1 text-right">
                                                {formData.message.length} karakter
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitStatus === "loading"}
                                        className={`w-full py-4 rounded-xl font-bold tracking-tight shadow-xl transition-all flex items-center justify-center gap-2 ${
                                            submitStatus === "loading"
                                                ? "bg-primary/50 cursor-not-allowed text-white"
                                                : "bg-gradient-to-r from-primary to-primary-container text-white hover:scale-[0.99] active:scale-95"
                                        }`}
                                    >
                                        {submitStatus === "loading" ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                Send Brief
                                                <span className="material-symbols-outlined text-sm">send</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </AnimateIn>
                    </div>
                </div>
            </section>
        </main>
    );
}