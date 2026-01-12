"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { AdminPageLayout } from "@/components/admin-page-layout";
import Image from "next/image";

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  alert(message);
};

// Icons
const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const ComputerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

const CATEGORY_OPTIONS = [
  { key: "Akademik", label: "Akademik" },
  { key: "Kepegawaian", label: "Kepegawaian" },
  { key: "Keuangan", label: "Keuangan" },
  { key: "Kemahasiswaan", label: "Kemahasiswaan" },
  { key: "Penelitian", label: "Penelitian" },
  { key: "Pengabdian", label: "Pengabdian" },
  { key: "Umum", label: "Umum" },
  { key: "Lainnya", label: "Lainnya" },
];

interface SpmiInformationSystem {
  id: string;
  name: string;
  shortName: string | null;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  category: string | null;
  order: number;
  isActive: boolean;
}

export default function SpmiInformationSystemsPage() {
  const [systems, setSystems] = useState<SpmiInformationSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    shortName: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    category: "",
    order: 0,
  });

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [systemToDelete, setSystemToDelete] = useState<SpmiInformationSystem | null>(null);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const response = await fetch("/api/spmi-information-systems");
      const data = await response.json();
      setSystems(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching systems:", error);
      setSystems([]);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      id: "",
      name: "",
      shortName: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
      category: "",
      order: systems.length + 1,
    });
    onOpen();
  };

  const handleEdit = (system: SpmiInformationSystem) => {
    setFormData({
      id: system.id,
      name: system.name,
      shortName: system.shortName || "",
      description: system.description || "",
      logoUrl: system.logoUrl || "",
      websiteUrl: system.websiteUrl || "",
      category: system.category || "",
      order: system.order,
    });
    onOpen();
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showNotification("Ukuran file maksimal 2MB", "error");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification("Hanya file gambar yang diperbolehkan", "error");
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData({ ...formData, logoUrl: data.url });
      showNotification("Logo berhasil diupload", "success");
    } catch (error) {
      console.error("Error uploading logo:", error);
      showNotification("Gagal mengupload logo", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      showNotification("Nama sistem informasi harus diisi", "error");
      return;
    }

    try {
      const url = "/api/spmi-information-systems";
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification(formData.id ? "Sistem informasi berhasil diperbarui" : "Sistem informasi berhasil ditambahkan", "success");
        onClose();
        fetchSystems();
      } else {
        showNotification("Gagal menyimpan sistem informasi", "error");
      }
    } catch (error) {
      console.error("Error saving system:", error);
      showNotification("Terjadi kesalahan saat menyimpan sistem informasi", "error");
    }
  };

  const handleDelete = (system: SpmiInformationSystem) => {
    setSystemToDelete(system);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!systemToDelete) return;

    try {
      const response = await fetch(`/api/spmi-information-systems?id=${systemToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification("Sistem informasi berhasil dihapus", "success");
        onDeleteClose();
        fetchSystems();
      } else {
        showNotification("Gagal menghapus sistem informasi", "error");
      }
    } catch (error) {
      console.error("Error deleting system:", error);
      showNotification("Terjadi kesalahan saat menghapus sistem informasi", "error");
    }
  };

  return (
    <AdminPageLayout
      title="Sistem Informasi Pendukung SPMI"
      description="Kelola data sistem informasi yang mendukung SPMI UNSOED"
      icon={<ComputerIcon className="w-8 h-8" />}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="p-4">
            <p className="text-xs text-default-500">Total Sistem</p>
            <p className="text-2xl font-bold text-primary">{systems.length}</p>
          </CardBody>
        </Card>
        {CATEGORY_OPTIONS.slice(0, 3).map(cat => (
          <Card key={cat.key}>
            <CardBody className="p-4">
              <p className="text-xs text-default-500">{cat.label}</p>
              <p className="text-2xl font-bold text-primary">
                {systems.filter(s => s.category === cat.key).length}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Daftar Sistem Informasi</h3>
          <Button
            color="primary"
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={handleAdd}
          >
            Tambah Sistem Informasi
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Tabel Sistem Informasi Pendukung SPMI">
            <TableHeader>
              <TableColumn>LOGO</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>DESKRIPSI</TableColumn>
              <TableColumn>KATEGORI</TableColumn>
              <TableColumn>WEBSITE</TableColumn>
              <TableColumn>URUTAN</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody items={systems} isLoading={loading} emptyContent="Belum ada data sistem informasi">
              {(system) => (
                <TableRow key={system.id}>
                  <TableCell>
                    {system.logoUrl ? (
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-default-200">
                        <Image
                          src={system.logoUrl}
                          alt={system.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-default-100 flex items-center justify-center">
                        <ComputerIcon className="w-6 h-6 text-default-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{system.name}</p>
                      {system.shortName && (
                        <p className="text-xs text-default-500">({system.shortName})</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-default-600 line-clamp-2">
                      {system.description || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    {system.category ? (
                      <Chip size="sm" variant="flat" color="primary">
                        {system.category}
                      </Chip>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    {system.websiteUrl ? (
                      <a
                        href={system.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                        <span className="text-sm">Kunjungi</span>
                      </a>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{system.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<PencilIcon className="w-3 h-3" />}
                        onPress={() => handleEdit(system)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        startContent={<TrashIcon className="w-3 h-3" />}
                        onPress={() => handleDelete(system)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {formData.id ? "Edit Sistem Informasi" : "Tambah Sistem Informasi"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nama Sistem"
                  placeholder="Masukkan nama sistem informasi"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  isRequired
                />

                <Input
                  label="Singkatan/Akronim"
                  placeholder="e.g., SIAKAD, SIMPEG"
                  value={formData.shortName}
                  onChange={(e) =>
                    setFormData({ ...formData, shortName: e.target.value })
                  }
                />
              </div>

              <Textarea
                label="Deskripsi"
                placeholder="Deskripsi singkat tentang sistem informasi ini"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Kategori"
                  placeholder="Pilih kategori"
                  selectedKeys={formData.category ? [formData.category] : []}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  type="number"
                  label="Urutan"
                  placeholder="Urutan tampil"
                  value={formData.order.toString()}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <Input
                label="URL Website"
                placeholder="https://example.unsoed.ac.id"
                value={formData.websiteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
              />

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Logo Aplikasi</label>
                <div className="flex items-center gap-4">
                  {formData.logoUrl ? (
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-default-200">
                      <Image
                        src={formData.logoUrl}
                        alt="Logo preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-default-100 flex items-center justify-center">
                      <ComputerIcon className="w-8 h-8 text-default-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer border border-default-200 rounded-lg p-2"
                    />
                    <p className="text-xs text-default-500 mt-1">
                      Format: JPG, PNG, SVG (Maks. 2MB)
                    </p>
                  </div>
                </div>
                {formData.logoUrl && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => setFormData({ ...formData, logoUrl: "" })}
                  >
                    Hapus Logo
                  </Button>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSave} isLoading={uploading}>
              {formData.id ? "Perbarui" : "Tambah"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Hapus Sistem Informasi</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus sistem informasi{" "}
              <strong>{systemToDelete?.name}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>
              Batal
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
