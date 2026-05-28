"use client";

import Link from "next/link";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { login, loginGoogle } from "@/lib/auth/client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

interface Props {
    params: Promise<{
        mode: string;
    }>;
}

function getFirebaseError(error: any) {
    switch (error?.code) {
        case "auth/email-already-in-use": return "Email already exists";
        case "auth/user-not-found": return "User not found";
        case "auth/wrong-password": return "Incorrect password";
        case "auth/invalid-email": return "Invalid email";
        case "auth/weak-password": return "Password must be at least 6 characters";
        case "auth/popup-closed-by-user": return "Google login cancelled";
        default: return error?.message || "Authentication failed";
    }
}

export default function Authentication({ params }: Props) {
    const { mode } = use(params);

    if (mode !== "login" && mode !== "register") {
        notFound();
    }

    const isLogin = mode === "login";

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);

            if (!email.trim() || !password.trim()) {
                setError("Email and password are required");
                return;
            }

            if (isLogin) {
                await login(email, password);
                window.location.replace("/user/dashboard");
                return;
            }

            if (!firstName.trim() || !lastName.trim()) {
                setError("Name is required");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            await login(email, password);
            window.location.replace("/user/dashboard");
        } catch (error: any) {
            setError(getFirebaseError(error));
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            setError("");
            setGoogleLoading(true);
            await loginGoogle();
            window.location.replace("/user/dashboard");
        } catch (error: any) {
            setError(getFirebaseError(error));
        } finally {
            setGoogleLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent)] pointer-events-none" />
            
            <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative z-10">
                <CardHeader className="space-y-1 pb-8 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-white">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        {isLogin ? "Enter your credentials to access your dashboard" : "Join TreamExam and start your journey today"}
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    {error && (
                        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">First Name</label>
                                    <input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="John"
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Last Name</label>
                                    <input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Doe"
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full shadow-lg shadow-primary/20" 
                            isLoading={loading}
                        >
                            {isLogin ? "Sign In" : "Create Account"}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full border-slate-700 hover:bg-slate-800 text-slate-300"
                        onClick={handleGoogleLogin}
                        isLoading={googleLoading}
                    >
                        {!googleLoading && (
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        )}
                        Google
                    </Button>
                </CardContent>
                
                <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-slate-500 pb-8">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <Link
                        href={isLogin ? "/auth/register" : "/auth/login"}
                        className="text-primary hover:underline font-semibold"
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </Link>
                </CardFooter>
            </Card>
        </main>
    );
}
