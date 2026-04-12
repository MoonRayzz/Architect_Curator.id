import { Metadata } from "next";
import TopNavBar from "@/components/shared/TopNavBar";
import PublicFooter from "@/components/shared/PublicFooter";

export const metadata: Metadata = {
  title: "Home | ArchitectCurator",
  description: "Selamat datang di ArchitectCurator. Temukan solusi arsitektur digital, web development, dan mobile app terbaik.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
            <TopNavBar />
            <div className="flex-1 pt-24">
                {children}
            </div>
            <PublicFooter />
        </div>
    );
}