import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAccreditations() {
  console.log("🌱 Seeding accreditations...");

  // Seed International Accreditations
  console.log("📝 Seeding International Accreditations...");
  const internationalData = [
    {
      facultyName: "Fakultas Kedokteran",
      programName: "Kedokteran",
      agency: "World Federation for Medical Education (WFME)",
      order: 1,
    },
    {
      facultyName: "Fakultas Kedokteran",
      programName: "Keperawatan",
      agency: "ASEAN University Network - Quality Assurance (AUN-QA)",
      order: 2,
    },
    {
      facultyName: "Fakultas Ekonomi dan Bisnis",
      programName: "Akuntansi",
      agency: "ASEAN University Network - Quality Assurance (AUN-QA)",
      order: 3,
    },
    {
      facultyName: "Fakultas Pertanian",
      programName: "Agroteknologi",
      agency: "ASEAN University Network - Quality Assurance (AUN-QA)",
      order: 4,
    },
    {
      facultyName: "Fakultas Teknik",
      programName: "Teknik Sipil",
      agency: "ASEAN University Network - Quality Assurance (AUN-QA)",
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
    { programName: "Kedokteran", level: "S1", skNumber: "123/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rating: "UNGGUL", order: 1 },
    { programName: "Keperawatan", level: "S1", skNumber: "456/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rating: "UNGGUL", order: 2 },
    { programName: "Farmasi", level: "S1", skNumber: "789/SK/BAN-PT/Akred/S/III/2023", skYear: 2023, rating: "BAIK SEKALI", order: 3 },
    { programName: "Akuntansi", level: "S1", skNumber: "101/SK/BAN-PT/Akred/S/IV/2023", skYear: 2023, rating: "UNGGUL", order: 4 },
    { programName: "Manajemen", level: "S1", skNumber: "102/SK/BAN-PT/Akred/S/IV/2023", skYear: 2023, rating: "BAIK SEKALI", order: 5 },
    { programName: "Ilmu Ekonomi", level: "S1", skNumber: "103/SK/BAN-PT/Akred/S/V/2023", skYear: 2023, rating: "BAIK SEKALI", order: 6 },
    { programName: "Agroteknologi", level: "S1", skNumber: "201/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rating: "UNGGUL", order: 7 },
    { programName: "Peternakan", level: "S1", skNumber: "202/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rating: "BAIK SEKALI", order: 8 },
    { programName: "Teknik Sipil", level: "S1", skNumber: "301/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rating: "BAIK SEKALI", order: 9 },
    { programName: "Teknik Elektro", level: "S1", skNumber: "302/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rating: "BAIK", order: 10 },
    { programName: "Ilmu Hukum", level: "S1", skNumber: "401/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rating: "BAIK SEKALI", order: 11 },
    { programName: "Biologi", level: "S1", skNumber: "501/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rating: "BAIK", order: 12 },
    { programName: "Matematika", level: "S1", skNumber: "502/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rating: "BAIK", order: 13 },
    { programName: "Fisika", level: "S1", skNumber: "503/SK/BAN-PT/Akred/S/III/2023", skYear: 2023, rating: "BAIK", order: 14 },
    { programName: "Kimia", level: "S1", skNumber: "504/SK/BAN-PT/Akred/S/IV/2023", skYear: 2023, rating: "BAIK", order: 15 },
    { programName: "Pendidikan Matematika", level: "S1", skNumber: "601/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rating: "BAIK SEKALI", order: 16 },
    { programName: "Pendidikan Bahasa Inggris", level: "S1", skNumber: "602/SK/BAN-PT/Akred/S/II/2023", skYear: 2023, rating: "BAIK SEKALI", order: 17 },
    { programName: "Ilmu Komunikasi", level: "S1", skNumber: "701/SK/BAN-PT/Akred/S/I/2023", skYear: 2023, rating: "BAIK", order: 18 },
    { programName: "Magister Manajemen", level: "S2", skNumber: "801/SK/BAN-PT/Akred/M/I/2023", skYear: 2023, rating: "BAIK SEKALI", order: 19 },
    { programName: "Magister Hukum", level: "S2", skNumber: "802/SK/BAN-PT/Akred/M/II/2023", skYear: 2023, rating: "BAIK", order: 20 },
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
