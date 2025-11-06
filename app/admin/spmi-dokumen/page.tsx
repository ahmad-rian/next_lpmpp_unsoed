"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import type { Selection } from "@heroui/select";
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

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

type DocumentType = "SPMI" | "AUDIT" | "REGULATION";

interface Document {
  id: string;
  type: DocumentType;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const typeLabels: Record<DocumentType, string> = {
  SPMI: "Dokumen SPMI",
  AUDIT: "Dokumen Audit",
  REGULATION: "Peraturan",
};

const typeColors: Record<DocumentType, "primary" | "success" | "warning"> = {
  SPMI: "primary",
  AUDIT: "success",
  REGULATION: "warning",
};

export default function SpmiDokumenPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<DocumentType>("SPMI");

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    id: "",
    type: "SPMI" as DocumentType,
    title: "",
    description: "",
    fileUrl: "",
    fileName: "",
    fileSize: 0,
    order: 0,
  });

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
      setLoading(false);
    }
  };

  const handleAdd = (type: DocumentType) => {
    setFormData({
      id: "",
      type,
      title: "",
      description: "",
      fileUrl: "",
      fileName: "",
      fileSize: 0,
      order: documents.filter((d) => d.type === type).length + 1,
    });
    onOpen();
  };

  const handleEdit = (document: Document) => {
    setFormData({
      id: document.id,
      type: document.type,
      title: document.title,
      description: document.description || "",
      fileUrl: document.fileUrl,
      fileName: document.fileName,
      fileSize: document.fileSize || 0,
      order: document.order,
    });
    onOpen();
  };

  const handleSave = async () => {
    try {
      const url = formData.id ? "/api/documents" : "/api/documents";
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchDocuments();
        onClose();
      }
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const confirmDelete = (document: Document) => {
    setDocumentToDelete(document);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      const response = await fetch(`/api/documents?id=${documentToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchDocuments();
        onDeleteClose();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const filteredDocuments = documents.filter((doc) => doc.type === selectedTab);

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
          <h1 className="text-3xl font-bold">Manajemen Dokumen SPMI</h1>
          <p className="text-default-500 mt-1">
            Kelola dokumen SPMI, Audit, dan Peraturan
          </p>
        </div>
      </div>

      <Card>
        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as DocumentType)}
            aria-label="Document types"
            color="primary"
            className="mb-4"
          >
            <Tab key="SPMI" title="Dokumen SPMI" />
            <Tab key="AUDIT" title="Dokumen Audit" />
            <Tab key="REGULATION" title="Peraturan" />
          </Tabs>

          <div className="flex justify-end mb-4">
            <Button
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={() => handleAdd(selectedTab)}
            >
              Tambah {typeLabels[selectedTab]}
            </Button>
          </div>

          <Table aria-label="Dokumen table">
            <TableHeader>
              <TableColumn>NO</TableColumn>
              <TableColumn>JUDUL</TableColumn>
              <TableColumn>DESKRIPSI</TableColumn>
              <TableColumn>FILE</TableColumn>
              <TableColumn>UKURAN</TableColumn>
              <TableColumn>URUTAN</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Belum ada dokumen">
              {filteredDocuments.map((doc, index) => (
                <TableRow key={doc.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <p className="font-semibold">{doc.title}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-default-500 line-clamp-2">
                      {doc.description || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <DocumentIcon className="w-4 h-4" />
                      <span className="text-sm">{doc.fileName}</span>
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
                        onPress={() => handleEdit(doc)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => confirmDelete(doc)}
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

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {formData.id ? "Edit Dokumen" : "Tambah Dokumen Baru"}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Judul Dokumen"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              isRequired
            />
            <Textarea
              label="Deskripsi"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              minRows={3}
            />
            <DocumentUpload
              label="File Dokumen"
              value={formData.fileUrl}
              onChange={(url, fileName, fileSize) =>
                setFormData({ ...formData, fileUrl: url, fileName, fileSize })
              }
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
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Batal
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              isDisabled={!formData.title || !formData.fileUrl}
            >
              Simpan
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
              Apakah Anda yakin ingin menghapus dokumen{" "}
              <strong>{documentToDelete?.title}</strong>?
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
    </div>
  );
}
