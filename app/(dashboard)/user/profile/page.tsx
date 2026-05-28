import { requireUser } from "@/lib/auth/server";
import { adminFirestore } from "@/lib/firebase-admin";
import ProfileEditor from "./ProfileEditor";

export default async function ProfilePage() {
    const sessionUser = await requireUser();
    
    // Fetch detailed user data from Firestore
    const userDoc = await adminFirestore.collection("users").doc(sessionUser.uid).get();
    const userData = userDoc.data() || {};

    const user = {
        uid: sessionUser.uid,
        email: sessionUser.email,
        displayName: userData.displayName || sessionUser.name || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        role: sessionUser.role || "user",
    };

    return <ProfileEditor user={user} />;
}
