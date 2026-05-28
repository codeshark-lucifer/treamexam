import { requireAdmin } from "@/lib/auth/server";
import LogoutButton from "@/lib/auth/LogoutButton";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const user = await requireAdmin();

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        Admin Dashboard
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/user/dashboard" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                            User View
                        </Link>
                        <LogoutButton />
                    </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">
                        Welcome, Administrator
                    </h2>
                    
                    <div className="space-y-2">
                        <p>
                            <span className="font-semibold text-slate-400">
                                UID:
                            </span>{" "}
                            {user.uid}
                        </p>

                        <p>
                            <span className="font-semibold text-slate-400">
                                Email:
                            </span>{" "}
                            {user.email}
                        </p>

                        <p>
                            <span className="font-semibold text-slate-400">
                                Role:
                            </span>{" "}
                            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">
                                {user.role}
                            </span>
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <h3 className="text-lg font-medium mb-4">Admin Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors cursor-not-allowed opacity-50">
                                <h4 className="font-bold mb-1">User Management</h4>
                                <p className="text-sm text-slate-400">View and manage all registered users.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors cursor-not-allowed opacity-50">
                                <h4 className="font-bold mb-1">System Logs</h4>
                                <p className="text-sm text-slate-400">Check application activity and errors.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
