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
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { PlusIcon, PencilIcon, TrashIcon, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface StudyProgramAccreditation {
  id: string;
  programName: string;
  level: string;
  skNumber: string | null;
  skYear: number | null;
  rating: string;
  order: number;
  isActive: boolean;
}

interface ChartData {
  name: string;
  value: number;
}

const LEVEL_OPTIONS = [
  { key: "D-III", label: "D-III" },
  { key: "S1", label: "S1" },
  { key: "S2", label: "S2" },
  { key: "S3", label: "S3" },
  { key: "Profesi", label: "Profesi" },
  { key: "Spesialis", label: "Spesialis" },
];

const RATING_OPTIONS = [
  { key: "UNGGUL", label: "UNGGUL", color: "success" },
  { key: "BAIK SEKALI", label: "BAIK SEKALI", color: "primary" },
  { key: "BAIK", label: "BAIK", color: "warning" },
  { key: "TERAKREDITASI SEMENTARA", label: "TERAKREDITASI SEMENTARA", color: "default" },
  { key: "A", label: "A", color: "success" },
  { key: "B", label: "B", color: "primary" },
  { key: "C", label: "C", color: "warning" },
];

const getRatingColor = (rating: string): string => {
  if (rating === "UNGGUL" || rating === "A") return "#22c55e";
  if (rating === "BAIK SEKALI" || rating === "B") return "#3b82f6";
  if (rating === "BAIK" || rating === "C") return "#eab308";
  return "#6b7280";
};

const getRatingChipColor = (rating: string): "success" | "primary" | "warning" | "default" => {
  if (rating === "UNGGUL" || rating === "A") return "success";
  if (rating === "BAIK SEKALI" || rating === "B") return "primary";
  if (rating === "BAIK" || rating === "C") return "warning";
  return "default";
};

export default function AkreditasiProdiPage() {
  const [accreditations, setAccreditations] = useState<StudyProgramAccreditation[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<StudyProgramAccreditation | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const [formData, setFormData] = useState({
    programName: "",
    level: "",
    skNumber: "",
    skYear: "",
    rating: "",
    order: 0,
  });

  useEffect(() => {
    fetchAccreditations();
    fetchChartData();
  }, []);

  const fetchAccreditations = async () => {
    try {
      const response = await fetch("/api/study-program-accreditations");
      const data = await response.json();
      if (data.accreditations) {
        setAccreditations(data.accreditations);
        setLastUpdate(new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }));
      }
    } catch (error) {
      console.error("Error fetching accreditations:", error);
      alert("Gagal memuat data akreditasi");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch("/api/accreditation-stats");
      const data = await response.json();
      if (data.stats) {
        setChartData(data.stats);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const handleOpenModal = (item?: StudyProgramAccreditation) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        programName: item.programName,
        level: item.level,
        skNumber: item.skNumber || "",
        skYear: item.skYear?.toString() || "",
        rating: item.rating,
        order: item.order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        programName: "",
        level: "",
        skNumber: "",
        skYear: "",
        rating: "",
        order: accreditations.length + 1,
      });
    }
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setFormData({
      programName: "",
      level: "",
      skNumber: "",
      skYear: "",
      rating: "",
      order: 0,
    });
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.programName || !formData.level || !formData.rating) {
      alert("Program Studi, Strata, dan Peringkat harus diisi");
      return;
    }

    setSaving(true);
    try {
      const url = "/api/study-program-accreditations";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem
        ? {
            id: editingItem.id,
            programName: formData.programName,
            level: formData.level,
            skNumber: formData.skNumber || null,
            skYear: formData.skYear ? parseInt(formData.skYear) : null,
            rating: formData.rating,
            order: formData.order,
          }
        : {
            programName: formData.programName,
            level: formData.level,
            skNumber: formData.skNumber || null,
            skYear: formData.skYear ? parseInt(formData.skYear) : null,
            rating: formData.rating,
            order: formData.order,
          };

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
      fetchChartData();
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
      const response = await fetch(`/api/study-program-accreditations?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus data");
      }

      alert("Data berhasil dihapus");
      fetchAccreditations();
      fetchChartData();
    } catch (error: any) {
      console.error("Error deleting:", error);
      alert(error.message || "Gagal menghapus data");
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ["No", "Program Studi", "Strata", "No. SK", "Tahun SK", "Peringkat"];
    const rows = accreditations.map((item, index) => [
      index + 1,
      item.programName,
      item.level,
      item.skNumber || "-",
      item.skYear || "-",
      item.rating,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `akreditasi-prodi-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
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
          <h1 className="text-2xl font-bold">Akreditasi Program Studi</h1>
          <p className="text-default-500 text-sm">
            Kelola data akreditasi program studi dan lihat statistik peringkat
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Download className="w-4 h-4" />}
            onPress={handleExport}
          >
            Export CSV
          </Button>
          <Button
            color="primary"
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={() => handleOpenModal()}
          >
            Tambah Data
          </Button>
        </div>
      </div>

      {/* Chart Card */}
      <Card>
        <CardBody>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Statistik Peringkat Akreditasi</h2>
              {lastUpdate && (
                <p className="text-sm text-default-500">Update: {lastUpdate}</p>
              )}
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Jumlah Program Studi">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRatingColor(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-[300px] text-default-400">
                Belum ada data untuk ditampilkan
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Table aria-label="Akreditasi Program Studi Table">
        <TableHeader>
          <TableColumn>NO</TableColumn>
          <TableColumn>PROGRAM STUDI</TableColumn>
          <TableColumn>STRATA</TableColumn>
          <TableColumn>NO. SK</TableColumn>
          <TableColumn>TAHUN SK</TableColumn>
          <TableColumn>PERINGKAT</TableColumn>
          <TableColumn>AKSI</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Belum ada data akreditasi">
          {accreditations.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.programName}</TableCell>
              <TableCell>{item.level}</TableCell>
              <TableCell>{item.skNumber || "-"}</TableCell>
              <TableCell>{item.skYear || "-"}</TableCell>
              <TableCell>
                <Chip color={getRatingChipColor(item.rating)} variant="flat" size="sm">
                  {item.rating}
                </Chip>
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="2xl">
        <ModalContent>
          <ModalHeader>
            {editingItem ? "Edit Akreditasi" : "Tambah Akreditasi"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Program Studi"
                placeholder="Masukkan nama program studi"
                value={formData.programName}
                onChange={(e: any) =>
                  setFormData({ ...formData, programName: e.target.value })
                }
                isRequired
              />
              <Select
                label="Strata"
                placeholder="Pilih strata"
                selectedKeys={formData.level ? [formData.level] : []}
                onChange={(e: any) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                isRequired
              >
                {LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="No. SK"
                placeholder="Masukkan nomor SK (opsional)"
                value={formData.skNumber}
                onChange={(e: any) =>
                  setFormData({ ...formData, skNumber: e.target.value })
                }
              />
              <Input
                type="number"
                label="Tahun SK"
                placeholder="Masukkan tahun SK (opsional)"
                value={formData.skYear}
                onChange={(e: any) =>
                  setFormData({ ...formData, skYear: e.target.value })
                }
              />
              <Select
                label="Peringkat"
                placeholder="Pilih peringkat akreditasi"
                selectedKeys={formData.rating ? [formData.rating] : []}
                onChange={(e: any) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                isRequired
              >
                {RATING_OPTIONS.map((option) => (
                  <SelectItem key={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
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
