"use client";

import { Button } from "@/components/ui/Button";
import { downloadCSV } from "@/lib/utils/export";
import Link from "next/link";

interface AdminDashboardHeaderProps {
    recentUsers: any[];
    recentResults: any[];
}

export function AdminDashboardHeader({ recentUsers, recentResults }: AdminDashboardHeaderProps) {
    const handleDownloadReports = () => {
        // Prepare data for export
        const userData = recentUsers.map(u => ({
            ID: u.id,
            Name: u.displayName || `${u.firstName} ${u.lastName}`,
            Email: u.email,
            Joined: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : "N/A"
        }));

        const resultData = recentResults.map(r => ({
            ID: r.id,
            User: r.userName,
            Exam: r.examTypeId,
            Score: `${r.score}%`,
            Date: r.timestamp ? new Date(r.timestamp).toLocaleDateString() : "N/A"
        }));

        downloadCSV(userData, `recent_users_${new Date().toISOString().split('T')[0]}.csv`);
        setTimeout(() => {
            downloadCSV(resultData, `recent_results_${new Date().toISOString().split('T')[0]}.csv`);
        }, 500);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Control Center</h1>
                <p className="text-muted-foreground">High-level overview of system and user activity.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadReports}>
                    <i className="fa-solid fa-download mr-2"></i>
                    Download Reports
                </Button>
                <Link href="/admin/settings">
                    <Button size="sm">
                        <i className="fa-solid fa-cog mr-2"></i>
                        System Settings
                    </Button>
                </Link>
            </div>
        </div>
    );
}
