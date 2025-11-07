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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { AdminPageLayout } from "@/components/admin-page-layout";

// Icons
const DocumentIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
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

interface Download {
  id: string;
  name: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fileUrl: "",
    fileType: "",
    fileSize: 0,
  });

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch("/api/downloads");
      if (response.ok) {
        const data = await response.json();
        setDownloads(data);
      }
    } catch (error) {
      console.error("Error fetching downloads:", error);
      alert("Gagal memuat data unduhan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("File harus berformat PDF, DOC, atau DOCX");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          fileUrl: data.url,
          fileType: file.type.includes("pdf")
            ? "pdf"
            : file.type.includes("wordprocessingml")
            ? "docx"
            : "doc",
          fileSize: file.size,
        }));
        alert("File berhasil diupload");
      } else {
        alert("Gagal mengupload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Gagal mengupload file");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      fileUrl: "",
      fileType: "",
      fileSize: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (download: Download) => {
    setEditingId(download.id);
    setFormData({
      name: download.name,
      description: download.description || "",
      fileUrl: download.fileUrl,
      fileType: download.fileType,
      fileSize: download.fileSize,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.fileUrl) {
      alert("Nama dan file wajib diisi");
      return;
    }

    try {
      const url = editingId ? "/api/downloads" : "/api/downloads";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId ? { id: editingId, ...formData } : formData
        ),
      });

      if (response.ok) {
        alert(
          editingId
            ? "Unduhan berhasil diperbarui"
            : "Unduhan berhasil ditambahkan"
        );
        setIsModalOpen(false);
        fetchDownloads();
      } else {
        alert("Gagal menyimpan unduhan");
      }
    } catch (error) {
      console.error("Error saving download:", error);
      alert("Gagal menyimpan unduhan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus unduhan ini?")) return;

    try {
      const response = await fetch(`/api/downloads?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Unduhan berhasil dihapus");
        fetchDownloads();
      } else {
        alert("Gagal menghapus unduhan");
      }
    } catch (error) {
      console.error("Error deleting download:", error);
      alert("Gagal menghapus unduhan");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Pagination
  const totalPages = Math.ceil(downloads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDownloads = downloads.slice(startIndex, endIndex);

  return (
    <AdminPageLayout
      icon={<DocumentIcon />}
      title="Unduhan"
      description="Kelola file dokumen yang dapat diunduh"
      actions={
        <Button
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
          onPress={handleAdd}
        >
          Tambah Unduhan
        </Button>
      }
      stats={[
        { label: "Total Dokumen", value: downloads.length.toString() },
      ]}
    >
      <Table aria-label="Tabel Unduhan">
        <TableHeader>
          <TableColumn>NO.</TableColumn>
          <TableColumn>NAMA DOKUMEN</TableColumn>
          <TableColumn>JENIS FILE</TableColumn>
          <TableColumn>UKURAN</TableColumn>
          <TableColumn>JUMLAH UNDUH</TableColumn>
          <TableColumn>TANGGAL</TableColumn>
          <TableColumn>AKSI</TableColumn>
        </TableHeader>
        <TableBody
          items={currentDownloads}
          isLoading={loading}
          emptyContent="Tidak ada data"
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{startIndex + currentDownloads.indexOf(item) + 1}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={
                    item.fileType === "pdf"
                      ? "danger"
                      : "primary"
                  }
                  variant="flat"
                >
                  {item.fileType.toUpperCase()}
                </Chip>
              </TableCell>
              <TableCell>{formatFileSize(item.fileSize)}</TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">
                  {item.downloadCount}x
                </Chip>
              </TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="warning"
                    variant="flat"
                    onPress={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => handleDelete(item.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {editingId ? "Edit Unduhan" : "Tambah Unduhan"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nama Dokumen"
                placeholder="Masukkan nama dokumen"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isRequired
              />

              <Textarea
                label="Deskripsi"
                placeholder="Deskripsi dokumen (opsional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                minRows={3}
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload File <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: PDF, DOC, DOCX (Maksimal 10MB)
                </p>
              </div>

              {formData.fileUrl && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color="success" variant="flat">
                      {formData.fileType.toUpperCase()}
                    </Chip>
                    <span className="text-sm text-gray-600">
                      {formatFileSize(formData.fileSize)}
                    </span>
                  </div>
                  <a
                    href={formData.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 block"
                  >
                    Lihat file
                  </a>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isDisabled={!formData.name || !formData.fileUrl || uploading}
            >
              {uploading ? "Mengupload..." : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
