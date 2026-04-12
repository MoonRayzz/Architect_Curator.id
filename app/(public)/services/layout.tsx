import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Expertise",
  description: "Daftar layanan profesional kami, mulai dari Web Development, Mobile App, hingga System Architecture.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}