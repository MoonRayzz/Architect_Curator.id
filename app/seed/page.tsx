"use client";

import { useState } from "react";
import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 1. Data Dummy Projects
const dummyProjects = [
    {
        title: "Nexus Core Enterprise Dashboard",
        category: "IoT",
        tags: ["IoT", "Enterprise"],
        techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "MQTT", "PostgreSQL"],
        githubUrl: "https://github.com",
        demoUrl: "https://demo.com",
        description: "Nexus Core is a sophisticated IoT orchestration platform built for high-scale industrial monitoring. The challenge was to visualize over 10,000 concurrent data points from sensors across three continents without compromising interface responsiveness.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIjl8nVjHyNIeQ3d4_AUY4jf1kGR3TJizR7mZmHpDbapi-l1u2kcbiWS9zWnK2gswJoHHbSN6K-PyoV4ls-9LJaCO_sz2RZfdE3aoIZ319Dhk7QgWLWLSCfavEO2jsVUPwJ57gm8zG4Tta9n56KwY76a-f_O3t90Lp3u4K6x5bEqQO0R3WCdkxA1IQ8ddFjaAF8NgSeoRhgGS2Svc77gPZjsSH9LRKjL-LEeoMRVVB7jTi3gpQPxf2fbSr96jqR4Ti-jPsxa-Ywow",
        detailImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-idwyZPYrLKEmTTS5nD0YZiNhR3AWyBU1abbj6IJIowbIdTwm_SgyAANr6P-UCxGo_VKO8rRfH75DglWXp5UdVZ7YI7ABIp0zYMdvGpG-y0xBtTa17Bf5lLL5gv1hEiJ7MuQuSZ2o9Riu_9igpCEuWCUVW3iuDNkexY-OJhxfAhNBLU_2o34WlNyMN44kqBGiKWPm3gmpxDSFrAItMiusjxPNILihcEMrr4VJJA_dR2c_zr3fGfq3XxH_wOiSdo47VFIJXmbbH4A",
        featured: true,
    },
    {
        title: "ArchiScan Mobile",
        category: "Mobile App",
        tags: ["Mobile App"],
        techStack: ["Flutter", "Dart", "Firebase"],
        githubUrl: "https://github.com",
        demoUrl: "https://demo.com",
        description: "Aplikasi mobile untuk memindai struktur arsitektur menggunakan teknologi AR dan kamera smartphone secara real-time.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIwFMDgOGfqUCWQw4NuqLjcpLovqQ04WxtRy0_NM54eNgosOlTr3qh6if7czn7gZgmQzqiIrREZuP1NVAICdJcarYEr5cXHZsXUkSa7A5QnwleBERH1Mb4I5rlbqfje8mrUYscNxf7uDoKWz7S7LZBAOfmMu4sdZNKyVLmHJ91awh4AfUJ_zhXEPtQD9ner-UaBiEus-LTBlX68OdzqpE89zqXf9j3tX0Rpt99ZXLECH0pKkyc2cgsVxHGcWwDAb4CZG4In3kskOI",
        detailImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIwFMDgOGfqUCWQw4NuqLjcpLovqQ04WxtRy0_NM54eNgosOlTr3qh6if7czn7gZgmQzqiIrREZuP1NVAICdJcarYEr5cXHZsXUkSa7A5QnwleBERH1Mb4I5rlbqfje8mrUYscNxf7uDoKWz7S7LZBAOfmMu4sdZNKyVLmHJ91awh4AfUJ_zhXEPtQD9ner-UaBiEus-LTBlX68OdzqpE89zqXf9j3tX0Rpt99ZXLECH0pKkyc2cgsVxHGcWwDAb4CZG4In3kskOI",
        featured: false,
    },
    {
        title: "Portfolio OS",
        category: "Web",
        tags: ["Web"],
        techStack: ["React", "JavaScript", "Tailwind"],
        githubUrl: "https://github.com",
        demoUrl: "https://demo.com",
        description: "Dark mode web design for architectural firm portfolio featuring high-contrast photography and minimalist grid layout.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZAoGjl6BBlCVhg41SsUG8pJ5G6zfpAmi62XXyj6Kl_1E4jXn4fwDDAhg5nkuKUgnNjPoiyb4BQNGknr2cBxlY8ba6JZhR15X31FcVW1DbJOgzcKkHb8q3t0zAgzd75KtlFe2j2o70beQqynopmn6EdIJv4TfRO-Uw7362RVGcI3SV4lLMuUDn2B5AEYe6Xa8mi7T9xzs53OPirpqHd1VuxjrsfIbMhJuh4zxW_7PPeQiTG9NjU_5SKvJG4DjGrExKmry1XzEP98",
        detailImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZAoGjl6BBlCVhg41SsUG8pJ5G6zfpAmi62XXyj6Kl_1E4jXn4fwDDAhg5nkuKUgnNjPoiyb4BQNGknr2cBxlY8ba6JZhR15X31FcVW1DbJOgzcKkHb8q3t0zAgzd75KtlFe2j2o70beQqynopmn6EdIJv4TfRO-Uw7362RVGcI3SV4lLMuUDn2B5AEYe6Xa8mi7T9xzs53OPirpqHd1VuxjrsfIbMhJuh4zxW_7PPeQiTG9NjU_5SKvJG4DjGrExKmry1XzEP98",
        featured: false,
    },
    {
        title: "Cloud Layer Protocol",
        category: "Backend",
        tags: ["DevOps", "Backend"],
        techStack: ["Node.js", "Docker", "AWS"],
        githubUrl: "https://github.com",
        demoUrl: "https://demo.com",
        description: "Custom server orchestration middleware designed for low-latency distribution across edge nodes.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9iIR948fYoYLy87Cq4nINX72CNV5PfSKYN2XJ6FkpykesFkvErZS5GBBKcb46W3HWenBkxqWPn2rTW2C6eO5KQI7qylQZ6p6bMapmr1GlVp_8nvwFmdxuP88ujhJZL7_VgGqTZ-H4a6gWgtEwNk0oh-rv3BvwaTDmFEDx-Ll_pp214gLApF7DMShKICRVNfAcUuYEgKOn0xVw9285FiJM7IeQXvgHvsOA636y1Xn_a2Br85td76D-CxHqug12sgkdjDEH_fbOznY",
        detailImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9iIR948fYoYLy87Cq4nINX72CNV5PfSKYN2XJ6FkpykesFkvErZS5GBBKcb46W3HWenBkxqWPn2rTW2C6eO5KQI7qylQZ6p6bMapmr1GlVp_8nvwFmdxuP88ujhJZL7_VgGqTZ-H4a6gWgtEwNk0oh-rv3BvwaTDmFEDx-Ll_pp214gLApF7DMShKICRVNfAcUuYEgKOn0xVw9285FiJM7IeQXvgHvsOA636y1Xn_a2Br85td76D-CxHqug12sgkdjDEH_fbOznY",
        featured: true,
    },
    {
        title: "SmartCampus Hub",
        category: "IoT",
        tags: ["IoT", "EdTech"],
        techStack: ["Next.js", "Python", "IoT Hub"],
        githubUrl: "https://github.com",
        demoUrl: "https://demo.com",
        description: "Sistem manajemen fasilitas kampus terintegrasi dengan sensor IoT untuk efisiensi energi hingga 30%.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdAv4Kt1APihSbYwGCNKU6r7U8Xi43AF6YguASbg0iC9VXm3afiqWPcWLyW0xfAcgTUmkR5y5jU6dKnzm98MqYovy1jFXwozgYNXWqGR_4_7PaAbKZ-4IX8srw3ClzlpitHhacKZDgaaSboET3aueBMyH6xNb_RTHP-4hXWZnqzmvhwEdQcxVNQK9aLvJrAlXUz6w2ebU7yTxCREC_8MJUA_EqXZOyYy4dZuQC8PTjqca-Yv3YF2j0TDVF9KAK9YR4OMpLMtyk6_Q",
        detailImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdAv4Kt1APihSbYwGCNKU6r7U8Xi43AF6YguASbg0iC9VXm3afiqWPcWLyW0xfAcgTUmkR5y5jU6dKnzm98MqYovy1jFXwozgYNXWqGR_4_7PaAbKZ-4IX8srw3ClzlpitHhacKZDgaaSboET3aueBMyH6xNb_RTHP-4hXWZnqzmvhwEdQcxVNQK9aLvJrAlXUz6w2ebU7yTxCREC_8MJUA_EqXZOyYy4dZuQC8PTjqca-Yv3YF2j0TDVF9KAK9YR4OMpLMtyk6_Q",
        featured: true,
    },
    {
        title: "EduSync Enterprise",
        category: "Web App",
        tags: ["Web App", "Education"],
        techStack: ["React", "Node.js", "PostgreSQL"],
        githubUrl: "https://github.com",
        demoUrl: "https://demo.com",
        description: "Platform pelatihan karyawan modular yang digunakan oleh 3 perusahaan multinasional di Asia Tenggara.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9Hn5nuWfHTmQh8m163C6R_6ZeDYUFxqQS5hSCmlH07h072h54mIajCZNJsqNMHKD673Uw3PCsKkBNSdNtj3_0-mLZtJWu50LWssFznIQZ4Z79lerfQVcoQbgHGpgNlUifrMaKY2ntxCHHfvQdNPHbeZSZYunIPfxxz6dnUxnSID8PRIOO1YvXK3zJ70sxQjrIcUKWy1zjAMxh7tmQ1fPivsPsXIzElRBYu7qOMgSorFBHBIi3W99CLOx_QbZbEe7sKB5qC8fPX1M",
        detailImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9Hn5nuWfHTmQh8m163C6R_6ZeDYUFxqQS5hSCmlH07h072h54mIajCZNJsqNMHKD673Uw3PCsKkBNSdNtj3_0-mLZtJWu50LWssFznIQZ4Z79lerfQVcoQbgHGpgNlUifrMaKY2ntxCHHfvQdNPHbeZSZYunIPfxxz6dnUxnSID8PRIOO1YvXK3zJ70sxQjrIcUKWy1zjAMxh7tmQ1fPivsPsXIzElRBYu7qOMgSorFBHBIi3W99CLOx_QbZbEe7sKB5qC8fPX1M",
        featured: true,
    }
];

// 2. Data Dummy Profile
const dummyProfile = {
    headline: "Digital Architect.",
    bio: "With a decade spent at the intersection of structural design and digital logic, I curate experiences that bridge physical intent with digital execution. My background in architecture fuels my approach to UI/UX—focusing on circulation, scale, and the fundamental beauty of functional systems.",
    location: "San Francisco, CA",
    status: "Available for Projects",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuClHWpd3Kuw8aFKFWu_Wt_wAlyzlPFeR6RNqGkNoQNBh8hp9Uzz0UgvU4GqQdTP43Qr86SdlFuSPOrH3x5whCnAQ2WVPRoG7HQM-BHQ0r0AiQHFveFcb9QILB1h6Wsr1ZQYHJeNUkCMS09aSD22rImfZGlNED7gw87xhAcX4QGsiIq8607bwgq2D8toRupPAufrOEbJ8pMvn7vhTy6CYt5aUsdt_16FAA2nlEW_-09cy0F-3kNZ8KConjtAEObNFanhmLZMvdj9qMc",
    skills: [
        { category: "Mobile", icon: "smartphone", tools: ["Flutter", "Dart"] },
        { category: "Web", icon: "language", tools: ["React/Next.js", "HTML/CSS"] },
        { category: "Backend", icon: "database", tools: ["Firebase", "MySQL", "PostgreSQL"] },
        { category: "Others", icon: "hub", tools: ["IoT", "SEO"] }
    ],
    milestones: [
        { year: "2023 - Present", title: "Senior Product Architect", desc: "Leading design-system strategy for IoT infrastructures." },
        { year: "2021", title: "Google Cloud Professional", desc: "Cloud Architecture & Infrastructure certification." },
        { year: "2018", title: "Masters in Digital Design", desc: "Focused on Computational Architecture & VR systems." }
    ]
};

// 3. Data Dummy Services
const dummyServices = {
    items: [
        {
            title: "Web Company Profile",
            icon: "language",
            description: "Premium digital representations of your brand identity. We craft high-performance, responsive websites that serve as your global architectural flagship.",
            tags: ["Next.js", "Editorial UI"],
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHxpCn2a58kwAwnNXySgj1CeQDNzHsoLwZTprUo_RNNJIv8T-rsd3Qz4SfzU5SWQsSLUxPJ5rXSAZLvBp60pfVU22YFxy44EE_muHI6jVhalPkDAnDRr3_BfR_Jo97oQoNCK8htQNT-qh8cHWLcaRsxdeB_XgUOSOgNKSF-QYVrgOXS52wQvtzTvVTExM9EGr14jxWWErafWQI1Gz2Qy5V6Q2k773pQgWsAlZH9s5bWJU-TqlC8YAhPT5FiCRokvGOqE5K6e0y-Pg"
        },
        {
            title: "Mobile App Android/iOS",
            icon: "smartphone",
            description: "Native-feel cross-platform experiences. High-fidelity interactions optimized for precision-driven mobile utility.",
            tags: ["Flutter / React Native"],
            imageUrl: ""
        },
        {
            title: "Information System Development",
            icon: "database",
            description: "Custom ERP, CRM, and internal management tools. Engineered for scalability, data integrity, and complex workflow automation.",
            tags: ["Scalable Backend Architecture", "Real-time Data Visualization"],
            imageUrl: ""
        },
        {
            title: "IoT Prototypes",
            icon: "settings_input_component",
            description: "Bridging hardware and software. We build connected ecosystems for smart automation and industrial monitoring.",
            tags: [],
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJBb9MZ8lPugRFx2fFXHLnIcIcBvaHuEy2-NjIllTXuqmpkj2cII8lVSVDBNSxLTWh-WL7VNtHy6HSrPibu9eMtttuqF75prAIt1EkzmAcTpKZ8tAIUuo-ZjX3g3dzXazXRFt2LRbdaSnP2QHeFy2t2hU0x-4gqdgFZDOLBX9DAXz_gifRwzj56JE3cUxUu5LBcPZ4p0u9pHZ97y-fIuUvzWxCe8DooznJHPHqOIpsf6dsYZtZGd1wbi48d8Z1knNp6ns0VX4Mjd0"
        }
    ]
};

export default function SeedPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleSeedData = async () => {
        setIsLoading(true);
        setStatus("Memulai proses seeding ke Firebase...");

        try {
            // 1. Seed Projects
            setStatus("Seeding Projects...");
            for (const project of dummyProjects) {
                await addDoc(collection(db, "projects"), {
                    ...project,
                    createdAt: serverTimestamp(),
                });
            }

            // 2. Seed Profile
            setStatus("Seeding Profile...");
            // Kita pakai setDoc agar ID dokumennya spesifik ("profile") dan mudah dipanggil
            await setDoc(doc(db, "portfolio_content", "profile"), {
                ...dummyProfile,
                updatedAt: serverTimestamp()
            });

            // 3. Seed Services
            setStatus("Seeding Services...");
            await setDoc(doc(db, "portfolio_content", "services"), {
                ...dummyServices,
                updatedAt: serverTimestamp()
            });

            setStatus("✅ BERHASIL! Seluruh data Projects, Profile, dan Services sudah masuk ke Firebase.");
        } catch (error) {
            console.error("Error seeding data:", error);
            setStatus("❌ GAGAL! Terjadi kesalahan. Cek console log.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface p-8">
            <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl shadow-xl text-center border border-outline-variant/20">
                <h1 className="text-2xl font-bold font-headline mb-4 text-primary">Master Database Seeder</h1>
                <p className="text-on-surface-variant text-sm mb-8">
                    Proses ini akan memindahkan data <b>Projects, Profile, dan Services</b> ke Firestore secara otomatis. Klik satu kali saja.
                </p>

                <button
                    onClick={handleSeedData}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all ${isLoading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary-container"
                        }`}
                >
                    {isLoading ? "Memproses Data..." : "Tanam Semua Data"}
                </button>

                {status && (
                    <div className="mt-6 p-4 rounded-lg bg-surface-container-low font-medium text-sm border border-outline-variant/10">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}