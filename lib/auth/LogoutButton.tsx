"use client";

import { logout } from "@/lib/auth/client";
import { useState } from "react";

interface LogoutButtonProps {
    className?: string;
}

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        try {
            setLoading(true);
            await logout();
            window.location.replace("/auth/login");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-destructive/50 disabled:opacity-50 bg-destructive/10 text-destructive hover:bg-destructive/20 ${className}`}
        >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
}

