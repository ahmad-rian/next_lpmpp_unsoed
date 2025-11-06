"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { PlusIcon, PencilIcon, TrashIcon, Download, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface UniversityAccreditation {
  id: string;
  title: string;
  description: string;
  documentUrl: string | null;
  documentName: string | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

export default function AkreditasiPTPage() {
  const [accreditations, setAccreditations] = useState<UniversityAccreditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<UniversityAccreditation | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    documentUrl: "",
    documentName: "",
    imageUrl: "",
    order: 0,
  });

  useEffect(() => {
    fetchAccreditations();
  }, []);

  const fetchAccreditations = async () => {
    try {
      const response = await fetch("/api/university-accreditations");
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

  const handleOpenModal = (item?: UniversityAccreditation) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        documentUrl: item.documentUrl || "",
        documentName: item.documentName || "",
        imageUrl: item.imageUrl || "",
        order: item.order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        description: "",
        documentUrl: "",
        documentName: "",
        imageUrl: "",
        order: accreditations.length + 1,
      });
    }
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      documentUrl: "",
      documentName: "",
      imageUrl: "",
      order: 0,
    });
    onClose();
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      alert("File harus berformat PDF, DOC, atau DOCX");
      return;
    }

    // Validate file size (max 10MB)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berformat gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengupload gambar");
      }

      setFormData({
        ...formData,
        imageUrl: data.url,
      });
      alert("Gambar berhasil diupload");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(error.message || "Gagal mengupload gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert("Judul dan Deskripsi harus diisi");
      return;
    }

    setSaving(true);
    try {
      const url = "/api/university-accreditations";
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
      const response = await fetch(`/api/university-accreditations?id=${id}`, {
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
          <h1 className="text-2xl font-bold">Akreditasi Perguruan Tinggi</h1>
          <p className="text-default-500 text-sm">
            Kelola data akreditasi perguruan tinggi dengan dokumen dan gambar
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

      {/* Cards Grid */}
      {accreditations.length === 0 ? (
        <Card>
          <CardBody>
            <div className="flex flex-col items-center justify-center py-12 text-default-400">
              <FileText className="w-16 h-16 mb-4" />
              <p>Belum ada data akreditasi</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accreditations.map((item) => (
            <Card key={item.id} className="group">
              {item.imageUrl && (
                <CardHeader className="p-0 overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
              )}
              <CardBody className="space-y-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-default-500 line-clamp-3">
                  {item.description}
                </p>
              </CardBody>
              <CardFooter className="flex justify-between gap-2">
                <div className="flex gap-2">
                  {item.documentUrl && (
                    <Button
                      as="a"
                      href={item.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  )}
                </div>
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {editingItem ? "Edit Akreditasi" : "Tambah Akreditasi"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Judul"
                placeholder="Masukkan judul akreditasi"
                value={formData.title}
                onChange={(e: any) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                isRequired
              />
              <Textarea
                label="Deskripsi"
                placeholder="Masukkan deskripsi akreditasi"
                value={formData.description}
                onChange={(e: any) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                minRows={4}
                isRequired
              />

              {/* Document Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Dokumen (PDF/DOC/DOCX)</label>
                <div className="flex items-center gap-2">
                  <Button
                    as="label"
                    htmlFor="document-upload"
                    variant="flat"
                    startContent={<FileText className="w-4 h-4" />}
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

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Gambar</label>
                <div className="flex items-center gap-2">
                  <Button
                    as="label"
                    htmlFor="image-upload"
                    variant="flat"
                    startContent={<ImageIcon className="w-4 h-4" />}
                    isLoading={uploadingImage}
                  >
                    {formData.imageUrl ? "Ganti Gambar" : "Upload Gambar"}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                {formData.imageUrl && (
                  <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <Input
                type="number"
                label="Urutan"
                placeholder="Masukkan urutan tampilan"
                value={formData.order.toString()}
                onChange={(e: any) =>
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
