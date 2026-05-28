"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/lib/auth/LogoutButton";
import Link from "next/link";

interface Props {
    user: {
        uid: string;
        email?: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    };
}

export default function ProfileEditor({ user }: Props) {
    const router = useRouter();
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

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setDisplayName(data.displayName); // Update with censored name from server
            router.refresh();
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Your Profile</h1>
                    <div className="flex gap-4">
                        <Link href="/user/dashboard" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                            Dashboard
                        </Link>
                        <LogoutButton />
                    </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg border ${
                            message.type === "success" 
                                ? "bg-green-500/10 border-green-500/30 text-green-400" 
                                : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Display Name (Censored)</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Choose a public display name"
                            />
                            <p className="mt-1 text-xs text-slate-500">Offensive words will be automatically censored.</p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-8 py-3 rounded-lg bg-blue-600 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium uppercase mb-2">Account Info</h3>
                            <div className="space-y-1">
                                <p><span className="text-slate-500">Email:</span> {user.email}</p>
                                <p><span className="text-slate-500">UID:</span> <span className="font-mono text-xs">{user.uid}</span></p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium uppercase mb-2">Permissions</h3>
                            <p><span className="text-slate-500">Role:</span> <span className="capitalize">{user.role || "user"}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
