import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions, getUserRoles, hasPermission } from "@/lib/authorization";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated", session: null }, { status: 401 });
    }

    const userId = session.user.id;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } }
              }
            }
          }
        }
      }
    });

    const userRoles = await getUserRoles(userId);
    const userPermissions = await getUserPermissions(userId);
    const canViewUsers = await hasPermission(userId, "users.view");
    const canViewRoles = await hasPermission(userId, "roles.view");

    return NextResponse.json({
      session: {
        id: session.user.id,
        email: session.user.email,
        roles: session.user.roles,
        permissions: session.user.permissions,
      },
      database: {
        userId: dbUser?.id,
        email: dbUser?.email,
        rolesCount: dbUser?.roles.length,
        roles: dbUser?.roles.map(ur => ({
          roleName: ur.role.name,
          permissions: ur.role.permissions.map(rp => rp.permission.name)
        }))
      },
      checks: { canViewUsers, canViewRoles }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
