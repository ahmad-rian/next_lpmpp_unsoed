import { prisma } from "../lib/prisma";

async function checkAll() {
  const users = await prisma.user.findMany({
    include: { accounts: true }
  });
  
  console.log("📊 All Users in Database:");
  console.log(JSON.stringify(users, null, 2));
}

checkAll()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
