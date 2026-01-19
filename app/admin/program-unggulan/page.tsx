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
import { Chip } from "@heroui/chip";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { RichTextEditor, RichTextViewer } from "@/components/rich-text-editor";

// Heroicons
const SparklesIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
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

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

interface FeaturedProgram {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  documentUrl: string | null;
  documentName: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProgramUnggulanPage() {
  const [programs, setPrograms] = useState<FeaturedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    description: "",
    documentUrl: "",
    documentName: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  const [editingProgram, setEditingProgram] = useState<FeaturedProgram | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/featured-programs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch programs");
      }

      // Ensure data is an array
      if (Array.isArray(data)) {
        setPrograms(data);
      } else {
        console.error("Invalid data format:", data);
        setPrograms([]);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setPrograms([]); // Set empty array on error
      alert("Gagal memuat data program");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProgram(null);
    setFormData({
      id: "",
      title: "",
      slug: "",
      description: "",
      documentUrl: "",
      documentName: "",
      icon: "",
      order: programs.length,
      isActive: true,
    });
    onOpen();
  };

  const handleEdit = (program: FeaturedProgram) => {
    setEditingProgram(program);
    setFormData({
      id: program.id,
      title: program.title,
      slug: program.slug,
      description: program.description || "",
      documentUrl: program.documentUrl || "",
      documentName: program.documentName || "",
      icon: program.icon || "",
      order: program.order,
      isActive: program.isActive,
    });
    onOpen();
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      alert("File harus berformat PDF, DOC, atau DOCX");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setUploadingDoc(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengupload dokumen");
      }

      setFormData({
        ...formData,
        documentUrl: data.url,
        documentName: file.name,
      });
      alert("Dokumen berhasil diupload");
    } catch (error: any) {
      console.error("Error uploading document:", error);
      alert(error.message || "Gagal mengupload dokumen");
    } finally {
      setUploadingDoc(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      alert("Judul harus diisi");
      return;
    }

    // Auto-generate slug if empty
    if (!formData.slug) {
      formData.slug = generateSlug(formData.title);
    }

    setSaving(true);
    try {
      const url = "/api/featured-programs";
      const method = editingProgram ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan data");
      }

      alert(editingProgram ? "Program berhasil diperbarui" : "Program berhasil ditambahkan");
      onClose();
      fetchPrograms();
    } catch (error: any) {
      console.error("Error saving:", error);
      alert(error.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus program ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/featured-programs?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus program");
      }

      alert("Program berhasil dihapus");
      fetchPrograms();
    } catch (error: any) {
      console.error("Error deleting:", error);
      alert(error.message || "Gagal menghapus program");
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
      title="Program Unggulan"
      description="Kelola program-program unggulan LPMPP UNSOED"
      icon={<SparklesIcon />}
      badge={{ label: "Program", value: programs.length }}
      action={
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Tambah Program
        </Button>
      }
    >
      <Table aria-label="Program unggulan table">
        <TableHeader>
          <TableColumn>URUTAN</TableColumn>
          <TableColumn>NAMA PROGRAM</TableColumn>
          <TableColumn>SLUG</TableColumn>
          <TableColumn>DOKUMEN</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>AKSI</TableColumn>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell>{program.order}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{program.title}</p>
                  {program.description && (
                    <div
                      className="text-sm text-default-400 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: program.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
                      }}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-default-100 px-2 py-1 rounded">
                  {program.slug}
                </code>
              </TableCell>
              <TableCell>
                {program.documentUrl ? (
                  <div className="flex items-center gap-2">
                    <DocumentIcon className="w-4 h-4 text-primary" />
                    <a
                      href={program.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {program.documentName || "Dokumen"}
                    </a>
                  </div>
                ) : (
                  <span className="text-sm text-default-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  color={program.isActive ? "success" : "default"}
                  variant="flat"
                  size="sm"
                >
                  {program.isActive ? "Aktif" : "Nonaktif"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="warning"
                    isIconOnly
                    onPress={() => handleEdit(program)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    isIconOnly
                    onPress={() => handleDelete(program.id)}
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
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {editingProgram ? "Edit Program Unggulan" : "Tambah Program Unggulan"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Judul Program"
                placeholder="Contoh: Pembelajaran di Luar Kampus (MBKM)"
                value={formData.title}
                onChange={(e: any) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value) // Auto-generate slug
                  });
                }}
                isRequired
              />

              <Input
                label="Slug (URL-friendly)"
                placeholder="mbkm"
                value={formData.slug}
                onChange={(e: any) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                description="Otomatis dibuat dari judul. Gunakan huruf kecil dan tanda hubung (-)"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Deskripsi / Konten <span className="text-danger">*</span>
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value: string) =>
                    setFormData({ ...formData, description: value })
                  }
                  placeholder="Masukkan deskripsi lengkap program dengan formatting..."
                  height="350px"
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Dokumen Peraturan (PDF/DOC/DOCX - Opsional)
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    as="label"
                    htmlFor="document-upload"
                    variant="flat"
                    startContent={<DocumentIcon className="w-4 h-4" />}
                    isLoading={uploadingDoc}
                  >
                    {formData.documentUrl ? "Ganti Dokumen" : "Upload Dokumen"}
                  </Button>
                  <input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleDocumentUpload}
                  />
                  {formData.documentName && (
                    <span className="text-sm text-default-500">
                      {formData.documentName}
                    </span>
                  )}
                </div>
              </div>

              <Input
                label="Urutan Tampilan"
                type="number"
                value={String(formData.order)}
                onChange={(e: any) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSubmit} isLoading={saving}>
              {editingProgram ? "Simpan Perubahan" : "Tambah Program"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
