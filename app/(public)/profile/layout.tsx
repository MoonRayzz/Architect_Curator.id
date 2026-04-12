import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile & Journey",
  description: "Pelajari lebih lanjut tentang perjalanan karir, pengalaman, dan teknologi yang kami kuasai.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}