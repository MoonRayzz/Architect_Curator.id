import { Metadata, ResolvingMetadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// PERBAIKAN 1: Sesuaikan tipe Props agar Next.js tahu ini adalah Promise
type Props = {
    params: Promise<{ id: string }>;
};

// Fungsi ini berjalan di server Next.js sebelum halaman dirender
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // PERBAIKAN 2: Kita harus "menunggu" (await) params terbuka sebelum mengambil .id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { title: "Project Not Found" };
        }

        const data = docSnap.data();

        // Logika ambil gambar (prioritaskan array, jika tidak ada pakai data lama)
        const coverImage = (data.imageUrls && data.imageUrls.length > 0)
            ? data.imageUrls[0]
            : (data.imageUrl || "");

        // Potong deskripsi agar tidak error di Google (maks 160 karakter)
        const cleanDescription = data.description?.substring(0, 150) + "...";

        return {
            title: data.title,
            description: cleanDescription,
            openGraph: {
                title: data.title,
                description: cleanDescription,
                images: [
                    {
                        url: coverImage,
                        width: 1200, // Standar resolusi HD untuk WhatsApp/LinkedIn
                        height: 630,
                        alt: data.title,
                    },
                ],
                type: "article",
            },
            twitter: {
                card: "summary_large_image",
                title: data.title,
                description: cleanDescription,
                images: [coverImage],
            },
        };
    } catch (error) {
        return { title: "Project Detail" };
    }
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}