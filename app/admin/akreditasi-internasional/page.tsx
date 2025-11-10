"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { AdminPageLayout } from "@/components/admin-page-layout";

// Heroicons
const GlobeIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

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

interface InternationalAccreditation {
  id: string;
  facultyName: string;
  programName: string;
  agency: string;
  order: number;
  isActive: boolean;
}

export default function AkreditasiInternasionalPage() {
  const [accreditations, setAccreditations] = useState<InternationalAccreditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<InternationalAccreditation | null>(null);

  const [formData, setFormData] = useState({
    facultyName: "",
    programName: "",
    agency: "",
    order: 0,
  });

  useEffect(() => {
    fetchAccreditations();
  }, []);

  const fetchAccreditations = async () => {
    try {
      const response = await fetch("/api/international-accreditations");
      const data = await response.json();
      if (data.accreditations) {
        setAccreditations(data.accreditations);
      }
    } catch (error) {
      console.error("Error fetching accreditations:", error);
      alert("Gagal memuat data akreditasi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: InternationalAccreditation) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        facultyName: item.facultyName,
        programName: item.programName,
        agency: item.agency,
        order: item.order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        facultyName: "",
        programName: "",
        agency: "",
        order: accreditations.length + 1,
      });
    }
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setFormData({
      facultyName: "",
      programName: "",
      agency: "",
      order: 0,
    });
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.facultyName || !formData.programName || !formData.agency) {
      alert("Semua field harus diisi");
      return;
    }

    setSaving(true);
    try {
      const url = "/api/international-accreditations";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem
        ? { id: editingItem.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan data");
      }

      alert(editingItem ? "Data berhasil diperbarui" : "Data berhasil ditambahkan");
      handleCloseModal();
      fetchAccreditations();
    } catch (error: any) {
      console.error("Error saving:", error);
      alert(error.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/international-accreditations?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus data");
      }

      alert("Data berhasil dihapus");
      fetchAccreditations();
    } catch (error: any) {
      console.error("Error deleting:", error);
      alert(error.message || "Gagal menghapus data");
    }
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
      title="Akreditasi Internasional"
      description="Kelola data akreditasi internasional program studi"
      icon={<GlobeIcon />}
    >
      <div className="space-y-6">
        {/* Header dengan tombol */}
        <div className="flex justify-end">
          <Button
            color="primary"
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={() => handleOpenModal()}
          >
            Tambah Data
          </Button>
        </div>

        {/* Table */}
        <Table aria-label="Akreditasi Internasional Table">
          <TableHeader>
            <TableColumn>NO</TableColumn>
            <TableColumn>FAKULTAS</TableColumn>
            <TableColumn>PROGRAM STUDI</TableColumn>
            <TableColumn>LEMBAGA</TableColumn>
            <TableColumn>AKSI</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Belum ada data akreditasi">
            {accreditations.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.facultyName}</TableCell>
                <TableCell>{item.programName}</TableCell>
                <TableCell>
                  <div className="whitespace-pre-wrap">{item.agency}</div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="warning"
                      isIconOnly
                      onPress={() => handleOpenModal(item)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      isIconOnly
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

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal} size="2xl">
          <ModalContent>
            <ModalHeader>
              {editingItem ? "Edit Akreditasi" : "Tambah Akreditasi"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Fakultas"
                  placeholder="Masukkan nama fakultas"
                  value={formData.facultyName}
                  onChange={(e) =>
                    setFormData({ ...formData, facultyName: e.target.value })
                  }
                  isRequired
                />
                <Input
                  label="Program Studi"
                  placeholder="Masukkan nama program studi"
                  value={formData.programName}
                  onChange={(e) =>
                    setFormData({ ...formData, programName: e.target.value })
                  }
                  isRequired
                />
                <Textarea
                  label="Lembaga"
                  placeholder="Masukkan nama lembaga akreditasi"
                  value={formData.agency}
                  onChange={(e) =>
                    setFormData({ ...formData, agency: e.target.value })
                  }
                  minRows={3}
                  isRequired
                />
                <Input
                  type="number"
                  label="Urutan"
                  placeholder="Masukkan urutan tampilan"
                  value={formData.order.toString()}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={handleCloseModal}>
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={saving}>
                {editingItem ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminPageLayout>
  );
}
