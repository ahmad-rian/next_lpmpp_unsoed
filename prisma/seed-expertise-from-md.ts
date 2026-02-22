import fs from "fs";
import path from "path";
import { PrismaClient, ExpertiseType } from "@prisma/client";

const prisma = new PrismaClient();

function readMarkdown(filePath: string): string {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Markdown file not found at ${abs}`);
  }
  return fs.readFileSync(abs, "utf-8");
}

function extractSection(md: string, sectionTitle: string): string {
  // Find the section starting with "## <title>" until the next "## " or end of file
  const titleRegex = new RegExp(`^##\\s+${sectionTitle}\\s*$`, "mi");
  const match = md.match(titleRegex);
  if (!match || match.index === undefined) return "";
  const headerStart = match.index;
  const headerEnd = md.indexOf("\n", headerStart);
  const sectionStart = headerEnd >= 0 ? headerEnd + 1 : headerStart;
  // Find next header AFTER the current header
  const nextHeaderMarker = md.indexOf("\n## ", sectionStart);
  const sectionEnd = nextHeaderMarker >= 0 ? nextHeaderMarker + 1 /* exclude preceding \n */ : md.length;
  return md.slice(sectionStart, sectionEnd);
}

function parseTableRows(section: string): string[] {
  const lines = section.split(/\r?\n/);
  const names: string[] = [];
  const rowRegex = /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*$/;
  for (const line of lines) {
    if (line.startsWith("|") && !line.includes("----")) {
      const m = line.match(rowRegex);
      if (m) {
        const name = m[2].trim();
        if (name && name.toLowerCase() !== "nama fasilitator" && name.toLowerCase() !== "nama auditor" && name.toLowerCase() !== "nama asesor") {
          names.push(name);
        }
      }
    }
  }
  return names;
}

async function seedFromMarkdown() {
  console.log("🌱 Seeding Expertise from kepakaran.md");
  const md = readMarkdown("kepakaran.md");

  const fasilitatorSection = extractSection(md, "Fasilitator Pekerti / AA");
  const auditorSection = extractSection(md, "Auditor Mutu Internal");
  const asesorSection = extractSection(md, "Asesor BKD");

  const fasilitators = parseTableRows(fasilitatorSection);
  const auditors = parseTableRows(auditorSection);
  const asesors = parseTableRows(asesorSection);

  console.log(`📄 Parsed counts -> Fasilitator: ${fasilitators.length}, Auditor: ${auditors.length}, Asesor: ${asesors.length}`);

  console.log("🗑️  Clearing existing expertise...");
  await prisma.expertise.deleteMany();

  let totalCreated = 0;

  for (let i = 0; i < fasilitators.length; i++) {
    await prisma.expertise.create({
      data: {
        type: ExpertiseType.PELATIHAN_PEKERTI_AA,
        name: fasilitators[i],
        order: i + 1,
      },
    });
    totalCreated++;
  }

  for (let i = 0; i < auditors.length; i++) {
    await prisma.expertise.create({
      data: {
        type: ExpertiseType.PELATIHAN_SPMI_AMI,
        name: auditors[i],
        order: i + 1,
      },
    });
    totalCreated++;
  }

  for (let i = 0; i < asesors.length; i++) {
    await prisma.expertise.create({
      data: {
        type: ExpertiseType.EVALUASI_BKD,
        name: asesors[i],
        order: i + 1,
      },
    });
    totalCreated++;
  }

  console.log("✨ Seed completed.");
  console.log(`📊 Total records: ${totalCreated}`);
  console.log(`   - Fasilitator Pekerti/AA: ${fasilitators.length}`);
  console.log(`   - Auditor SPMI: ${auditors.length}`);
  console.log(`   - Asesor BKD: ${asesors.length}`);
}

seedFromMarkdown()
  .catch((e) => {
    console.error("❌ Error seeding expertise from markdown:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });