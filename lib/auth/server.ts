import { cookies } from "next/headers";
import { adminAuth, adminFirestore } from "@/lib/firebase-admin";
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

        // 🔥 IMPORTANT: Fetch latest role from Firestore to allow manual overrides
        const userDoc = await adminFirestore.collection("users").doc(decodedToken.uid).get();
        const userData = userDoc.data();
        
        return {
            ...decodedToken,
            displayName: userData?.displayName || decodedToken.name || null,
            role: userData?.role || decodedToken.role || ROLES.USER
        };
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
        redirect("/user/dashboard");
    }

    return user;
}