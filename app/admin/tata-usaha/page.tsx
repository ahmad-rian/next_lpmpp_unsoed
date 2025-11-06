"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { ImageUpload } from "@/components/image-upload";

interface Staff {
  id: string;
  position: string;
  name: string;
  title: string | null;
  photo: string | null;
  order: number;
}

const positionLabels: Record<string, string> = {
  SUB_COORDINATOR: "Sub Koordinator",
  GENERAL_STAFF: "Staff Umum",
  PROGRAM_DATA_INFO_STAFF: "Staff Program, Data & Informasi",
  DRIVER: "Pengemudi",
  OFFICE_ASSISTANT: "Pramu Bakti",
};

const positionColors: Record<string, "primary" | "success" | "warning" | "secondary" | "default"> = {
  SUB_COORDINATOR: "primary",
  GENERAL_STAFF: "success",
  PROGRAM_DATA_INFO_STAFF: "warning",
  DRIVER: "secondary",
  OFFICE_ASSISTANT: "default",
};

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

export default function TataUsahaPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    position: "",
    name: "",
    title: "",
    photo: "",
    order: 0,
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch("/api/staff");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setMessage({ type: 'error', text: 'Gagal memuat data staff' });
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setFormData({ position: "", name: "", title: "", photo: "", order: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setFormData({
      position: staffMember.position,
      name: staffMember.name,
      title: staffMember.title || "",
      photo: staffMember.photo || "",
      order: staffMember.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const url = selectedStaff ? "/api/staff" : "/api/staff";
      const method = selectedStaff ? "PUT" : "POST";
      const body = selectedStaff 
        ? { id: selectedStaff.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save");

      setMessage({ 
        type: 'success', 
        text: selectedStaff ? 'Staff berhasil diupdate!' : 'Staff berhasil ditambahkan!' 
      });
      setIsModalOpen(false);
      fetchStaff();
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menyimpan data staff' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/staff?id=${selectedStaff.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setMessage({ type: 'success', text: 'Staff berhasil dihapus!' });
      setIsDeleteModalOpen(false);
      fetchStaff();
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghapus staff' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]"><p>Memuat data...</p></div>;
  }

  return (
    <AdminPageLayout
      title="Tata Usaha LPMPP"
      description="Kelola data staff dan karyawan Tata Usaha LPMPP UNSOED"
      icon={<UsersIcon />}
      action={
        <Button color="primary" onPress={handleAdd}>
          + Tambah Staff
        </Button>
      }
    >
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardBody>
          <Table aria-label="Tata Usaha Staff Table">
            <TableHeader>
              <TableColumn>FOTO</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>POSISI</TableColumn>
              <TableColumn>URUTAN</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar
                      src={member.photo || undefined}
                      name={member.name}
                      showFallback
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      {member.title && <p className="text-xs text-default-500">{member.title}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip color={positionColors[member.position]} size="sm" variant="flat">
                      {positionLabels[member.position]}
                    </Chip>
                  </TableCell>
                  <TableCell>{member.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="flat" onPress={() => handleEdit(member)}>Edit</Button>
                      <Button size="sm" color="danger" variant="flat" onPress={() => handleDelete(member)}>Hapus</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader>{selectedStaff ? "Edit Staff" : "Tambah Staff Baru"}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Posisi"
                selectedKeys={formData.position ? [formData.position] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setFormData({...formData, position: selected});
                }}
                isRequired
              >
                {Object.entries(positionLabels).map(([key, label]) => (
                  <SelectItem key={key}>{label}</SelectItem>
                ))}
              </Select>
              <Input
                label="Nama Lengkap"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                isRequired
              />
              <Input
                label="Gelar/Keterangan"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <Input
                label="Urutan"
                type="number"
                value={String(formData.order)}
                onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
              />
              <ImageUpload
                label="Foto Staff"
                value={formData.photo}
                onChange={(url) => setFormData({...formData, photo: url})}
                description="Upload foto staff (auto-convert ke WebP)"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsModalOpen(false)}>Batal</Button>
            <Button color="primary" onPress={handleSubmit} isLoading={isSubmitting}>Simpan</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Konfirmasi Hapus</ModalHeader>
          <ModalBody>
            Apakah Anda yakin ingin menghapus <strong>{selectedStaff?.name}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button color="danger" onPress={confirmDelete} isLoading={isSubmitting}>Hapus</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
