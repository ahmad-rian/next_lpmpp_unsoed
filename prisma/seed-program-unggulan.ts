import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const featuredPrograms = [
  {
    title: 'Pembelajaran di Luar Kampus (MBKM)',
    slug: 'pembelajaran-di-luar-kampus-mbkm',
    description:
      '<h2 class="text-xl font-semibold">Pembelajaran di Luar Kampus (MBKM)</h2>' +
      '<p>Untuk memenuhi dan/atau memperkaya capaian pembelajaran, mahasiswa dimungkinkan untuk mengikuti kegiatan <strong>pembelajaran di luar kampus</strong> dan diakui sebagai proses pembelajaran yang terintegrasi dengan pembelajaran di dalam kampus.</p>' +
      '<p>Kegiatan tersebut dapat berbentuk <em>magang</em>, <em>asistensi mengajar</em> di satuan pendidikan, <em>kewirausahaan</em>, <em>program membangun desa/KKN Tematik</em>, <em>riset</em>, <em>proyek kemanusiaan</em>, <em>studi independen</em>, dan <em>pertukaran mahasiswa</em> (dalam/luar negeri).</p>' +
      '<p>Peraturan mengenai MBKM dapat diunduh pada tautan: <strong>Peraturan MBKM</strong>.</p>',
    order: 1,
    isActive: true,
  },
  {
    title: 'Insentif Buku Ajar',
    slug: 'insentif-buku-ajar',
    description:
      '<h2 class="text-xl font-semibold">Pemberian Insentif Buku Ajar</h2>' +
      '<p>Berdasarkan Peraturan Rektor UNSOED No. 23 Tahun 2021 tentang Standar dan Ketentuan Pengajuan Insentif Publikasi Ilmiah dan Kekayaan Intelektual, dosen Unsoed yang telah menerbitkan <strong>Buku Ajar</strong> dapat mengajukan insentif penulisan buku ajar.</p>' +
      '<p>Satu orang tenaga fungsional hanya berhak mendapat sebanyak-banyaknya 1 (satu) kali insentif dalam 1 (satu) tahun. Insentif Buku Ajar maksimal sebesar <strong>Rp. 15.000.000</strong> (lima belas juta rupiah) dan dikenakan pajak yang berlaku.</p>' +
      '<p>Semua biaya yang diperlukan pada proses penulisan, penelaahan, editing hingga penerbitan menjadi <em>tanggung jawab penulis/tim penulis</em>.</p>' +
      '<h3 class="mt-3 font-semibold">Ketentuan Buku Ajar:</h3>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Merupakan buku pegangan untuk suatu mata kuliah dalam satu semester;</li><li>Ditulis dan disusun oleh tenaga fungsional yang mengampu matakuliah terkait;</li><li>Memenuhi kaidah buku ajar (kompetensi, tujuan pembelajaran, contoh soal, kisi-kisi jawaban, daftar pustaka, glosarium, indeks subjek);</li><li>Diterbitkan oleh <strong>Unsoed Press</strong> dan memiliki ISBN;</li><li>Memuat paling sedikit 60 halaman cetak (spasi tunggal, ukuran 15,5 cm x 23 cm);</li><li>Jika penulis lebih dari satu, Penulis Utama harus dosen UNSOED;</li></ul>' +
      '<p>Ketentuan lebih rinci tentang Buku Ajar dapat dilihat pada <em>Panduan Penulisan Buku Ilmiah Tahun 2023</em>, yang dapat diunduh pada menu Unduhan website LP3M.</p>' +
      '<h3 class="mt-3 font-semibold">Cara Pengajuan Insentif:</h3>' +
      '<ol class="list-decimal pl-5 space-y-1"><li>Penulis utama (pertama) mengajukan surat permohonan kepada Rektor dengan surat pengantar dari Dekan. Surat dikirim ke bagian Rumah Tangga, Gd Rektorat Lantai 1.</li><li>Surat disertai dengan lampiran: 2 eksemplar Buku Ajar ber-ISBN; surat bukti telaah oleh penelaah isi (Doktor/Profesor kompeten); surat bukti telaah oleh penyelaras bahasa; surat pernyataan bermaterai bahwa buku belum didanai pemerintah; fotokopi nomor rekening bank pengusul.</li></ol>' +
      '<h3 class="mt-3 font-semibold">Catatan:</h3>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Buku ajar yang dapat diberikan insentif terbit paling lama TS-1 dari saat pengajuan.</li><li>Jika jumlah usulan melebihi kuota, akan diikutkan pada periode berikutnya. Kuota Tahun 2024 sebanyak <strong>20 judul</strong>.</li><li>Surat penugasan penulis/tim penulis dan penugasan penelaah isi/bahasa dapat dimintakan kepada Dekan masing-masing (tidak ada format baku).</li><li>LP3M hanya memproses usulan terkait insentif Buku Ajar.</li></ul>',
    order: 2,
    isActive: true,
  },
  {
    title: 'Pelatihan Penyusunan Dokumen SPMI',
    slug: 'pelatihan-penyusunan-dokumen-spmi',
    description:
      '<h2 class="text-xl font-semibold">Pelatihan Penyusunan Dokumen SPMI</h2>' +
      '<p>Pelatihan untuk meningkatkan kompetensi sivitas akademika dalam <strong>penyusunan dokumen SPMI</strong> yang lengkap dan sesuai standar.</p>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Standar dan kebijakan SPMI</li><li>Struktur dokumen dan tata kelola</li><li>Best practices penulisan dan pengarsipan</li></ul>',
    order: 3,
    isActive: true,
  },
  {
    title: 'Pelatihan Penerapan Siklus SPMI',
    slug: 'pelatihan-penerapan-siklus-spmi',
    description:
      '<h2 class="text-xl font-semibold">Pelatihan Penerapan Siklus SPMI</h2>' +
      '<p>Fokus pada penerapan siklus <strong>PPEPP</strong> (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan) dalam unit kerja.</p>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Strategi implementasi PPEPP</li><li>Monitoring dan evaluasi berkelanjutan</li><li>Perbaikan mutu berkesinambungan</li></ul>',
    order: 4,
    isActive: true,
  },
  {
    title: 'Pelatihan Audit Mutu Internal (AMI)',
    slug: 'pelatihan-audit-mutu-internal',
    description:
      '<h2 class="text-xl font-semibold">Pelatihan Audit Mutu Internal</h2>' +
      '<p>Program untuk mempersiapkan <strong>auditor internal</strong> yang kompeten dalam melaksanakan AMI.</p>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Teknik audit dan penyusunan instrumen</li><li>Pelaksanaan audit</li><li>Pelaporan hasil sesuai standar SPMI</li></ul>',
    order: 5,
    isActive: true,
  },
  {
    title: 'ToT Auditor SPMI',
    slug: 'tot-auditor-spmi',
    description:
      '<h2 class="text-xl font-semibold">Training of Trainer (ToT) Auditor SPMI</h2>' +
      '<p>Program ToT untuk auditor yang tidak hanya kompeten, tetapi juga mampu <em>melatih auditor lainnya</em>.</p>',
    order: 6,
    isActive: true,
  },
  {
    title: 'Pelatihan Penulisan Buku Ajar Perguruan Tinggi',
    slug: 'pelatihan-penulisan-buku-ajar-pt',
    description:
      '<h2 class="text-xl font-semibold">Pelatihan Penulisan Buku Ajar Perguruan Tinggi</h2>' +
      '<p>Meningkatkan kompetensi dosen dalam penulisan <strong>buku ajar berkualitas</strong> sesuai standar penerbitan.</p>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Teknik penulisan dan struktur buku ajar</li><li>Pengembangan materi dan contoh soal</li><li>Proses editorial dan penerbitan</li></ul>',
    order: 7,
    isActive: true,
  },
  {
    title: 'Pelatihan Learning Management System (LMS) untuk Pembelajaran Daring',
    slug: 'pelatihan-lms',
    description:
      '<h2 class="text-xl font-semibold">Pelatihan LMS untuk Pembelajaran Daring</h2>' +
      '<p>Meningkatkan kompetensi dosen dalam penggunaan <strong>LMS</strong> untuk pembelajaran online.</p>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Pengelolaan kelas virtual</li><li>Pembuatan konten digital</li><li>Penilaian dan interaksi online</li></ul>',
    order: 8,
    isActive: true,
  },
  {
    title: 'Pelatihan Kurikulum Perguruan Tinggi Berbasis Luaran (Kurikulum OBE)',
    slug: 'pelatihan-kurikulum-obe',
    description:
      '<h2 class="text-xl font-semibold">Pelatihan Kurikulum OBE</h2>' +
      '<p>Mengimplementasikan pendekatan <strong>Outcome Based Education (OBE)</strong> dalam proses pendidikan.</p>' +
      '<ul class="list-disc pl-5 space-y-1"><li>Penyusunan Capaian Pembelajaran</li><li>Pengembangan kurikulum berbasis OBE</li><li>Metode student-centered learning</li><li>Sistem penilaian berbasis capaian</li></ul>',
    order: 9,
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
