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
  Bars3Icon,
  PhotoIcon 
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { ImageUpload } from "@/components/image-upload";

interface DataGaleri {
  id: string;
  judul?: string | null;
  gambar: string;
  deskripsi?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DataGaleriForm {
  judul: string;
  gambar: string;
  deskripsi: string;
  isActive: boolean;
}

export default function DataGaleriPage() {
  const [dataGaleri, setDataGaleri] = useState<DataGaleri[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<DataGaleri | null>(null);
  const [formData, setFormData] = useState<DataGaleriForm>({
    judul: "",
    gambar: "",
    deskripsi: "",
    isActive: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchDataGaleri();
  }, []);

  const fetchDataGaleri = async () => {
    try {
      const response = await fetch("/api/admin/data-galeri");
      if (response.ok) {
        const data = await response.json();
        setDataGaleri(data);
      } else {
        toast.error("Gagal memuat data galeri");
      }
    } catch (error) {
      console.error("Error fetching data galeri:", error);
      toast.error("Gagal memuat data galeri");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      judul: "",
      gambar: "",
      deskripsi: "",
      isActive: true,
    });
    setEditingItem(null);
  };

  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  const handleEdit = (item: DataGaleri) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul || "",
      gambar: item.gambar,
      deskripsi: item.deskripsi || "",
      isActive: item.isActive,
    });
    onOpen();
  };

  const handleSubmit = async () => {
    if (!formData.gambar.trim()) {
      toast.error("URL gambar harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingItem
        ? `/api/admin/data-galeri/${editingItem.id}`
        : "/api/admin/data-galeri";
      
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
            ? "Data galeri berhasil diperbarui"
            : "Data galeri berhasil ditambahkan"
        );
        fetchDataGaleri();
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
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/data-galeri/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Foto berhasil dihapus");
        fetchDataGaleri();
      } else {
        toast.error("Gagal menghapus foto");
      }
    } catch (error) {
      console.error("Error deleting data galeri:", error);
      toast.error("Gagal menghapus foto");
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/data-galeri/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(
          `Foto berhasil ${!isActive ? "diaktifkan" : "disembunyikan"}`
        );
        fetchDataGaleri();
      } else {
        toast.error("Gagal mengubah status foto");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Gagal mengubah status foto");
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
      title="Data Galeri"
      description="Kelola koleksi foto dan gambar LPMPP"
      icon={<PhotoIcon className="w-8 h-8" />}
      action={
        <Button color="primary" startContent={<PlusIcon className="w-5 h-5" />} onPress={handleAdd}>
          Tambah Foto
        </Button>
      }
      badge={{
        label: "Foto",
        value: dataGaleri.length
      }}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">{dataGaleri.length}</div>
            <div className="text-sm text-gray-600">Total Foto</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">
              {dataGaleri.filter(item => item.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Aktif</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">
              {dataGaleri.filter(item => !item.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Tersembunyi</div>
          </CardBody>
        </Card>
      </div>

      {/* Gallery Grid View */}
      <Card>
        <CardBody>
          {dataGaleri.length === 0 ? (
            <div className="text-center py-12">
              <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Belum ada foto di galeri
              </h3>
              <p className="text-gray-500">
                Klik tombol "Tambah Foto" untuk menambahkan foto pertama Anda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dataGaleri.map((item, index) => (
                <Card key={item.id} className="relative group">
                  <CardBody className="p-0">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={item.gambar}
                        alt={item.judul || `Foto ${index + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="solid"
                            color={item.isActive ? "warning" : "success"}
                            onPress={() => toggleActive(item.id, item.isActive)}
                          >
                            {item.isActive ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="solid"
                            color="primary"
                            onPress={() => handleEdit(item)}
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="solid"
                            color="danger"
                            onPress={() => handleDelete(item.id)}
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Order badge */}
                      <div className="absolute top-2 left-2">
                        <Chip
                          size="sm"
                          variant="solid"
                          color="default"
                          classNames={{
                            base: "bg-black/70 text-white"
                          }}
                        >
                          #{index + 1}
                        </Chip>
                      </div>
                      
                      {/* Status badge */}
                      <div className="absolute top-2 right-2">
                        <Chip
                          size="sm"
                          color={item.isActive ? "success" : "default"}
                          variant="solid"
                        >
                          {item.isActive ? "Aktif" : "Tersembunyi"}
                        </Chip>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      {item.judul && (
                        <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                          {item.judul}
                        </h4>
                      )}
                      {item.deskripsi && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.deskripsi}
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
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
            {editingItem ? "Edit Foto Galeri" : "Tambah Foto Galeri"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <ImageUpload
                label="Upload Gambar"
                value={formData.gambar || null}
                onChange={(url) => setFormData({ ...formData, gambar: url })}
                description="Upload foto untuk galeri (otomatis convert ke WebP)"
              />
              
              <Input
                label="Judul/Caption"
                placeholder="Masukkan judul atau caption foto (opsional)"
                value={formData.judul}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
              />
              
              <Textarea
                label="Deskripsi"
                placeholder="Masukkan deskripsi foto (opsional)"
                value={formData.deskripsi}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                maxRows={4}
              />
              
              <div className="flex items-center gap-3">
                <Switch
                  isSelected={formData.isActive}
                  onValueChange={(value: boolean) =>
                    setFormData({ ...formData, isActive: value })
                  }
                />
                <span className="text-sm">Tampilkan di galeri</span>
              </div>
              
              {/* Preview Gambar */}
              {formData.gambar && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Preview Gambar:</p>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.gambar}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="500px"
                      onError={() => {
                        setFormData({ ...formData, gambar: "" });
                        toast.error("URL gambar tidak valid");
                      }}
                    />
                  </div>
                </div>
              )}
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
