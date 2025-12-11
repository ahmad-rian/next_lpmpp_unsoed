"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { ImageUpload } from "@/components/image-upload";

interface SiteConfig {
  id: string;
  logoUnsoed: string | null;
  logoApp: string | null;
  logoDescription: string | null;
  siteName: string;
  tagline: string | null; // Tagline LPMPP
  motto: string | null; // Motto LPMPP (fixed typo from moto)
  headMessage: string | null; // Pesan Kepala Lembaga
  visi: string | null; // Visi LPMPP
  misi: string | null; // Misi LPMPP
  visiUnsoed: string | null; // Visi UNSOED
  misiUnsoed: string | null; // Misi UNSOED
  tugas: string | null;
  fungsi: string | null;
  alamat: string | null;
  email: string | null;
  instagramUrl: string | null;
  carouselImages: string | null; // JSON string array

  // Field tambahan untuk halaman utama
  gambarTeam: string | null; // Gambar team
  gambarSlogan: string | null; // Gambar slogan
  gambarTambahan: string | null; // Gambar tambahan

  // Detail Layanan LPMPP
  layananKami: string | null; // LAYANAN KAMI description
  pelatihan: string | null; // PELATIHAN description  
  pembelajaran: string | null; // PEMBELAJARAN description
  penjaminanMutu: string | null; // PENJAMINAN MUTU description

  // Informasi dan Layanan
  informasiLayanan: string | null; // Informasi pelayanan dan jadwal
  gambarInformasi: string | null; // Gambar untuk informasi layanan
  gambarStaff: string | null; // Gambar staff pendukung
  gambarPartner: string | null; // Gambar partner
}

const CogIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/site-config");
      const data = await response.json();
      setConfig(data);
      // Parse carousel images
      if (data.carouselImages) {
        try {
          const parsed = JSON.parse(data.carouselImages);
          setCarouselImages(Array.isArray(parsed) ? parsed : []);
        } catch {
          setCarouselImages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching config:", error);
      setMessage({ type: 'error', text: 'Gagal memuat konfigurasi' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Prepare config with carousel images
      const configToSave = {
        ...config,
        carouselImages: JSON.stringify(carouselImages),
      };

      const response = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Konfigurasi berhasil disimpan!' });
        setConfig(result.data);
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan konfigurasi' });
      }
    } catch (error) {
      console.error("Error saving config:", error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addCarouselImage = (url: string) => {
    if (carouselImages.length < 5) {
      setCarouselImages([...carouselImages, url]);
    }
  };

  const removeCarouselImage = (index: number) => {
    setCarouselImages(carouselImages.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Konfigurasi Situs"
      description="Kelola informasi dan pengaturan company profile LPMPP UNSOED"
      icon={<CogIcon />}
    >
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success'
            ? 'bg-success/10 text-success border border-success/20'
            : 'bg-danger/10 text-danger border border-danger/20'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Section */}
        <Card>
          <CardBody className="gap-6 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Logo & Branding</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                label="Logo UNSOED"
                value={config?.logoUnsoed || null}
                onChange={(url) => handleChange("logoUnsoed", url)}
                description="Logo resmi Universitas Jenderal Soedirman"
              />

              <ImageUpload
                label="Logo Aplikasi"
                value={config?.logoApp || null}
                onChange={(url) => handleChange("logoApp", url)}
                description="Logo aplikasi LPMPP"
              />
            </div>

            <Textarea
              label="Detail Penjelasan Logo"
              placeholder="Masukkan penjelasan tentang makna, filosofi, atau detail logo organisasi..."
              value={config?.logoDescription || ""}
              onChange={(e) => handleChange("logoDescription", e.target.value)}
              minRows={4}
              description="Penjelasan tentang makna dan filosofi logo LPMPP UNSOED"
              variant="bordered"
              size="lg"
            />

            <Input
              label="Nama Aplikasi"
              placeholder="LPMPP UNSOED"
              value={config?.siteName || ""}
              onChange={(e) => handleChange("siteName", e.target.value)}
              isRequired
              description="Nama resmi aplikasi/situs"
              variant="bordered"
              size="lg"
            />

            <Textarea
              label="Tagline"
              placeholder="Masukkan tagline LPMPP"
              value={config?.tagline || ""}
              onChange={(e) => handleChange("tagline", e.target.value)}
              description="Tagline atau slogan singkat LPMPP UNSOED"
              variant="bordered"
              minRows={2}
              maxRows={3}
            />

            <Textarea
              label="Motto"
              placeholder="Masukkan motto LPMPP"
              value={config?.motto || ""}
              onChange={(e) => handleChange("motto", e.target.value)}
              description="Motto atau filosofi LPMPP UNSOED"
              variant="bordered"
              minRows={2}
              maxRows={4}
            />
          </CardBody>
        </Card>

        {/* Carousel Images Section */}
        <Card>
          <CardBody className="gap-6 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Carousel Banner Homepage</h2>
              <p className="text-sm text-default-500">
                Upload gambar untuk carousel di halaman beranda (maksimal 5 gambar)
              </p>
            </div>

            {/* Display existing images */}
            {carouselImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {carouselImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Carousel ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-default-200"
                    />
                    <Button
                      color="danger"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeCarouselImage(index)}
                    >
                      Hapus
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      Gambar {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload new image */}
            {carouselImages.length < 5 && (
              <ImageUpload
                label={`Tambah Gambar Carousel (${carouselImages.length}/5)`}
                value={null}
                onChange={(url) => {
                  addCarouselImage(url);
                }}
                description="Gambar akan ditampilkan sebagai banner carousel di homepage"
              />
            )}

            {carouselImages.length >= 5 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg text-warning text-sm">
                Maksimal 5 gambar carousel telah tercapai. Hapus gambar yang ada untuk menambah yang baru.
              </div>
            )}
          </CardBody>
        </Card>

        {/* Company Profile */}
        <Card>
          <CardBody className="gap-4 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Profil Organisasi</h2>
            </div>

            {/* LPMPP Section */}
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-lg font-medium mb-3 text-primary">LPMPP UNSOED</h3>
              <div className="space-y-4">
                <Textarea
                  label="Visi LPMPP"
                  placeholder="Masukkan visi LPMPP UNSOED..."
                  value={config?.visi || ""}
                  onChange={(e) => handleChange("visi", e.target.value)}
                  minRows={3}
                  description="Visi organisasi LPMPP UNSOED"
                  variant="bordered"
                />
                <Textarea
                  label="Misi LPMPP"
                  placeholder="Masukkan misi LPMPP UNSOED..."
                  value={config?.misi || ""}
                  onChange={(e) => handleChange("misi", e.target.value)}
                  minRows={4}
                  description="Misi organisasi LPMPP UNSOED"
                  variant="bordered"
                />
              </div>
            </div>

            {/* UNSOED Section */}
            <div className="border-l-4 border-secondary pl-4">
              <h3 className="text-lg font-medium mb-3 text-secondary">Universitas Jenderal Soedirman</h3>
              <div className="space-y-4">
                <Textarea
                  label="Visi UNSOED"
                  placeholder="Masukkan visi Universitas Jenderal Soedirman..."
                  value={config?.visiUnsoed || ""}
                  onChange={(e) => handleChange("visiUnsoed", e.target.value)}
                  minRows={3}
                  description="Visi Universitas Jenderal Soedirman"
                  variant="bordered"
                />
                <Textarea
                  label="Misi UNSOED"
                  placeholder="Masukkan misi Universitas Jenderal Soedirman..."
                  value={config?.misiUnsoed || ""}
                  onChange={(e) => handleChange("misiUnsoed", e.target.value)}
                  minRows={4}
                  description="Misi Universitas Jenderal Soedirman"
                  variant="bordered"
                />
              </div>
            </div>

            {/* Tugas dan Fungsi Section */}
            <div className="border-l-4 border-success pl-4">
              <h3 className="text-lg font-medium mb-3 text-success">Tugas & Fungsi</h3>
              <div className="space-y-4">
                <Textarea
                  label="Tugas"
                  placeholder="Masukkan tugas organisasi..."
                  value={config?.tugas || ""}
                  onChange={(e) => handleChange("tugas", e.target.value)}
                  minRows={4}
                  description="Tugas pokok organisasi"
                  variant="bordered"
                />
                <Textarea
                  label="Fungsi"
                  placeholder="Masukkan fungsi organisasi..."
                  value={config?.fungsi || ""}
                  onChange={(e) => handleChange("fungsi", e.target.value)}
                  minRows={4}
                  description="Fungsi organisasi"
                  variant="bordered"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Head Message Section */}
        <Card>
          <CardBody className="gap-4 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Keterangan Kepala Lembaga</h2>
              <p className="text-sm text-default-500">
                Pesan atau sambutan dari Kepala Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran
              </p>
            </div>
            <Textarea
              label="Pesan Kepala Lembaga"
              placeholder="Masukkan pesan atau sambutan dari Kepala Lembaga..."
              value={config?.headMessage || ""}
              onChange={(e) => handleChange("headMessage", e.target.value)}
              minRows={10}
              description="Pesan, sambutan, atau keterangan dari Kepala LPMPP UNSOED"
              variant="bordered"
            />
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardBody className="gap-4 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informasi Kontak</h2>
            </div>
            <Textarea
              label="Alamat"
              placeholder="Jl. HR Boenyamin No.708, Grendeng, Purwokerto..."
              value={config?.alamat || ""}
              onChange={(e) => handleChange("alamat", e.target.value)}
              minRows={2}
              description="Alamat lengkap kantor"
              variant="bordered"
            />
            <Input
              label="Email"
              type="email"
              placeholder="lpmpp@unsoed.ac.id"
              value={config?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              description="Email resmi organisasi"
              variant="bordered"
            />
            <Input
              label="Instagram URL"
              placeholder="https://instagram.com/lpmppunsoed"
              value={config?.instagramUrl || ""}
              onChange={(e) => handleChange("instagramUrl", e.target.value)}
              description="Link ke akun Instagram resmi"
              variant="bordered"
            />
          </CardBody>
        </Card>

        {/* Gambar Halaman Utama */}
        <Card>
          <CardBody className="gap-6 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Gambar Halaman Utama</h2>
              <p className="text-sm text-default-500">
                Upload gambar untuk berbagai section di halaman utama
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                label="Gambar Team"
                value={config?.gambarTeam || null}
                onChange={(url) => handleChange("gambarTeam", url)}
                description="Gambar team LPMPP untuk section tentang tim"
              />

              <ImageUpload
                label="Gambar Slogan"
                value={config?.gambarSlogan || null}
                onChange={(url) => handleChange("gambarSlogan", url)}
                description="Gambar untuk section slogan atau motto"
              />

              <ImageUpload
                label="Gambar Tambahan"
                value={config?.gambarTambahan || null}
                onChange={(url) => handleChange("gambarTambahan", url)}
                description="Gambar tambahan untuk keperluan lainnya"
              />

              <ImageUpload
                label="Gambar Informasi Layanan"
                value={config?.gambarInformasi || null}
                onChange={(url) => handleChange("gambarInformasi", url)}
                description="Gambar untuk section informasi dan jadwal layanan"
              />

              <ImageUpload
                label="Gambar Tenaga Kependidikan"
                value={config?.gambarStaff || null}
                onChange={(url) => handleChange("gambarStaff", url)}
                description="Gambar staff pendukung atau tim kerja"
              />

              <ImageUpload
                label="Gambar Partner"
                value={config?.gambarPartner || null}
                onChange={(url) => handleChange("gambarPartner", url)}
                description="Gambar partner atau kerjasama institusi"
              />
            </div>
          </CardBody>
        </Card>

        {/* Detail Layanan LPMPP */}
        <Card>
          <CardBody className="gap-4 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Detail Layanan LPMPP</h2>
              <p className="text-sm text-default-500">
                Deskripsi lengkap untuk setiap layanan yang disediakan LPMPP
              </p>
            </div>

            <Textarea
              label="LAYANAN KAMI"
              placeholder="LPMPP Universitas Jenderal Soedirman adalah lembaga yang bertugas menjamin mutu pendidikan dan mengembangkan pembelajaran untuk mendukung visi universitas menjadi institusi unggul dan berdaya saing."
              value={config?.layananKami || ""}
              onChange={(e) => handleChange("layananKami", e.target.value)}
              minRows={4}
              description="Deskripsi umum tentang layanan LPMPP"
              variant="bordered"
            />

            <Textarea
              label="PELATIHAN"
              placeholder="LPMPP menyelenggarakan program pelatihan untuk meningkatkan kompetensi tenaga pendidik serta mendukung penjaminan mutu dan pengembangan pembelajaran yang berkualitas di Universitas Jenderal Soedirman."
              value={config?.pelatihan || ""}
              onChange={(e) => handleChange("pelatihan", e.target.value)}
              minRows={3}
              description="Deskripsi tentang layanan pelatihan"
              variant="bordered"
            />

            <Textarea
              label="PEMBELAJARAN"
              placeholder="LPMPP mengembangkan metode, kurikulum, dan teknologi pembelajaran untuk meningkatkan kualitas pendidikan di Universitas Jenderal Soedirman."
              value={config?.pembelajaran || ""}
              onChange={(e) => handleChange("pembelajaran", e.target.value)}
              minRows={3}
              description="Deskripsi tentang pengembangan pembelajaran"
              variant="bordered"
            />

            <Textarea
              label="PENJAMINAN MUTU"
              placeholder="LPMPP memastikan pelaksanaan sistem penjaminan mutu pendidikan yang konsisten, melakukan evaluasi, serta memberikan rekomendasi untuk peningkatan kualitas akademik di Universitas Jenderal Soedirman"
              value={config?.penjaminanMutu || ""}
              onChange={(e) => handleChange("penjaminanMutu", e.target.value)}
              minRows={4}
              description="Deskripsi tentang sistem penjaminan mutu"
              variant="bordered"
            />
          </CardBody>
        </Card>

        {/* Informasi dan Layanan */}
        <Card>
          <CardBody className="gap-4 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informasi dan Layanan</h2>
              <p className="text-sm text-default-500">
                Jadwal pelayanan dan informasi kontak untuk civitas akademika
              </p>
            </div>

            <Textarea
              label="Informasi Pelayanan"
              placeholder="LPMPP menyediakan layanan bagi seluruh civitas akademika Universitas Jenderal Soedirman. Jadwal Pelayanan sebagai berikut:

Hari : Senin s/d Jumat
Waktu : Pukul 08.00 – 16.00 WIB"
              value={config?.informasiLayanan || ""}
              onChange={(e) => handleChange("informasiLayanan", e.target.value)}
              minRows={6}
              description="Informasi lengkap tentang jadwal dan cara pelayanan"
              variant="bordered"
            />
          </CardBody>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-3 justify-end">
          <Button
            color="primary"
            type="submit"
            size="lg"
            isLoading={saving}
            className="min-w-[200px]"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </AdminPageLayout>
  );
}
