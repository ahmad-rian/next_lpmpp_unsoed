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
import { BookOpenIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { ImageUpload } from "@/components/image-upload";
import toast from "react-hot-toast";

interface DataBuku {
  id: string;
  judul: string;
  deskripsi?: string | null;
  gambar?: string | null;
  link?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DataBukuForm {
  judul: string;
  deskripsi: string;
  cover: string;
  linkBuku: string;
  urutan: string;
  isActive: boolean;
}

export default function DataBukuPage() {
  const [dataBuku, setDataBuku] = useState<DataBuku[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<DataBuku | null>(null);
  const [formData, setFormData] = useState<DataBukuForm>({
    judul: "",
    deskripsi: "",
    cover: "",
    linkBuku: "",
    urutan: "0",
    isActive: true,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/data-buku");
      if (response.ok) {
        const data = await response.json();
        setDataBuku(data);
      } else {
        toast.error("Gagal memuat data buku");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data buku");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      judul: "",
      deskripsi: "",
      cover: "",
      linkBuku: "",
      urutan: "0",
      isActive: true,
    });
    onOpen();
  };

  const handleEdit = (item: DataBuku) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || "",
      cover: item.gambar || "",
      linkBuku: item.link || "",
      urutan: item.order.toString(),
      isActive: item.isActive,
    });
    onOpen();
  };

  const handleSubmit = async () => {
    if (!formData.judul) {
      toast.error("Judul harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingItem 
        ? `/api/admin/data-buku/${editingItem.id}` 
        : "/api/admin/data-buku";
      const method = editingItem ? "PUT" : "POST";

      const payload = {
        judul: formData.judul,
        deskripsi: formData.deskripsi || null,
        cover: formData.cover || null,
        linkBuku: formData.linkBuku || null,
        urutan: parseInt(formData.urutan) || 0,
        isActive: formData.isActive,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingItem ? "Data buku berhasil diperbarui" : "Data buku berhasil ditambahkan");
        await fetchData();
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Gagal menyimpan data buku");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Gagal menyimpan data buku");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data buku ini?")) return;

    try {
      const response = await fetch(`/api/admin/data-buku/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Data buku berhasil dihapus");
        await fetchData();
      } else {
        toast.error("Gagal menghapus data buku");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Gagal menghapus data buku");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const item = dataBuku.find(d => d.id === id);
      if (!item) return;

      const response = await fetch(`/api/admin/data-buku/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        toast.success(`Status berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
        await fetchData();
      } else {
        toast.error("Gagal mengubah status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal mengubah status");
    }
  };

  return (
    <AdminPageLayout
      title="Data Buku"
      description="Kelola koleksi buku dan publikasi LPMPP"
      icon={<BookOpenIcon className="w-8 h-8" />}
      action={
        <Button color="primary" startContent={<PlusIcon className="w-5 h-5" />} onPress={handleAdd}>
          Tambah Data Buku
        </Button>
      }
      badge={{
        label: "Buku",
        value: dataBuku.length
      }}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">{dataBuku.length}</div>
            <div className="text-sm text-gray-600">Total Buku</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">
              {dataBuku.filter(item => item.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Aktif</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">
              {dataBuku.filter(item => !item.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Tidak Aktif</div>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table aria-label="Data Buku table">
            <TableHeader>
              <TableColumn>COVER</TableColumn>
              <TableColumn>JUDUL & DESKRIPSI</TableColumn>
              <TableColumn>LINK</TableColumn>
              <TableColumn>URUTAN</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody>
              {dataBuku.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.gambar ? (
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <BookOpenIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.judul}</p>
                      {item.deskripsi && (
                        <p className="text-sm text-gray-600 line-clamp-2">{item.deskripsi}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.link ? (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Lihat Buku
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">Tidak ada link</span>
                    )}
                  </TableCell>
                  <TableCell>{item.order}</TableCell>
                  <TableCell>
                    <Switch
                      isSelected={item.isActive}
                      onValueChange={() => handleToggleStatus(item.id, item.isActive)}
                      color="success"
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
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
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {editingItem ? "Edit Data Buku" : "Tambah Data Buku"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Judul Buku"
                placeholder="Masukkan judul buku"
                value={formData.judul}
                onChange={(e) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
                isRequired
              />

              <Textarea
                label="Deskripsi"
                placeholder="Masukkan deskripsi buku (opsional)"
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                maxRows={4}
              />

              <Input
                label="Urutan"
                type="number"
                placeholder="0"
                value={formData.urutan}
                onChange={(e) =>
                  setFormData({ ...formData, urutan: e.target.value })
                }
              />

              <div className="flex items-center gap-3">
                <Switch
                  isSelected={formData.isActive}
                  onValueChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  color="success"
                />
                <label className="text-sm">Aktif</label>
              </div>

              <ImageUpload
                label="Cover Buku"
                value={formData.cover || null}
                onChange={(url) => setFormData({ ...formData, cover: url })}
                description="Upload gambar cover buku (otomatis convert ke WebP)"
              />

              <Input
                label="Link Buku"
                placeholder="https://example.com/link-ke-buku"
                value={formData.linkBuku}
                onChange={(e) =>
                  setFormData({ ...formData, linkBuku: e.target.value })
                }
                type="url"
                description="URL link menuju buku atau file PDF online"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Batal
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={submitting}
            >
              {editingItem ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
