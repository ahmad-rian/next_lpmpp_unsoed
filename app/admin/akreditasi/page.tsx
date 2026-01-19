"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Spinner } from "@heroui/spinner";
import toast, { Toaster } from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface InternationalAccreditation {
  id: string;
  faculty: string;
  studyProgram: string;
  accreditationBody: string;
  order: number;
  isActive: boolean;
}

interface StudyProgramAccreditation {
  id: string;
  studyProgram: string;
  level: string;
  skNumber: string | null;
  skYear: number | null;
  rank: string | null;
  order: number;
  isActive: boolean;
}

const COLORS = ["#DC2626", "#EA580C", "#CA8A04", "#16A34A", "#2563EB", "#7C3AED", "#DB2777"];

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

export default function AdminAkreditasiPage() {
  const [loading, setLoading] = useState(true);
  const [internationalAccreditations, setInternationalAccreditations] = useState<InternationalAccreditation[]>([]);
  const [studyProgramAccreditations, setStudyProgramAccreditations] = useState<StudyProgramAccreditation[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/accreditation");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setInternationalAccreditations(data.internationalAccreditations);
      setStudyProgramAccreditations(data.studyProgramAccreditations);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memuat data akreditasi");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const rankData = [
    { name: 'UNGGUL', value: studyProgramAccreditations.filter(item => item.rank === 'UNGGUL').length },
    { name: 'BAIK SEKALI', value: studyProgramAccreditations.filter(item => item.rank === 'BAIK_SEKALI').length },
    { name: 'BAIK', value: studyProgramAccreditations.filter(item => item.rank === 'BAIK').length },
    { name: 'TERAKREDITASI', value: studyProgramAccreditations.filter(item => item.rank === 'TERAKREDITASI').length },
    { name: 'A', value: studyProgramAccreditations.filter(item => item.rank === 'A').length },
    { name: 'B', value: studyProgramAccreditations.filter(item => item.rank === 'B').length },
    { name: 'C', value: studyProgramAccreditations.filter(item => item.rank === 'C').length },
  ];

  const levelData = [
    { name: 'D-III', value: studyProgramAccreditations.filter(item => item.level === 'D3').length },
    { name: 'S1', value: studyProgramAccreditations.filter(item => item.level === 'S1').length },
    { name: 'S2', value: studyProgramAccreditations.filter(item => item.level === 'S2').length },
    { name: 'S3', value: studyProgramAccreditations.filter(item => item.level === 'S3').length },
    { name: 'Profesi', value: studyProgramAccreditations.filter(item => item.level === 'PROFESI').length },
    { name: 'Spesialis', value: studyProgramAccreditations.filter(item => item.level === 'SPESIALIS').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manajemen Akreditasi</h1>
        <p className="text-default-600">Kelola data akreditasi internasional dan program studi</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-red-500">
          <CardBody className="p-4">
            <p className="text-sm text-default-600">Akreditasi Internasional</p>
            <p className="text-3xl font-bold text-red-600">{internationalAccreditations.length}</p>
          </CardBody>
        </Card>
        <Card className="border-l-4 border-blue-500">
          <CardBody className="p-4">
            <p className="text-sm text-default-600">Total Program Studi</p>
            <p className="text-3xl font-bold text-blue-600">{studyProgramAccreditations.length}</p>
          </CardBody>
        </Card>
        <Card className="border-l-4 border-green-500">
          <CardBody className="p-4">
            <p className="text-sm text-default-600">Peringkat Unggul</p>
            <p className="text-3xl font-bold text-green-600">
              {studyProgramAccreditations.filter((p) => p.rank === "UNGGUL").length}
            </p>
          </CardBody>
        </Card>
        <Card className="border-l-4 border-yellow-500">
          <CardBody className="p-4">
            <p className="text-sm text-default-600">Peringkat A</p>
            <p className="text-3xl font-bold text-yellow-600">
              {studyProgramAccreditations.filter((p) => p.rank === "A").length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rank Distribution Chart */}
        <Card>
          <CardHeader className="pb-0">
            <h3 className="text-lg font-semibold">Distribusi Peringkat Akreditasi</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rankData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={110} fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#DC2626" name="Jumlah Program Studi" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Level Distribution Chart */}
        <Card>
          <CardHeader className="pb-0">
            <h3 className="text-lg font-semibold">Distribusi Tingkat Program</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs aria-label="Accreditation Tabs" color="danger" size="lg">
        <Tab key="international" title="Akreditasi Internasional">
          <Card className="mt-4">
            <CardBody>
              <div className="space-y-4">
                {internationalAccreditations.map((acc, index) => (
                  <Card key={acc.id} className="border-2">
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Chip color="danger" size="sm" variant="flat">
                              #{index + 1}
                            </Chip>
                            <h3 className="font-semibold">{acc.faculty}</h3>
                          </div>
                          <p className="text-sm text-default-700 mb-2">{acc.studyProgram}</p>
                          <p className="text-xs text-default-500">
                            <span className="font-medium">Lembaga:</span> {acc.accreditationBody}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="programs" title="Program Studi">
          <Card className="mt-4">
            <CardBody>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-default-200">
                      <th className="text-left p-3 text-sm font-semibold">No</th>
                      <th className="text-left p-3 text-sm font-semibold">Program Studi</th>
                      <th className="text-left p-3 text-sm font-semibold">Strata</th>
                      <th className="text-left p-3 text-sm font-semibold">No. SK</th>
                      <th className="text-left p-3 text-sm font-semibold">Tahun</th>
                      <th className="text-left p-3 text-sm font-semibold">Peringkat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studyProgramAccreditations.map((acc, index) => (
                      <tr key={acc.id} className="border-b border-default-100 hover:bg-default-50">
                        <td className="p-3 text-sm">{index + 1}</td>
                        <td className="p-3 text-sm font-medium">{acc.studyProgram}</td>
                        <td className="p-3 text-sm">
                          <Chip size="sm" variant="flat" color="primary">
                            {LEVEL_LABELS[acc.level] || acc.level}
                          </Chip>
                        </td>
                        <td className="p-3 text-sm text-default-600">{acc.skNumber || "-"}</td>
                        <td className="p-3 text-sm">{acc.skYear || "-"}</td>
                        <td className="p-3 text-sm">
                          {acc.rank ? (
                            <Chip
                              size="sm"
                              color={acc.rank === "UNGGUL" || acc.rank === "A" ? "success" : "warning"}
                              variant="flat"
                            >
                              {RANK_LABELS[acc.rank] || acc.rank}
                            </Chip>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
