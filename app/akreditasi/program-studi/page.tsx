"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import { Pagination } from "@heroui/pagination";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface StudyProgramAccreditation {
  id: string;
  studyProgram: string;
  level: string;
  korprodi: string | null;
  skNumber: string | null;
  skYear: number | null;
  rank: string | null;
  validUntil: string | null;
  order: number;
}

// Helper function to format date
const formatDateID = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

const RANK_LABELS: Record<string, string> = {
  UNGGUL: "UNGGUL",
  BAIK_SEKALI: "BAIK SEKALI",
  BAIK: "BAIK",
  TERAKREDITASI: "TERAKREDITASI",
  A: "A",
  B: "B",
  C: "C",
};

const LEVEL_LABELS: Record<string, string> = {
  D3: "D-III",
  S1: "S1",
  S2: "S2",
  S3: "S3",
  PROFESI: "Profesi",
  SPESIALIS: "Spesialis",
};

const LEVEL_OPTIONS = [
  { key: "all", label: "Semua Strata" },
  { key: "D3", label: "D-III" },
  { key: "S1", label: "S1" },
  { key: "S2", label: "S2" },
  { key: "S3", label: "S3" },
  { key: "PROFESI", label: "Profesi" },
  { key: "SPESIALIS", label: "Spesialis" },
];

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const getRankColor = (rank: string) => {
  const colors: Record<string, string> = {
    UNGGUL: "#16A34A",
    "BAIK SEKALI": "#2563EB",
    BAIK: "#CA8A04",
    "TERAKREDITASI SEMENTARA": "#EA580C",
    A: "#16A34A",
    B: "#2563EB",
    C: "#CA8A04",
  };
  return colors[rank] || "#6B7280";
};

const getRankChipColor = (rank: string | null) => {
  if (!rank) return "default";
  const colorMap: Record<string, "success" | "primary" | "warning" | "danger" | "default"> = {
    UNGGUL: "success",
    BAIK_SEKALI: "primary",
    BAIK: "warning",
    TERAKREDITASI: "default",
    A: "success",
    B: "primary",
    C: "warning",
  };
  return colorMap[rank] || "default";
};

export default function AkreditasiProgramStudiPage() {
  const [loading, setLoading] = useState(true);
  const [accreditations, setAccreditations] = useState<StudyProgramAccreditation[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/accreditation");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAccreditations(data.studyProgramAccreditations || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by level, then by search query
  const filteredAccreditations = accreditations
    .filter((acc) => filterLevel === "all" || acc.level === filterLevel)
    .filter((acc) =>
      acc.studyProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.rank && RANK_LABELS[acc.rank].toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const totalPages = Math.ceil(filteredAccreditations.length / rowsPerPage);
  const paginatedAccreditations = filteredAccreditations.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Chart data
  const chartData = [
    { name: 'UNGGUL', value: accreditations.filter(item => item.rank === 'UNGGUL').length },
    { name: 'BAIK SEKALI', value: accreditations.filter(item => item.rank === 'BAIK_SEKALI').length },
    { name: 'BAIK', value: accreditations.filter(item => item.rank === 'BAIK').length },
    { name: 'TERAKREDITASI', value: accreditations.filter(item => item.rank === 'TERAKREDITASI').length },
    { name: 'A', value: accreditations.filter(item => item.rank === 'A').length },
    { name: 'B', value: accreditations.filter(item => item.rank === 'B').length },
    { name: 'C', value: accreditations.filter(item => item.rank === 'C').length },
  ].filter(item => item.value > 0);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filterLevel, searchQuery]);

  if (loading) {
    return (
      <div className="w-full space-y-8 px-4 py-8">
        <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
          <Skeleton className="h-12 w-96 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-64 mx-auto rounded-lg" />
        </div>
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-96 rounded-xl mb-6" />
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Akreditasi Program Studi
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Informasi lengkap peringkat akreditasi program studi UNSOED
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 max-w-7xl mx-auto">
        <Card className="shadow-md border-l-4 border-blue-500">
          <CardBody className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-default-600 mb-1">Total Program</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{accreditations.length}</p>
          </CardBody>
        </Card>
        <Card className="shadow-md border-l-4 border-green-500">
          <CardBody className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-default-600 mb-1">Unggul & A</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {accreditations.filter(a => a.rank === "UNGGUL" || a.rank === "A").length}
            </p>
          </CardBody>
        </Card>
        <Card className="shadow-md border-l-4 border-blue-500">
          <CardBody className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-default-600 mb-1">Baik Sekali & B</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {accreditations.filter(a => a.rank === "BAIK_SEKALI" || a.rank === "B").length}
            </p>
          </CardBody>
        </Card>
        <Card className="shadow-md border-l-4 border-yellow-500">
          <CardBody className="p-3 md:p-4">
            <p className="text-xs md:text-sm text-default-600 mb-1">Baik & C</p>
            <p className="text-2xl md:text-3xl font-bold text-yellow-600">
              {accreditations.filter(a => a.rank === "BAIK" || a.rank === "C").length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <Card className="shadow-lg">
          <CardHeader className="pb-0 flex flex-col items-start px-4 pt-4">
            <h3 className="text-lg md:text-xl font-semibold text-red-600 dark:text-red-400">
              Distribusi Peringkat Akreditasi
            </h3>
            <p className="text-xs md:text-sm text-default-500 mt-1">
              Visualisasi jumlah program studi per peringkat
            </p>
          </CardHeader>
          <CardBody className="px-2 md:px-4">
            {chartData.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={300}>
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: '12px' }}
                      labelStyle={{ fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="value" name="Jumlah Program Studi">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getRankColor(entry.name)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex justify-center items-center h-[300px] text-default-400">
                Belum ada data untuk ditampilkan
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-0 flex flex-col gap-3 px-4 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 w-full">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-red-600 dark:text-red-400">
                  Daftar Program Studi
                </h3>
                <p className="text-xs md:text-sm text-default-500 mt-1">
                  Menampilkan {filteredAccreditations.length > 0 ? (page - 1) * rowsPerPage + 1 : 0} - {Math.min(page * rowsPerPage, filteredAccreditations.length)} dari {filteredAccreditations.length} data
                </p>
              </div>
              <div className="w-full md:w-48">
                <Select
                  label="Filter Strata"
                  placeholder="Pilih Strata"
                  selectedKeys={[filterLevel]}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  size="sm"
                  classNames={{
                    trigger: "min-h-unit-10",
                    value: "text-xs md:text-sm"
                  }}
                >
                  {LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level.key}>
                      {level.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full">
              <Input
                placeholder="Cari program studi atau peringkat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<SearchIcon />}
                size="md"
                variant="bordered"
                isClearable
                onClear={() => setSearchQuery("")}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-10"
                }}
              />
            </div>
          </CardHeader>

          <CardBody className="overflow-x-auto px-0">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-default-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-default-600">No</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-default-600">Program Studi</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-default-600">Korprodi</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-default-600">Strata</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-default-600">Masa Berlaku</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-default-600">Tahun SK</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-default-600">Peringkat</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAccreditations.length > 0 ? (
                    paginatedAccreditations.map((acc, index) => (
                      <tr key={acc.id} className="border-b border-default-100 hover:bg-default-50 transition-colors">
                        <td className="py-3 px-4 text-sm">{(page - 1) * rowsPerPage + index + 1}</td>
                        <td className="py-3 px-4 text-sm font-medium">{acc.studyProgram}</td>
                        <td className="py-3 px-4 text-sm">{acc.korprodi || "-"}</td>
                        <td className="py-3 px-4 text-sm">
                          <Chip size="sm" variant="flat" color="primary">
                            {LEVEL_LABELS[acc.level] || acc.level}
                          </Chip>
                        </td>
                        <td className="py-3 px-4 text-sm">{formatDateID(acc.validUntil)}</td>
                        <td className="py-3 px-4 text-sm">{acc.skYear || "-"}</td>
                        <td className="py-3 px-4 text-sm">
                          <Chip size="sm" variant="flat" color={getRankChipColor(acc.rank)}>
                            {acc.rank ? RANK_LABELS[acc.rank] || acc.rank : "-"}
                          </Chip>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-default-400">
                        {searchQuery || filterLevel !== "all"
                          ? "Tidak ada data yang sesuai dengan pencarian"
                          : "Tidak ada data yang ditemukan"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden px-4 space-y-3">
              {paginatedAccreditations.length > 0 ? (
                paginatedAccreditations.map((acc, index) => (
                  <Card key={acc.id} className="shadow-sm border border-default-200">
                    <CardBody className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-default-500">
                              #{(page - 1) * rowsPerPage + index + 1}
                            </span>
                            <Chip size="sm" variant="flat" color="primary">
                              {LEVEL_LABELS[acc.level] || acc.level}
                            </Chip>
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                            {acc.studyProgram}
                          </h4>
                          {acc.korprodi && (
                            <p className="text-xs text-default-600 mt-1">
                              Korprodi: {acc.korprodi}
                            </p>
                          )}
                        </div>
                        <Chip size="sm" variant="flat" color={getRankChipColor(acc.rank)}>
                          {acc.rank ? RANK_LABELS[acc.rank] || acc.rank : "-"}
                        </Chip>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-default-500 pt-2 border-t border-default-100">
                        <span>Masa Berlaku: {formatDateID(acc.validUntil)}</span>
                        <span>•</span>
                        <span>Tahun: {acc.skYear || "-"}</span>
                      </div>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <div className="py-8 text-center text-default-400">
                  {searchQuery || filterLevel !== "all"
                    ? "Tidak ada data yang sesuai dengan pencarian"
                    : "Tidak ada data yang ditemukan"}
                </div>
              )}
            </div>
          </CardBody>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center py-4 px-4">
              <Pagination
                total={totalPages}
                initialPage={1}
                page={page}
                onChange={setPage}
                showControls
                color="primary"
                size="sm"
                className="gap-1"
              />
            </div>
          )}
        </Card>
      </div>

      {/* Update Info */}
      <div className="text-center text-xs md:text-sm text-default-500 mt-8">
        <p>Update: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>
    </div>
  );
}