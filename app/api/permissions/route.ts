import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/authorization";

// GET - Fetch all permissions
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check permission
        const canView = await hasPermission(session.user.id, "roles.view");
        if (!canView) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const groupByModule = searchParams.get("groupByModule") === "true";

        const permissions = await prisma.permission.findMany({
            orderBy: [{ module: "asc" }, { name: "asc" }],
        });

        if (groupByModule) {
            // Group permissions by module
            const grouped = permissions.reduce((acc, perm) => {
                if (!acc[perm.module]) {
                    acc[perm.module] = {
                        module: perm.module,
                        permissions: [],
                    };
                }
                acc[perm.module].permissions.push(perm);
                return acc;
            }, {} as Record<string, { module: string; permissions: typeof permissions }>);

            return NextResponse.json(Object.values(grouped));
        }

        return NextResponse.json(permissions);
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return NextResponse.json(
            { error: "Failed to fetch permissions" },
            { status: 500 }
        );
    }
}

// POST - Create new permission (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only super-admin can create permissions
        const isSuperAdmin = await hasPermission(session.user.id, "roles.assign-permissions");
        if (!isSuperAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { name, displayName, module, description } = body;

        if (!name || !displayName || !module) {
            return NextResponse.json(
                { error: "Name, display name, and module are required" },
                { status: 400 }
            );
        }

        // Check if permission already exists
        const existing = await prisma.permission.findUnique({ where: { name } });
        if (existing) {
            return NextResponse.json(
                { error: "Permission name already exists" },
                { status: 409 }
            );
        }

        const permission = await prisma.permission.create({
            data: {
                name: name.toLowerCase().replace(/\s+/g, "."),
                displayName,
                module: module.toLowerCase(),
                description,
            },
        });

        return NextResponse.json(permission, { status: 201 });
    } catch (error) {
        console.error("Error creating permission:", error);
        return NextResponse.json(
            { error: "Failed to create permission" },
            { status: 500 }
        );
    }
}

// DELETE - Delete permission (admin only)
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isSuperAdmin = await hasPermission(session.user.id, "roles.assign-permissions");
        if (!isSuperAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Permission ID is required" }, { status: 400 });
        }

        await prisma.permission.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting permission:", error);
        return NextResponse.json(
            { error: "Failed to delete permission" },
            { status: 500 }
        );
    }
}
