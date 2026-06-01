import { requireAdmin } from "@/lib/auth/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { adminFirestore, adminDatabase } from "@/lib/firebase-admin";
import Link from "next/link";
import { AdminDashboardHeader } from "./AdminDashboardHeader";

export default async function AdminDashboardPage() {
    const user = await requireAdmin();

    // Fetch stats in parallel
    const [
        usersCount,
        resultsCount,
        categoriesSnap,
        examsSnap,
        questionsSnap,
        recentUsersSnap,
        recentResultsSnap
    ] = await Promise.all([
        adminFirestore.collection("users").count().get(),
        adminFirestore.collection("results").count().get(),
        adminDatabase?.ref("data/categories").get(),
        adminDatabase?.ref("data/exams").get(),
        adminDatabase?.ref("data/questions").get(),
        adminFirestore.collection("users").orderBy("updatedAt", "desc").limit(5).get(),
        adminFirestore.collection("results").orderBy("timestamp", "desc").limit(5).get()
    ]);

    const totalUsers = usersCount.data().count;
    const totalResults = resultsCount.data().count;
    const totalCategories = categoriesSnap?.exists() ? Object.keys(categoriesSnap.val()).length : 0;
    const totalExams = examsSnap?.exists() ? Object.keys(examsSnap.val()).length : 0;
    const totalQuestions = questionsSnap?.exists() ? Object.keys(questionsSnap.val()).length : 0;

    const recentUsers = recentUsersSnap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            displayName: data.displayName || null,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            email: data.email || null,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null,
        };
    });

    // Fetch user details for recent results for better display
    const recentResults = await Promise.all(recentResultsSnap.docs.map(async (doc) => {
        const data = doc.data();
        const userDoc = await adminFirestore.collection("users").doc(data.userId).get();
        const userData = userDoc.data();
        return {
            id: doc.id,
            userId: data.userId,
            examTypeId: data.examTypeId,
            score: data.score,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : null,
            userName: userData?.displayName || (userData?.firstName ? `${userData.firstName} ${userData.lastName}` : "Unknown User")
        };
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AdminDashboardHeader recentUsers={recentUsers} recentResults={recentResults} />

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <i className="fa-solid fa-users text-primary"></i>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Registered students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exam Attempts</CardTitle>
                        <i className="fa-solid fa-file-invoice text-muted-foreground"></i>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalResults.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Completed assessments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Content Library</CardTitle>
                        <i className="fa-solid fa-database text-muted-foreground"></i>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalQuestions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{totalExams} Exams in {totalCategories} Categories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Healthy</div>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Results */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Exam Results</CardTitle>
                        <CardDescription>Latest student performances across all categories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentResults.map((result: any) => (
                                <div key={result.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">{result.userName}</p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {result.examTypeId.replace("-", " ")} • {result.timestamp ? new Date(result.timestamp).toLocaleDateString() : "Recently"}
                                        </p>
                                    </div>
                                    <div className={`text-lg font-black ${result.score >= 80 ? "text-green-500" : result.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                                        {result.score}%
                                    </div>
                                </div>
                            ))}
                            {recentResults.length === 0 && (
                                <p className="text-center py-4 text-sm text-muted-foreground italic">No recent results found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>New Registrations</CardTitle>
                        <CardDescription>Most recently joined students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers.map((u: any) => (
                                <div key={u.id} className="flex items-center gap-3 p-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {(u.displayName || u.firstName || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{u.displayName || `${u.firstName} ${u.lastName}`}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : "N/A"}
                                    </div>
                                </div>
                            ))}
                            {recentUsers.length === 0 && (
                                <p className="text-center py-4 text-sm text-muted-foreground italic">No new users yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Management Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Management Actions</CardTitle>
                    <CardDescription>Quick access to administrative tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/admin/users" className="flex flex-col items-start p-4 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all group">
                            <span className="p-2 rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <i className="fa-solid fa-user-gear"></i>
                            </span>
                            <span className="font-bold">User Management</span>
                            <span className="text-xs text-muted-foreground">Edit roles and permissions</span>
                        </Link>
                        <Link href="/admin/exams" className="flex flex-col items-start p-4 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all group">
                            <span className="p-2 rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <i className="fa-solid fa-layer-group"></i>
                            </span>
                            <span className="font-bold">Exam Catalog</span>
                            <span className="text-xs text-muted-foreground">Create and manage exams</span>
                        </Link>
                        <Link href="/admin/analytics" className="flex flex-col items-start p-4 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all group">
                            <span className="p-2 rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <i className="fa-solid fa-chart-line"></i>
                            </span>
                            <span className="font-bold">Analytics</span>
                            <span className="text-xs text-muted-foreground">Detailed usage statistics</span>
                        </Link>
                        <Link href="/admin/logs" className="flex flex-col items-start p-4 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all group">
                            <span className="p-2 rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <i className="fa-solid fa-shield-halved"></i>
                            </span>
                            <span className="font-bold">Security Logs</span>
                            <span className="text-xs text-muted-foreground">Monitor system access</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
