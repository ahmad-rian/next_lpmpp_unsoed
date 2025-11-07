import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const linksData = [
  { name: "SAPTO 2", url: "https://sapto2.kemdikbud.go.id", order: 1 },
  { name: "BAN-PT", url: "https://www.banpt.or.id", order: 2 },
  { name: "PDDIKTI", url: "https://pddikti.kemdikbud.go.id", order: 3 },
  { name: "LAM PENDIDIKAN (LAMDIK)", url: "https://lamdik.or.id", order: 4 },
  { name: "LAM INFOKOM", url: "https://www.laminfokom.or.id", order: 5 },
  { name: "LAM Ilmu Sosial, Politik, Administrasi, dan Komunikasi (LAMSPAK)", url: "https://lamspak.or.id", order: 6 },
  { name: "LAM Perguruan Tinggi Kesehatan (LAMPTKES)", url: "https://lamptkes.org", order: 7 },
  { name: "LAM PERGURUAN TINGGI ILMU PERTANIAN (LAMPTIP)", url: "https://lamptip.org", order: 8 },
  { name: "LAM Sains Alam dan Ilmu Formal (LAMSAMA)", url: "https://lamsama.or.id", order: 9 },
  { name: "LAM Ekonomi, Manajemen, Bisnis, dan Akuntansi (LAMEMBA)", url: "https://lamemba.or.id", order: 10 },
  { name: "LAM TEKNIK", url: "https://lamteknik.or.id", order: 11 },
];

async function main() {
  console.log("🌱 Starting seed for Links data...");

  // Clear existing data
  console.log("🗑️  Clearing existing links...");
  await prisma.link.deleteMany();

  console.log("\n📝 Inserting Links...");
  for (const link of linksData) {
    await prisma.link.create({
      data: link,
    });
    console.log(`✅ [${link.order}] ${link.name} - ${link.url}`);
  }

  console.log("\n✨ Seed completed successfully!");
  console.log(`📊 Total links seeded: ${linksData.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
