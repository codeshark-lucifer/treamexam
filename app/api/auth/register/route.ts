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
    const {
      firstName,
      lastName,
      email,
      password,
    } = await req.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await adminAuth.createUser({
        email,
        password,
        displayName:
          `${firstName} ${lastName}`,
      });

    await adminAuth.setCustomUserClaims(
      user.uid,
      {
        role: ROLES.USER,
      }
    );

    await adminFirestore
      .collection("users")
      .doc(user.uid)
      .set({
        uid: user.uid,
        firstName,
        lastName,
        email,
        role: ROLES.USER,
        provider: "password",
        createdAt:
          new Date(),
      });

    return NextResponse.json({
      success: true,
      uid: user.uid,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.code ||
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}