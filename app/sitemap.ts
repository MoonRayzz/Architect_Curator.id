// app/sitemap.ts
// Sitemap dinamis untuk Next.js App Router
// Ref: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BASE_URL = "https://architect-curator.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static routes ──────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // ── Dynamic routes: /projects/[id] ─────────────────────────
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const snap = await getDocs(collection(db, "projects"));
    dynamicRoutes = snap.docs.map((doc) => ({
      url: `${BASE_URL}/projects/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    // Jika Firestore gagal (misal build time), tetap lanjut dengan static routes saja
    console.error("[sitemap] Gagal fetch projects:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
