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
  visi: string | null;
  misi: string | null;
  tugas: string | null;
  fungsi: string | null;
  alamat: string | null;
  email: string | null;
  instagramUrl: string | null;
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

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/site-config");
      const data = await response.json();
      setConfig(data);
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
      const response = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
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
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
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
          </CardBody>
        </Card>

        {/* Company Profile */}
        <Card>
          <CardBody className="gap-4 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Profil Organisasi</h2>
            </div>
            <Textarea
              label="Visi"
              placeholder="Masukkan visi organisasi..."
              value={config?.visi || ""}
              onChange={(e) => handleChange("visi", e.target.value)}
              minRows={3}
              description="Visi organisasi LPMPP UNSOED"
              variant="bordered"
            />
            <Textarea
              label="Misi"
              placeholder="Masukkan misi organisasi..."
              value={config?.misi || ""}
              onChange={(e) => handleChange("misi", e.target.value)}
              minRows={4}
              description="Misi organisasi LPMPP UNSOED"
              variant="bordered"
            />
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
