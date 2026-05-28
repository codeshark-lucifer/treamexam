import { requireUser } from "@/lib/auth/server";
import LogoutButton from "@/lib/auth/LogoutButton";
import Link from "next/link";

export default async function ProfilePage() {
    const user = await requireUser();

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        Your Profile
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                            Dashboard
                        </Link>
                        <LogoutButton />
                    </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {user.displayName || "User"}
                            </h2>
                            <p className="text-slate-400">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">UID</label>
                                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 font-mono text-sm">
                                    {user.uid}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Account Role</label>
                                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 capitalize">
                                    {user.role || "User"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Authentication Provider</label>
                                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                                    {user.firebase.sign_in_provider}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Account Created</label>
                                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                                    {new Date(user.auth_time * 1000).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
