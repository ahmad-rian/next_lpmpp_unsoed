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
      tagline: "Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran",
      motto: "Unggul dalam Inovasi, Profesional dalam Layanan, Berkualitas dalam Hasil",
      headMessage: "Selamat datang di website resmi Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran (LPMPP) Universitas Jenderal Soedirman. LPMPP berkomitmen untuk terus meningkatkan kualitas pendidikan dan pembelajaran melalui sistem penjaminan mutu yang berkelanjutan dan pengembangan inovasi pembelajaran berbasis teknologi.",
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
      carouselImages: JSON.stringify([
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2940",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2940",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2940",
      ]),
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

  // Create sample documents
  await prisma.document.deleteMany({});
  
  const sampleDocs = [
    // Dokumen SPMI
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
      title: "Keputusan Rektor No. 3/UN23/JM.00/2025 tentang Penetapan Dokumen Kebijakan Dan Standar Sistem Penjaminan Mutu Internal",
      description: "Dokumen keputusan rektor tentang kebijakan dan standar SPMI",
      fileUrl: "/documents/sample.pdf",
      fileName: "keputusan-rektor-3-2025.pdf",
      order: 2,
    },
    // Dokumen AUDIT
    {
      type: "AUDIT",
      title: "Laporan Audit Mutu Internal Tahun 2024",
      description: "Dokumen laporan hasil audit mutu internal tahun akademik 2024",
      fileUrl: "/documents/sample.pdf",
      fileName: "laporan-ami-2024.pdf",
      order: 1,
    },
    {
      type: "AUDIT",
      title: "Panduan Audit Mutu Internal UNSOED",
      description: "Dokumen panduan pelaksanaan audit mutu internal di lingkungan UNSOED",
      fileUrl: "/documents/sample.pdf",
      fileName: "panduan-ami-unsoed.pdf",
      order: 2,
    },
  ];

  for (const doc of sampleDocs) {
    await prisma.document.create({
      data: doc as any,
    });
  }

  console.log("Created sample documents (SPMI & AUDIT)");

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

  // Create SPMI About data
  const spmiAbout = await prisma.spmiAbout.upsert({
    where: { 
      id: (await prisma.spmiAbout.findFirst())?.id || "new-spmi" 
    },
    update: {
      title: "SPM Unsoed",
      tujuan: `Tujuan penerapan SPMI di Unsoed adalah untuk:

1. Menjamin pencapaian tujuan Unsoed
2. Menjamin pemenuhan dan pelampauan Standar Pendidikan Tinggi (Standar Dikti) secara sistemik dan berkelanjutan, sehingga terbangun budaya mutu
3. Menjamin keselarasan SPMI dengan SPME
4. Mewujudkan transparansi dan akuntabilitas kepada seluruh pemangku kepentingan tentang kesesuaian penyelenggaraan pendidikan Unsoed dengan standar yang ditetapkan`,
      fungsi: `Fungsi SPMI di Unsoed adalah:

1. Sebagai bentuk akuntabilitas kepada pemangku kepentingan
2. Sebagai landasan dan arah dalam peningkatan mutu pendidikan
3. Sebagai pedoman penyelenggaraan pendidikan tinggi sehingga sesuai dengan ketentuan peraturan-peraturan perundangan yang berlaku`,
    },
    create: {
      title: "SPM Unsoed",
      tujuan: `Tujuan penerapan SPMI di Unsoed adalah untuk:

1. Menjamin pencapaian tujuan Unsoed
2. Menjamin pemenuhan dan pelampauan Standar Pendidikan Tinggi (Standar Dikti) secara sistemik dan berkelanjutan, sehingga terbangun budaya mutu
3. Menjamin keselarasan SPMI dengan SPME
4. Mewujudkan transparansi dan akuntabilitas kepada seluruh pemangku kepentingan tentang kesesuaian penyelenggaraan pendidikan Unsoed dengan standar yang ditetapkan`,
      fungsi: `Fungsi SPMI di Unsoed adalah:

1. Sebagai bentuk akuntabilitas kepada pemangku kepentingan
2. Sebagai landasan dan arah dalam peningkatan mutu pendidikan
3. Sebagai pedoman penyelenggaraan pendidikan tinggi sehingga sesuai dengan ketentuan peraturan-peraturan perundangan yang berlaku`,
    },
  });

  console.log("SPMI About data created/updated:", spmiAbout);

  // Delete existing accreditation data
  await prisma.internationalAccreditation.deleteMany({});
  await prisma.studyProgramAccreditation.deleteMany({});

  // Create International Accreditation data
  const internationalAccreditations = await prisma.internationalAccreditation.createMany({
    data: [
      {
        faculty: "Fakultas Teknik",
        studyProgram: "Program Sarjana Teknik Sipil",
        accreditationBody: "Indonesian Accreditation Board for Engineering Education (IABEE)",
        order: 1,
      },
      {
        faculty: "Fakultas Ilmu-Ilmu Kesehatan",
        studyProgram: "Program Profesi Ners",
        accreditationBody: "The Accreditation Agency for Study Programmes in Engineering, Informatics, Natural Sciences and Mathematics (ASIIN)",
        order: 2,
      },
      {
        faculty: "Fakultas Ilmu-Ilmu Kesehatan",
        studyProgram: "Program Sarjana Keperawatan",
        accreditationBody: "The Accreditation Agency for Study Programmes in Engineering, Informatics, Natural Sciences and Mathematics (ASIIN)",
        order: 3,
      },
      {
        faculty: "Fakultas Hukum",
        studyProgram: "Program Sarjana Hukum",
        accreditationBody: "Foundation for International Business Administration Accreditation (FIBAA)",
        order: 4,
      },
      {
        faculty: "Fakultas Ekonomi dan Bisnis",
        studyProgram: "Program Sarjana Akuntansi",
        accreditationBody: "Foundation for International Business Administration Accreditation (FIBAA)",
        order: 5,
      },
      {
        faculty: "Fakultas Ekonomi dan Bisnis",
        studyProgram: "Program Sarjana Manajemen",
        accreditationBody: "Foundation for International Business Administration Accreditation (FIBAA)",
        order: 6,
      },
      {
        faculty: "Fakultas Ekonomi dan Bisnis",
        studyProgram: "Program Sarjana Ekonomi Pembangunan",
        accreditationBody: "Foundation for International Business Administration Accreditation (FIBAA)",
        order: 7,
      },
    ],
  });

  console.log("International Accreditation data created:", internationalAccreditations);

  // Create Study Program Accreditation data
  const studyProgramAccreditations = await prisma.studyProgramAccreditation.createMany({
    data: [
      { studyProgram: "Bahasa Inggris", level: "D3", skNumber: "285/SK/BAN-PT/Ak/D3/II/2025", skYear: 2025, rank: "UNGGUL", order: 1 },
      { studyProgram: "Budi Daya Ikan", level: "D3", skNumber: "627/SK/BAN-PT/Ak.Ppj/D3/II/2024", skYear: 2024, rank: "B", order: 2 },
      { studyProgram: "Bisnis Internasional", level: "D3", skNumber: "10010/SK/BAN-PT/Ak.KP/D3/II/2023", skYear: 2023, rank: "UNGGUL", order: 3 },
      { studyProgram: "Akuntansi", level: "D3", skNumber: "1340/SK/BAN-PT/Ak.KP/D3/IV/2023", skYear: 2023, rank: "UNGGUL", order: 4 },
      { studyProgram: "Budi Daya Ternak", level: "D3", skNumber: "6487/SK/BAN-PT/Ak.KP/D3/V/2025", skYear: 2025, rank: "UNGGUL", order: 5 },
      { studyProgram: "Administrasi Bisnis", level: "D3", skNumber: "3142/SK/BAN-PT/AK-ISK/Dipl-III/V/2022", skYear: 2022, rank: "UNGGUL", order: 6 },
      { studyProgram: "Agribisnis", level: "D3", skNumber: "4464/SK/BAN-PT/Ak-PPJ/Dipl-III/VII/2022", skYear: 2022, rank: "B", order: 7 },
      { studyProgram: "Administrasi Perkantoran", level: "D3", skNumber: "11176/SK/BAN-PT/Ak-PNB/Dipl-III/IX/2021", skYear: 2021, rank: "B", order: 8 },
      { studyProgram: "Perencanaan Sumber Daya Lahan", level: "D3", skNumber: "4142/SK/BAN-PT/Akred/Dipl-III/VII/2020", skYear: 2020, rank: "B", order: 9 },
      { studyProgram: "Bahasa Mandarin", level: "D3", skNumber: "7238/SK/BAN-PT/Akred/Dipl-III/XI/2020", skYear: 2020, rank: "A", order: 10 },
      
      { studyProgram: "APOTEKER", level: "PROFESI", skNumber: "0063/LAM-PTKes/Akr/Pro/I/2023", skYear: 2023, rank: "BAIK_SEKALI", order: 11 },
      { studyProgram: "DOKTER GIGI", level: "PROFESI", skNumber: "0094/LAM-PTKes/Akr/Pro/II/2023", skYear: 2023, rank: "BAIK_SEKALI", order: 12 },
      { studyProgram: "PENDIDIKAN PROFESI DOKTER", level: "PROFESI", skNumber: "0547/LAM-PTKes/Akr/Pro/VII/2022", skYear: 2022, rank: "UNGGUL", order: 13 },
      { studyProgram: "NERS", level: "PROFESI", skNumber: "0511/LAM-PTKes/Akr/SAR/IV/2025", skYear: 2025, rank: "UNGGUL", order: 14 },
      { studyProgram: "Pendidikan Profesi Akuntan", level: "PROFESI", skNumber: "2239/DE/A.5/AR.10/IV/2025", skYear: 2025, rank: "UNGGUL", order: 15 },
      
      { studyProgram: "Sastra Indonesia", level: "S1", skNumber: "451/SK/BAN-PT/Ak.Ppj/S/III/2025", skYear: 2025, rank: "UNGGUL", order: 16 },
      { studyProgram: "Teknik Komputer", level: "S1", skNumber: "020/SK/LAM-INFOKOM/Ak.Min/S/III/2024", skYear: 2024, rank: "BAIK", order: 17 },
      { studyProgram: "Teknik Mesin", level: "S1", skNumber: "0058/SK/LAM Teknik/PB.AS/III/2024", skYear: 2024, rank: "BAIK", order: 18 },
      { studyProgram: "Ilmu Komunikasi", level: "S1", skNumber: "531/SK/BAN-PT/Ak.KP/S/II/2024", skYear: 2024, rank: "UNGGUL", order: 19 },
      { studyProgram: "Manajemen Sumber Daya Perairan", level: "S1", skNumber: "549/SK/BAN-PT/Ak.KP/S/II/2024", skYear: 2024, rank: "UNGGUL", order: 20 },
      { studyProgram: "Sosiologi", level: "S1", skNumber: "564/SK/BAN-PT/Ak.KP/S/II/2024", skYear: 2024, rank: "UNGGUL", order: 21 },
      { studyProgram: "Biologi Terapan", level: "S1", skNumber: "440/SK/BAN-PT/Ak.P/S/II/2024", skYear: 2024, rank: "TERAKREDITASI_SEMENTARA", order: 22 },
      { studyProgram: "Proteksi Tanaman", level: "S1", skNumber: "454/SK/BAN-PT/Ak.P/S/II/2024", skYear: 2024, rank: "TERAKREDITASI_SEMENTARA", order: 23 },
      { studyProgram: "Sastra Inggris", level: "S1", skNumber: "7227/SK/BAN-PT/Ak/S/XII/2024", skYear: 2024, rank: "UNGGUL", order: 24 },
      { studyProgram: "Ilmu Politik", level: "S1", skNumber: "6729/SK/BAN-PT/Ak.KP/S/XI/2024", skYear: 2024, rank: "UNGGUL", order: 25 },
      { studyProgram: "Hubungan Internasional", level: "S1", skNumber: "6550/SK/BAN-PT/Ak.KP/S/XI/2024", skYear: 2024, rank: "UNGGUL", order: 26 },
      { studyProgram: "Pendidikan Bahasa Indonesia", level: "S1", skNumber: "1514/SK/LAMDIK/Ak/S/X/2024", skYear: 2024, rank: "UNGGUL", order: 27 },
      { studyProgram: "Statistika", level: "S1", skNumber: "005/SK/LAMSAMA/Akred-M/S/VI/2024", skYear: 2024, rank: "BAIK", order: 28 },
      { studyProgram: "Mikrobiologi", level: "S1", skNumber: "003/SK/LAMSAMA/Akred-M/S/VI/2024", skYear: 2024, rank: "BAIK", order: 29 },
      { studyProgram: "Sastra Jepang", level: "S1", skNumber: "4240/SK/BAN-PT/Ak.KP/S/V/2024", skYear: 2024, rank: "UNGGUL", order: 30 },
      { studyProgram: "Agribisnis", level: "S1", skNumber: "3758/SK/BAN-PT/Ak.KP/S/IV/2024", skYear: 2024, rank: "UNGGUL", order: 31 },
      { studyProgram: "Pendidikan Jasmani", level: "S1", skNumber: "3765/SK/BAN-PT/Ak.KP/S/IV/2024", skYear: 2024, rank: "UNGGUL", order: 32 },
      { studyProgram: "Pendidikan Bahasa Jepang", level: "S1", skNumber: "407/SK/LAMDIK/Ak-PSB/S/III/2024", skYear: 2024, rank: "BAIK", order: 33 },
      { studyProgram: "Teknik Pertanian", level: "S1", skNumber: "6643/SK/BAN-PT/AK.KP/S/V/2025.", skYear: 2025, rank: "UNGGUL", order: 34 },
      { studyProgram: "FARMASI", level: "S1", skNumber: "0062/LAM-PTKes/Akr/Sar/I/2023", skYear: 2023, rank: "BAIK_SEKALI", order: 35 },
      { studyProgram: "KEDOKTERAN GIGI", level: "S1", skNumber: "0093/LAM-PTKes/Akr/Sar/II/2023", skYear: 2023, rank: "UNGGUL", order: 36 },
      { studyProgram: "Ilmu Kelautan", level: "S1", skNumber: "1159/SK/BAN-PT/Ak.Ppj/S/III/2023", skYear: 2023, rank: "UNGGUL", order: 37 },
      { studyProgram: "Pendidikan Bahasa Inggris", level: "S1", skNumber: "372/SK/LAMDIK/Ak/S/III/2023", skYear: 2023, rank: "UNGGUL", order: 38 },
      { studyProgram: "Teknik Sipil", level: "S1", skNumber: "0234/SK/LAM Teknik/AS/IV/2025", skYear: 2025, rank: "UNGGUL", order: 39 },
      { studyProgram: "Peternakan", level: "S1", skNumber: "6657/SK/BAN-PT/Ak.KP/S/V/2025", skYear: 2025, rank: "UNGGUL", order: 40 },
      { studyProgram: "Administrasi Publik", level: "S1", skNumber: "3495/SK/BAN-PT/Ak.Ppj/S/VIII/2023", skYear: 2023, rank: "UNGGUL", order: 41 },
      { studyProgram: "Teknik Geologi", level: "S1", skNumber: "3621/SK/BAN-PT/Ak/S/IX/2023", skYear: 2023, rank: "BAIK_SEKALI", order: 42 },
      { studyProgram: "ILMU GIZI", level: "S1", skNumber: "0954/LAM-PTKes/Akr/Sar/XII/2023", skYear: 2023, rank: "UNGGUL", order: 43 },
      { studyProgram: "Teknik Elektro", level: "S1", skNumber: "4/SK/BAN-PT/SURV-BDG/S/I/2022", skYear: 2022, rank: "A", order: 44 },
      { studyProgram: "Pendidikan Ekonomi", level: "S1", skNumber: "649/SK/BAN-PT/Ak-PPJ/S/I/2022", skYear: 2022, rank: "B", order: 45 },
      { studyProgram: "Ekonomi Pembangunan", level: "S1", skNumber: "2563/SK/BAN-PT/AK-ISK/S/IV/2022", skYear: 2022, rank: "UNGGUL", order: 46 },
      { studyProgram: "Manajemen", level: "S1", skNumber: "3143/SK/BAN-PT/AK-ISK/S/V/2022", skYear: 2022, rank: "UNGGUL", order: 47 },
      { studyProgram: "KEDOKTERAN", level: "S1", skNumber: "0546/LAM-PTKes/Akr/Sar/VII/2022", skYear: 2022, rank: "UNGGUL", order: 48 },
      { studyProgram: "Akuakultur", level: "S1", skNumber: "5354/SK/BAN-PT/Ak.Ppj/S/VIII/2022", skYear: 2022, rank: "BAIK_SEKALI", order: 49 },
      { studyProgram: "Teknik Industri", level: "S1", skNumber: "0045/SK/LAM Teknik/AS/VIII/2022", skYear: 2022, rank: "BAIK_SEKALI", order: 50 },
      { studyProgram: "Akuntansi", level: "S1", skNumber: "047/DE/A.5/AR.10/XI/2022", skYear: 2022, rank: "UNGGUL", order: 51 },
      { studyProgram: "Informatika", level: "S1", skNumber: "187/SK/BAN-PT/Ak-PPJ/S/I/2021", skYear: 2021, rank: "B", order: 52 },
      { studyProgram: "KESEHATAN MASYARAKAT", level: "S1", skNumber: "0146/LAM-PTKes/Akr/Sar/IV/2021", skYear: 2021, rank: "UNGGUL", order: 53 },
      { studyProgram: "Teknologi Pangan", level: "S1", skNumber: "6506/SK/BAN-PT/Ak.KP/S/V/2025", skYear: 2025, rank: "UNGGUL", order: 54 },
      { studyProgram: "Biologi", level: "S1", skNumber: "11998/SK/BAN-PT/Ak-PPJ/S/X/2021", skYear: 2021, rank: "A", order: 55 },
      { studyProgram: "Agroteknologi", level: "S1", skNumber: "12845/SK/BAN-PT/Ak-PPJ/S/XII/2021", skYear: 2021, rank: "A", order: 56 },
      { studyProgram: "KEPERAWATAN", level: "S1", skNumber: "0510/LAM-PTKes/Akr/SAR/IV/2025", skYear: 2025, rank: "UNGGUL", order: 57 },
      { studyProgram: "Fisika", level: "S1", skNumber: "122/SK/LAMSAMA/Akred/S/V/2025", skYear: 2025, rank: "UNGGUL", order: 58 },
      { studyProgram: "Kimia", level: "S1", skNumber: "071/SK/LAMSAMA/Akred/S/V/2025", skYear: 2025, rank: "UNGGUL", order: 59 },
      { studyProgram: "Matematika", level: "S1", skNumber: "", skYear: 2025, rank: "UNGGUL", order: 60 },
      { studyProgram: "Hukum", level: "S1", skNumber: "6626/SK/BAN-PT/Ak-PPJ/S/X/2020", skYear: 2020, rank: "A", order: 61 },
      
      { studyProgram: "Biologi", level: "S2", skNumber: "010/SK/LAMSAMA/Akred/M/III/2024", skYear: 2024, rank: "UNGGUL", order: 62 },
      { studyProgram: "Ilmu Politik", level: "S2", skNumber: "7118/SK/BAN-PT/Ak/M/XII/2024", skYear: 2024, rank: "BAIK_SEKALI", order: 63 },
      { studyProgram: "Bioteknologi Pertanian", level: "S2", skNumber: "7217/SK/BAN-PT/Ak/M/XII/2024", skYear: 2024, rank: "BAIK_SEKALI", order: 64 },
      { studyProgram: "Ilmu Pangan", level: "S2", skNumber: "6594/SK/BAN-PT/Ak.KP/M/XI/2024", skYear: 2024, rank: "BAIK_SEKALI", order: 65 },
      { studyProgram: "ILMU BIOMEDIS", level: "S2", skNumber: "0362/LAM-PTKes/Akr/Mag/VI/2024", skYear: 2024, rank: "BAIK_SEKALI", order: 66 },
      { studyProgram: "Sumber Daya Akuatik", level: "S2", skNumber: "5966/SK/BAN-PT/PEPA-Ppj/M/IX/2024", skYear: 2024, rank: "BAIK", order: 67 },
      { studyProgram: "Teknik Sipil", level: "S2", skNumber: "0461/SK/LAM Teknik/AM/VIII/2024", skYear: 2024, rank: "BAIK_SEKALI", order: 68 },
      { studyProgram: "Fisika", level: "S2", skNumber: "004/SK/LAMSAMA/Akred-M/M/VI/2024", skYear: 2024, rank: "BAIK", order: 69 },
      { studyProgram: "Agribisnis", level: "S2", skNumber: "5368/SK/BAN-PT/Ak.Ppj/M/VIII/2024", skYear: 2024, rank: "B", order: 70 },
      { studyProgram: "KEPERAWATAN", level: "S2", skNumber: "0500/LAM-PTKes/Akr/Mag/VII/2024", skYear: 2024, rank: "UNGGUL", order: 71 },
      { studyProgram: "Kimia", level: "S2", skNumber: "025/SK/LAMSAMA/Akred-M/M/VII/2024", skYear: 2024, rank: "BAIK", order: 72 },
      { studyProgram: "Penyuluhan Pertanian", level: "S2", skNumber: "5137/SK/BAN-PT/Ak.Ppj/M/VII/2024", skYear: 2024, rank: "B", order: 73 },
      { studyProgram: "Kenotariatan", level: "S2", skNumber: "4051/SK/BAN-PT/Ak/M/V/2024", skYear: 2024, rank: "UNGGUL", order: 74 },
      { studyProgram: "Ilmu Komunikasi", level: "S2", skNumber: "4056/SK/BAN-PT/Ak/M/V/2024", skYear: 2024, rank: "UNGGUL", order: 75 },
      { studyProgram: "Administrasi Publik", level: "S2", skNumber: "3770/SK/BAN-PT/Ak.KP/M/IV/2024", skYear: 2024, rank: "UNGGUL", order: 76 },
      { studyProgram: "KESEHATAN MASYARAKAT", level: "S2", skNumber: "0211/LAM-PTKes/Akr/Mag/III/2024", skYear: 2024, rank: "BAIK_SEKALI", order: 77 },
      { studyProgram: "Agronomi", level: "S2", skNumber: "", skYear: 2025, rank: "UNGGUL", order: 78 },
      { studyProgram: "Hukum", level: "S2", skNumber: "685/SK/BAN-PT/Ak.Ppj/M/III/2023", skYear: 2023, rank: "UNGGUL", order: 79 },
      { studyProgram: "Sosiologi", level: "S2", skNumber: "999/SK/BAN-PT/Ak/M/III/2023", skYear: 2023, rank: "UNGGUL", order: 80 },
      { studyProgram: "Ilmu Manajemen", level: "S2", skNumber: "1074/SK/BAN-PT/Ak.Ppj/M/III/2023", skYear: 2023, rank: "UNGGUL", order: 81 },
      { studyProgram: "Peternakan", level: "S2", skNumber: "6509/SK/BAN-PT/Ak.KP/M/V/2025", skYear: 2025, rank: "UNGGUL", order: 82 },
      { studyProgram: "Ilmu Lingkungan", level: "S2", skNumber: "3775/SK/BAN-PT/Akred/M/VI/2022", skYear: 2022, rank: "BAIK_SEKALI", order: 83 },
      { studyProgram: "Ekonomi", level: "S2", skNumber: "3770/SK/BAN-PT/Akred-PMT/M/VI/2022", skYear: 2022, rank: "UNGGUL", order: 84 },
      { studyProgram: "Akuntansi", level: "S2", skNumber: "8856/SK/BAN-PT/Ak-PPJ/M/VI/2021", skYear: 2021, rank: "A", order: 85 },
      { studyProgram: "Ilmu Kelautan", level: "S2", skNumber: "063/SK/LAMSAMA/Akred/M/IV/2025", skYear: 2025, rank: "UNGGUL", order: 86 },
      { studyProgram: "Farmasi", level: "S2", skNumber: "SK Pendirian", skYear: 2025, rank: null, order: 87 },
      { studyProgram: "Linguistik", level: "S2", skNumber: "SK Pendirian 291/B/O/2025", skYear: 2025, rank: null, order: 88 },
      
      { studyProgram: "Ilmu Akuntansi", level: "S3", skNumber: "2163/DE/A.5/AR.10/III/2025", skYear: 2025, rank: "BAIK_SEKALI", order: 89 },
      { studyProgram: "Ekonomi", level: "S3", skNumber: "1957/DE/A.5/AR.10/I/2025", skYear: 2025, rank: "UNGGUL", order: 90 },
      { studyProgram: "Ilmu Pertanian", level: "S3", skNumber: "648/SK/BAN-PT/Ak.Ppj/D/II/2024", skYear: 2024, rank: "B", order: 91 },
      { studyProgram: "Administrasi Publik", level: "S3", skNumber: "4935/SK/BAN-PT/Ak.P/D/VII/2024", skYear: 2024, rank: "TERAKREDITASI_SEMENTARA", order: 92 },
      { studyProgram: "Peternakan", level: "S3", skNumber: "6210/SK/BAN-PT/Ak/D/IV/2025", skYear: 2025, rank: "UNGGUL", order: 93 },
      { studyProgram: "Hukum", level: "S3", skNumber: "", skYear: 2025, rank: "BAIK_SEKALI", order: 94 },
      { studyProgram: "Ilmu Manajemen", level: "S3", skNumber: "10927/SK/BAN-PT/Akred/D/IX/2021", skYear: 2021, rank: "UNGGUL", order: 95 },
      { studyProgram: "Biologi", level: "S3", skNumber: "13836/SK/BAN-PT/Ak-PPJ/D/XII/2021", skYear: 2021, rank: "B", order: 96 },
      
      { studyProgram: "ANESTESIOLOGI DAN TERAPI INTENSIF", level: "SPESIALIS", skNumber: "0070/LAM-PTKes/Akr/Spe/II/2024", skYear: 2024, rank: "BAIK_SEKALI", order: 97 },
      { studyProgram: "NEUROLOGI", level: "SPESIALIS", skNumber: "0246/LAM-PTKes/Akr.PB/Spe/VIII/2024", skYear: 2024, rank: "BAIK", order: 98 },
      { studyProgram: "OBSTETRIK DAN GINEKOLOGI", level: "SPESIALIS", skNumber: "0247/LAM-PTKes/Akr.PB/Spe/VIII/2024", skYear: 2024, rank: "BAIK", order: 99 },
    ],
  });

  console.log("Study Program Accreditation data created:", studyProgramAccreditations);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
