"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavBar() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Profile", path: "/profile" },
        { name: "Projects", path: "/projects" },
        { name: "Services", path: "/services" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                <Link href="/" className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 uppercase font-headline">
                    ArchitectCurator
                </Link>

                <div className="hidden md:flex space-x-8">
                    {navLinks.map((link) => {
                        const isActive =
                            link.path === "/"
                                ? pathname === "/"
                                : pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`pb-1 font-manrope tracking-tight text-sm font-semibold uppercase transition-colors duration-300 ${isActive
                                        ? "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <Link href="/services#contact">
                    <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight hover:scale-95 transition-transform duration-200">
                        Get in Touch
                    </button>
                </Link>
            </div>
        </nav>
    );
}