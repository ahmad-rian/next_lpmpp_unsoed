"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import Link from "next/link";

type GalleryItem = {
  id: string;
  gambar: string;
  judul?: string | null;
};

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/galeri?page=1&pageSize=30");
        if (!res.ok) throw new Error("Gagal mengambil galeri");
        const data: GalleryItem[] = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Gagal memuat galeri:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs size="sm">
          <BreadcrumbItem>
            <Link href="/">Beranda</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Galeri</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-red-600 dark:text-red-400">Galeri</h1>
        <p className="text-default-600">Kumpulan dokumentasi kegiatan LPMPP Unsoed</p>
      </div>

      {/* Grid Images only */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-default-200 animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, idx) => (
            <div key={item.id} className="aspect-[4/3] rounded-xl overflow-hidden bg-default-100">
              <img
                src={item.gambar}
                alt={item.judul || `Galeri ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="text-xl font-bold mb-2">Belum ada gambar galeri</h3>
          <p className="text-default-600">Silakan kembali lagi nanti.</p>
        </div>
      )}
    </div>
  );
}