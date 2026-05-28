import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import { ROLES } from "./role";

export async function getSessionCookie() {
    const cookieStore = await cookies();
    return cookieStore.get("session")?.value;
}

export async function getCurrentUser() {
    try {
        const session = await getSessionCookie();

        if (!session) {
            return null;
        }

        const decodedToken = await adminAuth.verifySessionCookie(
            session,
            true
        );

        return decodedToken;
    } catch (error) {
        return null;
    }
}

export async function requireUser() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    return user;
}

export async function requireAdmin() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    if (user.role !== ROLES.ADMIN) {
        redirect("/dashboard");
    }

    return user;
}