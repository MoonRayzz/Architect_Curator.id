import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: 'swap' });

export const metadata: Metadata = {
  // WAJIB: Ganti dengan domain Vercel Anda agar OpenGraph (Gambar Sosmed) bekerja
  metadataBase: new URL('https://architect-curator.vercel.app'), 
  title: {
    default: "ArchitectCurator | Digital Precision & Software Engineering",
    template: "%s | ArchitectCurator" // Otomatis menambahkan "| ArchitectCurator" di belakang judul halaman lain
  },
  description: "Portfolio of I Made Aris Danuarta - Professional Software Engineer specializing in Mobile Apps & Web Development.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "ArchitectCurator",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Implementasi verifikasi Google Search Console yang benar di Next.js App Router
  verification: {
    google: "tGznE5rNerGCz4Ga_DVEk8bRQkBwY6QuR0v1A9XzaqM",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block" />
      </head>
      <body className="antialiased selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}