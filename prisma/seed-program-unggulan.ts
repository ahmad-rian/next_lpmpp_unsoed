import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const featuredPrograms = [
  {
    title: 'MBKM (Merdeka Belajar Kampus Merdeka)',
    slug: 'mbkm',
    description: '<h2>Program Merdeka Belajar Kampus Merdeka</h2><p>Program Merdeka Belajar Kampus Merdeka adalah kebijakan <strong>Kementerian Pendidikan dan Kebudayaan</strong> yang memberikan kesempatan kepada mahasiswa untuk mengasah kemampuan sesuai bakat dan minat dengan terjun langsung ke dunia kerja sebagai persiapan karir masa depan.</p><p>Program ini memfasilitasi mahasiswa untuk belajar di luar program studi selama <strong>3 semester</strong>, baik di dalam maupun luar perguruan tinggi.</p><h3>Manfaat Program:</h3><ul><li>Pengalaman praktis di dunia kerja</li><li>Pengembangan soft skills dan hard skills</li><li>Networking dengan industri</li><li>Persiapan karir yang lebih matang</li></ul>',
    order: 1,
    isActive: true,
  },
  {
    title: 'Insentif Buku Ajar',
    slug: 'insentif-buku-ajar',
    description: '<h2>Program Insentif Buku Ajar</h2><p>Program pemberian insentif untuk mendorong dosen dalam menulis dan menerbitkan <strong>buku ajar berkualitas</strong>.</p><h3>Tujuan Program:</h3><ul><li>Meningkatkan kualitas pembelajaran</li><li>Menyediakan referensi yang relevan bagi mahasiswa</li><li>Mendorong produktivitas dosen dalam penulisan karya ilmiah</li></ul><p>Insentif diberikan kepada dosen yang telah menyelesaikan penulisan buku ajar dan memenuhi <em>standar kualitas yang ditetapkan</em>.</p>',
    order: 2,
    isActive: true,
  },
  {
    title: 'Pelatihan SPMI (Sistem Penjaminan Mutu Internal)',
    slug: 'pelatihan-spmi',
    description: '<h2>Pelatihan SPMI</h2><p>Pelatihan untuk meningkatkan pemahaman dan kompetensi sivitas akademika dalam implementasi <strong>Sistem Penjaminan Mutu Internal (SPMI)</strong>.</p><h3>Materi Pelatihan:</h3><ol><li>Standar SPMI</li><li>Siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan)</li><li>Praktik terbaik dalam pengelolaan mutu pendidikan tinggi</li></ol><blockquote>Program ini dirancang untuk memastikan mutu pendidikan tinggi di Universitas Jenderal Soedirman</blockquote>',
    order: 3,
    isActive: true,
  },
  {
    title: 'Pelatihan Audit Mutu Internal (AMI)',
    slug: 'pelatihan-audit-mutu-internal',
    description: '<h2>Pelatihan Audit Mutu Internal</h2><p>Program pelatihan untuk mempersiapkan <strong>auditor internal</strong> yang kompeten dalam melaksanakan audit mutu internal perguruan tinggi.</p><h3>Cakupan Materi:</h3><ul><li>Teknik audit</li><li>Penyusunan instrumen audit</li><li>Pelaksanaan audit</li><li>Pelaporan hasil audit sesuai standar SPMI</li></ul>',
    order: 4,
    isActive: true,
  },
  {
    title: 'ToT (Training of Trainer) Auditor',
    slug: 'tot-auditor',
    description: '<h2>Training of Trainer Auditor</h2><p>Program <strong>Training of Trainer</strong> untuk mempersiapkan auditor yang tidak hanya kompeten dalam melakukan audit, tetapi juga mampu <em>melatih auditor lainnya</em>.</p><p>Program ini bertujuan untuk mengembangkan pool auditor internal yang berkualitas dan berkelanjutan di lingkungan Universitas Jenderal Soedirman.</p>',
    order: 5,
    isActive: true,
  },
  {
    title: 'Pelatihan Penulisan Buku Ajar',
    slug: 'pelatihan-penulisan-buku-ajar',
    description: '<h2>Pelatihan Penulisan Buku Ajar</h2><p>Pelatihan untuk meningkatkan kompetensi dosen dalam menulis <strong>buku ajar yang berkualitas</strong> dan sesuai dengan standar penerbitan.</p><h3>Materi Pelatihan:</h3><ol><li>Teknik penulisan</li><li>Struktur buku ajar</li><li>Pengembangan materi pembelajaran</li><li>Proses penerbitan buku ajar</li></ol>',
    order: 6,
    isActive: true,
  },
  {
    title: 'Pelatihan Learning Management System (LMS)',
    slug: 'pelatihan-lms',
    description: '<h2>Pelatihan LMS</h2><p>Pelatihan untuk meningkatkan kompetensi dosen dalam menggunakan <strong>Learning Management System (LMS)</strong> untuk pembelajaran daring.</p><h3>Topik yang Dibahas:</h3><ul><li>Pengelolaan kelas virtual</li><li>Pembuatan konten pembelajaran digital</li><li>Penilaian online</li><li>Interaksi dengan mahasiswa melalui platform LMS</li></ul>',
    order: 7,
    isActive: true,
  },
  {
    title: 'Pelatihan Outcome Based Education (OBE)',
    slug: 'pelatihan-obe',
    description: '<h2>Pelatihan OBE</h2><p>Pelatihan untuk mengimplementasikan pendekatan <strong>Outcome Based Education (OBE)</strong> dalam proses pembelajaran.</p><h3>Materi Utama:</h3><ul><li>Penyusunan Capaian Pembelajaran (CP)</li><li>Pengembangan kurikulum berbasis OBE</li><li>Metode pembelajaran yang berpusat pada mahasiswa</li><li>Sistem penilaian berbasis capaian pembelajaran</li></ul><p><em>Pendekatan OBE memastikan pembelajaran fokus pada hasil yang terukur</em></p>',
    order: 8,
    isActive: true,
  },
];

async function main() {
  console.log('🌱 Starting seed for Featured Programs...');

  // Clear existing data
  console.log('🗑️  Clearing existing featured programs...');
  await prisma.featuredProgram.deleteMany();

  // Insert new data
  console.log('📝 Inserting featured programs...');
  for (const program of featuredPrograms) {
    await prisma.featuredProgram.create({
      data: program,
    });
    console.log(`✅ Created: ${program.title}`);
  }

  console.log('✨ Seed completed successfully!');
  console.log(`📊 Total programs seeded: ${featuredPrograms.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
