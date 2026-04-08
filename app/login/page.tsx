"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AnimateIn from "@/components/shared/AnimateIn";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const router = useRouter();
    const { user, loading } = useAuth();

    // Jika sudah login, otomatis lempar ke dashboard admin
    useEffect(() => {
        if (!loading && user) {
            router.push("/admin");
        }
    }, [user, loading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin"); // Jika sukses, masuk ke admin
        } catch (err: any) {
            console.error("Login failed:", err);
            setError("Email atau Password salah. Silakan coba lagi.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <AnimateIn delay={0.1} direction="up">
                <div className="bg-surface-container-lowest p-10 md:p-12 rounded-3xl shadow-2xl max-w-md w-full border border-outline-variant/10 relative overflow-hidden">

                    {/* Aksen visual */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-tertiary-fixed-dim"></div>

                    <div className="text-center mb-10">
                        <h1 className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-2">ArchitectCurator</h1>
                        <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Management Suite</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-start gap-3">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all"
                                placeholder="admin@architectcurator.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-tertiary-fixed-dim/50 text-primary font-medium transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${isLoggingIn ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary-container active:scale-[0.98]"
                                }`}
                        >
                            {isLoggingIn ? (
                                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Authenticating...</>
                            ) : (
                                <><span className="material-symbols-outlined text-sm">login</span> Secure Login</>
                            )}
                        </button>
                    </form>
                </div>
            </AnimateIn>
        </div>
    );
}