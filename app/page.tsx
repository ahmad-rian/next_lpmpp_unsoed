"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/beranda/HeroSection";
import AdditionalImagesSection from "@/components/beranda/AdditionalImagesSection";
import InfoSection from "@/components/beranda/InfoSection";
// import LayananTautanSection from "@/components/beranda/LayananTautanSection";
// import SambutanInformasiSection from "@/components/beranda/SambutanInformasiSection";
import BukuBeritaGaleriSection from "@/components/beranda/BukuBeritaGaleriSection";
import TenagaGambarSection from "@/components/beranda/TenagaGambarSection";

interface SiteConfig {
  siteName: string;
  tagline?: string;
  motto?: string;
  carouselImages?: string;
  gambarSlogan?: string;
  gambarTeam?: string;
  gambarPartner?: string;
  gambarTambahan?: string;
  layananKami?: string | null;
  pelatihan?: string | null;
  pembelajaran?: string | null;
  penjaminanMutu?: string | null;
}

interface TautanLayananItem {
  id: string;
  nama: string;
  gambar?: string | null;
  link: string;
  order: number;
  isActive: boolean;
}

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  // const [serviceLinks, setServiceLinks] = useState<TautanLayananItem[]>([]);
  // const [loadingLinks, setLoadingLinks] = useState(true);

  useEffect(() => {
    fetchSiteConfig();
    // fetchServiceLinks();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const response = await fetch("/api/site-config");
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error("Error fetching site config:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchServiceLinks = async () => {
  //   try {
  //     const response = await fetch("/api/tautan-layanan");
  //     const data = await response.json();
  //     setServiceLinks(data.filter((item: TautanLayananItem) => item.isActive));
  //   } catch (error) {
  //     console.error("Error fetching service links:", error);
  //   } finally {
  //     setLoadingLinks(false);
  //   }
  // };

  // Parse carousel images
  const carouselImages = config?.carouselImages
    ? JSON.parse(config.carouselImages)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <main className="w-full">
      <HeroSection
        title="LPMPP UNSOED"
        subtitle={config?.tagline || "Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran"}
        description="Universitas Jenderal Soedirman"
        motto={config?.motto || "Unggul dalam Mutu, Inovatif dalam Pembelajaran"}
        carouselImages={carouselImages}
      />

      {/* Gambar Slogan dan Partner */}
      <AdditionalImagesSection
        gambarSlogan={config?.gambarSlogan}
        gambarPartner={config?.gambarPartner}
      />

      {/* Info Section - Accreditation Status & Agenda */}
      <InfoSection />

      {/* Layanan & Tautan Section with Bento Grid - COMMENTED OUT
      <LayananTautanSection
        config={config}
        serviceLinks={serviceLinks}
        loading={loadingLinks}
      />
      */}

      {/* Sambutan Kepala & Informasi Layanan - COMMENTED OUT
      <SambutanInformasiSection />
      */}

      {/* Buku Ajar, Berita, dan Galeri (Buku Ajar & Galeri sudah di-comment di component) */}
      <BukuBeritaGaleriSection />

      {/* Pengelola - Menampilkan Gambar Team, Staff, dan Tambahan secara sejajar */}
      <TenagaGambarSection />
    </main>
  );
}