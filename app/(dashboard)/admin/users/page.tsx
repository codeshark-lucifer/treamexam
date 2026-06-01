import { requireAdmin } from "@/lib/auth/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function UserManagementPage() {
    await requireAdmin();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts, roles, and permissions.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users List</CardTitle>
                    <CardDescription>A list of all registered users in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground italic">
                        User management interface is under development.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
