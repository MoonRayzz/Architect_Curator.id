// app/robots.ts
// Robots.txt untuk Next.js App Router
// Ref: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

import { MetadataRoute } from "next";

const BASE_URL = "https://architect-curator.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Semua crawler boleh akses semua halaman publik
        userAgent: "*",
        allow: "/",
        // Blokir halaman admin & API dari crawler
        disallow: ["/admin", "/admin/", "/api/", "/login"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
