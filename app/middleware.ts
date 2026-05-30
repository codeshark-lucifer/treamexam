import {
    NextRequest,
    NextResponse,
} from "next/server";

const PROTECTED_ROUTES = [
    "/user",
    "/admin",
];

const AUTH_ROUTES = [
    "/auth/login",
    "/auth/register",
];

export function middleware(
    req: NextRequest
) {
    const pathname =
        req.nextUrl.pathname;

    const session =
        req.cookies.get(
            "session"
        );

    const isProtectedRoute =
        PROTECTED_ROUTES.some(route => 
            pathname.startsWith(route)
        );

    const isAuthRoute =
        AUTH_ROUTES.some(route => 
            pathname.startsWith(route)
        );

    if (
        !session &&
        isProtectedRoute
    ) {
        return NextResponse.redirect(
            new URL(
                "/auth/login",
                req.url
            )
        );
    }

    if (
        session &&
        isAuthRoute
    ) {
        return NextResponse.redirect(
            new URL(
                "/user/dashboard",
                req.url
            )
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};