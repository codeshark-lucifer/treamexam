import { requireAdmin } from "@/lib/auth/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function ExamCatalogPage() {
    await requireAdmin();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Exam Catalog</h1>
                <p className="text-muted-foreground">Create, edit, and manage exams and questions.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Available Exams</CardTitle>
                    <CardDescription>Manage categories and exam content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground italic">
                        Exam management interface is under development.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
