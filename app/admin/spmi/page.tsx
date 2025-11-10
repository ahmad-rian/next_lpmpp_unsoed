"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { AdminPageLayout } from "@/components/admin-page-layout";

interface SpmiAbout {
  id: string;
  title: string;
  tujuan: string;
  fungsi: string;
}

const DocumentIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

interface SpmiAbout {
  id: string;
  title: string;
  tujuan: string;
  fungsi: string;
}

export default function AdminSpmiPage() {
  const [spmiData, setSpmiData] = useState<SpmiAbout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: "SPM Unsoed",
    tujuan: "",
    fungsi: "",
  });

  useEffect(() => {
    fetchSpmiData();
  }, []);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchSpmiData = async () => {
    try {
      const response = await fetch("/api/admin/spmi");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSpmiData(data);
          setFormData({
            title: data.title,
            tujuan: data.tujuan,
            fungsi: data.fungsi,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching SPMI data:", error);
      setMessage({ type: 'error', text: 'Gagal memuat data SPMI' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/spmi", {
        method: spmiData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSpmiData(data);
        setMessage({ type: 'success', text: 'Data SPMI berhasil disimpan!' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Gagal menyimpan data SPMI' });
      }
    } catch (error) {
      console.error("Error saving SPMI data:", error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Tentang SPMI"
      description="Kelola informasi Sistem Penjaminan Mutu Internal (SPMI) UNSOED"
      icon={<DocumentIcon />}
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
        {/* Basic Information Section */}
        <Card>
          <CardBody className="gap-6 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informasi Dasar</h2>
            </div>

            <Input
              label="Judul"
              placeholder="Masukkan judul (contoh: SPM Unsoed)"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              isRequired
              variant="bordered"
              size="lg"
              description="Judul utama halaman Tentang SPMI"
            />
          </CardBody>
        </Card>

        {/* Tujuan SPMI Section */}
        <Card>
          <CardBody className="gap-6 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Tujuan SPMI</h2>
            </div>

            <Textarea
              label="Tujuan SPMI"
              placeholder="Masukkan tujuan SPMI (gunakan format list dengan nomor)"
              value={formData.tujuan}
              onChange={(e) => handleChange("tujuan", e.target.value)}
              isRequired
              variant="bordered"
              minRows={10}
              size="lg"
              description="Tips: Gunakan format numbered list seperti: 1. Item pertama | 2. Item kedua"
            />

            <div className="text-xs text-default-500 bg-default-50 dark:bg-default-100 p-4 rounded-lg">
              <strong>Contoh format:</strong>
              <pre className="mt-2 whitespace-pre-wrap text-xs">
{`Tujuan penerapan SPMI di Unsoed adalah untuk:

1. Menjamin pencapaian tujuan Unsoed
2. Menjamin pemenuhan dan pelampauan Standar Pendidikan Tinggi
3. Menjamin keselarasan SPMI dengan SPME
4. Mewujudkan transparansi dan akuntabilitas`}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Fungsi SPMI Section */}
        <Card>
          <CardBody className="gap-6 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Fungsi SPMI</h2>
            </div>

            <Textarea
              label="Fungsi SPMI"
              placeholder="Masukkan fungsi SPMI (gunakan format list dengan nomor)"
              value={formData.fungsi}
              onChange={(e) => handleChange("fungsi", e.target.value)}
              isRequired
              variant="bordered"
              minRows={8}
              size="lg"
              description="Tips: Gunakan format numbered list seperti: 1. Item pertama | 2. Item kedua"
            />

            <div className="text-xs text-default-500 bg-default-50 dark:bg-default-100 p-4 rounded-lg">
              <strong>Contoh format:</strong>
              <pre className="mt-2 whitespace-pre-wrap text-xs">
{`Fungsi SPMI di Unsoed adalah:

1. Sebagai bentuk akuntabilitas kepada pemangku kepentingan
2. Sebagai landasan dan arah dalam peningkatan mutu pendidikan
3. Sebagai pedoman penyelenggaraan pendidikan tinggi`}
              </pre>
            </div>
          </CardBody>
        </Card>

        {/* Preview Section */}
        {(formData.tujuan || formData.fungsi) && (
          <Card>
            <CardBody className="gap-6 p-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Preview</h2>
              </div>

              <div className="bg-default-50 dark:bg-default-100 p-6 rounded-lg space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {formData.title}
                  </h3>
                </div>

                {formData.tujuan && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-danger">TUJUAN</h4>
                    <div className="whitespace-pre-wrap text-default-700 text-sm leading-relaxed">
                      {formData.tujuan}
                    </div>
                  </div>
                )}

                {formData.fungsi && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-warning">FUNGSI SPMI</h4>
                    <div className="whitespace-pre-wrap text-default-700 text-sm leading-relaxed">
                      {formData.fungsi}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardBody className="p-6">
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="flat"
                onPress={() => {
                  if (spmiData) {
                    setFormData({
                      title: spmiData.title,
                      tujuan: spmiData.tujuan,
                      fungsi: spmiData.fungsi,
                    });
                  }
                }}
                isDisabled={isSaving}
              >
                Reset
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={isSaving}
                isDisabled={isSaving}
                size="lg"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </AdminPageLayout>
  );
}
