"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import type { Selection } from "@heroui/select";
import { ImageUpload } from "@/components/image-upload";

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

type CenterMemberRole = "COORDINATOR" | "MEMBER";

interface CenterMember {
  id: string;
  centerId: string;
  role: CenterMemberRole;
  name: string;
  title: string;
  photo: string | null;
  order: number;
}

interface Center {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  members: CenterMember[];
}

const roleLabels: Record<CenterMemberRole, string> = {
  COORDINATOR: "Koordinator",
  MEMBER: "Anggota",
};

export default function PusatUnitPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);

  // Center Modal
  const {
    isOpen: isCenterOpen,
    onOpen: onCenterOpen,
    onClose: onCenterClose,
  } = useDisclosure();
  const [centerFormData, setCenterFormData] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    order: 0,
    isActive: true,
  });

  // Member Modal
  const {
    isOpen: isMemberOpen,
    onOpen: onMemberOpen,
    onClose: onMemberClose,
  } = useDisclosure();
  const [memberFormData, setMemberFormData] = useState({
    id: "",
    centerId: "",
    role: "MEMBER" as CenterMemberRole,
    name: "",
    title: "",
    photo: "",
    order: 0,
  });

  // Delete Modals
  const {
    isOpen: isDeleteCenterOpen,
    onOpen: onDeleteCenterOpen,
    onClose: onDeleteCenterClose,
  } = useDisclosure();
  const [centerToDelete, setCenterToDelete] = useState<Center | null>(null);

  const {
    isOpen: isDeleteMemberOpen,
    onOpen: onDeleteMemberOpen,
    onClose: onDeleteMemberClose,
  } = useDisclosure();
  const [memberToDelete, setMemberToDelete] = useState<CenterMember | null>(
    null
  );

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await fetch("/api/centers");
      const data = await response.json();
      setCenters(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching centers:", error);
      setLoading(false);
    }
  };

  // Center handlers
  const handleAddCenter = () => {
    setCenterFormData({
      id: "",
      name: "",
      slug: "",
      description: "",
      order: centers.length + 1,
      isActive: true,
    });
    onCenterOpen();
  };

  const handleEditCenter = (center: Center) => {
    setCenterFormData({
      id: center.id,
      name: center.name,
      slug: center.slug,
      description: center.description,
      order: center.order,
      isActive: center.isActive,
    });
    onCenterOpen();
  };

  const handleSaveCenter = async () => {
    try {
      const url = centerFormData.id ? "/api/centers" : "/api/centers";
      const method = centerFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(centerFormData),
      });

      if (response.ok) {
        await fetchCenters();
        onCenterClose();
      }
    } catch (error) {
      console.error("Error saving center:", error);
    }
  };

  const confirmDeleteCenter = (center: Center) => {
    setCenterToDelete(center);
    onDeleteCenterOpen();
  };

  const handleDeleteCenter = async () => {
    if (!centerToDelete) return;

    try {
      const response = await fetch(`/api/centers?id=${centerToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCenters();
        if (selectedCenter?.id === centerToDelete.id) {
          setSelectedCenter(null);
        }
        onDeleteCenterClose();
      }
    } catch (error) {
      console.error("Error deleting center:", error);
    }
  };

  // Member handlers
  const handleAddMember = () => {
    if (!selectedCenter) return;

    setMemberFormData({
      id: "",
      centerId: selectedCenter.id,
      role: "MEMBER",
      name: "",
      title: "",
      photo: "",
      order: selectedCenter.members.length + 1,
    });
    onMemberOpen();
  };

  const handleEditMember = (member: CenterMember) => {
    setMemberFormData({
      id: member.id,
      centerId: member.centerId,
      role: member.role,
      name: member.name,
      title: member.title,
      photo: member.photo || "",
      order: member.order,
    });
    onMemberOpen();
  };

  const handleSaveMember = async () => {
    try {
      const url = memberFormData.id
        ? "/api/center-members"
        : "/api/center-members";
      const method = memberFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberFormData),
      });

      if (response.ok) {
        await fetchCenters();
        // Update selected center
        if (selectedCenter) {
          const updated = centers.find((c) => c.id === selectedCenter.id);
          if (updated) setSelectedCenter(updated);
        }
        onMemberClose();
      }
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  const confirmDeleteMember = (member: CenterMember) => {
    setMemberToDelete(member);
    onDeleteMemberOpen();
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      const response = await fetch(
        `/api/center-members?id=${memberToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchCenters();
        // Update selected center
        if (selectedCenter) {
          const updated = centers.find((c) => c.id === selectedCenter.id);
          if (updated) setSelectedCenter(updated);
        }
        onDeleteMemberClose();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleCenterNameChange = (value: string) => {
    setCenterFormData({
      ...centerFormData,
      name: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    });
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
          <h1 className="text-3xl font-bold">Manajemen Pusat & Unit</h1>
          <p className="text-default-500 mt-1">
            Kelola seluruh pusat dan unit di LPMPP UNSOED beserta anggotanya
          </p>
        </div>
        <Button 
          color="primary" 
          onPress={handleAddCenter}
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          Tambah Pusat Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List of Centers */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-xl font-semibold">Daftar Pusat</h2>
          </CardHeader>
          <Divider />
          <CardBody className="gap-2 p-2">
            {centers.map((center) => (
              <Card
                key={center.id}
                className={
                  selectedCenter?.id === center.id
                    ? "bg-primary/10 border-2 border-primary"
                    : "cursor-pointer hover:bg-default-100"
                }
              >
                <CardBody className="p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedCenter(center)}
                    >
                      <h3 className="font-semibold text-sm truncate">
                        {center.name}
                      </h3>
                      <p className="text-xs text-default-500 mt-1">
                        {center.members.length} anggota
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        onPress={() => handleEditCenter(center)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => confirmDeleteCenter(center)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </CardBody>
        </Card>

        {/* Right: Center Details & Members */}
        <div className="lg:col-span-2">
          {selectedCenter ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {selectedCenter.name}
                    </h2>
                    <p className="text-default-500 mt-2">
                      {selectedCenter.description}
                    </p>
                  </div>
                  <Button 
                    color="primary" 
                    size="sm" 
                    onPress={handleAddMember}
                    startContent={<PlusIcon className="w-4 h-4" />}
                  >
                    Tambah Anggota
                  </Button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <Table aria-label="Anggota pusat">
                  <TableHeader>
                    <TableColumn>FOTO</TableColumn>
                    <TableColumn>NAMA</TableColumn>
                    <TableColumn>JABATAN</TableColumn>
                    <TableColumn>PERAN</TableColumn>
                    <TableColumn>URUTAN</TableColumn>
                    <TableColumn>AKSI</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {selectedCenter.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Avatar
                            src={member.photo || undefined}
                            name={member.name}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{member.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{member.title || "-"}</p>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={
                              member.role === "COORDINATOR"
                                ? "primary"
                                : "default"
                            }
                          >
                            {roleLabels[member.role]}
                          </Chip>
                        </TableCell>
                        <TableCell>{member.order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              onPress={() => handleEditMember(member)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              color="danger"
                              onPress={() => confirmDeleteMember(member)}
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
          ) : (
            <Card>
              <CardBody className="text-center py-20">
                <p className="text-default-500 text-lg">
                  Pilih pusat dari daftar untuk melihat detail dan anggota
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Center Modal */}
      <Modal isOpen={isCenterOpen} onClose={onCenterClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {centerFormData.id ? "Edit Pusat" : "Tambah Pusat Baru"}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Nama Pusat"
              value={centerFormData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCenterNameChange(e.target.value)}
              isRequired
            />
            <Input
              label="Slug (URL-friendly)"
              value={centerFormData.slug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCenterFormData({ ...centerFormData, slug: e.target.value })
              }
              description="Otomatis dibuat dari nama pusat"
              isRequired
            />
            <Textarea
              label="Deskripsi / Tugas & Fungsi"
              value={centerFormData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCenterFormData({
                  ...centerFormData,
                  description: e.target.value,
                })
              }
              minRows={4}
            />
            <Input
              label="Urutan"
              type="number"
              value={centerFormData.order.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCenterFormData({
                  ...centerFormData,
                  order: parseInt(e.target.value) || 0,
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCenterClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSaveCenter}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Member Modal */}
      <Modal isOpen={isMemberOpen} onClose={onMemberClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {memberFormData.id ? "Edit Anggota" : "Tambah Anggota Baru"}
          </ModalHeader>
          <ModalBody>
            <Select
              label="Peran"
              selectedKeys={memberFormData.role ? [memberFormData.role] : []}
              onSelectionChange={(keys: Selection) => {
                const role = Array.from(keys)[0] as CenterMemberRole;
                setMemberFormData({ ...memberFormData, role });
              }}
              isRequired
            >
              <SelectItem key="COORDINATOR" value="COORDINATOR">
                Koordinator
              </SelectItem>
              <SelectItem key="MEMBER" value="MEMBER">
                Anggota
              </SelectItem>
            </Select>
            <Input
              label="Nama Lengkap"
              value={memberFormData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMemberFormData({ ...memberFormData, name: e.target.value })
              }
              isRequired
            />
            <Input
              label="Jabatan / Gelar"
              value={memberFormData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMemberFormData({ ...memberFormData, title: e.target.value })
              }
              placeholder="Contoh: Koordinator Pusat..."
            />
            <ImageUpload
              value={memberFormData.photo}
              onChange={(url) =>
                setMemberFormData({ ...memberFormData, photo: url })
              }
              label="Foto Anggota"
            />
            <Input
              label="Urutan"
              type="number"
              value={memberFormData.order.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMemberFormData({
                  ...memberFormData,
                  order: parseInt(e.target.value) || 0,
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onMemberClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSaveMember}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Center Modal */}
      <Modal isOpen={isDeleteCenterOpen} onClose={onDeleteCenterClose}>
        <ModalContent>
          <ModalHeader>Konfirmasi Hapus Pusat</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus pusat{" "}
              <strong>{centerToDelete?.name}</strong>?
            </p>
            <p className="text-danger text-sm mt-2">
              Semua anggota dari pusat ini akan ikut terhapus!
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteCenterClose}>
              Batal
            </Button>
            <Button color="danger" onPress={handleDeleteCenter}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Member Modal */}
      <Modal isOpen={isDeleteMemberOpen} onClose={onDeleteMemberClose}>
        <ModalContent>
          <ModalHeader>Konfirmasi Hapus Anggota</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus anggota{" "}
              <strong>{memberToDelete?.name}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteMemberClose}>
              Batal
            </Button>
            <Button color="danger" onPress={handleDeleteMember}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
