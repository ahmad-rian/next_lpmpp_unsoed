"use client";

import { useEffect, useState } from "react";
import { AdminPageLayout } from "@/components/admin-page-layout";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";

interface Agenda {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string | null;
    color: string;
    isActive: boolean;
}

const COLOR_OPTIONS = [
    { value: "#f59e0b", label: "Orange" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#ef4444", label: "Red" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ec4899", label: "Pink" },
];

export default function AgendaPage() {
    const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingItem, setEditingItem] = useState<Agenda | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const [formData, setFormData] = useState({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        description: "",
        color: "#f59e0b",
        isActive: true,
    });

    useEffect(() => {
        fetchAgendas();
    }, []);

    const fetchAgendas = async () => {
        try {
            const response = await fetch("/api/agenda");
            const data = await response.json();
            // Ensure data is always an array
            setAgendas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching agendas:", error);
            setAgendas([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: Agenda) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                date: item.date.split("T")[0],
                startTime: item.startTime,
                endTime: item.endTime,
                location: item.location,
                description: item.description || "",
                color: item.color,
                isActive: item.isActive,
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: "",
                date: "",
                startTime: "",
                endTime: "",
                location: "",
                description: "",
                color: "#f59e0b",
                isActive: true,
            });
        }
        onOpen();
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            date: "",
            startTime: "",
            endTime: "",
            location: "",
            description: "",
            color: "#f59e0b",
            isActive: true,
        });
        onClose();
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.location) {
            alert("Judul, Tanggal, Waktu, dan Lokasi harus diisi");
            return;
        }

        setSaving(true);
        try {
            const url = "/api/agenda";
            const method = editingItem ? "PUT" : "POST";
            const body = editingItem
                ? { id: editingItem.id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan data");
            }

            alert(editingItem ? "Data berhasil diperbarui" : "Data berhasil ditambahkan");
            handleCloseModal();
            fetchAgendas();
        } catch (error: any) {
            console.error("Error saving:", error);
            alert(error.message || "Gagal menyimpan data");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus agenda ini?")) return;

        try {
            const response = await fetch(`/api/agenda?id=${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Gagal menghapus data");
            }

            alert("Data berhasil dihapus");
            fetchAgendas();
        } catch (error: any) {
            console.error("Error deleting:", error);
            alert(error.message || "Gagal menghapus data");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", { weekday: "long" });
    };

    // Pagination
    const pages = Math.ceil(agendas.length / rowsPerPage);
    const items = agendas.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const CalendarIcon = () => (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
    );

    return (
        <AdminPageLayout
            title="Agenda Kegiatan"
            description="Kelola agenda dan kegiatan LPMPP"
            icon={<CalendarIcon />}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Agenda Kegiatan</h2>
                        <p className="text-sm text-default-500">
                            Kelola agenda dan kegiatan LPMPP
                        </p>
                    </div>
                    <Button color="primary" onPress={() => handleOpenModal()}>
                        + Tambah Agenda
                    </Button>
                </div>

                {/* Table */}
                <Table
                    aria-label="Agenda table"
                    bottomContent={
                        pages > 1 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={pages}
                                    onChange={setPage}
                                />
                            </div>
                        ) : null
                    }
                >
                    <TableHeader>
                        <TableColumn>TANGGAL</TableColumn>
                        <TableColumn>WAKTU</TableColumn>
                        <TableColumn>JUDUL KEGIATAN</TableColumn>
                        <TableColumn>LOKASI</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>AKSI</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={items}
                        isLoading={loading}
                        loadingContent={<div>Loading...</div>}
                        emptyContent="Belum ada agenda"
                    >
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{formatDate(item.date)}</span>
                                        <span className="text-xs text-default-500">{formatDay(item.date)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">
                                        {item.startTime} - {item.endTime}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="font-medium">{item.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{item.location}</span>
                                </TableCell>
                                <TableCell>
                                    <Chip color={item.isActive ? "success" : "default"} size="sm">
                                        {item.isActive ? "Aktif" : "Nonaktif"}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="warning"
                                            onPress={() => handleOpenModal(item)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="danger"
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

                {/* Modal */}
                <Modal isOpen={isOpen} onClose={handleCloseModal} size="2xl">
                    <ModalContent>
                        <ModalHeader>
                            {editingItem ? "Edit Agenda" : "Tambah Agenda"}
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <Input
                                    label="Judul Kegiatan"
                                    placeholder="Masukkan judul kegiatan"
                                    value={formData.title}
                                    onChange={(e: any) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    isRequired
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        label="Tanggal"
                                        value={formData.date}
                                        onChange={(e: any) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                        isRequired
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            type="time"
                                            label="Waktu Mulai"
                                            value={formData.startTime}
                                            onChange={(e: any) =>
                                                setFormData({ ...formData, startTime: e.target.value })
                                            }
                                            isRequired
                                        />
                                        <Input
                                            type="time"
                                            label="Waktu Selesai"
                                            value={formData.endTime}
                                            onChange={(e: any) =>
                                                setFormData({ ...formData, endTime: e.target.value })
                                            }
                                            isRequired
                                        />
                                    </div>
                                </div>

                                <Input
                                    label="Lokasi"
                                    placeholder="Masukkan lokasi kegiatan"
                                    value={formData.location}
                                    onChange={(e: any) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                    isRequired
                                />

                                <Textarea
                                    label="Deskripsi"
                                    placeholder="Masukkan deskripsi kegiatan (opsional)"
                                    value={formData.description}
                                    onChange={(e: any) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    minRows={3}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Warna</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {COLOR_OPTIONS.map((color) => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData({ ...formData, color: color.value })
                                                    }
                                                    className={`w-10 h-10 rounded-full border-2 transition-all ${formData.color === color.value
                                                        ? "border-black dark:border-white scale-110"
                                                        : "border-transparent"
                                                        }`}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.label}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    checked={formData.isActive}
                                                    onChange={() =>
                                                        setFormData({ ...formData, isActive: true })
                                                    }
                                                    className="w-4 h-4"
                                                />
                                                <span>Aktif</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    checked={!formData.isActive}
                                                    onChange={() =>
                                                        setFormData({ ...formData, isActive: false })
                                                    }
                                                    className="w-4 h-4"
                                                />
                                                <span>Nonaktif</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
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
        </AdminPageLayout>
    );
}
