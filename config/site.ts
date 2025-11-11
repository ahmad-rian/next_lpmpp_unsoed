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
      href: "#",
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
      label: "Unit Kerja",
      href: "/pusat-unit",
    },
    {
      label: "SPMI",
      href: "#",
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
      href: "#",
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
      ],
    },
    {
      label: "Kepakaran",
      href: "#",
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