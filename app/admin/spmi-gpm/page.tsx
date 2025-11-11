"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { AdminPageLayout } from "@/components/admin-page-layout";

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  // Simple notification function - replace with your preferred notification system
  alert(message);
};

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

const LinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

interface GPMLink {
  id: string;
  groupId: string;
  title: string;
  url: string;
  description: string | null;
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
  directUrl: string | null;
  order: number;
  isActive: boolean;
  links?: GPMLink[];
}

export default function SpmiGpmPage() {
  const [groups, setGroups] = useState<QualityAssuranceGroup[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<QualityAssuranceGroup | null>(null);
  const [links, setLinks] = useState<GPMLink[]>([]);

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    id: "",
    facultyId: "",
    description: "",
    contactInfo: "",
    directUrl: "",
    order: 0,
  });

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [groupToDelete, setGroupToDelete] = useState<QualityAssuranceGroup | null>(null);

  // Link modal
  const {
    isOpen: isLinkModalOpen,
    onOpen: onLinkModalOpen,
    onClose: onLinkModalClose,
  } = useDisclosure();
  const [linkFormData, setLinkFormData] = useState({
    id: "",
    title: "",
    url: "",
    description: "",
    order: 0,
  });

  // Delete link modal
  const {
    isOpen: isDeleteLinkOpen,
    onOpen: onDeleteLinkOpen,
    onClose: onDeleteLinkClose,
  } = useDisclosure();
  const [linkToDelete, setLinkToDelete] = useState<GPMLink | null>(null);
  const linkSectionRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGroups();
    fetchFaculties();
  }, []);

  useEffect(() => {
    // Scroll ke section link ketika GPM dipilih
    if (selectedGroup && linkSectionRef.current) {
      setTimeout(() => {
        linkSectionRef.current?.scrollIntoView({ 
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

  const fetchLinks = async (groupId: string) => {
    try {
      const response = await fetch(`/api/gpm-links?groupId=${groupId}`);
      const data = await response.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching links:", error);
      setLinks([]);
    }
  };

  const handleSelectGroup = (group: QualityAssuranceGroup) => {
    setSelectedGroup(group);
    fetchLinks(group.id);
  };

  const handleAdd = () => {
    setFormData({
      id: "",
      facultyId: "",
      description: "",
      contactInfo: "",
      directUrl: "",
      order: groups.length + 1,
    });
    onOpen();
  };

  const handleEdit = (group: QualityAssuranceGroup) => {
    setFormData({
      id: group.id,
      facultyId: group.facultyId,
      description: group.description || "",
      contactInfo: group.contactInfo || "",
      directUrl: group.directUrl || "",
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
        showNotification(formData.id ? "GPM berhasil diperbarui" : "GPM berhasil ditambahkan", "success");
        onClose();
        fetchGroups();
      } else {
        showNotification("Gagal menyimpan GPM", "error");
      }
    } catch (error) {
      console.error("Error saving group:", error);
      showNotification("Terjadi kesalahan saat menyimpan GPM", "error");
    }
  };

  const handleDelete = (group: QualityAssuranceGroup) => {
    setGroupToDelete(group);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;

    try {
      const response = await fetch("/api/quality-assurance-groups", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: groupToDelete.id }),
      });

      if (response.ok) {
        showNotification("GPM berhasil dihapus", "success");
        onDeleteClose();
        fetchGroups();
        if (selectedGroup?.id === groupToDelete.id) {
          setSelectedGroup(null);
          setLinks([]);
        }
      } else {
        showNotification("Gagal menghapus GPM", "error");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      showNotification("Terjadi kesalahan saat menghapus GPM", "error");
    }
  };

  // Link Functions
  const handleAddLink = () => {
    if (!selectedGroup) return;
    
    setLinkFormData({
      id: "",
      title: "",
      url: "",
      description: "",
      order: links.length + 1,
    });
    onLinkModalOpen();
  };

  const handleEditLink = (link: GPMLink) => {
    setLinkFormData({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description || "",
      order: link.order,
    });
    onLinkModalOpen();
  };

  const handleSaveLink = async () => {
    if (!selectedGroup) return;

    try {
      const linkData = {
        ...linkFormData,
        groupId: selectedGroup.id,
      };

      const url = linkFormData.id
        ? "/api/gpm-links"
        : "/api/gpm-links";
      const method = linkFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkData),
      });

      if (response.ok) {
        showNotification(linkFormData.id ? "Link berhasil diperbarui" : "Link berhasil ditambahkan", "success");
        onLinkModalClose();
        fetchLinks(selectedGroup.id);
      } else {
        showNotification("Gagal menyimpan link", "error");
      }
    } catch (error) {
      console.error("Error saving link:", error);
      showNotification("Terjadi kesalahan saat menyimpan link", "error");
    }
  };

  const handleDeleteLink = (link: GPMLink) => {
    setLinkToDelete(link);
    onDeleteLinkOpen();
  };

  const confirmDeleteLink = async () => {
    if (!linkToDelete) return;

    try {
      const response = await fetch("/api/gpm-links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: linkToDelete.id }),
      });

      if (response.ok) {
        showNotification("Link berhasil dihapus", "success");
        onDeleteLinkClose();
        if (selectedGroup) {
          fetchLinks(selectedGroup.id);
        }
      } else {
        showNotification("Gagal menghapus link", "error");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      showNotification("Terjadi kesalahan saat menghapus link", "error");
    }
  };

  return (
    <AdminPageLayout
      title="Gugus Penjaminan Mutu Fakultas"
      description="Kelola data Gugus Penjaminan Mutu (GPM) Fakultas beserta link-link yang tersedia"
    >
      {/* GPM Table */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Daftar GPM Fakultas</h3>
          <Button
            color="primary"
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={handleAdd}
          >
            Tambah GPM
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Tabel GPM Fakultas">
            <TableHeader>
              <TableColumn>FAKULTAS</TableColumn>
              <TableColumn>DESKRIPSI</TableColumn>
              <TableColumn>KONTAK</TableColumn>
              <TableColumn>LINK LANGSUNG</TableColumn>
              <TableColumn>URUTAN</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody items={groups} isLoading={loading}>
              {(group) => (
                <TableRow 
                  key={group.id}
                  className={selectedGroup?.id === group.id ? "bg-primary-50" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="flat"
                        size="sm"
                        onPress={() => handleSelectGroup(group)}
                        className={selectedGroup?.id === group.id ? "bg-primary-100" : ""}
                      >
                        {group.faculty.name}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{group.description || "-"}</TableCell>
                  <TableCell>{group.contactInfo || "-"}</TableCell>
                  <TableCell>
                    {group.directUrl ? (
                      <a 
                        href={group.directUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        {group.directUrl.length > 30 ? `${group.directUrl.substring(0, 30)}...` : group.directUrl}
                      </a>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{group.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<PencilIcon className="w-3 h-3" />}
                        onPress={() => handleEdit(group)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        startContent={<TrashIcon className="w-3 h-3" />}
                        onPress={() => handleDelete(group)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Links Section */}
      {selectedGroup && (
        <div ref={linkSectionRef}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">
                  Link GPM {selectedGroup.faculty.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Kelola link-link untuk Gugus Penjaminan Mutu {selectedGroup.faculty.name}
                </p>
              </div>
              <Button
                color="primary"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={handleAddLink}
              >
                Tambah Link
              </Button>
            </CardHeader>
            <CardBody>
              {links.length > 0 ? (
                <Table aria-label="Tabel Link GPM">
                  <TableHeader>
                    <TableColumn>JUDUL</TableColumn>
                    <TableColumn>URL</TableColumn>
                    <TableColumn>DESKRIPSI</TableColumn>
                    <TableColumn>URUTAN</TableColumn>
                    <TableColumn>AKSI</TableColumn>
                  </TableHeader>
                  <TableBody items={links}>
                    {(link) => (
                      <TableRow key={link.id}>
                        <TableCell>{link.title}</TableCell>
                        <TableCell>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                          </a>
                        </TableCell>
                        <TableCell>{link.description || "-"}</TableCell>
                        <TableCell>{link.order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="flat"
                              startContent={<PencilIcon className="w-3 h-3" />}
                              onPress={() => handleEditLink(link)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              startContent={<TrashIcon className="w-3 h-3" />}
                              onPress={() => handleDeleteLink(link)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Belum Ada Link
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Tambahkan link untuk GPM {selectedGroup.faculty.name}
                  </p>
                  <Button
                    color="primary"
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onPress={handleAddLink}
                  >
                    Tambah Link Pertama
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* GPM Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {formData.id ? "Edit GPM" : "Tambah GPM"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Fakultas"
                placeholder="Pilih Fakultas"
                selectedKeys={formData.facultyId ? [formData.facultyId] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFormData({ ...formData, facultyId: selectedKey });
                }}
              >
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </Select>

              <Textarea
                label="Deskripsi"
                placeholder="Deskripsi GPM"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <Input
                label="Kontak"
                placeholder="Informasi kontak GPM"
                value={formData.contactInfo}
                onChange={(e) =>
                  setFormData({ ...formData, contactInfo: e.target.value })
                }
              />

              <Input
                label="Link Langsung"
                placeholder="https://fikes.unsoed.ac.id/gugus-penjaminan-mutu/"
                value={formData.directUrl}
                onChange={(e) =>
                  setFormData({ ...formData, directUrl: e.target.value })
                }
                description="URL langsung ke halaman GPM fakultas"
              />

              <Input
                type="number"
                label="Urutan"
                placeholder="Urutan tampil"
                value={formData.order.toString()}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSave}>
              {formData.id ? "Perbarui" : "Tambah"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete GPM Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Hapus GPM</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus GPM{" "}
              <strong>{groupToDelete?.faculty.name}</strong>?
              Semua link yang terkait juga akan terhapus.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>
              Batal
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Link Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={onLinkModalClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {linkFormData.id ? "Edit Link" : "Tambah Link"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Judul Link"
                placeholder="Masukkan judul link"
                value={linkFormData.title}
                onChange={(e) =>
                  setLinkFormData({ ...linkFormData, title: e.target.value })
                }
                isRequired
              />

              <Input
                label="URL"
                placeholder="https://example.com"
                value={linkFormData.url}
                onChange={(e) =>
                  setLinkFormData({ ...linkFormData, url: e.target.value })
                }
                isRequired
              />

              <Textarea
                label="Deskripsi"
                placeholder="Deskripsi singkat tentang link ini"
                value={linkFormData.description}
                onChange={(e) =>
                  setLinkFormData({ ...linkFormData, description: e.target.value })
                }
              />

              <Input
                type="number"
                label="Urutan"
                placeholder="Urutan tampil"
                value={linkFormData.order.toString()}
                onChange={(e) =>
                  setLinkFormData({ ...linkFormData, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onLinkModalClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSaveLink}>
              {linkFormData.id ? "Perbarui" : "Tambah"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Link Modal */}
      <Modal isOpen={isDeleteLinkOpen} onClose={onDeleteLinkClose}>
        <ModalContent>
          <ModalHeader>Hapus Link</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus link{" "}
              <strong>{linkToDelete?.title}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteLinkClose}>
              Batal
            </Button>
            <Button color="danger" onPress={confirmDeleteLink}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
