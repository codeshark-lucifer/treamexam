import { headers } from "next/headers";
import { adminFirestore } from "@/lib/firebase-admin";
import ProfileEditor from "./ProfileEditor";

export default async function ProfilePage() {
    const sessionUser = await (async () => {
        // Fallback for requireUser to avoid redirect loops in research/dev
        // though it's better to use it as intended
        const { requireUser } = await import("@/lib/auth/server");
        return await requireUser();
    })();
    
    // Fetch detailed user data from Firestore
    const userDoc = await adminFirestore.collection("users").doc(sessionUser.uid).get();
    const userData = userDoc.data() || {};

    // Calculate total score and exams from results to be sure
    const resultsSnapshot = await adminFirestore.collection("results")
        .where("userId", "==", sessionUser.uid)
        .get();
    
    const results = resultsSnapshot.docs.map(d => d.data());
    const totalExams = results.length;
    const totalScore = results.reduce((acc, curr) => acc + (curr.score || 0), 0);

    const user = {
        uid: sessionUser.uid,
        email: sessionUser.email,
        displayName: userData.displayName || sessionUser.name || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        role: sessionUser.role || "user",
        totalExams,
        totalScore
    };

    return <ProfileEditor user={user} />;
}
