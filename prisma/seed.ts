import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "alriansr@gmail.com" },
    update: {
      role: "ADMIN",
    },
    create: {
      email: "alriansr@gmail.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("Admin user created/updated:", admin);

  // Create default site configuration
  const siteConfig = await prisma.siteConfig.upsert({
    where: { 
      id: (await prisma.siteConfig.findFirst())?.id || "new-config" 
    },
    update: {},
    create: {
      siteName: "LPMPP UNSOED",
      logoUnsoed: "/assets/images/logo.webp",
      logoApp: "/assets/images/logo.webp",
      logoDescription: "Logo LPMPP UNSOED menggambarkan komitmen terhadap kualitas pendidikan dan pembelajaran. Elemen visual dalam logo mencerminkan inovasi, profesionalisme, dan dedikasi dalam pengembangan mutu pendidikan tinggi di Universitas Jenderal Soedirman.",
      visi: "Menjadi lembaga pengembangan pendidikan dan pembelajaran yang unggul, profesional, dan inovatif dalam mendukung pencapaian visi Universitas Jenderal Soedirman sebagai universitas riset bereputasi internasional.",
      misi: "1. Mengembangkan sistem penjaminan mutu pendidikan dan pembelajaran\n2. Meningkatkan kompetensi dosen dalam bidang pendidikan dan pembelajaran\n3. Mengembangkan inovasi pembelajaran berbasis teknologi\n4. Melakukan penelitian dan pengembangan di bidang pendidikan",
      tugas: "1. Melaksanakan pengembangan sistem pembelajaran\n2. Melaksanakan pelatihan dan pengembangan kompetensi dosen\n3. Melakukan monitoring dan evaluasi pembelajaran\n4. Mengembangkan pusat pembelajaran digital",
      fungsi: "1. Perencanaan dan pengembangan sistem pembelajaran\n2. Pelatihan dan pengembangan SDM pendidikan\n3. Penelitian dan pengembangan pendidikan\n4. Monitoring dan evaluasi mutu pembelajaran",
      alamat: "Jl. HR Boenyamin No.708, Grendeng, Purwokerto Utara, Kabupaten Banyumas, Jawa Tengah 53122",
      email: "lpmpp@unsoed.ac.id",
      instagramUrl: "https://instagram.com/lpmppunsoed",
    },
  });

  console.log("Site configuration created/updated:", siteConfig);

  // Create Leadership data
  const headLeadership = await prisma.leadership.upsert({
    where: { position: "HEAD" },
    update: {
      name: "Prof. Ir. Juni Sumarmono, M.Sc. Ph.D., IPU., ASEAN Eng",
      title: "Kepala Lembaga",
    },
    create: {
      position: "HEAD",
      name: "Prof. Ir. Juni Sumarmono, M.Sc. Ph.D., IPU., ASEAN Eng",
      title: "Kepala Lembaga",
    },
  });

  const secretaryLeadership = await prisma.leadership.upsert({
    where: { position: "SECRETARY" },
    update: {
      name: "Dr. Wisnu Widjanarko, S.Sos., M.Psi.",
      title: "Sekretaris Lembaga",
    },
    create: {
      position: "SECRETARY",
      name: "Dr. Wisnu Widjanarko, S.Sos., M.Psi.",
      title: "Sekretaris Lembaga",
    },
  });

  console.log("Leadership created/updated:", { headLeadership, secretaryLeadership });

  // Create Staff data
  const staffData: Array<{ position: any; name: string; title: string; order: number }> = [
    // Sub Koordinator
    { position: "SUB_COORDINATOR", name: "Prasetyo Heru Saptono, S.Pd., M.B.A", title: "Sub Koordinator", order: 1 },
    
    // Staff Umum
    { position: "GENERAL_STAFF", name: "Sri Apriani, S.E.", title: "Staff Umum", order: 1 },
    { position: "GENERAL_STAFF", name: "Kusrini Kartikawati, A.Md.", title: "Staff Umum", order: 2 },
    { position: "GENERAL_STAFF", name: "Alfia Nova Refi Sari, S.H.", title: "Staff Umum", order: 3 },
    
    // Staff Program, Data & Informasi
    { position: "PROGRAM_DATA_INFO_STAFF", name: "Widya Hastuti, S.E.", title: "Staff Program, Data & Informasi", order: 1 },
    { position: "PROGRAM_DATA_INFO_STAFF", name: "Heri Yuwono W.H, A.Md.", title: "Staff Program, Data & Informasi", order: 2 },
    { position: "PROGRAM_DATA_INFO_STAFF", name: "Dasworo", title: "Staff Program, Data & Informasi", order: 3 },
    { position: "PROGRAM_DATA_INFO_STAFF", name: "Adhitya Ardiansyah, S.H.", title: "Staff Program, Data & Informasi", order: 4 },
    
    // Pengemudi
    { position: "DRIVER", name: "Akhmad Wahyanto", title: "Pengemudi", order: 1 },
    
    // Pramu Bakti
    { position: "OFFICE_ASSISTANT", name: "Yulian Kamal Bachrok", title: "Pramu Bakti", order: 1 },
  ];

  // Delete existing staff and create new ones
  await prisma.staff.deleteMany({});
  
  for (const staff of staffData) {
    await prisma.staff.create({
      data: staff as any,
    });
  }

  console.log(`Created ${staffData.length} staff members`);

  // Create Centers data with members
  await prisma.centerMember.deleteMany({});
  await prisma.center.deleteMany({});

  const centersData = [
    {
      name: "Pusat Penjaminan Mutu Internal",
      slug: "pusat-penjaminan-mutu-internal",
      description: "Menyusun, mengembangkan, dan mendokumentasikan Sistem Penjaminan Mutu Internal (SPMI); Mengoordinasi penerapan SPMI di tingkat universitas, bersama dengan Gugus Penjaminan Mutu di unit pengelola program studi dan Gugus Kendali Mutu di program studi; dan Melaksanakan layanan pelatihan SPMI.",
      order: 1,
      members: [
        { role: "COORDINATOR", name: "Prof. Dr. Bambang Tri Harsanto, M.Si", title: "Koordinator Pusat Penjaminan Mutu Internal", order: 1 },
        { role: "MEMBER", name: "Alpha Nadeira Mandamdari, S.P., M.P", title: "", order: 2 },
        { role: "MEMBER", name: "Dr. dr. Eman Sutrisna, M. Kes", title: "", order: 3 },
      ]
    },
    {
      name: "Pusat Audit Mutu Akademik Internal",
      slug: "pusat-audit-mutu-akademik-internal",
      description: "Menyusun, mengembangkan, dan mendokumentasikan audit mutu internal; Mengoordinasi pelaksanaan audit mutu akademik internal; dan Melaksanakan layanan pelatihan audit mutu akademik internal.",
      order: 2,
      members: [
        { role: "COORDINATOR", name: "Prof. Mekar Dwi Anggraeni, S.Kep. Ners., M.Kep. Ph.D", title: "Koordinator Pusat Audit Mutu Akademik Internal", order: 1 },
        { role: "MEMBER", name: "Dr. Ervina Mela, S.T., M.Si", title: "", order: 2 },
        { role: "MEMBER", name: "Dr. Laeli Budiarti, SE, M.Si Ak.", title: "", order: 3 },
      ]
    },
    {
      name: "Pusat Akreditasi Nasional",
      slug: "pusat-akreditasi-nasional",
      description: "Mengoordinasi kesiapan perguruan tinggi dan program-program studi dalam akreditasi nasional; Menyelenggarakan pendampingan dalam proses akreditasi nasional; dan Mengoordinasi persiapan pendirian program studi baru.",
      order: 3,
      members: [
        { role: "COORDINATOR", name: "Dra. Gratiana E. Wijayanti., M.Rep.Sc., Ph.D", title: "Koordinator Pusat Akreditasi Nasional", order: 1 },
        { role: "MEMBER", name: "Prof. Dr. Sofa Marwah., S.IP., M.Si", title: "", order: 2 },
        { role: "MEMBER", name: "Dr. Arif Setyo Upoyo, S.Kep. Ners M.Kep", title: "", order: 3 },
      ]
    },
    {
      name: "Pusat Akreditasi Internasional",
      slug: "pusat-akreditasi-internasional",
      description: "Mengoordinasi kesiapan program-program studi dalam akreditasi internasional; dan Menyelenggarakan pendampingan dalam proses akreditasi internasional.",
      order: 4,
      members: [
        { role: "COORDINATOR", name: "Dr. Sidik Awaludin, SKep., M.Kep. Ns. Sp.Kep.MB", title: "Koordinator Pusat Akreditasi Internasional", order: 1 },
        { role: "MEMBER", name: "Dian Ramawati, SKep., Ns. M.Kep., Ph.D", title: "", order: 2 },
      ]
    },
    {
      name: "Pusat Analisis Pembelajaran & Penjaminan Mutu",
      slug: "pusat-analisis-pembelajaran-penjaminan-mutu",
      description: "Mengoordinasi ketersediaan dan keterjaminan data kegiatan pendidikan dalam rangka penjaminan mutu; Melaksanakan kegiatan monitoring dan analisis penjaminan mutu; dan Mengoordinasi kegiatan kerja sama penjamiman mutu dan pengembangan pembelajaran.",
      order: 5,
      members: [
        { role: "COORDINATOR", name: "Dr. Muhamad Yamin, S.IP., M.Si.", title: "Koordinator Pusat Analisis Pembelajaran dan Penjaminan Mutu", order: 1 },
        { role: "MEMBER", name: "Merryafinola Ifani, S.Pt., M.Pt.", title: "", order: 2 },
        { role: "MEMBER", name: "Kilau Riksaning Ayu, S.I.Kom., M.I.Kom.", title: "", order: 3 },
      ]
    },
    {
      name: "Pusat Inovasi Pembelajaran",
      slug: "pusat-inovasi-pembelajaran",
      description: "Melaksanakan kegiatan pengembangan keterampilan pembelajaran; Melaksanakan kegiatan pengembangan penyusunan bahan ajar; dan Memberikan layanan pelatihan pengembangan keterampilan pembelajaran dan penyusunan bahan ajar.",
      order: 6,
      members: [
        { role: "COORDINATOR", name: "Prof. Dr. Abdul Azis Nasihudin, S.H., M.M., M.H", title: "Koordinator Pusat Inovasi Pembelajaran", order: 1 },
        { role: "MEMBER", name: "dr. Miko Ferine, M.Med.Ed", title: "", order: 2 },
        { role: "MEMBER", name: "Laxmi Mustika Cakrawati, S.Pd., M.Pd", title: "", order: 3 },
      ]
    },
    {
      name: "Pusat Pengembangan Kurikulum",
      slug: "pusat-pengembangan-kurikulum",
      description: "Melaksanakan kegiatan pengkajian dan pengembangan kurikulum; Melaksanakan kegiatan evaluasi kurikulum; dan Memberikan layanan pelatihan pengembangan kurikulum.",
      order: 7,
      members: [
        { role: "COORDINATOR", name: "Tri Nugroho Adi. S.Sos. M.Si", title: "Koordinator Pusat Pengembangan Kurikulum", order: 1 },
        { role: "MEMBER", name: "Dr. dr. VM. Wahyu Siswandari, Sp.PK., M.Si.Med", title: "", order: 2 },
        { role: "MEMBER", name: "Indah Nuraeni, S.TP., M.Sc", title: "", order: 3 },
      ]
    },
    {
      name: "Pusat Pengembangan Karakter dan Mata Kuliah Wajib Kurikulum",
      slug: "pusat-pengembangan-karakter-mkwk",
      description: "Melaksanakan kegiatan integrasi pengembangan karakter dalam kurikulum dan pembelajaran; Mengoordinasi penyelenggaraan mata kuliah wajib kurikulum; dan Melaksanakan layanan pelatihan integrasi karakter dalam pembelajaran.",
      order: 8,
      members: [
        { role: "COORDINATOR", name: "Prof. Dr. Ir. Heru Adi Djatmiko, M.P.", title: "Koordinator Pusat Pengembangan Karakter dan Mata Kuliah Wajib Kurikulum", order: 1 },
        { role: "MEMBER", name: "Muhammad Riza Chamadi, S.Pd.I., M.Pd.I", title: "", order: 2 },
        { role: "MEMBER", name: "Dr. Ir. Rosidi, M.P., IPU", title: "", order: 3 },
        { role: "MEMBER", name: "Luthfi Makhasin, S.IP., M.A., Ph.D.", title: "", order: 4 },
      ]
    },
    {
      name: "Pusat Pembelajaran Berbasis Teknologi Informasi",
      slug: "pusat-pembelajaran-berbasis-ti",
      description: "Memberikan layanan dan fasilitasi pembelajaran berbasis teknologi informasi; Melaksanakan kegiatan pengembangan konten dan media pembelajaran berbasis teknologi informasi; dan Melaksanakan layanan pelatihan pemanfaatan teknologi informasi dalam pembelajaran.",
      order: 9,
      members: [
        { role: "COORDINATOR", name: "Ardiansyah, S.TP., M.Si., Ph.D", title: "Koordinator Pusat Pembelajaran Berbasis Teknologi Informasi", order: 1 },
        { role: "MEMBER", name: "Dr. Mulki Indana Zulfa, S.T., M.T", title: "", order: 2 },
        { role: "MEMBER", name: "Ir. Eko Murdyantoro Atmojo, S.T., M.T", title: "", order: 3 },
      ]
    },
    {
      name: "Pusat Merdeka Belajar Kampus Merdeka",
      slug: "pusat-mbkm",
      description: "Melaksanakan kegiatan pembelajaran khusus, seperti vokasi, dan pembelajaran di luar kampus; Melaksanakan kegiatan audit asesmen rekognisi pembelajaran lampau.",
      order: 10,
      members: [
        { role: "COORDINATOR", name: "Dr. Zaroh Irayani, S.Si., M.Si", title: "Koordinator Pusat MBKM", order: 1 },
        { role: "MEMBER", name: "Prof. Ahadiyat Yugi Rahayu, S.P., M.Si., D.Tech.Sc", title: "", order: 2 },
        { role: "MEMBER", name: "Ratri Noorhidayah, S.P., M.Sc", title: "", order: 3 },
        { role: "MEMBER", name: "Okti Herliana, S.P., M.P", title: "", order: 4 },
        { role: "MEMBER", name: "Dr. Nanang Martono, S.Sos., M.Si", title: "", order: 5 },
      ]
    },
  ];

  for (const centerData of centersData) {
    const { members, ...centerInfo } = centerData;
    const center = await prisma.center.create({
      data: centerInfo,
    });

    for (const member of members) {
      await prisma.centerMember.create({
        data: {
          centerId: center.id,
          role: member.role as any,
          name: member.name,
          title: member.title,
          order: member.order,
        },
      });
    }
  }

  console.log(`Created ${centersData.length} centers with their members`);

  // Create SPMI Content
  await prisma.spmiContent.upsert({
    where: { section: "tujuan" },
    update: {},
    create: {
      section: "tujuan",
      content: `Tujuan penerapan SPMI di Unsoed adalah untuk:
      
1. Menjamin pencapaian tujuan Unsoed
2. Menjamin pemenuhan dan pelampauan Standar Pendidikan Tinggi (Standar Dikti) secara sistemik dan berkelanjutan, sehingga terbangun budaya mutu
3. Menjamin keselarasan SPMI dengan SPME
4. Mewujudkan transparansi dan akuntabilitas kepada seluruh pemangku kepentingan tentang kesesuaian penyelenggaraan pendidikan Unsoed dengan standar yang ditetapkan`,
      order: 1,
    },
  });

  await prisma.spmiContent.upsert({
    where: { section: "fungsi" },
    update: {},
    create: {
      section: "fungsi",
      content: `Fungsi SPMI di Unsoed adalah:
      
1. Sebagai bentuk akuntabilitas kepada pemangku kepentingan
2. Sebagai landasan dan arah dalam peningkatan mutu pendidikan
3. Sebagai pedoman penyelenggaraan pendidikan tinggi sehingga sesuai dengan ketentuan peraturan-peraturan perundangan yang berlaku`,
      order: 2,
    },
  });

  console.log("Created SPMI content");

  // Create sample documents
  await prisma.document.deleteMany({});
  
  const sampleDocs = [
    {
      type: "SPMI",
      title: "Peraturan Rektor No. 34 Tahun 2021 tentang Sistem Penjaminan Mutu Internal",
      description: "Dokumen peraturan rektor tentang sistem penjaminan mutu internal",
      fileUrl: "/documents/sample.pdf",
      fileName: "peraturan-rektor-34-2021.pdf",
      order: 1,
    },
    {
      type: "SPMI",
      title: "Keputusan Rektor No. 3/UN23/JM.00/2025 tentang Penetapan Dokumen Kebijakan Dan Standar SPMI",
      description: "Dokumen keputusan rektor tentang kebijakan dan standar SPMI",
      fileUrl: "/documents/sample.pdf",
      fileName: "keputusan-rektor-3-2025.pdf",
      order: 2,
    },
  ];

  for (const doc of sampleDocs) {
    await prisma.document.create({
      data: doc as any,
    });
  }

  console.log(`Created ${sampleDocs.length} sample documents`);

  // Create Fakultas (Master Data) - 12 Fakultas UNSOED
  await prisma.faculty.deleteMany({});
  
  const faculties = [
    { name: "Fakultas Pertanian", shortName: "Faperta", code: "FP", order: 1 },
    { name: "Fakultas Biologi", shortName: "Fabio", code: "FB", order: 2 },
    { name: "Fakultas Ekonomi dan Bisnis", shortName: "FEB", code: "FEB", order: 3 },
    { name: "Fakultas Peternakan", shortName: "Fapet", code: "FPT", order: 4 },
    { name: "Fakultas Hukum", shortName: "FH", code: "FH", order: 5 },
    { name: "Fakultas Ilmu Sosial dan Ilmu Politik", shortName: "FISIP", code: "FISIP", order: 6 },
    { name: "Fakultas Kedokteran", shortName: "FK", code: "FK", order: 7 },
    { name: "Fakultas Teknik", shortName: "FT", code: "FT", order: 8 },
    { name: "Fakultas Ilmu-ilmu Kesehatan", shortName: "FIKES", code: "FIKES", order: 9 },
    { name: "Fakultas Ilmu Budaya", shortName: "FIB", code: "FIB", order: 10 },
    { name: "Fakultas Matematika dan Ilmu Pengetahuan Alam", shortName: "FMIPA", code: "FMIPA", order: 11 },
    { name: "Fakultas Perikanan dan Ilmu Kelautan", shortName: "FPIK", code: "FPIK", order: 12 },
  ];

  const createdFaculties = [];
  for (const faculty of faculties) {
    const created = await prisma.faculty.create({
      data: faculty,
    });
    createdFaculties.push(created);
  }

  console.log(`Created ${createdFaculties.length} faculties`);

  // Create sample Quality Assurance Groups
  await prisma.qualityAssuranceGroup.deleteMany({});
  
  const sampleGPM = [
    {
      facultyId: createdFaculties[8].id, // FIKES (index 8 - Fakultas Ilmu-ilmu Kesehatan)
      description: "Gugus Penjamin Mutu Fakultas Ilmu-ilmu Kesehatan",
      contactInfo: "gpm.fikes@unsoed.ac.id",
      order: 1,
    },
    {
      facultyId: createdFaculties[2].id, // FEB (index 2 - Fakultas Ekonomi dan Bisnis)
      description: "Gugus Penjamin Mutu Fakultas Ekonomi dan Bisnis",
      contactInfo: "gpm.feb@unsoed.ac.id",
      order: 2,
    },
  ];

  for (const gpm of sampleGPM) {
    await prisma.qualityAssuranceGroup.create({
      data: gpm,
    });
  }

  console.log(`Created ${sampleGPM.length} quality assurance groups`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
