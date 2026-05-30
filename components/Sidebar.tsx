"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/lib/auth/LogoutButton";
import Image from "next/image";

import { useTranslation, LanguageToggle } from "@/lib/translate";
import { ThemeToggle } from "@/lib/theme";

interface SidebarProps {
    user: {
        email?: string;
        displayName?: string;
        role?: string;
    };
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const { t } = useTranslation();

    const navItems = [
        {
            label: t.sidebar.dashboard,
            href: "/user/dashboard",
            icon: <i className="fa-solid fa-gauge-high w-5 text-center"></i>,
        },
        {
            label: t.sidebar.browseExams,
            href: "/category",
            icon: <i className="fa-solid fa-building-columns w-5 text-center"></i>,
        },
        {
            label: t.sidebar.profile,
            href: "/user/profile",
            icon: <i className="fa-solid fa-user w-5 text-center"></i>,
        },
    ];

    if (user.role === "admin") {
        navItems.push({
            label: t.sidebar.adminPanel,
            href: "/admin/dashboard",
            icon: <i className="fa-solid fa-user-shield w-5 text-center"></i>,
        });
    }

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--surface)] border border-[var(--line)] md:hidden transition-transform ${isOpen ? "translate-x-52" : "translate-x-0"}`}
            >
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-[var(--primary)]`}></i>
            </button>

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[var(--paper)] border-r border-[var(--line)] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-xl md:shadow-none`}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/images/logo1.png" alt="Logo" width={32} height={32} />
                            <span className="text-xl font-bold text-[var(--primary)]">
                                TreamExam
                            </span>
                        </Link>
                    </div>

                    <div className="mb-8 space-y-2">
                        <div className="p-2 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] flex items-center justify-between shadow-sm">
                            <span className="text-[10px] font-black uppercase text-[var(--muted)] px-2">Theme</span>
                            <ThemeToggle className="w-8 h-8" />
                        </div>
                        <div className="p-2 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] flex items-center justify-between shadow-sm">
                            <span className="text-[10px] font-black uppercase text-[var(--muted)] px-2">Language</span>
                            <LanguageToggle />
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] transition-all ${
                                        isActive 
                                            ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20" 
                                            : "text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--primary)]"
                                    }`}
                                >
                                    {item.icon}
                                    <span className="font-bold">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-[var(--line)]">
                        <div className="px-4 py-4 mb-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] shadow-sm">
                            <p className="text-sm font-bold text-[var(--ink)] truncate">{user.displayName || "User"}</p>
                            <p className="text-[10px] text-[var(--muted)] truncate mb-3">{user.email}</p>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[var(--secondary)] text-[var(--primary)]">
                                {user.role || "user"}
                            </span>
                        </div>
                        <LogoutButton className="w-full justify-start px-4 py-3 font-bold hover:bg-red-50 hover:text-red-600 transition-colors" />
                    </div>
                </div>
            </aside>
        </>
    );
}

