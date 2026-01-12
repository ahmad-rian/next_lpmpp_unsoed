import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/authorization";

// GET - Fetch all roles with permissions
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
        const includePermissions = searchParams.get("includePermissions") === "true";
        const includeUsers = searchParams.get("includeUsers") === "true";

        const roles = await prisma.role.findMany({
            include: {
                permissions: includePermissions ? {
                    include: {
                        permission: true,
                    },
                } : false,
                users: includeUsers ? {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                } : false,
                _count: {
                    select: {
                        users: true,
                        permissions: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(roles);
    } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json(
            { error: "Failed to fetch roles" },
            { status: 500 }
        );
    }
}

// POST - Create new role
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const canCreate = await hasPermission(session.user.id, "roles.create");
        if (!canCreate) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { name, displayName, description, color, permissionIds } = body;

        if (!name || !displayName) {
            return NextResponse.json(
                { error: "Name and display name are required" },
                { status: 400 }
            );
        }

        // Check if role name already exists
        const existing = await prisma.role.findUnique({ where: { name } });
        if (existing) {
            return NextResponse.json(
                { error: "Role name already exists" },
                { status: 409 }
            );
        }

        // Create role
        const role = await prisma.role.create({
            data: {
                name: name.toLowerCase().replace(/\s+/g, "-"),
                displayName,
                description,
                color: color || "#6366f1",
                isSystem: false,
            },
        });

        // Assign permissions if provided
        if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
            await prisma.rolePermission.createMany({
                data: permissionIds.map((permissionId: string) => ({
                    roleId: role.id,
                    permissionId,
                })),
            });
        }

        // Return role with permissions
        const roleWithPermissions = await prisma.role.findUnique({
            where: { id: role.id },
            include: {
                permissions: {
                    include: { permission: true },
                },
                _count: {
                    select: { users: true, permissions: true },
                },
            },
        });

        return NextResponse.json(roleWithPermissions, { status: 201 });
    } catch (error) {
        console.error("Error creating role:", error);
        return NextResponse.json(
            { error: "Failed to create role" },
            { status: 500 }
        );
    }
}

// PUT - Update role
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const canUpdate = await hasPermission(session.user.id, "roles.update");
        if (!canUpdate) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { id, name, displayName, description, color, permissionIds } = body;

        if (!id) {
            return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
        }

        // Check if role exists
        const existingRole = await prisma.role.findUnique({ where: { id } });
        if (!existingRole) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 });
        }

        // Prevent modifying system roles' name
        if (existingRole.isSystem && name && name !== existingRole.name) {
            return NextResponse.json(
                { error: "Cannot change system role name" },
                { status: 400 }
            );
        }

        // Update role
        const role = await prisma.role.update({
            where: { id },
            data: {
                ...(name && !existingRole.isSystem && { name: name.toLowerCase().replace(/\s+/g, "-") }),
                displayName,
                description,
                color,
            },
        });

        // Update permissions if provided
        if (permissionIds !== undefined) {
            const canAssignPermissions = await hasPermission(session.user.id, "roles.assign-permissions");
            if (!canAssignPermissions) {
                return NextResponse.json(
                    { error: "You don't have permission to assign permissions" },
                    { status: 403 }
                );
            }

            // Delete existing permissions
            await prisma.rolePermission.deleteMany({ where: { roleId: id } });

            // Assign new permissions
            if (Array.isArray(permissionIds) && permissionIds.length > 0) {
                await prisma.rolePermission.createMany({
                    data: permissionIds.map((permissionId: string) => ({
                        roleId: id,
                        permissionId,
                    })),
                });
            }
        }

        // Return updated role with permissions
        const roleWithPermissions = await prisma.role.findUnique({
            where: { id },
            include: {
                permissions: {
                    include: { permission: true },
                },
                _count: {
                    select: { users: true, permissions: true },
                },
            },
        });

        return NextResponse.json(roleWithPermissions);
    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json(
            { error: "Failed to update role" },
            { status: 500 }
        );
    }
}

// DELETE - Delete role
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const canDelete = await hasPermission(session.user.id, "roles.delete");
        if (!canDelete) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
        }

        // Check if role exists
        const role = await prisma.role.findUnique({ where: { id } });
        if (!role) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 });
        }

        // Prevent deleting system roles
        if (role.isSystem) {
            return NextResponse.json(
                { error: "Cannot delete system role" },
                { status: 400 }
            );
        }

        // Check if role has users
        const usersWithRole = await prisma.userRole.count({ where: { roleId: id } });
        if (usersWithRole > 0) {
            return NextResponse.json(
                { error: `Cannot delete role with ${usersWithRole} users assigned. Remove users first.` },
                { status: 400 }
            );
        }

        // Delete role (permissions will cascade)
        await prisma.role.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting role:", error);
        return NextResponse.json(
            { error: "Failed to delete role" },
            { status: 500 }
        );
    }
}
