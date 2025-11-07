import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const downloadsData = [
  {
    name: "Panduan Akreditasi Institusi Perguruan Tinggi",
    description: "Panduan lengkap untuk proses akreditasi institusi perguruan tinggi oleh BAN-PT",
    fileUrl: "/documents/panduan-akreditasi-institusi.pdf",
    fileType: "pdf",
    fileSize: 2458624, // ~2.4 MB
    downloadCount: 45,
  },
  {
    name: "Borang Akreditasi Program Studi",
    description: "Template borang akreditasi untuk program studi",
    fileUrl: "/documents/borang-akreditasi-prodi.docx",
    fileType: "docx",
    fileSize: 1024000, // ~1 MB
    downloadCount: 78,
  },
  {
    name: "Instrumen Evaluasi Diri SPMI",
    description: "Instrumen evaluasi diri untuk Sistem Penjaminan Mutu Internal",
    fileUrl: "/documents/instrumen-evaluasi-diri-spmi.pdf",
    fileType: "pdf",
    fileSize: 1536000, // ~1.5 MB
    downloadCount: 32,
  },
  {
    name: "Standar Nasional Pendidikan Tinggi (SN-DIKTI)",
    description: "Dokumen standar nasional pendidikan tinggi terbaru",
    fileUrl: "/documents/sn-dikti.pdf",
    fileType: "pdf",
    fileSize: 3072000, // ~3 MB
    downloadCount: 56,
  },
  {
    name: "Formulir Usulan Penelitian",
    description: "Template formulir untuk pengajuan usulan penelitian",
    fileUrl: "/documents/formulir-usulan-penelitian.docx",
    fileType: "docx",
    fileSize: 768000, // ~750 KB
    downloadCount: 91,
  },
  {
    name: "Panduan Penyusunan Laporan Evaluasi Diri",
    description: "Panduan lengkap dalam menyusun laporan evaluasi diri institusi",
    fileUrl: "/documents/panduan-laporan-evaluasi-diri.pdf",
    fileType: "pdf",
    fileSize: 2048000, // ~2 MB
    downloadCount: 28,
  },
  {
    name: "Matriks Penilaian Instrumen Akreditasi",
    description: "Matriks penilaian untuk instrumen akreditasi program studi",
    fileUrl: "/documents/matriks-penilaian-akreditasi.pdf",
    fileType: "pdf",
    fileSize: 1792000, // ~1.7 MB
    downloadCount: 41,
  },
  {
    name: "Template Dokumen Kurikulum",
    description: "Template dokumen untuk penyusunan kurikulum program studi",
    fileUrl: "/documents/template-dokumen-kurikulum.docx",
    fileType: "docx",
    fileSize: 896000, // ~875 KB
    downloadCount: 63,
  },
];

async function main() {
  console.log("Start seeding downloads...");

  for (const download of downloadsData) {
    const created = await prisma.download.create({
      data: download,
    });
    console.log(`Created download: ${created.name}`);
  }

  console.log("Seeding downloads completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
