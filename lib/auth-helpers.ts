import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { hasPermission, isSuperAdmin } from "./authorization";

/**
 * Check if user has at least one role assigned (can access admin panel)
 */
export function hasAnyRoleSync(roles: string[] | undefined): boolean {
    return !!roles && roles.length > 0;
}

/**
 * Check if user is admin (has any admin-related role)
 */
export function isAdmin(roles: string[] | undefined): boolean {
    if (!roles) return false;
    return roles.some(role =>
        role === "super-admin" ||
        role === "admin" ||
        role === "editor"
    );
}

/**
 * Middleware helper to check if request is from admin
 * Returns error response if not authenticated/authorized
 */
export async function requireAdmin(): Promise<{ session: any } | NextResponse> {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasAnyRoleSync(session.user.roles)) {
        return NextResponse.json({ error: "Forbidden - No role assigned" }, { status: 403 });
    }

    return { session };
}

/**
 * Middleware helper to check specific permission
 */
export async function requirePermission(permissionName: string): Promise<{ session: any } | NextResponse> {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasPerm = await hasPermission(session.user.id, permissionName);
    if (!hasPerm) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return { session };
}
