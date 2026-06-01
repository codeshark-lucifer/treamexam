import { requireAdmin } from "@/lib/auth/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function SecurityLogsPage() {
    await requireAdmin();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Security Logs</h1>
                <p className="text-muted-foreground">Monitor system access and security-related events.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Audit Trail</CardTitle>
                    <CardDescription>Recent security events and access logs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground italic">
                        Security logging interface is under development.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
