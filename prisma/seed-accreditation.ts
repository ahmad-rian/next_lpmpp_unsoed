import { PrismaClient, AccreditationLevel, AccreditationRank } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAccreditations() {
  console.log("🌱 Seeding accreditations...");

  // Seed International Accreditations
  console.log("📝 Seeding International Accreditations...");
  const internationalData = [
    {
      faculty: "Fakultas Kedokteran",
      studyProgram: "Kedokteran",
      accreditationBody: "World Federation for Medical Education (WFME)",
      order: 1,
    },
    {
      faculty: "Fakultas Kedokteran",
      studyProgram: "Keperawatan",
      accreditationBody: "ASEAN University Network - Quality Assurance (AUN-QA)",
      order: 2,
    },
    {
      faculty: "Fakultas Ekonomi dan Bisnis",
      studyProgram: "Akuntansi",
      accreditationBody: "ASEAN University Network - Quality Assurance (AUN-QA)",
      order: 3,
    },
    {
      faculty: "Fakultas Pertanian",
      studyProgram: "Agroteknologi",
      accreditationBody: "ASEAN University Network - Quality Assurance (AUN-QA)",
      order: 4,
    },
    {
      faculty: "Fakultas Teknik",
      studyProgram: "Teknik Sipil",
      accreditationBody: "ASEAN University Network - Quality Assurance (AUN-QA)",
      order: 5,
    },
  ];

  for (const data of internationalData) {
    await prisma.internationalAccreditation.upsert({
      where: { id: `int-${data.order}` },
      update: data,
      create: {
        id: `int-${data.order}`,
        ...data,
      },
    });
  }
  console.log(`✅ Created ${internationalData.length} international accreditations`);

  // Seed Study Program Accreditations
  console.log("📝 Seeding Study Program Accreditations...");
  const studyProgramData = [
    { studyProgram: "Kedokteran", level: AccreditationLevel.S1, skNumber: "123/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rank: AccreditationRank.UNGGUL, order: 1 },
    { studyProgram: "Keperawatan", level: AccreditationLevel.S1, skNumber: "456/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rank: AccreditationRank.UNGGUL, order: 2 },
    { studyProgram: "Farmasi", level: AccreditationLevel.S1, skNumber: "789/SK/BAN-PT/Akred/S/III/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 3 },
    { studyProgram: "Akuntansi", level: AccreditationLevel.S1, skNumber: "101/SK/BAN-PT/Akred/S/IV/2023", skYear: 2023, rank: AccreditationRank.UNGGUL, order: 4 },
    { studyProgram: "Manajemen", level: AccreditationLevel.S1, skNumber: "102/SK/BAN-PT/Akred/S/IV/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 5 },
    { studyProgram: "Ilmu Ekonomi", level: AccreditationLevel.S1, skNumber: "103/SK/BAN-PT/Akred/S/V/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 6 },
    { studyProgram: "Agroteknologi", level: AccreditationLevel.S1, skNumber: "201/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rank: AccreditationRank.UNGGUL, order: 7 },
    { studyProgram: "Peternakan", level: AccreditationLevel.S1, skNumber: "202/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 8 },
    { studyProgram: "Teknik Sipil", level: AccreditationLevel.S1, skNumber: "301/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 9 },
    { studyProgram: "Teknik Elektro", level: AccreditationLevel.S1, skNumber: "302/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rank: AccreditationRank.BAIK, order: 10 },
    { studyProgram: "Ilmu Hukum", level: AccreditationLevel.S1, skNumber: "401/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 11 },
    { studyProgram: "Biologi", level: AccreditationLevel.S1, skNumber: "501/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rank: AccreditationRank.BAIK, order: 12 },
    { studyProgram: "Matematika", level: AccreditationLevel.S1, skNumber: "502/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rank: AccreditationRank.BAIK, order: 13 },
    { studyProgram: "Fisika", level: AccreditationLevel.S1, skNumber: "503/SK/BAN-PT/Akred/S/III/2023", skYear: 2023, rank: AccreditationRank.BAIK, order: 14 },
    { studyProgram: "Kimia", level: AccreditationLevel.S1, skNumber: "504/SK/BAN-PT/Akred/S/IV/2023", skYear: 2023, rank: AccreditationRank.BAIK, order: 15 },
    { studyProgram: "Pendidikan Matematika", level: AccreditationLevel.S1, skNumber: "601/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 16 },
    { studyProgram: "Pendidikan Bahasa Inggris", level: AccreditationLevel.S1, skNumber: "602/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 17 },
    { studyProgram: "Ilmu Komunikasi", level: AccreditationLevel.S1, skNumber: "701/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rank: AccreditationRank.BAIK, order: 18 },
    { studyProgram: "Magister Manajemen", level: AccreditationLevel.S2, skNumber: "801/SK/BAN-PT/Akred/M/I/2023", skYear: 2023, rank: AccreditationRank.BAIK_SEKALI, order: 19 },
    { studyProgram: "Magister Hukum", level: AccreditationLevel.S2, skNumber: "802/SK/BAN-PT/Akred/M/II/2023", skYear: 2023, rank: AccreditationRank.BAIK, order: 20 },
  ];

  for (const data of studyProgramData) {
    await prisma.studyProgramAccreditation.upsert({
      where: { id: `sp-${data.order}` },
      update: data,
      create: {
        id: `sp-${data.order}`,
        ...data,
      },
    });
  }
  console.log(`✅ Created ${studyProgramData.length} study program accreditations`);

  // Seed University Accreditation (Single Entry with Multiple Documents)
  console.log("📝 Seeding University Accreditation...");
  
  const universityAccreditation = await prisma.universityAccreditation.upsert({
    where: { id: "univ-main" },
    update: {
      title: "Akreditasi Institusi Perguruan Tinggi UNSOED",
      description: "Universitas Jenderal Soedirman telah memperoleh akreditasi UNGGUL berdasarkan Surat Keputusan BAN-PT. Akreditasi ini menunjukkan komitmen universitas dalam memberikan pendidikan berkualitas tinggi dan terakreditasi internasional.\n\nAkreditasi ini berlaku untuk periode 2024-2029 dan mencakup seluruh aspek penyelenggaraan pendidikan tinggi di UNSOED.",
      imageUrl: null,
    },
    create: {
      id: "univ-main",
      title: "Akreditasi Institusi Perguruan Tinggi UNSOED",
      description: "Universitas Jenderal Soedirman telah memperoleh akreditasi UNGGUL berdasarkan Surat Keputusan BAN-PT. Akreditasi ini menunjukkan komitmen universitas dalam memberikan pendidikan berkualitas tinggi dan terakreditasi internasional.\n\nAkreditasi ini berlaku untuk periode 2024-2029 dan mencakup seluruh aspek penyelenggaraan pendidikan tinggi di UNSOED.",
      imageUrl: null,
    },
  });
  console.log(`✅ Created university accreditation`);

  // Seed University Accreditation Documents
  console.log("📝 Seeding University Accreditation Documents...");
  const documentsData = [
    {
      id: "doc-1",
      title: "SK Akreditasi Institusi UNSOED 2024",
      order: 1,
    },
    {
      id: "doc-2",
      title: "Sertifikat Akreditasi Perguruan Tinggi",
      order: 2,
    },
    {
      id: "doc-3",
      title: "Laporan Evaluasi Diri UNSOED",
      order: 3,
    },
  ];

  for (const data of documentsData) {
    await prisma.universityAccreditationDocument.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        order: data.order,
      },
      create: {
        id: data.id,
        accreditationId: universityAccreditation.id,
        title: data.title,
        documentUrl: "/documents/placeholder.pdf", // Placeholder URL
        documentName: `${data.title}.pdf`,
        order: data.order,
      },
    });
  }
  console.log(`✅ Created ${documentsData.length} university accreditation documents`);

  console.log("✨ Accreditation seeding completed!");
}

seedAccreditations()
  .catch((error) => {
    console.error("❌ Error seeding accreditations:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
