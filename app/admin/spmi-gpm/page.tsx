"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { DocumentUpload } from "@/components/document-upload";

// Heroicons
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

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

interface GPMDocument {
  id: string;
  groupId: string;
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  order: number;
}

interface Faculty {
  id: string;
  name: string;
  shortName: string | null;
  code: string | null;
}

interface QualityAssuranceGroup {
  id: string;
  facultyId: string;
  faculty: Faculty;
  description: string | null;
  contactInfo: string | null;
  order: number;
  isActive: boolean;
  documents?: GPMDocument[];
}

export default function SpmiGpmPage() {
  const [groups, setGroups] = useState<QualityAssuranceGroup[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<QualityAssuranceGroup | null>(null);
  const [documents, setDocuments] = useState<GPMDocument[]>([]);

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    id: "",
    facultyId: "",
    description: "",
    contactInfo: "",
    order: 0,
  });

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [groupToDelete, setGroupToDelete] = useState<QualityAssuranceGroup | null>(null);

  // Document modal
  const {
    isOpen: isDocModalOpen,
    onOpen: onDocModalOpen,
    onClose: onDocModalClose,
  } = useDisclosure();
  const [docFormData, setDocFormData] = useState({
    id: "",
    title: "",
    fileUrl: "",
    fileName: "",
    fileSize: 0,
    order: 0,
  });

  // Delete document modal
  const {
    isOpen: isDeleteDocOpen,
    onOpen: onDeleteDocOpen,
    onClose: onDeleteDocClose,
  } = useDisclosure();
  const [docToDelete, setDocToDelete] = useState<GPMDocument | null>(null);
  const documentSectionRef = React.useRef<HTMLDivElement>(null);

  // State untuk dokumen di dalam modal create
  const [tempDocuments, setTempDocuments] = useState<Array<{
    title: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    order: number;
  }>>([]);

  useEffect(() => {
    fetchGroups();
    fetchFaculties();
  }, []);

  useEffect(() => {
    // Scroll ke section dokumen ketika GPM dipilih
    if (selectedGroup && documentSectionRef.current) {
      setTimeout(() => {
        documentSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/quality-assurance-groups");
      const data = await response.json();
      setGroups(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await fetch("/api/faculties");
      const data = await response.json();
      setFaculties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      setFaculties([]);
    }
  };

  const fetchDocuments = async (groupId: string) => {
    try {
      const response = await fetch(`/api/gpm-documents?groupId=${groupId}`);
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    }
  };

  const handleSelectGroup = (group: QualityAssuranceGroup) => {
    setSelectedGroup(group);
    fetchDocuments(group.id);
  };

  const handleAdd = () => {
    setFormData({
      id: "",
      facultyId: "",
      description: "",
      contactInfo: "",
      order: groups.length + 1,
    });
    setTempDocuments([]); // Reset temp documents
    onOpen();
  };

  const handleEdit = (group: QualityAssuranceGroup) => {
    setFormData({
      id: group.id,
      facultyId: group.facultyId,
      description: group.description || "",
      contactInfo: group.contactInfo || "",
      order: group.order,
    });
    onOpen();
  };

  const handleSave = async () => {
    try {
      const url = formData.id
        ? "/api/quality-assurance-groups"
        : "/api/quality-assurance-groups";
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedGroup = await response.json();
        
        // Jika ada dokumen yang ditambahkan, simpan juga
        if (!formData.id && tempDocuments.length > 0) {
          await Promise.all(
            tempDocuments.map((doc) =>
              fetch("/api/gpm-documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  groupId: savedGroup.id,
                  title: doc.title,
                  fileUrl: doc.fileUrl,
                  fileName: doc.fileName,
                  fileSize: doc.fileSize,
                  order: doc.order,
                }),
              })
            )
          );
        }
        
        await fetchGroups();
        onClose();
        setTempDocuments([]);
      }
    } catch (error) {
      console.error("Error saving group:", error);
    }
  };

  const confirmDelete = (group: QualityAssuranceGroup) => {
    setGroupToDelete(group);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;

    try {
      const response = await fetch(
        `/api/quality-assurance-groups?id=${groupToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchGroups();
        onDeleteClose();
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleAddDocument = () => {
    if (!selectedGroup) return;
    setDocFormData({
      id: "",
      title: "",
      fileUrl: "",
      fileName: "",
      fileSize: 0,
      order: documents.length + 1,
    });
    onDocModalOpen();
  };

  const handleEditDocument = (doc: GPMDocument) => {
    setDocFormData({
      id: doc.id,
      title: doc.title,
      fileUrl: doc.fileUrl,
      fileName: doc.fileName,
      fileSize: doc.fileSize || 0,
      order: doc.order,
    });
    onDocModalOpen();
  };

  const handleSaveDocument = async () => {
    if (!selectedGroup) return;
    try {
      const url = docFormData.id
        ? "/api/gpm-documents"
        : "/api/gpm-documents";
      const method = docFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(docFormData.id && { id: docFormData.id }),
          groupId: selectedGroup.id,
          title: docFormData.title,
          fileUrl: docFormData.fileUrl,
          fileName: docFormData.fileName,
          fileSize: docFormData.fileSize,
          order: docFormData.order,
        }),
      });

      if (response.ok) {
        await fetchDocuments(selectedGroup.id);
        onDocModalClose();
      }
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const handleDeleteDocumentConfirm = async () => {
    if (!docToDelete || !selectedGroup) return;
    try {
      const response = await fetch("/api/gpm-documents", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: docToDelete.id }),
      });

      if (response.ok) {
        await fetchDocuments(selectedGroup.id);
        onDeleteDocClose();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleAddTempDocument = () => {
    const newDoc = {
      title: "",
      fileUrl: "",
      fileName: "",
      fileSize: 0,
      order: tempDocuments.length + 1,
    };
    setTempDocuments([...tempDocuments, newDoc]);
  };

  const handleUpdateTempDocument = (index: number, field: string, value: any) => {
    const updated = [...tempDocuments];
    updated[index] = { ...updated[index], [field]: value };
    setTempDocuments(updated);
  };

  const handleRemoveTempDocument = (index: number) => {
    setTempDocuments(tempDocuments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gugus Penjamin Mutu Fakultas</h1>
          <p className="text-default-500 mt-1">
            Kelola daftar Gugus Penjamin Mutu per Fakultas
          </p>
        </div>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Tambah GPM
        </Button>
      </div>

      <Card>
        <CardBody>
          <Table aria-label="GPM table">
            <TableHeader>
              <TableColumn>NO</TableColumn>
              <TableColumn>NAMA FAKULTAS</TableColumn>
              <TableColumn>SINGKATAN</TableColumn>
              <TableColumn>DESKRIPSI</TableColumn>
              <TableColumn>KONTAK</TableColumn>
              <TableColumn>URUTAN</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Belum ada GPM">
              {groups.map((group, index) => (
                <TableRow key={group.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{group.faculty.name}</p>
                      <p className="text-xs text-default-400">{group.faculty.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>{group.faculty.shortName || "-"}</TableCell>
                  <TableCell>
                    <p className="text-sm text-default-500 line-clamp-2">
                      {group.description || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{group.contactInfo || "-"}</p>
                  </TableCell>
                  <TableCell>{group.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="secondary"
                        onPress={() => handleSelectGroup(group)}
                      >
                        Lihat Dokumen
                      </Button>
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        onPress={() => handleEdit(group)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => confirmDelete(group)}
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

      {/* Document Section */}
      {selectedGroup && (
        <Card className="mt-6" ref={documentSectionRef}>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{selectedGroup.faculty.name}</h2>
              <p className="text-sm text-default-500">Dokumen GPM</p>
            </div>
            <Button
              color="primary"
              size="sm"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={handleAddDocument}
            >
              Tambah Dokumen
            </Button>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Documents table">
              <TableHeader>
                <TableColumn>NO</TableColumn>
                <TableColumn>JUDUL</TableColumn>
                <TableColumn>FILE</TableColumn>
                <TableColumn>UKURAN</TableColumn>
                <TableColumn>URUTAN</TableColumn>
                <TableColumn>AKSI</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Belum ada dokumen">
                {documents.map((doc, index) => (
                  <TableRow key={doc.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <p className="font-medium">{doc.title}</p>
                    </TableCell>
                    <TableCell>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {doc.fileName}
                      </a>
                    </TableCell>
                    <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                    <TableCell>{doc.order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          isIconOnly
                          variant="light"
                          onPress={() => handleEditDocument(doc)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          isIconOnly
                          variant="light"
                          color="danger"
                          onPress={() => {
                            setDocToDelete(doc);
                            onDeleteDocOpen();
                          }}
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
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {formData.id ? "Edit GPM" : "Tambah GPM Baru"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {/* Form GPM */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informasi GPM</h3>
                <Select
                  label="Pilih Fakultas"
                  placeholder="Pilih fakultas"
                  selectedKeys={formData.facultyId ? [formData.facultyId] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setFormData({ ...formData, facultyId: selectedKey });
                  }}
                  isRequired
                  isDisabled={!!formData.id} // Disable when editing
                >
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.id}>
                      {faculty.name} ({faculty.shortName})
                    </SelectItem>
                  ))}
                </Select>
                <Textarea
                  label="Deskripsi"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Informasi tentang GPM fakultas ini"
                  minRows={3}
                />
                <Textarea
                  label="Informasi Kontak"
                  value={formData.contactInfo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                  placeholder="Email, telepon, atau informasi kontak lainnya"
                  minRows={2}
                />
                <Input
                  label="Urutan"
                  type="number"
                  value={formData.order.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Dokumen GPM - hanya untuk create baru */}
              {!formData.id && (
                <>
                  <Divider className="my-4" />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Dokumen GPM (Opsional)</h3>
                        <p className="text-sm text-default-500">
                          Tambahkan dokumen-dokumen GPM sekaligus
                        </p>
                      </div>
                      <Button
                        size="sm"
                        color="secondary"
                        variant="flat"
                        startContent={<PlusIcon className="w-4 h-4" />}
                        onPress={handleAddTempDocument}
                      >
                        Tambah Dokumen
                      </Button>
                    </div>

                    {tempDocuments.length === 0 ? (
                      <div className="bg-default-100 p-8 rounded-lg text-center">
                        <p className="text-default-500">
                          Belum ada dokumen. Klik "Tambah Dokumen" untuk menambahkan.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tempDocuments.map((doc, index) => {
                          const isComplete = doc.title && doc.fileUrl && doc.fileName;
                          return (
                            <Card 
                              key={index} 
                              className={`border-2 ${isComplete ? 'border-success' : 'border-warning'}`}
                            >
                              <CardBody className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm">
                                      Dokumen #{index + 1}
                                    </h4>
                                    {isComplete ? (
                                      <span className="text-xs text-success">✓ Lengkap</span>
                                    ) : (
                                      <span className="text-xs text-warning">⚠ Belum lengkap</span>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    isIconOnly
                                    variant="light"
                                    color="danger"
                                    onPress={() => handleRemoveTempDocument(index)}
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Input
                                  label="Judul Dokumen"
                                  placeholder="Masukkan judul dokumen"
                                  value={doc.title}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleUpdateTempDocument(index, "title", e.target.value)
                                  }
                                  size="sm"
                                  isRequired
                                />
                                <DocumentUpload
                                  label="File Dokumen (PDF/DOC/DOCX)"
                                  value={doc.fileUrl}
                                  onChange={(url, fileName, fileSize) => {
                                    handleUpdateTempDocument(index, "fileUrl", url);
                                    handleUpdateTempDocument(index, "fileName", fileName);
                                    handleUpdateTempDocument(index, "fileSize", fileSize);
                                  }}
                                />
                                {doc.fileName && (
                                  <p className="text-xs text-default-500">
                                    File: {doc.fileName} ({formatFileSize(doc.fileSize)})
                                  </p>
                                )}
                              </CardBody>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Batal
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              isDisabled={
                !formData.facultyId ||
                (tempDocuments.length > 0 && 
                 tempDocuments.some(doc => !doc.title || !doc.fileUrl || !doc.fileName))
              }
            >
              Simpan {!formData.id && tempDocuments.length > 0 && `(${tempDocuments.length} dokumen)`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Konfirmasi Hapus</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus GPM{" "}
              <strong>{groupToDelete?.faculty?.name}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Batal
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Document Add/Edit Modal */}
      <Modal isOpen={isDocModalOpen} onClose={onDocModalClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {docFormData.id ? "Edit Dokumen" : "Tambah Dokumen Baru"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Judul Dokumen"
                placeholder="Masukkan judul dokumen"
                value={docFormData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDocFormData({ ...docFormData, title: e.target.value })
                }
                isRequired
              />
              <DocumentUpload
                label="File Dokumen (PDF/DOC/DOCX)"
                value={docFormData.fileUrl}
                onChange={(url, fileName, fileSize) =>
                  setDocFormData({
                    ...docFormData,
                    fileUrl: url,
                    fileName: fileName,
                    fileSize: fileSize,
                  })
                }
              />
              <Input
                label="Urutan"
                type="number"
                value={docFormData.order.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDocFormData({
                    ...docFormData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDocModalClose}>
              Batal
            </Button>
            <Button
              color="primary"
              onPress={handleSaveDocument}
              isDisabled={!docFormData.title || !docFormData.fileUrl}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Document Modal */}
      <Modal isOpen={isDeleteDocOpen} onClose={onDeleteDocClose}>
        <ModalContent>
          <ModalHeader>Konfirmasi Hapus</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus dokumen{" "}
              <strong>{docToDelete?.title}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteDocClose}>
              Batal
            </Button>
            <Button color="danger" onPress={handleDeleteDocumentConfirm}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
