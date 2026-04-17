// ============================================================
// FILE 1: app/api/github-languages/route.ts
// Server-side API route agar GitHub token tidak exposed ke client
// dan mendapat rate limit 5000 req/jam (bukan 60/jam)
// ============================================================

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const repoUrl = searchParams.get("repoUrl");

    if (!repoUrl) {
        return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    // Parse owner dan repo dari URL GitHub
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
        return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const owner = match[1];
    const repo = match[2].replace(".git", "");

    try {
        const headers: HeadersInit = {
            Accept: "application/vnd.github.v3+json",
        };

        // Jika ada GITHUB_TOKEN di .env (opsional), pakai untuk rate limit lebih tinggi
        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/languages`,
            {
                headers,
                // Cache respons di server Next.js selama 1 jam
                next: { revalidate: 3600 },
            }
        );

        if (!res.ok) {
            // Repo private atau tidak ditemukan — kembalikan kosong, jangan crash
            if (res.status === 404 || res.status === 403) {
                return NextResponse.json({});
            }
            return NextResponse.json({ error: "GitHub API error" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("GitHub API fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}