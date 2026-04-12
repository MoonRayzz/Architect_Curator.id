import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Showcase",
  description: "Eksplorasi kumpulan studi kasus, arsitektur sistem, dan inovasi digital yang telah kami bangun.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}