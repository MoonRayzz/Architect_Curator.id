// app\admin\inbox\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AnimateIn from "@/components/shared/AnimateIn";

interface Message {
    id: string;
    name: string;
    email: string;
    category: string;
    message: string;
    createdAt: any;
}

export default function AdminInboxPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchMessages(); }, []);

    const deleteMessage = async (id: string) => {
        if (confirm("Hapus pesan ini?")) {
            await deleteDoc(doc(db, "messages", id));
            setMessages(messages.filter(m => m.id !== id));
        }
    };

    if (isLoading) return null; // Membiarkan loading.tsx bekerja

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <AnimateIn delay={0.1} direction="down">
                <header className="mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tighter text-primary font-headline">Priority Inbox</h2>
                    <p className="text-on-surface-variant font-medium mt-1">Daftar permintaan konsultasi dari calon klien Anda.</p>
                </header>
            </AnimateIn>

            <div className="grid grid-cols-1 gap-6">
                {messages.length === 0 ? (
                    <div className="p-20 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30">
                        <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">inbox</span>
                        <p className="font-bold text-on-surface-variant">Belum ada pesan masuk.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <AnimateIn key={msg.id} delay={index * 0.05} direction="up">
                            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all relative group">
                                <button
                                    onClick={() => deleteMessage(msg.id)}
                                    className="absolute top-6 right-6 p-2 text-error opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>

                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{msg.name}</h3>
                                        <p className="text-sm font-medium text-tertiary">{msg.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-black uppercase rounded-full tracking-widest">
                                            {msg.category || "General Inquiry"}
                                        </span>
                                        <span className="text-[10px] font-bold text-outline uppercase tracking-tighter">
                                            {msg.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-surface-container-low p-6 rounded-2xl italic text-on-surface-variant text-sm leading-relaxed">
                                    "{msg.message}"
                                </div>
                            </div>
                        </AnimateIn>
                    ))
                )}
            </div>
        </div>
    );
}