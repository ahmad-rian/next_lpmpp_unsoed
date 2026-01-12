import { prisma } from "../lib/prisma";

async function addAdmin() {
  const adminEmail = "alriansr@gmail.com";
  const adminName = "Ahmad Rian";
  
  console.log("🔧 Adding admin to database...");
  
  try {
    // Ensure admin role exists
    const adminRole = await prisma.role.upsert({
      where: { name: "admin" },
      update: {},
      create: {
        name: "admin",
        displayName: "Administrator",
        description: "Full system access",
        color: "#ef4444",
        isSystem: true,
      },
    });

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existing) {
      console.log("ℹ️  User already exists, updating...");
      const updated = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          name: adminName,
        }
      });
      
      // Ensure user has admin role
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: updated.id,
            roleId: adminRole.id,
          },
        },
        update: {},
        create: {
          userId: updated.id,
          roleId: adminRole.id,
        },
      });
      
      console.log("✅ Admin updated:", updated.email);
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
        }
      });
      
      // Assign admin role to new user
      await prisma.userRole.create({
        data: {
          userId: newUser.id,
          roleId: adminRole.id,
        },
      });
      
      console.log("✅ Admin created:", newUser.email);
    }
    
    console.log("\n🎉 Success! You can now login with:", adminEmail);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
