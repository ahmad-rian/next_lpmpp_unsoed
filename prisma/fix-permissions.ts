import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing role permissions...");

  // Get admin role
  const adminRole = await prisma.role.findUnique({
    where: { name: "admin" }
  });

  if (!adminRole) {
    console.log("Admin role not found!");
    return;
  }

  console.log("Found admin role:", adminRole.id);

  // Get all permissions
  const allPermissions = await prisma.permission.findMany();
  console.log(`Found ${allPermissions.length} permissions`);

  if (allPermissions.length === 0) {
    console.log("No permissions in database! Running permission seed first...");

    // Create permissions from DEFAULT_PERMISSIONS
    const permissionsToCreate = [
      { name: "users.view", displayName: "View Users", module: "users" },
      { name: "users.create", displayName: "Create Users", module: "users" },
      { name: "users.update", displayName: "Update Users", module: "users" },
      { name: "users.delete", displayName: "Delete Users", module: "users" },
      { name: "roles.view", displayName: "View Roles", module: "roles" },
      { name: "roles.create", displayName: "Create Roles", module: "roles" },
      { name: "roles.update", displayName: "Update Roles", module: "roles" },
      { name: "roles.delete", displayName: "Delete Roles", module: "roles" },
      { name: "roles.assign-permissions", displayName: "Assign Permissions", module: "roles" },
      { name: "news.view", displayName: "View Berita", module: "news" },
      { name: "news.create", displayName: "Create Berita", module: "news" },
      { name: "news.update", displayName: "Update Berita", module: "news" },
      { name: "news.delete", displayName: "Delete Berita", module: "news" },
      { name: "news.publish", displayName: "Publish Berita", module: "news" },
      { name: "agenda.view", displayName: "View Agenda", module: "agenda" },
      { name: "agenda.create", displayName: "Create Agenda", module: "agenda" },
      { name: "agenda.update", displayName: "Update Agenda", module: "agenda" },
      { name: "agenda.delete", displayName: "Delete Agenda", module: "agenda" },
      { name: "downloads.view", displayName: "View Unduhan", module: "downloads" },
      { name: "downloads.create", displayName: "Create Unduhan", module: "downloads" },
      { name: "downloads.update", displayName: "Update Unduhan", module: "downloads" },
      { name: "downloads.delete", displayName: "Delete Unduhan", module: "downloads" },
      { name: "leadership.view", displayName: "View Pimpinan", module: "leadership" },
      { name: "leadership.create", displayName: "Create Pimpinan", module: "leadership" },
      { name: "leadership.update", displayName: "Update Pimpinan", module: "leadership" },
      { name: "leadership.delete", displayName: "Delete Pimpinan", module: "leadership" },
      { name: "staff.view", displayName: "View Tata Usaha", module: "staff" },
      { name: "staff.create", displayName: "Create Tata Usaha", module: "staff" },
      { name: "staff.update", displayName: "Update Tata Usaha", module: "staff" },
      { name: "staff.delete", displayName: "Delete Tata Usaha", module: "staff" },
      { name: "centers.view", displayName: "View Pusat & Unit", module: "centers" },
      { name: "centers.create", displayName: "Create Pusat & Unit", module: "centers" },
      { name: "centers.update", displayName: "Update Pusat & Unit", module: "centers" },
      { name: "centers.delete", displayName: "Delete Pusat & Unit", module: "centers" },
      { name: "spmi.view", displayName: "View SPMI", module: "spmi" },
      { name: "spmi.update", displayName: "Update SPMI", module: "spmi" },
      { name: "spmi-documents.view", displayName: "View Dokumen SPMI", module: "spmi-documents" },
      { name: "spmi-documents.create", displayName: "Create Dokumen SPMI", module: "spmi-documents" },
      { name: "spmi-documents.update", displayName: "Update Dokumen SPMI", module: "spmi-documents" },
      { name: "spmi-documents.delete", displayName: "Delete Dokumen SPMI", module: "spmi-documents" },
      { name: "gpm.view", displayName: "View GPM", module: "gpm" },
      { name: "gpm.create", displayName: "Create GPM", module: "gpm" },
      { name: "gpm.update", displayName: "Update GPM", module: "gpm" },
      { name: "gpm.delete", displayName: "Delete GPM", module: "gpm" },
      { name: "accreditation.view", displayName: "View Akreditasi", module: "accreditation" },
      { name: "accreditation.create", displayName: "Create Akreditasi", module: "accreditation" },
      { name: "accreditation.update", displayName: "Update Akreditasi", module: "accreditation" },
      { name: "accreditation.delete", displayName: "Delete Akreditasi", module: "accreditation" },
      { name: "programs.view", displayName: "View Program Unggulan", module: "programs" },
      { name: "programs.create", displayName: "Create Program Unggulan", module: "programs" },
      { name: "programs.update", displayName: "Update Program Unggulan", module: "programs" },
      { name: "programs.delete", displayName: "Delete Program Unggulan", module: "programs" },
      { name: "expertise.view", displayName: "View Layanan", module: "expertise" },
      { name: "expertise.create", displayName: "Create Layanan", module: "expertise" },
      { name: "expertise.update", displayName: "Update Layanan", module: "expertise" },
      { name: "expertise.delete", displayName: "Delete Layanan", module: "expertise" },
      { name: "links.view", displayName: "View Tautan", module: "links" },
      { name: "links.create", displayName: "Create Tautan", module: "links" },
      { name: "links.update", displayName: "Update Tautan", module: "links" },
      { name: "links.delete", displayName: "Delete Tautan", module: "links" },
      { name: "tautan-layanan.view", displayName: "View Tautan Layanan", module: "tautan-layanan" },
      { name: "tautan-layanan.create", displayName: "Create Tautan Layanan", module: "tautan-layanan" },
      { name: "tautan-layanan.update", displayName: "Update Tautan Layanan", module: "tautan-layanan" },
      { name: "tautan-layanan.delete", displayName: "Delete Tautan Layanan", module: "tautan-layanan" },
      { name: "gallery.view", displayName: "View Data Galeri", module: "gallery" },
      { name: "gallery.create", displayName: "Create Data Galeri", module: "gallery" },
      { name: "gallery.update", displayName: "Update Data Galeri", module: "gallery" },
      { name: "gallery.delete", displayName: "Delete Data Galeri", module: "gallery" },
      { name: "books.view", displayName: "View Data Buku", module: "books" },
      { name: "books.create", displayName: "Create Data Buku", module: "books" },
      { name: "books.update", displayName: "Update Data Buku", module: "books" },
      { name: "books.delete", displayName: "Delete Data Buku", module: "books" },
      { name: "settings.view", displayName: "View Konfigurasi", module: "settings" },
      { name: "settings.update", displayName: "Update Konfigurasi", module: "settings" },
      { name: "dashboard.view", displayName: "View Dashboard", module: "dashboard" },
      { name: "dashboard.analytics", displayName: "View Analytics", module: "dashboard" },
    ];

    for (const perm of permissionsToCreate) {
      await prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      });
    }
    console.log("Permissions created!");
  }

  // Get all permissions again
  const permissions = await prisma.permission.findMany();

  // Assign all permissions to admin role
  console.log("Assigning permissions to admin role...");

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(`Assigned ${permissions.length} permissions to admin role`);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
