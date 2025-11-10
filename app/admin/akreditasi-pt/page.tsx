"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { AdminPageLayout } from "@/components/admin-page-layout";
import Image from "next/image";

// Heroicons
const BuildingLibraryIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
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

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

interface Document {
  id: string;
  title: string;
  documentUrl: string;
  documentName: string | null;
  order: number;
}

interface UniversityAccreditation {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  documents: Document[];
}

export default function AkreditasiPTPage() {
  const [accreditation, setAccreditation] = useState<UniversityAccreditation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDocOpen, onOpen: onDocOpen, onClose: onDocClose } = useDisclosure();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [docFormData, setDocFormData] = useState({
    id: "",
    title: "",
    documentUrl: "",
    documentName: "",
  });

  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  useEffect(() => {
    fetchAccreditation();
  }, []);

  const fetchAccreditation = async () => {
    try {
      const response = await fetch("/api/university-accreditations");
      const data = await response.json();

      // Ambil accreditation pertama (karena seharusnya hanya ada 1)
      if (data && data.length > 0) {
        setAccreditation(data[0]);
      }
    } catch (error) {
      console.error("Error fetching accreditation:", error);
      alert("Gagal memuat data akreditasi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    if (accreditation) {
      setFormData({
        title: accreditation.title,
        description: accreditation.description,
        imageUrl: accreditation.imageUrl || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
      });
    }
    onOpen();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!accreditation) {
      alert("Buat data akreditasi terlebih dahulu");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("File harus berformat gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      // Upload gambar ke server
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Gagal mengupload gambar");
      }

      // Update database dengan URL gambar baru
      const updateResponse = await fetch("/api/university-accreditations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: accreditation.id,
          title: accreditation.title,
          description: accreditation.description,
          imageUrl: uploadData.url,
        }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateData.error || "Gagal menyimpan gambar");
      }

      alert("Gambar banner berhasil diupload");
      fetchAccreditation(); // Reload data
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
      const method = accreditation ? "PUT" : "POST";
      const body = accreditation
        ? { id: accreditation.id, ...formData }
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

      alert(accreditation ? "Data berhasil diperbarui" : "Data berhasil ditambahkan");
      onClose();
      fetchAccreditation();
    } catch (error: any) {
      console.error("Error saving:", error);
      alert(error.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // Document Management
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

      setDocFormData({
        ...docFormData,
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

  const handleAddDocument = () => {
    setEditingDoc(null);
    setDocFormData({
      id: "",
      title: "",
      documentUrl: "",
      documentName: "",
    });
    onDocOpen();
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDoc(doc);
    setDocFormData({
      id: doc.id,
      title: doc.title,
      documentUrl: doc.documentUrl,
      documentName: doc.documentName || "",
    });
    onDocOpen();
  };

  const handleSubmitDocument = async () => {
    if (!docFormData.title || !docFormData.documentUrl) {
      alert("Judul dokumen dan file harus diisi");
      return;
    }

    if (!accreditation) {
      alert("Buat data akreditasi terlebih dahulu");
      return;
    }

    setSaving(true);
    try {
      const url = "/api/university-accreditation-documents";
      const method = editingDoc ? "PUT" : "POST";
      const body = editingDoc
        ? docFormData
        : {
          accreditationId: accreditation.id,
          ...docFormData,
          order: accreditation.documents.length,
        };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan dokumen");
      }

      alert(editingDoc ? "Dokumen berhasil diperbarui" : "Dokumen berhasil ditambahkan");
      onDocClose();
      fetchAccreditation();
    } catch (error: any) {
      console.error("Error saving document:", error);
      alert(error.message || "Gagal menyimpan dokumen");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/university-accreditation-documents?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus dokumen");
      }

      alert("Dokumen berhasil dihapus");
      fetchAccreditation();
    } catch (error: any) {
      console.error("Error deleting document:", error);
      alert(error.message || "Gagal menghapus dokumen");
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
      title="Akreditasi Perguruan Tinggi"
      description="Kelola informasi akreditasi perguruan tinggi dengan gambar banner dan multiple dokumen"
      icon={<BuildingLibraryIcon />}
    >
      <div className="space-y-6">
        {/* Info Card */}
        <Card>
          <CardBody className="space-y-4">
            {/* Header dengan tombol edit */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  {accreditation?.title || "Belum ada data"}
                </h3>
                <p className="text-default-500 whitespace-pre-wrap">
                  {accreditation?.description || "Belum ada deskripsi"}
                </p>
              </div>
              <Button
                color="primary"
                variant="flat"
                startContent={accreditation ? <PencilIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                onPress={handleOpenEdit}
              >
                {accreditation ? "Edit Info" : "Tambah Info"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Banner Image Section - Terpisah dari Info */}
        {accreditation && (
          <Card>
            <CardBody className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Gambar Banner/Logo</h3>
                <Button
                  as="label"
                  htmlFor="banner-upload"
                  color="primary"
                  variant="flat"
                  startContent={<ImageIcon className="w-4 h-4" />}
                  isLoading={uploadingImage}
                >
                  {accreditation.imageUrl ? "Ganti Gambar" : "Upload Gambar"}
                </Button>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {accreditation.imageUrl ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={accreditation.imageUrl}
                    alt="Banner"
                    fill
                    className="object-contain bg-default-100"
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-default-400 border-2 border-dashed border-default-200 rounded-lg">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>Belum ada gambar banner</p>
                  <p className="text-sm">Klik tombol "Upload Gambar" untuk mengunggah</p>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Documents Section */}
        {accreditation && (
          <Card>
            <CardBody className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Dokumen Akreditasi</h3>
                <Button
                  color="primary"
                  startContent={<PlusIcon className="w-4 h-4" />}
                  onPress={handleAddDocument}
                >
                  Tambah Dokumen
                </Button>
              </div>

              {/* Documents List */}
              {accreditation.documents.length === 0 ? (
                <div className="text-center py-8 text-default-400">
                  <FileTextIcon className="w-16 h-16 mx-auto mb-2" />
                  <p>Belum ada dokumen</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {accreditation.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-divider rounded-lg hover:bg-default-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileTextIcon className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          {doc.documentName && (
                            <p className="text-sm text-default-400">{doc.documentName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          as="a"
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          variant="flat"
                          color="primary"
                          isIconOnly
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="warning"
                          isIconOnly
                          onPress={() => handleEditDocument(doc)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isIconOnly
                          onPress={() => handleDeleteDocument(doc.id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Modal for Main Info - HANYA Judul dan Deskripsi */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader>
              {accreditation ? "Edit Informasi Akreditasi" : "Tambah Informasi Akreditasi"}
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
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={saving}>
                {accreditation ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal for Document */}
        <Modal isOpen={isDocOpen} onClose={onDocClose} size="2xl">
          <ModalContent>
            <ModalHeader>
              {editingDoc ? "Edit Dokumen" : "Tambah Dokumen"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Judul Dokumen"
                  placeholder="Masukkan judul dokumen (misal: SK Akreditasi 2024)"
                  value={docFormData.title}
                  onChange={(e: any) =>
                    setDocFormData({ ...docFormData, title: e.target.value })
                  }
                  isRequired
                />

                {/* Document Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">File Dokumen (PDF/DOC/DOCX)</label>
                  <div className="flex items-center gap-2">
                    <Button
                      as="label"
                      htmlFor="document-upload"
                      variant="flat"
                      startContent={<FileTextIcon className="w-4 h-4" />}
                      isLoading={uploadingDoc}
                    >
                      {docFormData.documentUrl ? "Ganti Dokumen" : "Upload Dokumen"}
                    </Button>
                    <input
                      id="document-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                    {docFormData.documentName && (
                      <span className="text-sm text-default-500">
                        {docFormData.documentName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onDocClose}>
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmitDocument} isLoading={saving}>
                {editingDoc ? "Simpan Perubahan" : "Tambah Dokumen"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminPageLayout>
  );
}
