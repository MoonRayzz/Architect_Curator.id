"use client";

import { useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function VisitorTracker() {
    useEffect(() => {
        const trackVisit = async () => {
            // Gunakan sessionStorage agar 1 pengunjung/tab tidak dihitung berkali-kali saat di-refresh
            if (sessionStorage.getItem("has_visited")) return;

            try {
                // Mengambil data lokasi pengunjung secara real-time via IP (Gratis & Aman)
                const response = await fetch("https://ipapi.co/json/");
                const geoData = await response.json();

                // Simpan data kunjungan asli ke Firestore
                await addDoc(collection(db, "visits"), {
                    country: geoData.country_name || "Unknown",
                    city: geoData.city || "Unknown",
                    ip: geoData.ip || "Unknown",
                    visitedAt: serverTimestamp(),
                });

                // Tandai bahwa sesi ini sudah direkam
                sessionStorage.setItem("has_visited", "true");
            } catch (error) {
                console.error("Gagal merekam data kunjungan:", error);
            }
        };

        trackVisit();
    }, []);

    return null; // Komponen ini tidak merender apa pun di layar (tak terlihat)
}