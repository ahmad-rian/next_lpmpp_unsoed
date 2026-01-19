export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LPMPP UNSOED",
  description: "Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran Universitas Jenderal Soedirman",
  navItems: [
    {
      label: "Beranda",
      href: "/",
    },
    {
      label: "Profil LPMPP",
      href: "/tentang-kami",
      children: [
        {
          label: "Tentang Kami",
          href: "/tentang-kami",
          description: "Informasi umum LPMPP UNSOED",
          icon: "information",
        },
        {
          label: "Pimpinan Lembaga",
          href: "/pimpinan-lembaga",
          description: "Struktur kepemimpinan",
          icon: "users",
        },
        {
          label: "Tata Usaha",
          href: "/tata-usaha",
          description: "Staff dan kepegawaian",
          icon: "briefcase",
        },
      ],
    },
    {
      label: "Pusat",
      href: "/pusat-unit",
    },
    {
      label: "SPMI",
      href: "/spmi/tentang",
      children: [
        {
          label: "Tentang SPMI",
          href: "/spmi/tentang",
          description: "Informasi Sistem Penjaminan Mutu Internal",
          icon: "information",
        },
        {
          label: "Dokumen GPM Fakultas",
          href: "/spmi/gugus-penjamin-mutu-fakultas",
          description: "Dokumen Gugus Penjaminan Mutu Fakultas",
          icon: "clipboard",
        },
        {
          label: "Sistem Informasi Pendukung",
          href: "/spmi/sistem-informasi-pendukung",
          description: "Daftar sistem informasi pendukung SPMI",
          icon: "computer",
        },
        {
          label: "Dokumen SPMI & Audit",
          href: "/spmi/dokumen",
          description: "Sistem Penjaminan Mutu Internal & Audit Mutu Internal",
          icon: "document",
        },
        {
          label: "Peraturan",
          href: "/spmi/peraturan",
          description: "Peraturan dan kebijakan SPMI",
          icon: "scale",
        },
      ],
    },
    {
      label: "Akreditasi",
      href: "/akreditasi/perguruan-tinggi",
      children: [
        {
          label: "Akreditasi PT",
          href: "/akreditasi/perguruan-tinggi",
          description: "Akreditasi Perguruan Tinggi",
          icon: "certificate",
        },
        {
          label: "Akreditasi Prodi",
          href: "/akreditasi/program-studi",
          description: "Akreditasi Program Studi",
          icon: "award",
        },
        {
          label: "Akreditasi Internasional",
          href: "/akreditasi/internasional",
          description: "Akreditasi tingkat internasional",
          icon: "globe",
        },
        {
          label: "Peringkat PT",
          href: "/akreditasi/peringkat",
          description: "Peringkat Perguruan Tinggi (Webometrics, QS, THE, dll)",
          icon: "trophy",
        },
      ],
    },
    {
      label: "Layanan",
      href: "/kepakaran/fasilitator-pekerti",
      children: [
        {
          label: "Fasilitator Pekerti / AA",
          href: "/kepakaran/fasilitator-pekerti",
          description: "Daftar Fasilitator Pekerti dan Applied Approach",
          icon: "users",
        },
        {
          label: "Auditor Mutu Internal",
          href: "/kepakaran/auditor-mutu-internal",
          description: "Daftar Auditor Mutu Internal",
          icon: "shield",
        },
        {
          label: "Asesor BKD",
          href: "/kepakaran/asesor-bkd",
          description: "Daftar Asesor Beban Kerja Dosen",
          icon: "usercheck",
        },
        {
          label: "Asesor Serdos",
          href: "/kepakaran/asesor-serdos",
          description: "Daftar Asesor Sertifikasi Dosen",
          icon: "certificate",
        },
      ],
    },
    {
      label: "Program Unggulan",
      href: "/program-unggulan",
    },
    {
      label: "Berita",
      href: "/berita",
    },
    {
      label: "Unduhan",
      href: "/unduhan",
    },
  ],
  navMenuItems: [
    {
      label: "Beranda",
      href: "/",
    },
    {
      label: "Tentang Kami",
      href: "/tentang-kami",
    },
    {
      label: "Pimpinan Lembaga",
      href: "/pimpinan-lembaga",
    },
    {
      label: "Tata Usaha",
      href: "/tata-usaha",
    },
    {
      label: "Pusat & Unit",
      href: "/pusat-unit",
    },
    {
      label: "Program Unggulan",
      href: "/program-unggulan",
    },
    {
      label: "Berita",
      href: "/berita",
    },
    {
      label: "Unduhan",
      href: "/unduhan",
    },
  ],
  links: {
    instagram: "https://instagram.com/lpmpp_unsoed",
    email: "mailto:lpmpp@unsoed.ac.id",
  },
};