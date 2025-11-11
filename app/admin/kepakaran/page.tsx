"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Pagination } from "@heroui/pagination";
import { AdminPageLayout } from "@/components/admin-page-layout";

// Icons
const AcademicCapIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
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

interface Expertise {
  id: string;
  type: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const typeLabels = {
  FASILITATOR_PEKERTI: "Fasilitator Pekerti/AA",
  AUDITOR_SPMI: "Auditor SPMI",
  ASESOR_BKD: "Asesor BKD",
};

export default function KepakaranPage() {
  const [selectedType, setSelectedType] = useState("FASILITATOR_PEKERTI");
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [formData, setFormData] = useState({
    id: "",
    type: selectedType,
    name: "",
    order: 0,
  });

  const [editingExpertise, setEditingExpertise] = useState<Expertise | null>(null);

  // Calculate pagination
  const pages = Math.ceil(expertise.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return expertise.slice(start, end);
  }, [page, expertise]);

  useEffect(() => {
    fetchExpertise();
    setPage(1); // Reset to first page when changing tabs
  }, [selectedType]);

  const fetchExpertise = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expertise?type=${selectedType}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch expertise");
      }
      
      if (Array.isArray(data)) {
        setExpertise(data);
      } else {
        console.error("Invalid data format:", data);
        setExpertise([]);
      }
    } catch (error) {
      console.error("Error fetching expertise:", error);
      setExpertise([]);
      alert("Gagal memuat data kepakaran");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingExpertise(null);
    setFormData({
      id: "",
      type: selectedType,
      name: "",
      order: expertise.length + 1,
    });
    onOpen();
  };

  const handleEdit = (exp: Expertise) => {
    setEditingExpertise(exp);
    setFormData({
      id: exp.id,
      type: exp.type,
      name: exp.name,
      order: exp.order,
    });
    onOpen();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Nama harus diisi");
      return;
    }

    try {
      setSaving(true);

      const method = editingExpertise ? "PUT" : "POST";
      const response = await fetch("/api/expertise", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      await fetchExpertise();
      onClose();
      alert(editingExpertise ? "Data berhasil diupdate" : "Data berhasil ditambahkan");
    } catch (error) {
      console.error("Error saving expertise:", error);
      alert("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const response = await fetch(`/api/expertise?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      await fetchExpertise();
      alert("Data berhasil dihapus");
    } catch (error) {
      console.error("Error deleting expertise:", error);
      alert("Gagal menghapus data");
    }
  };

  return (
    <AdminPageLayout
      title="Kepakaran"
      description="Kelola data Fasilitator, Auditor, dan Asesor"
      icon={<AcademicCapIcon />}
    >
      <div className="flex justify-between items-center mb-6">
        <Chip color="primary" variant="flat">
          Total: {expertise.length} data
        </Chip>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
          onPress={handleAdd}
        >
          Tambah {typeLabels[selectedType as keyof typeof typeLabels]}
        </Button>
      </div>

      <Tabs
        selectedKey={selectedType}
        onSelectionChange={(key) => setSelectedType(key as string)}
        color="primary"
        variant="underlined"
        className="mb-6"
      >
        <Tab key="FASILITATOR_PEKERTI" title="Fasilitator Pekerti/AA" />
        <Tab key="AUDITOR_SPMI" title="Auditor SPMI" />
        <Tab key="ASESOR_BKD" title="Asesor BKD" />
      </Tabs>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <Table aria-label="Tabel Kepakaran">
            <TableHeader>
              <TableColumn>NO</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((exp, index) => (
                <TableRow key={exp.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{exp.name}</div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={exp.isActive ? "success" : "default"}
                      variant="flat"
                      size="sm"
                    >
                      {exp.isActive ? "Aktif" : "Nonaktif"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="warning"
                        isIconOnly
                        onPress={() => handleEdit(exp)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isIconOnly
                        onPress={() => handleDelete(exp.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={pages}
                page={page}
                onChange={setPage}
                showControls
                color="primary"
              />
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {editingExpertise
              ? `Edit ${typeLabels[selectedType as keyof typeof typeLabels]}`
              : `Tambah ${typeLabels[selectedType as keyof typeof typeLabels]}`}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nama Lengkap (dengan gelar)"
                placeholder="Contoh: Prof. Dr. Nama Lengkap, S.T., M.T."
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isRequired
              />

              <Input
                type="number"
                label="Nomor Urut"
                value={formData.order.toString()}
                onChange={(e: any) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSubmit} isLoading={saving}>
              {editingExpertise ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
