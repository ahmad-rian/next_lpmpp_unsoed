import { prisma } from "../lib/prisma";

async function checkAndFixAdmin() {
  const adminEmail = "alriansr@gmail.com";
  
  console.log("🔍 Checking database for:", adminEmail);
  
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
  
  // Get user with accounts and roles
  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { 
      accounts: true,
      roles: {
        include: {
          role: true,
        },
      },
    }
  });
  
  if (!user) {
    console.log("❌ User not found in database");
    console.log("✅ User will be created on next login");
    return;
  }
  
  const userRoles = user.roles.map(r => r.role.name);
  const isAdmin = userRoles.includes("admin");
  
  console.log("\n📊 User Data:");
  console.log("- Email:", user.email);
  console.log("- Name:", user.name);
  console.log("- Roles:", userRoles.join(", ") || "none");
  console.log("- Accounts:", user.accounts.length);
  
  if (user.accounts.length > 0) {
    console.log("\n🔑 Connected Accounts:");
    user.accounts.forEach((account, index) => {
      console.log(`  ${index + 1}. Provider: ${account.provider}`);
      console.log(`     Provider Account ID: ${account.providerAccountId}`);
    });
  }
  
  // Check if there are duplicate accounts
  if (user.accounts.length > 1) {
    const providers = user.accounts.map(a => a.provider);
    const googleAccounts = providers.filter(p => p === "google");
    
    if (googleAccounts.length > 1) {
      console.log("\n⚠️  Multiple Google accounts detected!");
      console.log("🔧 Cleaning up...");
      
      // Keep only the latest account
      const sortedAccounts = user.accounts
        .filter(a => a.provider === "google")
        .sort((a, b) => b.id.localeCompare(a.id));
      
      // Delete older accounts
      for (let i = 1; i < sortedAccounts.length; i++) {
        await prisma.account.delete({
          where: { id: sortedAccounts[i].id }
        });
        console.log(`✅ Deleted duplicate account: ${sortedAccounts[i].id}`);
      }
    }
  }
  
  // Ensure user has admin role
  if (!isAdmin) {
    console.log("\n🔧 Adding admin role...");
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: adminRole.id,
      },
    });
    console.log("✅ Admin role assigned");
  }
  
  console.log("\n✅ Database check complete!");
  console.log("🚀 You can now login with Google");
}

checkAndFixAdmin()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
