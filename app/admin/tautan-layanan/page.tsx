"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  LinkIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { ImageUpload } from "@/components/image-upload";
import { AdminPageLayout } from "@/components/admin-page-layout";

interface TautanLayanan {
  id: string;
  nama: string;
  gambar?: string | null;
  link: string;
  deskripsi?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TautanLayananForm {
  nama: string;
  gambar: string;
  link: string;
  deskripsi: string;
  isActive: boolean;
}

export default function TautanLayananPage() {
  const [tautanLayanan, setTautanLayanan] = useState<TautanLayanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<TautanLayanan | null>(null);
  const [formData, setFormData] = useState<TautanLayananForm>({
    nama: "",
    gambar: "",
    link: "",
    deskripsi: "",
    isActive: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchTautanLayanan();
  }, []);

  const fetchTautanLayanan = async () => {
    try {
      const response = await fetch("/api/admin/tautan-layanan");
      if (response.ok) {
        const data = await response.json();
        setTautanLayanan(data);
      } else {
        toast.error("Gagal memuat data tautan layanan");
      }
    } catch (error) {
      console.error("Error fetching tautan layanan:", error);
      toast.error("Gagal memuat data tautan layanan");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      gambar: "",
      link: "",
      deskripsi: "",
      isActive: true,
    });
    setEditingItem(null);
  };

  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  const handleEdit = (item: TautanLayanan) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      gambar: item.gambar || "",
      link: item.link,
      deskripsi: item.deskripsi || "",
      isActive: item.isActive,
    });
    onOpen();
  };

  const handleSubmit = async () => {
    if (!formData.nama.trim()) {
      toast.error("Nama layanan harus diisi");
      return;
    }

    if (!formData.link.trim()) {
      toast.error("Link layanan harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingItem
        ? `/api/admin/tautan-layanan/${editingItem.id}`
        : "/api/admin/tautan-layanan";
      
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingItem
            ? "Tautan layanan berhasil diperbarui"
            : "Tautan layanan berhasil ditambahkan"
        );
        fetchTautanLayanan();
        onClose();
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tautan layanan ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tautan-layanan/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Tautan layanan berhasil dihapus");
        fetchTautanLayanan();
      } else {
        toast.error("Gagal menghapus tautan layanan");
      }
    } catch (error) {
      console.error("Error deleting tautan layanan:", error);
      toast.error("Gagal menghapus tautan layanan");
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/tautan-layanan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(
          `Tautan layanan berhasil ${!isActive ? "diaktifkan" : "dinonaktifkan"}`
        );
        fetchTautanLayanan();
      } else {
        toast.error("Gagal mengubah status tautan layanan");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Gagal mengubah status tautan layanan");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Tautan Layanan"
      description="Kelola tautan ke layanan-layanan penting"
      icon={<LinkIcon className="w-8 h-8" />}
      action={
        <Button color="primary" startContent={<PlusIcon className="w-5 h-5" />} onPress={handleAdd}>
          Tambah Tautan Layanan
        </Button>
      }
      badge={{
        label: "Tautan",
        value: tautanLayanan.length
      }}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">{tautanLayanan.length}</div>
            <div className="text-sm text-gray-600">Total Tautan</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">
              {tautanLayanan.filter(item => item.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Aktif</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">
              {tautanLayanan.filter(item => !item.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Tidak Aktif</div>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table aria-label="Tautan Layanan table">
            <TableHeader>
              <TableColumn>URUTAN</TableColumn>
              <TableColumn>GAMBAR</TableColumn>
              <TableColumn>NAMA LAYANAN</TableColumn>
              <TableColumn>DESKRIPSI</TableColumn>
              <TableColumn>LINK</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak ada tautan layanan">
              {tautanLayanan.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Bars3Icon className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm">{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.gambar ? (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={item.gambar}
                          alt={item.nama}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-semibold line-clamp-2">{item.nama}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.deskripsi || "-"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
                    >
                      <span>Buka Link</span>
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={item.isActive ? "success" : "default"}
                      variant="flat"
                      size="sm"
                    >
                      {item.isActive ? "Aktif" : "Tidak Aktif"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={item.isActive ? "warning" : "success"}
                        onPress={() => toggleActive(item.id, item.isActive)}
                      >
                        {item.isActive ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => handleEdit(item)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(item.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal Form */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {editingItem ? "Edit Tautan Layanan" : "Tambah Tautan Layanan"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nama Layanan"
                placeholder="Masukkan nama layanan"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                isRequired
              />
              
              <Input
                label="Link Layanan"
                placeholder="https://example.com"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                type="url"
                isRequired
              />
              
              <Textarea
                label="Deskripsi"
                placeholder="Masukkan deskripsi layanan (opsional)"
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                maxRows={4}
              />
              
              <ImageUpload
                label="Gambar Layanan"
                value={formData.gambar || null}
                onChange={(url) => setFormData({ ...formData, gambar: url })}
                description="Gambar akan otomatis dikonversi ke format WebP"
              />
              
              <div className="flex items-center gap-3">
                <Switch
                  isSelected={formData.isActive}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value })
                  }
                />
                <span className="text-sm">Aktif</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Batal
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={submitting}
            >
              {editingItem ? "Perbarui" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
