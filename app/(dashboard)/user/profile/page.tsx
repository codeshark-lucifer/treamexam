import { headers } from "next/headers";
import { adminFirestore } from "@/lib/firebase-admin";
import ProfileEditor from "./ProfileEditor";

export default async function ProfilePage() {
    const sessionUser = await (async () => {
        const { requireUser } = await import("@/lib/auth/server");
        return await requireUser();
    })() as any;
    
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
        displayName: userData.displayName || sessionUser.displayName || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        role: sessionUser.role || "user",
        totalExams,
        totalScore
    };

    return (
        <div className="py-4 md:py-8">
            <ProfileEditor user={user} />
        </div>
    );
}
