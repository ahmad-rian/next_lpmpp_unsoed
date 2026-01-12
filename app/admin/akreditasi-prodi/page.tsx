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
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { calculateAccreditationStatus, formatDateID } from "@/lib/accreditation-utils";

// Heroicons
const AcademicCapIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
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

interface StudyProgramAccreditation {
  id: string;
  studyProgram: string;
  level: string;
  korprodi: string | null;
  skNumber: string | null;
  skYear: number | null;
  rank: string | null;
  validFrom: string | null;
  validUntil: string | null;
  certificateUrl: string | null;
  order: number;
  isActive: boolean;
}

interface ChartData {
  name: string;
  value: number;
}

const LEVEL_OPTIONS = [
  { key: "D3", label: "D-III" },
  { key: "S1", label: "S1" },
  { key: "S2", label: "S2" },
  { key: "S3", label: "S3" },
  { key: "PROFESI", label: "Profesi" },
  { key: "SPESIALIS", label: "Spesialis" },
];

const RANK_OPTIONS = [
  { key: "UNGGUL", label: "UNGGUL", color: "success" },
  { key: "BAIK_SEKALI", label: "BAIK SEKALI", color: "primary" },
  { key: "BAIK", label: "BAIK", color: "warning" },
  { key: "TERAKREDITASI_SEMENTARA", label: "TERAKREDITASI SEMENTARA", color: "default" },
  { key: "A", label: "A", color: "success" },
  { key: "B", label: "B", color: "primary" },
  { key: "C", label: "C", color: "warning" },
];

const getRankColor = (rank: string | null): string => {
  if (!rank) return "#6b7280";
  if (rank === "UNGGUL" || rank === "A") return "#22c55e";
  if (rank === "BAIK_SEKALI" || rank === "B") return "#3b82f6";
  if (rank === "BAIK" || rank === "C") return "#eab308";
  return "#6b7280";
};

const getRankChipColor = (rank: string | null): "success" | "primary" | "warning" | "default" => {
  if (!rank) return "default";
  if (rank === "UNGGUL" || rank === "A") return "success";
  if (rank === "BAIK_SEKALI" || rank === "B") return "primary";
  if (rank === "BAIK" || rank === "C") return "warning";
  return "default";
};

export default function AkreditasiProdiPage() {
  const [accreditations, setAccreditations] = useState<StudyProgramAccreditation[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<StudyProgramAccreditation | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  // Pagination & Filter states
  const [page, setPage] = useState(1);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const rowsPerPage = 10;

  const [formData, setFormData] = useState({
    studyProgram: "",
    level: "",
    korprodi: "",
    skNumber: "",
    skYear: "",
    rank: "",
    validFrom: "",
    validUntil: "",
    certificateUrl: "",
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
      setAccreditations(data);
      setLastUpdate(new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }));
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
      setChartData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData([]);
    }
  };

  // Filter and pagination logic
  const filteredAccreditations = filterLevel === "all"
    ? accreditations
    : accreditations.filter(acc => acc.level === filterLevel);

  const totalPages = Math.ceil(filteredAccreditations.length / rowsPerPage);
  const paginatedAccreditations = filteredAccreditations.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleOpenModal = (item?: StudyProgramAccreditation) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        studyProgram: item.studyProgram,
        level: item.level,
        korprodi: item.korprodi || "",
        skNumber: item.skNumber || "",
        skYear: item.skYear?.toString() || "",
        rank: item.rank || "",
        validFrom: item.validFrom ? new Date(item.validFrom).toISOString().split('T')[0] : "",
        validUntil: item.validUntil ? new Date(item.validUntil).toISOString().split('T')[0] : "",
        certificateUrl: item.certificateUrl || "",
        order: item.order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        studyProgram: "",
        level: "",
        korprodi: "",
        skNumber: "",
        skYear: "",
        rank: "",
        validFrom: "",
        validUntil: "",
        certificateUrl: "",
        order: accreditations.length + 1,
      });
    }
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setCertificateFile(null);
    setFormData({
      studyProgram: "",
      level: "",
      korprodi: "",
      skNumber: "",
      skYear: "",
      rank: "",
      validFrom: "",
      validUntil: "",
      certificateUrl: "",
      order: 0,
    });
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.studyProgram || !formData.level || !formData.rank) {
      alert("Program Studi, Strata, dan Peringkat harus diisi");
      return;
    }

    setSaving(true);
    try {
      let certificateUrl = formData.certificateUrl;

      // Upload file if selected
      if (certificateFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", certificateFile);

        const uploadResponse = await fetch("/api/upload-document", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Gagal mengupload sertifikat");
        }

        const uploadData = await uploadResponse.json();
        certificateUrl = uploadData.url;
        setUploading(false);
      }

      const url = "/api/study-program-accreditations";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem
        ? {
          id: editingItem.id,
          studyProgram: formData.studyProgram,
          level: formData.level,
          korprodi: formData.korprodi || null,
          skNumber: formData.skNumber || null,
          skYear: formData.skYear ? parseInt(formData.skYear) : null,
          rank: formData.rank,
          validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : null,
          validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
          certificateUrl: certificateUrl || null,
          order: formData.order,
        }
        : {
          studyProgram: formData.studyProgram,
          level: formData.level,
          korprodi: formData.korprodi || null,
          skNumber: formData.skNumber || null,
          skYear: formData.skYear ? parseInt(formData.skYear) : null,
          rank: formData.rank,
          validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : null,
          validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
          certificateUrl: certificateUrl || null,
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
      setUploading(false);
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
      item.studyProgram,
      item.level,
      item.skNumber || "-",
      item.skYear || "-",
      item.rank,
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Akreditasi Program Studi"
      description="Kelola data akreditasi program studi dan lihat statistik peringkat"
      icon={<AcademicCapIcon />}
    >
      <div className="space-y-6">
        {/* Header dengan tombol */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <Select
              label="Filter Strata"
              placeholder="Semua Strata"
              selectedKeys={filterLevel === "all" ? [] : [filterLevel]}
              onChange={(e) => {
                setFilterLevel(e.target.value || "all");
                setPage(1);
              }}
              className="w-[200px]"
              size="sm"
            >
              <SelectItem key="all" value="all">Semua Strata</SelectItem>
              {LEVEL_OPTIONS.map((level) => (
                <SelectItem key={level.key} value={level.key}>
                  {level.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="flat"
              startContent={<DownloadIcon className="w-4 h-4" />}
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

              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-default-100 rounded-lg">
                  <p className="text-xs text-default-600">Total Program</p>
                  <p className="text-2xl font-bold text-primary">{accreditations.length}</p>
                </div>
                <div className="p-3 bg-success-50 rounded-lg">
                  <p className="text-xs text-success-700">Unggul & A</p>
                  <p className="text-2xl font-bold text-success-600">
                    {accreditations.filter(a => a.rank === "UNGGUL" || a.rank === "A").length}
                  </p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <p className="text-xs text-primary-700">Baik Sekali & B</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {accreditations.filter(a => a.rank === "BAIK_SEKALI" || a.rank === "B").length}
                  </p>
                </div>
                <div className="p-3 bg-warning-50 rounded-lg">
                  <p className="text-xs text-warning-700">Baik & C</p>
                  <p className="text-2xl font-bold text-warning-600">
                    {accreditations.filter(a => a.rank === "BAIK" || a.rank === "C").length}
                  </p>
                </div>
              </div>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={110} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Jumlah Program Studi">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getRankColor(entry.name)} />
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
            <TableColumn>KORPRODI</TableColumn>
            <TableColumn>STRATA</TableColumn>
            <TableColumn>PERINGKAT</TableColumn>
            <TableColumn>MASA BERLAKU</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>SERTIFIKAT</TableColumn>
            <TableColumn>AKSI</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Belum ada data akreditasi">
            {paginatedAccreditations.map((item, index) => {
              const status = calculateAccreditationStatus(item.validUntil ? new Date(item.validUntil) : null);

              return (
                <TableRow key={item.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.studyProgram}</div>
                      {item.skNumber && (
                        <div className="text-xs text-default-500">
                          SK: {item.skNumber} ({item.skYear || '-'})
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.korprodi || "-"}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color="primary">
                      {LEVEL_OPTIONS.find(l => l.key === item.level)?.label || item.level}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color={getRankChipColor(item.rank)} variant="flat" size="sm">
                      {item.rank}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {item.validFrom && item.validUntil ? (
                      <div className="text-xs">
                        <div>{formatDateID(item.validFrom)}</div>
                        <div className="text-default-500">s/d {formatDateID(item.validUntil)}</div>
                      </div>
                    ) : (
                      <span className="text-default-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={status.color}
                      variant="flat"
                      size="sm"
                      className="font-semibold"
                    >
                      {status.message}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {item.certificateUrl ? (
                      <Button
                        as="a"
                        href={item.certificateUrl}
                        target="_blank"
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<DownloadIcon className="w-4 h-4" />}
                      >
                        Lihat
                      </Button>
                    ) : (
                      <span className="text-default-400 text-sm">-</span>
                    )}
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
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-2 py-2">
            <div className="text-sm text-default-500">
              Menampilkan {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, filteredAccreditations.length)} dari {filteredAccreditations.length} data
            </div>
            <Pagination
              total={totalPages}
              initialPage={1}
              page={page}
              onChange={setPage}
              showControls
              color="primary"
            />
          </div>
        )}

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
                  value={formData.studyProgram}
                  onChange={(e: any) =>
                    setFormData({ ...formData, studyProgram: e.target.value })
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
                  label="Koordinator Program Studi"
                  placeholder="Masukkan nama koordinator prodi (opsional)"
                  value={formData.korprodi}
                  onChange={(e: any) =>
                    setFormData({ ...formData, korprodi: e.target.value })
                  }
                />
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
                  selectedKeys={formData.rank ? [formData.rank] : []}
                  onChange={(e: any) =>
                    setFormData({ ...formData, rank: e.target.value })
                  }
                  isRequired
                >
                  {RANK_OPTIONS.map((option) => (
                    <SelectItem key={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* New Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Mulai Berlaku"
                    placeholder="Pilih tanggal mulai"
                    value={formData.validFrom}
                    onChange={(e: any) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                    description="Tanggal mulai berlaku akreditasi"
                  />
                  <Input
                    type="date"
                    label="Selesai Berlaku"
                    placeholder="Pilih tanggal selesai"
                    value={formData.validUntil}
                    onChange={(e: any) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                    description="Tanggal selesai berlaku akreditasi"
                  />
                </div>

                {/* File Upload for Certificate */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Upload Sertifikat Akreditasi
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file size (max 10MB)
                        if (file.size > 10 * 1024 * 1024) {
                          alert("Ukuran file maksimal 10MB");
                          e.target.value = "";
                          return;
                        }
                        setCertificateFile(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer border border-default-200 rounded-lg p-2"
                  />
                  <p className="text-xs text-default-500">
                    Format: PDF, DOC, DOCX (Maks. 10MB)
                    {certificateFile && (
                      <span className="text-primary-600 font-medium ml-2">
                        ✓ {certificateFile.name}
                      </span>
                    )}
                    {formData.certificateUrl && !certificateFile && (
                      <span className="text-success-600 font-medium ml-2">
                        ✓ File sudah ada
                      </span>
                    )}
                  </p>
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
              <Button variant="flat" onPress={handleCloseModal} isDisabled={saving || uploading}>
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={saving || uploading}>
                {uploading ? "Mengupload..." : saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminPageLayout>
  );
}
