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
import { Pagination } from "@heroui/pagination";
import { AdminPageLayout } from "@/components/admin-page-layout";

// Icons
const LinkIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
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

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

interface Link {
  id: string;
  name: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TautanPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    url: "",
    order: 0,
  });

  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // Calculate pagination
  const pages = Math.ceil(links.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return links.slice(start, end);
  }, [page, links]);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/links");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch links");
      }
      
      if (Array.isArray(data)) {
        setLinks(data);
      } else {
        console.error("Invalid data format:", data);
        setLinks([]);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
      setLinks([]);
      alert("Gagal memuat data tautan");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLink(null);
    setFormData({
      id: "",
      name: "",
      url: "",
      order: links.length + 1,
    });
    onOpen();
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setFormData({
      id: link.id,
      name: link.name,
      url: link.url,
      order: link.order,
    });
    onOpen();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      alert("Nama dan URL harus diisi");
      return;
    }

    try {
      setSaving(true);

      const method = editingLink ? "PUT" : "POST";
      const response = await fetch("/api/links", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      await fetchLinks();
      onClose();
      alert(editingLink ? "Tautan berhasil diupdate" : "Tautan berhasil ditambahkan");
    } catch (error) {
      console.error("Error saving link:", error);
      alert("Gagal menyimpan tautan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tautan ini?")) return;

    try {
      const response = await fetch(`/api/links?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      await fetchLinks();
      alert("Tautan berhasil dihapus");
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("Gagal menghapus tautan");
    }
  };

  return (
    <AdminPageLayout
      title="Tautan"
      description="Kelola tautan eksternal (SAPTO 2, BAN-PT, PDDIKTI, LAM, dll)"
      icon={<LinkIcon />}
    >
      <div className="flex justify-between items-center mb-6">
        <Chip color="primary" variant="flat">
          Total: {links.length} tautan
        </Chip>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
          onPress={handleAdd}
        >
          Tambah Tautan
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <Table aria-label="Tabel Tautan">
            <TableHeader>
              <TableColumn>NO</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>URL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((link, index) => (
                <TableRow key={link.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{link.name}</div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <span className="truncate max-w-xs">{link.url}</span>
                      <ExternalLinkIcon className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={link.isActive ? "success" : "default"}
                      variant="flat"
                      size="sm"
                    >
                      {link.isActive ? "Aktif" : "Nonaktif"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="warning"
                        isIconOnly
                        onPress={() => handleEdit(link)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isIconOnly
                        onPress={() => handleDelete(link.id)}
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
            {editingLink ? "Edit Tautan" : "Tambah Tautan"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nama Tautan"
                placeholder="Contoh: SAPTO 2, BAN-PT, PDDIKTI"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isRequired
              />

              <Input
                label="URL"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e: any) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                isRequired
                description="URL lengkap termasuk https://"
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
              {editingLink ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
