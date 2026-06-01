import { requireAdmin } from "@/lib/auth/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function AnalyticsPage() {
    await requireAdmin();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Analytics</h1>
                <p className="text-muted-foreground">Detailed usage statistics and performance reports.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Usage</CardTitle>
                    <CardDescription>Visual reports and data exports.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground italic">
                        Analytics dashboard is under development.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
