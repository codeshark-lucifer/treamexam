import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  adminAuth,
  adminFirestore,
} from "@/lib/firebase-admin";

import {
  ROLES,
} from "@/lib/auth/role";

export async function POST(
  req: NextRequest
) {
  try {
    const { token } =
      await req.json();

    const decoded =
      await adminAuth.verifyIdToken(
        token
      );

    const uid =
      decoded.uid;

    const doc =
      await adminFirestore
        .collection("users")
        .doc(uid)
        .get();

    if (!doc.exists) {
      const user =
        await adminAuth.getUser(
          uid
        );

      await adminAuth.setCustomUserClaims(
        uid,
        {
          role: ROLES.USER,
        }
      );

      await adminFirestore
        .collection("users")
        .doc(uid)
        .set({
          uid,
          email:
            user.email,
          displayName:
            user.displayName,
          photoURL:
            user.photoURL,
          role:
            ROLES.USER,
          provider:
            "google",
          createdAt:
            new Date(),
        });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Google authentication failed",
      },
      {
        status: 500,
      }
    );
  }
}