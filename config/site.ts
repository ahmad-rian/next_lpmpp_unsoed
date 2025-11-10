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
          label: "Dokumen SPMI",
          href: "/spmi/dokumen",
          description: "Sistem Penjaminan Mutu Internal",
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
          href: "/akreditasi/pt",
          description: "Akreditasi Perguruan Tinggi",
          icon: "certificate",
        },
        {
          label: "Akreditasi Prodi",
          href: "/akreditasi/prodi",
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
          label: "MBKM",
          href: "/kepakaran/mbkm",
          description: "Merdeka Belajar Kampus Merdeka",
          icon: "book",
        },
        {
          label: "Asesor",
          href: "/kepakaran/asesor",
          description: "Daftar asesor",
          icon: "usercheck",
        },
        {
          label: "Auditor",
          href: "/kepakaran/auditor",
          description: "Daftar auditor",
          icon: "shield",
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
      href: "/about",
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
      label: "Fakultas",
      href: "/fakultas",
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
