import { prisma } from "../lib/prisma";

async function resetAdmin() {
  const adminEmail = "alriansr@gmail.com";
  
  console.log("🔍 Looking for user:", adminEmail);
  
  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { accounts: true, sessions: true }
  });
  
  if (!user) {
    console.log("✅ User not found - ready for fresh login");
    return;
  }
  
  console.log(`\n🗑️  Deleting user and related data...`);
  
  // Delete sessions
  if (user.sessions.length > 0) {
    await prisma.session.deleteMany({
      where: { userId: user.id }
    });
    console.log(`✅ Deleted ${user.sessions.length} session(s)`);
  }
  
  // Delete accounts
  if (user.accounts.length > 0) {
    await prisma.account.deleteMany({
      where: { userId: user.id }
    });
    console.log(`✅ Deleted ${user.accounts.length} account(s)`);
  }
  
  // Delete user
  await prisma.user.delete({
    where: { id: user.id }
  });
  console.log(`✅ Deleted user: ${user.email}`);
  
  console.log("\n✅ Reset complete!");
  console.log("🚀 Now try logging in with Google");
  console.log("   The user will be created fresh with proper account linking");
}

resetAdmin()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
