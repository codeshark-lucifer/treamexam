import { getCurrentUser } from "@/lib/auth/server";
import LogoutButton from "@/lib/auth/LogoutButton";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        User Dashboard
                    </h1>
                    <div className="flex gap-4">
                        <Link href="/user/profile" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                            Profile
                        </Link>
                        {user.role === "admin" && (
                            <Link href="/admin/dashboard" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                                Admin Panel
                            </Link>
                        )}
                        <LogoutButton />
                    </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-xl font-semibold mb-4">Welcome back, {user.displayName || "User"}!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                            <h3 className="text-slate-400 text-sm font-medium uppercase">Email</h3>
                            <p className="text-lg">{user.email}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                            <h3 className="text-slate-400 text-sm font-medium uppercase">Role</h3>
                            <p className="text-lg capitalize">{user.role || "user"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
