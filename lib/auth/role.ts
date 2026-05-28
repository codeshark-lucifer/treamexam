export const ROLES = {
    ADMIN: "admin",
    USER: "user",
} as const;

export type Role =
    (typeof ROLES)[keyof typeof ROLES];

export interface UserRole {
    role?: Role;
}

export function hasRole(
    user: UserRole | null | undefined,
    role: Role
) {
    return user?.role === role;
}

export function isAdmin(
    user: UserRole | null | undefined
) {
    return user?.role === ROLES.ADMIN;
}