import { prisma } from "../lib/prisma";

async function addAdmin() {
  const adminEmail = "alriansr@gmail.com";
  const adminName = "Ahmad Rian";
  
  console.log("🔧 Adding admin to database...");
  
  try {
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
          role: "ADMIN",
        }
      });
      console.log("✅ Admin updated:", updated.email);
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          role: "ADMIN",
        }
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
