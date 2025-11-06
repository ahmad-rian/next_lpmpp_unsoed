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
import { Spinner } from "@heroui/spinner";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";

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
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Akreditasi Internasional</h1>
          <p className="text-default-500 text-sm">
            Kelola data akreditasi internasional program studi
          </p>
        </div>
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
  );
}
