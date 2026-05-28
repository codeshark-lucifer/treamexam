import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    adminAuth,
} from "@/lib/firebase-admin";

export async function POST(
    req: NextRequest
) {
    try {
        const { token } =
            await req.json();

        const expiresIn =
            1000 *
            60 *
            60 *
            24 *
            5;

        const sessionCookie =
            await adminAuth.createSessionCookie(
                token,
                {
                    expiresIn,
                }
            );

        const response =
            NextResponse.json({
                success: true,
            });

        response.cookies.set(
            "session",
            sessionCookie,
            {
                httpOnly: true,
                secure:
                    process.env
                        .NODE_ENV ===
                    "production",
                sameSite: "lax",
                path: "/",
                maxAge:
                    60 *
                    60 *
                    24 *
                    5,
            }
        );

        return response;
    } catch {
        return NextResponse.json(
            {
                error:
                    "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }
}