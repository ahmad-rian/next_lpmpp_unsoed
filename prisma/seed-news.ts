import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const newsData = [
  {
    title: "LPMPP Unsoed Bekali Siswa SMKN 1 Kalibagor dengan Keterampilan Pertanian Modern Melalui Pelatihan IoT dan Seni Persuasi",
    slug: "lpmpp-unsoed-bekali-siswa-smkn-1-kalibagor-dengan-keterampilan-pertanian-modern",
    excerpt: "PURWOKERTO, JAWA TENGAH – 17 September 2025 – Dalam rangka menjawab tantangan industri pertanian 4.0, Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LPMPP) Universitas Jenderal Soedirman (Unsoed) menggelar kegiatan Penguatan Pembelajaran Vokasi Pertanian yang menargetkan siswa/i di SMKN 1 Kalibagor.",
    content: `<h2>PURWOKERTO, JAWA TENGAH – 17 September 2025</h2>
<p>Dalam rangka menjawab tantangan industri pertanian 4.0, Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LPMPP) Universitas Jenderal Soedirman (Unsoed) menggelar kegiatan <strong>"Penguatan Pembelajaran Vokasi Pertanian"</strong> yang menargetkan siswa/i di SMKN 1 Kalibagor. Acara yang berlangsung pada hari Rabu, 17 September 2025 ini bertujuan membekali para siswa dengan keterampilan praktis yang relevan dengan kebutuhan industri modern.</p>

<h3>Pelatihan IoT untuk Pertanian Smart</h3>
<p>Salah satu fokus utama pelatihan ini adalah pengenalan teknologi Internet of Things (IoT) dalam bidang pertanian. Para siswa diajak untuk memahami bagaimana sensor dan sistem otomasi dapat meningkatkan efisiensi produksi pertanian, mulai dari monitoring kelembaban tanah hingga pengaturan irigasi otomatis.</p>

<h3>Seni Persuasi dan Komunikasi</h3>
<p>Selain keterampilan teknis, siswa juga dibekali dengan kemampuan soft skills melalui sesi tentang seni persuasi dan komunikasi efektif. Materi ini penting untuk mempersiapkan lulusan yang tidak hanya kompeten secara teknis, namun juga mampu berkomunikasi dengan baik dalam dunia kerja.</p>

<blockquote>
"Kami berharap melalui pelatihan ini, siswa-siswi SMKN 1 Kalibagor dapat menjadi lulusan vokasi yang siap bersaing di era industri 4.0," ujar Kepala LPMPP Unsoed.
</blockquote>

<p>Kegiatan ini merupakan bagian dari komitmen LPMPP Unsoed dalam mendukung pendidikan vokasi di wilayah Banyumas dan sekitarnya.</p>`,
    author: "Admin LP3M",
    publishedAt: new Date("2025-09-17"),
    isPublished: true,
    viewCount: 245,
  },
  {
    title: "Perkuat Budaya Mutu, LPMPP Unsoed Gelar Praktik Audit Mutu Internal di Fakultas Kedokteran",
    slug: "perkuat-budaya-mutu-lpmpp-unsoed-gelar-praktik-audit-mutu-internal",
    excerpt: "PURWOKERTO – 14 Agustus 2025 – Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LPMPP) Universitas Jenderal Soedirman mengadakan kegiatan Praktik Audit Mutu Internal (AMI) di Fakultas Kedokteran Unsoed sebagai upaya memperkuat budaya mutu di lingkungan perguruan tinggi.",
    content: `<h2>PURWOKERTO – 14 Agustus 2025</h2>
<p>Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LPMPP) Universitas Jenderal Soedirman mengadakan kegiatan <strong>Praktik Audit Mutu Internal (AMI)</strong> di Fakultas Kedokteran Unsoed sebagai upaya memperkuat budaya mutu di lingkungan perguruan tinggi.</p>

<h3>Tujuan Audit Mutu Internal</h3>
<p>Audit Mutu Internal merupakan instrumen penting dalam Sistem Penjaminan Mutu Internal (SPMI) yang bertujuan untuk:</p>
<ul>
<li>Mengevaluasi efektivitas implementasi standar mutu</li>
<li>Mengidentifikasi area yang perlu perbaikan</li>
<li>Memastikan kesesuaian dengan standar SNPT (Standar Nasional Pendidikan Tinggi)</li>
<li>Meningkatkan kualitas layanan pendidikan secara berkelanjutan</li>
</ul>

<h3>Proses Audit</h3>
<p>Kegiatan audit melibatkan tim auditor terlatih dari LPMPP yang melakukan pemeriksaan menyeluruh terhadap berbagai aspek, meliputi:</p>
<ol>
<li><strong>Standar Pendidikan:</strong> Kurikulum, proses pembelajaran, dan evaluasi</li>
<li><strong>Standar Penelitian:</strong> Output penelitian dan pengabdian masyarakat</li>
<li><strong>Standar Pengelolaan:</strong> Tata kelola dan manajemen fakultas</li>
<li><strong>Standar Sarana Prasarana:</strong> Kelengkapan dan kualitas fasilitas</li>
</ol>

<h3>Hasil dan Tindak Lanjut</h3>
<p>Hasil audit akan digunakan sebagai bahan evaluasi dan penyusunan rencana perbaikan berkelanjutan (continuous improvement) untuk meningkatkan kualitas pendidikan di Fakultas Kedokteran.</p>

<blockquote>
"Audit Mutu Internal bukan hanya tentang mencari kesalahan, tetapi lebih kepada upaya bersama untuk terus meningkatkan kualitas pendidikan kita," ungkap Ketua Tim Auditor LPMPP.
</blockquote>

<p>Fakultas Kedokteran menyambut baik kegiatan ini dan berkomitmen untuk menindaklanjuti seluruh rekomendasi hasil audit.</p>`,
    author: "Admin LP3M",
    publishedAt: new Date("2025-08-14"),
    isPublished: true,
    viewCount: 189,
  },
];

async function main() {
  console.log("🌱 Starting seed for News data...");

  // Clear existing data
  console.log("🗑️  Clearing existing news...");
  await prisma.news.deleteMany();

  console.log("\n📝 Inserting News...");
  for (const news of newsData) {
    await prisma.news.create({
      data: news,
    });
    console.log(`✅ ${news.title.substring(0, 60)}...`);
  }

  console.log("\n✨ Seed completed successfully!");
  console.log(`📊 Total news seeded: ${newsData.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
