// next.config.ts
// Fix #5: Tambah remotePatterns agar next/image bisa load dari Cloudinary & Google
// Fix Turbopack: gunakan webpack (stable) — jalankan dengan "next dev" biasa

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            // Cloudinary — untuk semua gambar yang diupload via admin
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            // Google (lh3) — untuk gambar placeholder lama
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
        ],
    },

    // Matikan header X-Powered-By untuk security
    poweredByHeader: false,
};

export default nextConfig;