"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

interface Props {
    user: {
        uid: string;
        email?: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    };
}

export default function ProfileEditor({ user }: Props) {
    const router = useRouter();
    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [displayName, setDisplayName] = useState(user.displayName || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage({ type: "", text: "" });

            const response = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, displayName }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Update failed");

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setDisplayName(data.displayName);
            router.refresh();
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences.</p>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your name and public display name.</CardDescription>
                </CardHeader>
                <CardContent>
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                            message.type === "success" 
                                ? "bg-green-500/10 border-green-500/30 text-green-400" 
                                : "bg-destructive/10 border-destructive/30 text-destructive-foreground"
                        }`}>
                            {message.type === "success" ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="Choose a public display name"
                            />
                            <p className="text-xs text-muted-foreground ml-1">This is the name that will be shown to other users. Offensive words are filtered.</p>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <Button type="submit" isLoading={loading} className="w-full md:w-auto min-w-[140px]">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="text-lg">Account Details</CardTitle>
                    <CardDescription>Non-editable technical information.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">Email Address</span>
                            <span className="text-sm font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">User ID</span>
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{user.uid}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">Account Role</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary">
                                {user.role || "user"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
