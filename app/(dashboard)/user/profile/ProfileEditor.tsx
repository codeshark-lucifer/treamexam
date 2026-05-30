"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/translate";

interface Props {
    user: {
        uid: string;
        email?: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        totalExams?: number;
        totalScore?: number;
    };
}

export default function ProfileEditor({ user }: Props) {
    const router = useRouter();
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [displayName, setDisplayName] = useState(user.displayName || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage({ type: "", text: "" });

            const response = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, displayName }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Update failed");

            setMessage({ type: "success", text: t.profile.successUpdate });
            setDisplayName(data.displayName);
            router.refresh();
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--line)] shadow-sm flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center text-4xl shadow-inner shrink-0 border-4 border-white shadow-md">
                    <i className="fa-solid fa-user"></i>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-[var(--primary)]">{t.profile.settings}</h1>
                    <p className="text-[var(--muted)] mt-1 font-medium">{t.profile.manageAccount}</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Editor */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[var(--line)] bg-[var(--secondary)]/30">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <i className="fa-solid fa-id-card text-[var(--primary)]"></i>
                                {t.profile.personalInfo}
                            </h2>
                            <p className="text-xs text-[var(--muted)] mt-1">{t.profile.updateName}</p>
                        </div>
                        
                        <div className="p-6">
                            {message.text && (
                                <div className={`mb-6 p-4 rounded-[var(--radius)] border-2 flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
                                    message.type === "success" 
                                        ? "bg-green-50 border-green-200 text-green-700" 
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}>
                                    <i className={`fa-solid ${message.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"} text-xl`}></i>
                                    <span className="font-bold">{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest ml-1">{t.profile.firstName}</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full rounded-[var(--radius)] bg-white border-2 border-[var(--line)] px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all font-bold text-[var(--ink)]"
                                            placeholder={t.profile.firstName}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest ml-1">{t.profile.lastName}</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full rounded-[var(--radius)] bg-white border-2 border-[var(--line)] px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all font-bold text-[var(--ink)]"
                                            placeholder={t.profile.lastName}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-[var(--muted)] uppercase tracking-widest ml-1">{t.profile.displayName}</label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full rounded-[var(--radius)] bg-white border-2 border-[var(--line)] px-4 py-3 focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all font-bold text-[var(--ink)]"
                                        placeholder={t.profile.displayName}
                                    />
                                    <p className="text-[10px] text-[var(--muted)] ml-1 font-bold italic">{t.profile.displayNameNote}</p>
                                </div>

                                <div className="pt-4 border-t border-[var(--line)] flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className={`px-8 py-3 rounded-[var(--radius)] font-black text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 ${
                                            loading ? 'bg-[var(--muted)] opacity-50 cursor-not-allowed' : 'bg-[var(--primary)] shadow-[var(--primary)]/20 hover:-translate-y-1'
                                        }`}
                                    >
                                        {loading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                                        <i className="fa-solid fa-floppy-disk"></i>
                                        {t.profile.saveChanges}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className="space-y-8">
                    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[var(--line)] bg-[var(--secondary)]/30">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <i className="fa-solid fa-shield-halved text-[var(--primary)]"></i>
                                {t.profile.accountDetails}
                            </h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-1">{t.profile.email}</p>
                                <p className="font-bold text-[var(--ink)] break-all">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-1">{t.profile.userId}</p>
                                <p className="text-[11px] font-mono bg-[var(--line)]/30 px-2 py-1 rounded inline-block text-[var(--muted)]">{user.uid}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mb-1">{t.profile.role}</p>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[var(--secondary)] text-[var(--primary)] border border-[var(--primary)]/20">
                                    {user.role || "user"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--primary)] p-6 rounded-[var(--radius)] text-white shadow-lg relative overflow-hidden">
                         <i className="fa-solid fa-medal absolute -right-4 -bottom-4 text-7xl opacity-10 rotate-12"></i>
                         <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-chart-simple"></i>
                            ស្ថិតិសង្ខេប / Quick Stats
                         </h3>
                         <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-end border-b border-white/20 pb-2">
                                <span className="text-xs font-bold opacity-80">ការប្រឡងសរុប / Total Exams</span>
                                <span className="text-2xl font-black">{user.totalExams || 0}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold opacity-80">ពិន្ទុរួម / Total Score</span>
                                <span className="text-2xl font-black">{user.totalScore || 0}</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
