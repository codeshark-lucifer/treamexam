"use client";

import { logout } from "@/lib/auth/client";
import { useState } from "react";

export default function LogoutButton() {
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
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
}
