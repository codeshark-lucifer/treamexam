import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminFirestore } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth/server";
import { censorText } from "@/lib/utils/filter";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { firstName, lastName, displayName } = await req.json();

        // Apply censorship filter to display name
        const censoredDisplayName = censorText(displayName);

        // Update Firebase Auth
        await adminAuth.updateUser(user.uid, {
            displayName: censoredDisplayName || `${firstName} ${lastName}`,
        });

        // Update Firestore
        await adminFirestore.collection("users").doc(user.uid).update({
            firstName,
            lastName,
            displayName: censoredDisplayName,
            updatedAt: new Date(),
        });

        return NextResponse.json({ 
            success: true, 
            displayName: censoredDisplayName 
        });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
