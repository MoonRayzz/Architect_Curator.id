import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
// Menggunakan @/ agar aman dari error relative path
import { AuthProvider } from "@/context/AuthContext";

// Mengatur font Inter (Body)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// Mengatur font Manrope (Headline)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ArchitectCurator | Digital Precision",
  description: "Portfolio of Digital Architect and Software Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        {/* PERBAIKAN: Mengubah display=optional menjadi display=block agar ikon wajib di-render */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block" />
      </head>
      <body className="antialiased selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
        {/* AuthProvider membungkus seluruh aplikasi di sini */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}