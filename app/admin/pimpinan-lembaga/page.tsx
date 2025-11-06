"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { ImageUpload } from "@/components/image-upload";

interface Leadership {
  id: string;
  position: "HEAD" | "SECRETARY";
  name: string;
  title: string | null;
  photo: string | null;
}

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

export default function LeadershipPage() {
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchLeadership();
  }, []);

  const fetchLeadership = async () => {
    try {
      const response = await fetch("/api/leadership");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is an array
      setLeadership(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching leadership:", error);
      setMessage({ type: 'error', text: 'Gagal memuat data pimpinan' });
      setLeadership([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (position: "HEAD" | "SECRETARY", field: string, value: any) => {
    setLeadership((prev) =>
      prev.map((item) =>
        item.position === position ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Update each leadership position
      for (const leader of leadership) {
        const response = await fetch("/api/leadership", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leader),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Gagal menyimpan data');
        }
      }

      setMessage({ type: 'success', text: 'Data pimpinan berhasil disimpan!' });
      
      // Refresh data
      fetchLeadership();
      
      // Auto hide message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      console.error("Error saving leadership:", error);
      setMessage({ type: 'error', text: error.message || 'Terjadi kesalahan saat menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  const getLeader = (position: "HEAD" | "SECRETARY") => {
    return leadership.find((l) => l.position === position);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-default-500">Memuat data...</p>
      </div>
    );
  }

  const headLeader = getLeader("HEAD");
  const secretaryLeader = getLeader("SECRETARY");

  return (
    <AdminPageLayout
      title="Pimpinan Lembaga"
      description="Kelola data Kepala dan Sekretaris LPMPP UNSOED"
      icon={<UsersIcon />}
    >
      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === 'success'
              ? 'bg-success/10 text-success border border-success/20'
              : 'bg-danger/10 text-danger border border-danger/20'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kepala Lembaga */}
        <Card>
          <CardBody className="gap-6 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Kepala Lembaga</h2>
              <p className="text-sm text-default-500">
                Data Kepala LPMPP UNSOED
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Nama Lengkap & Gelar"
                  placeholder="Prof. Dr. Nama Lengkap, M.Sc., Ph.D."
                  value={headLeader?.name || ""}
                  onChange={(e) => handleChange("HEAD", "name", e.target.value)}
                  isRequired
                  description="Nama lengkap dengan gelar akademik"
                  variant="bordered"
                  size="lg"
                />

                <Input
                  label="Jabatan"
                  placeholder="Kepala Lembaga"
                  value={headLeader?.title || ""}
                  onChange={(e) => handleChange("HEAD", "title", e.target.value)}
                  description="Jabatan/posisi"
                  variant="bordered"
                  size="lg"
                />
              </div>

              <ImageUpload
                label="Foto Kepala Lembaga"
                value={headLeader?.photo || null}
                onChange={(url) => handleChange("HEAD", "photo", url)}
                description="Foto resmi Kepala Lembaga (akan diconvert ke WebP)"
              />
            </div>
          </CardBody>
        </Card>

        {/* Sekretaris Lembaga */}
        <Card>
          <CardBody className="gap-6 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Sekretaris Lembaga</h2>
              <p className="text-sm text-default-500">
                Data Sekretaris LPMPP UNSOED
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Nama Lengkap & Gelar"
                  placeholder="Dr. Nama Lengkap, S.Sos., M.Psi."
                  value={secretaryLeader?.name || ""}
                  onChange={(e) => handleChange("SECRETARY", "name", e.target.value)}
                  isRequired
                  description="Nama lengkap dengan gelar akademik"
                  variant="bordered"
                  size="lg"
                />

                <Input
                  label="Jabatan"
                  placeholder="Sekretaris Lembaga"
                  value={secretaryLeader?.title || ""}
                  onChange={(e) => handleChange("SECRETARY", "title", e.target.value)}
                  description="Jabatan/posisi"
                  variant="bordered"
                  size="lg"
                />
              </div>

              <ImageUpload
                label="Foto Sekretaris Lembaga"
                value={secretaryLeader?.photo || null}
                onChange={(url) => handleChange("SECRETARY", "photo", url)}
                description="Foto resmi Sekretaris Lembaga (akan diconvert ke WebP)"
              />
            </div>
          </CardBody>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            color="primary"
            size="lg"
            isLoading={saving}
            className="px-8"
          >
            {saving ? "Menyimpan..." : "Simpan Data Pimpinan"}
          </Button>
        </div>
      </form>
    </AdminPageLayout>
  );
}
