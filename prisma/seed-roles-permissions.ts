import { prisma } from "../lib/prisma";
import { DEFAULT_PERMISSIONS, DEFAULT_ROLES } from "../lib/authorization";

async function seedRolesAndPermissions() {
    console.log("🔐 Seeding roles and permissions...");

    // 1. Seed all permissions
    console.log("  📝 Creating permissions...");
    const permissionMap = new Map<string, string>(); // name -> id

    for (const [module, moduleData] of Object.entries(DEFAULT_PERMISSIONS)) {
        for (const perm of moduleData.permissions) {
            const permission = await prisma.permission.upsert({
                where: { name: perm.name },
                update: {
                    displayName: perm.displayName,
                    module,
                },
                create: {
                    name: perm.name,
                    displayName: perm.displayName,
                    module,
                },
            });
            permissionMap.set(perm.name, permission.id);
            console.log(`    ✓ ${perm.name}`);
        }
    }

    // 2. Seed all roles
    console.log("  👥 Creating roles...");
    for (const roleData of DEFAULT_ROLES) {
        // Create or update role
        const role = await prisma.role.upsert({
            where: { name: roleData.name },
            update: {
                displayName: roleData.displayName,
                description: roleData.description,
                color: roleData.color,
                isSystem: roleData.isSystem,
            },
            create: {
                name: roleData.name,
                displayName: roleData.displayName,
                description: roleData.description,
                color: roleData.color,
                isSystem: roleData.isSystem,
            },
        });
        console.log(`    ✓ ${roleData.displayName}`);

        // Assign permissions to role
        // First, remove all existing permissions
        await prisma.rolePermission.deleteMany({
            where: { roleId: role.id },
        });

        // Then assign new permissions
        if (roleData.permissions.includes("*")) {
            // Super admin gets all permissions
            const allPermissionIds = Array.from(permissionMap.values());
            await prisma.rolePermission.createMany({
                data: allPermissionIds.map((permissionId) => ({
                    roleId: role.id,
                    permissionId,
                })),
                skipDuplicates: true,
            });
            console.log(`      → Assigned ALL permissions to ${roleData.displayName}`);
        } else {
            // Assign specific permissions
            const permissionIds = roleData.permissions
                .map((permName) => permissionMap.get(permName))
                .filter((id): id is string => !!id);

            if (permissionIds.length > 0) {
                await prisma.rolePermission.createMany({
                    data: permissionIds.map((permissionId) => ({
                        roleId: role.id,
                        permissionId,
                    })),
                    skipDuplicates: true,
                });
                console.log(`      → Assigned ${permissionIds.length} permissions to ${roleData.displayName}`);
            }
        }
    }

    // 3. Migrate existing users with 'role' field to new system
    console.log("  🔄 Migrating existing admin users...");

    // Find super-admin role
    const superAdminRole = await prisma.role.findUnique({
        where: { name: "super-admin" },
    });

    if (superAdminRole) {
        // Get all users (we'll check their old role field if it exists)
        // Since we removed the role enum, we need to assign roles to existing admins
        // For now, we'll make the first user a super-admin if they have 'ADMIN' in their data

        const firstUser = await prisma.user.findFirst({
            orderBy: { createdAt: "asc" },
        });

        if (firstUser) {
            // Check if user already has roles
            const existingRoles = await prisma.userRole.findMany({
                where: { userId: firstUser.id },
            });

            if (existingRoles.length === 0) {
                await prisma.userRole.create({
                    data: {
                        userId: firstUser.id,
                        roleId: superAdminRole.id,
                    },
                });
                console.log(`    ✓ Made ${firstUser.email} a Super Administrator`);
            } else {
                console.log(`    → ${firstUser.email} already has roles assigned`);
            }
        }
    }

    console.log("✅ Roles and permissions seeding complete!");
}

// Run the seed
seedRolesAndPermissions()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
