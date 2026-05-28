"use client";

import Link from "next/link";
import { use } from "react";
import { useState } from "react";
import { notFound } from "next/navigation";

import {
    login,
    loginGoogle,
} from "@/lib/auth/client";

interface Props {
    params: Promise<{
        mode: string;
    }>;
}

function getFirebaseError(
    error: any
) {
    switch (
        error?.code
    ) {
        case "auth/email-already-in-use":
            return "Email already exists";

        case "auth/user-not-found":
            return "User not found";

        case "auth/wrong-password":
            return "Incorrect password";

        case "auth/invalid-email":
            return "Invalid email";

        case "auth/weak-password":
            return "Password must be at least 6 characters";

        case "auth/popup-closed-by-user":
            return "Google login cancelled";

        default:
            return (
                error?.message ||
                "Authentication failed"
            );
    }
}

export default function Authentication({
    params,
}: Props) {
    const { mode } =
        use(params);

    if (
        mode !==
            "login" &&
        mode !==
            "register"
    ) {
        notFound();
    }

    const isLogin =
        mode === "login";

    const [
        firstName,
        setFirstName,
    ] = useState("");

    const [
        lastName,
        setLastName,
    ] = useState("");

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    async function handleSubmit() {
        try {
            setError("");
            setLoading(
                true
            );

            if (
                !email.trim()
            ) {
                setError(
                    "Email is required"
                );
                return;
            }

            if (
                !password.trim()
            ) {
                setError(
                    "Password is required"
                );
                return;
            }

            if (
                isLogin
            ) {
                await login(
                    email,
                    password
                );

                window.location.replace(
                    "/dashboard"
                );

                return;
            }

            if (
                !firstName.trim()
            ) {
                setError(
                    "First name is required"
                );
                return;
            }

            if (
                !lastName.trim()
            ) {
                setError(
                    "Last name is required"
                );
                return;
            }

            if (
                password.length <
                6
            ) {
                setError(
                    "Password must be at least 6 characters"
                );
                return;
            }

            if (
                password !==
                confirmPassword
            ) {
                setError(
                    "Passwords do not match"
                );
                return;
            }

            const response =
                await fetch(
                    "/api/auth/register",
                    {
                        method:
                            "POST",
                        headers:
                            {
                                "Content-Type":
                                    "application/json",
                            },
                        body: JSON.stringify(
                            {
                                firstName,
                                lastName,
                                email,
                                password,
                            }
                        ),
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok
            ) {
                throw new Error(
                    data.error
                );
            }

            await login(
                email,
                password
            );

            window.location.replace(
                "/dashboard"
            );
        } catch (
            error: any
        ) {
            setError(
                getFirebaseError(
                    error
                )
            );
        } finally {
            setLoading(
                false
            );
        }
    }

    async function handleGoogleLogin() {
        try {
            setError("");
            setLoading(
                true
            );

            await loginGoogle();

            window.location.replace(
                "/dashboard"
            );
        } catch (
            error: any
        ) {
            setError(
                getFirebaseError(
                    error
                )
            );
        } finally {
            setLoading(
                false
            );
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
                <h1 className="mb-2 text-center text-3xl font-bold text-white">
                    {isLogin
                        ? "Welcome Back"
                        : "Create Account"}
                </h1>

                <p className="mb-6 text-center text-slate-400">
                    {isLogin
                        ? "Login to continue"
                        : "Register your account"}
                </p>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={(
                        e
                    ) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-4"
                >
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                value={
                                    firstName
                                }
                                onChange={(
                                    e
                                ) =>
                                    setFirstName(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="First Name"
                                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                            />

                            <input
                                value={
                                    lastName
                                }
                                onChange={(
                                    e
                                ) =>
                                    setLastName(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Last Name"
                                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                            />
                        </div>
                    )}

                    <input
                        type="email"
                        value={email}
                        onChange={(
                            e
                        ) =>
                            setEmail(
                                e
                                    .target
                                    .value
                            )
                        }
                        placeholder="Email"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    />

                    <input
                        type="password"
                        value={
                            password
                        }
                        onChange={(
                            e
                        ) =>
                            setPassword(
                                e
                                    .target
                                    .value
                            )
                        }
                        placeholder="Password"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    />

                    {!isLogin && (
                        <input
                            type="password"
                            value={
                                confirmPassword
                            }
                            onChange={(
                                e
                            ) =>
                                setConfirmPassword(
                                    e
                                        .target
                                        .value
                                )
                            }
                            placeholder="Confirm Password"
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                        />
                    )}

                    <button
                        disabled={
                            loading
                        }
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                            ? "Login"
                            : "Create Account"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-700" />
                    <span className="text-sm text-slate-500">
                        OR
                    </span>
                    <div className="h-px flex-1 bg-slate-700" />
                </div>

                <button
                    onClick={
                        handleGoogleLogin
                    }
                    disabled={
                        loading
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 text-white hover:bg-slate-700"
                >
                    Continue with Google
                </button>

                <div className="mt-6 text-center text-sm text-slate-400">
                    {isLogin ? (
                        <>
                            Don't have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="text-blue-400"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="text-blue-400"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}