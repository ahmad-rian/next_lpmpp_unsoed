import { prisma } from "./prisma";

export interface UserWithRoles {
    id: string;
    email: string;
    name: string | null;
    roles: {
        role: {
            id: string;
            name: string;
            displayName: string;
            permissions: {
                permission: {
                    id: string;
                    name: string;
                    module: string;
                };
            }[];
        };
    }[];
}

/**
 * Get user with all roles and permissions
 */
export async function getUserWithPermissions(userId: string): Promise<UserWithRoles | null> {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            roles: {
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true,
                            permissions: {
                                select: {
                                    permission: {
                                        select: {
                                            id: true,
                                            name: true,
                                            module: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}

/**
 * Check if user has a specific role
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
    const userRole = await prisma.userRole.findFirst({
        where: {
            userId,
            role: {
                name: roleName,
            },
        },
    });
    return !!userRole;
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(userId: string, roleNames: string[]): Promise<boolean> {
    const userRole = await prisma.userRole.findFirst({
        where: {
            userId,
            role: {
                name: { in: roleNames },
            },
        },
    });
    return !!userRole;
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const userWithPermission = await prisma.user.findFirst({
        where: {
            id: userId,
            roles: {
                some: {
                    role: {
                        permissions: {
                            some: {
                                permission: {
                                    name: permissionName,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    return !!userWithPermission;
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean> {
    const userWithPermission = await prisma.user.findFirst({
        where: {
            id: userId,
            roles: {
                some: {
                    role: {
                        permissions: {
                            some: {
                                permission: {
                                    name: { in: permissionNames },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    return !!userWithPermission;
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(userId: string, permissionNames: string[]): Promise<boolean> {
    for (const permissionName of permissionNames) {
        const has = await hasPermission(userId, permissionName);
        if (!has) return false;
    }
    return true;
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            roles: {
                select: {
                    role: {
                        select: {
                            permissions: {
                                select: {
                                    permission: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!user) return [];

    const permissions = new Set<string>();
    user.roles.forEach((userRole) => {
        userRole.role.permissions.forEach((rolePermission) => {
            permissions.add(rolePermission.permission.name);
        });
    });

    return Array.from(permissions);
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            roles: {
                select: {
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) return [];
    return user.roles.map((ur) => ur.role.name);
}

/**
 * Check if user is a super admin (has 'super-admin' role)
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
    return hasRole(userId, "super-admin");
}

/**
 * Assign a role to a user
 */
export async function assignRole(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.create({
        data: {
            userId,
            roleId,
        },
    });
}

/**
 * Remove a role from a user
 */
export async function removeRole(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.deleteMany({
        where: {
            userId,
            roleId,
        },
    });
}

/**
 * Sync roles for a user (replace all roles with new ones)
 */
export async function syncRoles(userId: string, roleIds: string[]): Promise<void> {
    // Delete all existing roles
    await prisma.userRole.deleteMany({
        where: { userId },
    });

    // Assign new roles
    if (roleIds.length > 0) {
        await prisma.userRole.createMany({
            data: roleIds.map((roleId) => ({
                userId,
                roleId,
            })),
        });
    }
}

/**
 * Assign a permission to a role
 */
export async function assignPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    await prisma.rolePermission.create({
        data: {
            roleId,
            permissionId,
        },
    });
}

/**
 * Remove a permission from a role
 */
export async function removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    await prisma.rolePermission.deleteMany({
        where: {
            roleId,
            permissionId,
        },
    });
}

/**
 * Sync permissions for a role (replace all permissions with new ones)
 */
export async function syncPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    // Delete all existing permissions
    await prisma.rolePermission.deleteMany({
        where: { roleId },
    });

    // Assign new permissions
    if (permissionIds.length > 0) {
        await prisma.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            })),
        });
    }
}

/**
 * Permission modules with their permissions for seeding
 * Covers ALL admin CRUD features
 */
export const DEFAULT_PERMISSIONS = {
    // User & Role Management
    users: {
        displayName: "User Management",
        permissions: [
            { name: "users.view", displayName: "View Users" },
            { name: "users.create", displayName: "Create Users" },
            { name: "users.update", displayName: "Update Users" },
            { name: "users.delete", displayName: "Delete Users" },
        ],
    },
    roles: {
        displayName: "Role Management",
        permissions: [
            { name: "roles.view", displayName: "View Roles" },
            { name: "roles.create", displayName: "Create Roles" },
            { name: "roles.update", displayName: "Update Roles" },
            { name: "roles.delete", displayName: "Delete Roles" },
            { name: "roles.assign-permissions", displayName: "Assign Permissions" },
        ],
    },

    // Content Management
    news: {
        displayName: "Berita",
        permissions: [
            { name: "news.view", displayName: "View Berita" },
            { name: "news.create", displayName: "Create Berita" },
            { name: "news.update", displayName: "Update Berita" },
            { name: "news.delete", displayName: "Delete Berita" },
            { name: "news.publish", displayName: "Publish Berita" },
        ],
    },
    agenda: {
        displayName: "Agenda",
        permissions: [
            { name: "agenda.view", displayName: "View Agenda" },
            { name: "agenda.create", displayName: "Create Agenda" },
            { name: "agenda.update", displayName: "Update Agenda" },
            { name: "agenda.delete", displayName: "Delete Agenda" },
        ],
    },
    downloads: {
        displayName: "Unduhan",
        permissions: [
            { name: "downloads.view", displayName: "View Unduhan" },
            { name: "downloads.create", displayName: "Create Unduhan" },
            { name: "downloads.update", displayName: "Update Unduhan" },
            { name: "downloads.delete", displayName: "Delete Unduhan" },
        ],
    },

    // Data Master
    leadership: {
        displayName: "Pimpinan Lembaga",
        permissions: [
            { name: "leadership.view", displayName: "View Pimpinan" },
            { name: "leadership.create", displayName: "Create Pimpinan" },
            { name: "leadership.update", displayName: "Update Pimpinan" },
            { name: "leadership.delete", displayName: "Delete Pimpinan" },
        ],
    },
    staff: {
        displayName: "Tata Usaha",
        permissions: [
            { name: "staff.view", displayName: "View Tata Usaha" },
            { name: "staff.create", displayName: "Create Tata Usaha" },
            { name: "staff.update", displayName: "Update Tata Usaha" },
            { name: "staff.delete", displayName: "Delete Tata Usaha" },
        ],
    },
    centers: {
        displayName: "Pusat & Unit",
        permissions: [
            { name: "centers.view", displayName: "View Pusat & Unit" },
            { name: "centers.create", displayName: "Create Pusat & Unit" },
            { name: "centers.update", displayName: "Update Pusat & Unit" },
            { name: "centers.delete", displayName: "Delete Pusat & Unit" },
        ],
    },

    // SPMI
    spmi: {
        displayName: "SPMI",
        permissions: [
            { name: "spmi.view", displayName: "View SPMI" },
            { name: "spmi.update", displayName: "Update SPMI" },
        ],
    },
    "spmi-documents": {
        displayName: "Dokumen SPMI",
        permissions: [
            { name: "spmi-documents.view", displayName: "View Dokumen SPMI" },
            { name: "spmi-documents.create", displayName: "Create Dokumen SPMI" },
            { name: "spmi-documents.update", displayName: "Update Dokumen SPMI" },
            { name: "spmi-documents.delete", displayName: "Delete Dokumen SPMI" },
        ],
    },
    gpm: {
        displayName: "GPM Fakultas",
        permissions: [
            { name: "gpm.view", displayName: "View GPM" },
            { name: "gpm.create", displayName: "Create GPM" },
            { name: "gpm.update", displayName: "Update GPM" },
            { name: "gpm.delete", displayName: "Delete GPM" },
        ],
    },

    // Akreditasi
    accreditation: {
        displayName: "Akreditasi",
        permissions: [
            { name: "accreditation.view", displayName: "View Akreditasi" },
            { name: "accreditation.create", displayName: "Create Akreditasi" },
            { name: "accreditation.update", displayName: "Update Akreditasi" },
            { name: "accreditation.delete", displayName: "Delete Akreditasi" },
        ],
    },

    // Program Unggulan
    programs: {
        displayName: "Program Unggulan",
        permissions: [
            { name: "programs.view", displayName: "View Program Unggulan" },
            { name: "programs.create", displayName: "Create Program Unggulan" },
            { name: "programs.update", displayName: "Update Program Unggulan" },
            { name: "programs.delete", displayName: "Delete Program Unggulan" },
        ],
    },

    // Layanan/Expertise
    expertise: {
        displayName: "Layanan",
        permissions: [
            { name: "expertise.view", displayName: "View Layanan" },
            { name: "expertise.create", displayName: "Create Layanan" },
            { name: "expertise.update", displayName: "Update Layanan" },
            { name: "expertise.delete", displayName: "Delete Layanan" },
        ],
    },

    // Links/Tautan
    links: {
        displayName: "Tautan",
        permissions: [
            { name: "links.view", displayName: "View Tautan" },
            { name: "links.create", displayName: "Create Tautan" },
            { name: "links.update", displayName: "Update Tautan" },
            { name: "links.delete", displayName: "Delete Tautan" },
        ],
    },
    "tautan-layanan": {
        displayName: "Tautan Layanan",
        permissions: [
            { name: "tautan-layanan.view", displayName: "View Tautan Layanan" },
            { name: "tautan-layanan.create", displayName: "Create Tautan Layanan" },
            { name: "tautan-layanan.update", displayName: "Update Tautan Layanan" },
            { name: "tautan-layanan.delete", displayName: "Delete Tautan Layanan" },
        ],
    },

    // Data Galeri & Buku
    gallery: {
        displayName: "Data Galeri",
        permissions: [
            { name: "gallery.view", displayName: "View Data Galeri" },
            { name: "gallery.create", displayName: "Create Data Galeri" },
            { name: "gallery.update", displayName: "Update Data Galeri" },
            { name: "gallery.delete", displayName: "Delete Data Galeri" },
        ],
    },
    books: {
        displayName: "Data Buku",
        permissions: [
            { name: "books.view", displayName: "View Data Buku" },
            { name: "books.create", displayName: "Create Data Buku" },
            { name: "books.update", displayName: "Update Data Buku" },
            { name: "books.delete", displayName: "Delete Data Buku" },
        ],
    },

    // Settings
    settings: {
        displayName: "Konfigurasi Situs",
        permissions: [
            { name: "settings.view", displayName: "View Konfigurasi" },
            { name: "settings.update", displayName: "Update Konfigurasi" },
        ],
    },

    // Dashboard & Analytics
    dashboard: {
        displayName: "Dashboard",
        permissions: [
            { name: "dashboard.view", displayName: "View Dashboard" },
            { name: "dashboard.analytics", displayName: "View Analytics" },
        ],
    },
};

/**
 * Default roles with their permissions for seeding
 */
export const DEFAULT_ROLES = [
    {
        name: "super-admin",
        displayName: "Super Administrator",
        description: "Full access to all features",
        color: "#ef4444",
        isSystem: true,
        permissions: ["*"], // All permissions
    },
    {
        name: "admin",
        displayName: "Administrator",
        description: "Administrative access with most permissions",
        color: "#f59e0b",
        isSystem: true,
        permissions: [
            // Users & Roles (partial)
            "users.view", "users.create", "users.update",
            "roles.view",
            // Content
            "news.view", "news.create", "news.update", "news.delete", "news.publish",
            "agenda.view", "agenda.create", "agenda.update", "agenda.delete",
            "downloads.view", "downloads.create", "downloads.update", "downloads.delete",
            // Data Master
            "leadership.view", "leadership.create", "leadership.update", "leadership.delete",
            "staff.view", "staff.create", "staff.update", "staff.delete",
            "centers.view", "centers.create", "centers.update", "centers.delete",
            // SPMI
            "spmi.view", "spmi.update",
            "spmi-documents.view", "spmi-documents.create", "spmi-documents.update", "spmi-documents.delete",
            "gpm.view", "gpm.create", "gpm.update", "gpm.delete",
            // Akreditasi
            "accreditation.view", "accreditation.create", "accreditation.update", "accreditation.delete",
            // Programs & Expertise
            "programs.view", "programs.create", "programs.update", "programs.delete",
            "expertise.view", "expertise.create", "expertise.update", "expertise.delete",
            // Links
            "links.view", "links.create", "links.update", "links.delete",
            "tautan-layanan.view", "tautan-layanan.create", "tautan-layanan.update", "tautan-layanan.delete",
            // Gallery & Books
            "gallery.view", "gallery.create", "gallery.update", "gallery.delete",
            "books.view", "books.create", "books.update", "books.delete",
            // Settings
            "settings.view", "settings.update",
            // Dashboard
            "dashboard.view", "dashboard.analytics",
        ],
    },
    {
        name: "editor",
        displayName: "Editor",
        description: "Can manage content like news, programs, and downloads",
        color: "#3b82f6",
        isSystem: false,
        permissions: [
            // Content only
            "news.view", "news.create", "news.update",
            "agenda.view", "agenda.create", "agenda.update",
            "downloads.view", "downloads.create", "downloads.update",
            "programs.view", "programs.create", "programs.update",
            "expertise.view", "expertise.create", "expertise.update",
            "links.view", "links.create", "links.update",
            "gallery.view", "gallery.create", "gallery.update",
            "books.view", "books.create", "books.update",
            // Dashboard
            "dashboard.view",
        ],
    },
    {
        name: "viewer",
        displayName: "Viewer",
        description: "Read-only access to admin panel",
        color: "#6b7280",
        isSystem: false,
        permissions: [
            // View only
            "users.view",
            "roles.view",
            "news.view",
            "agenda.view",
            "downloads.view",
            "leadership.view",
            "staff.view",
            "centers.view",
            "spmi.view",
            "spmi-documents.view",
            "gpm.view",
            "accreditation.view",
            "programs.view",
            "expertise.view",
            "links.view",
            "tautan-layanan.view",
            "gallery.view",
            "books.view",
            "settings.view",
            "dashboard.view",
        ],
    },
];

