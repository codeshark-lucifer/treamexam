import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser() as any;

    if (!user) {
        redirect("/auth/login");
    }

    const userData = {
        email: user.email,
        displayName: user.displayName || user.email?.split("@")[0] || "User",
        role: user.role || "user",
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar user={userData} />
            <main className="flex-1 md:ml-64 transition-all duration-300">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
