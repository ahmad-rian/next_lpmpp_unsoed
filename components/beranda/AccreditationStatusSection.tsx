"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { calculateAccreditationStatus, formatDateID } from "@/lib/accreditation-utils";

interface Accreditation {
    id: string;
    studyProgram: string;
    level: string;
    rank: string;
    validFrom: string | null;
    validUntil: string | null;
    skNumber: string | null;
    skYear: number | null;
}

const RANK_COLORS = {
    UNGGUL: "#22c55e",
    BAIK_SEKALI: "#3b82f6",
    BAIK: "#eab308",
    A: "#22c55e",
    B: "#3b82f6",
    C: "#eab308",
    TERAKREDITASI_SEMENTARA: "#6b7280",
};

const LEVEL_LABELS: Record<string, string> = {
    D3: "D-III",
    S1: "S1",
    S2: "S2",
    S3: "S3",
    PROFESI: "Profesi",
    SPESIALIS: "Spesialis",
};

export default function AccreditationStatusSection() {
    const [criticalAccreditations, setCriticalAccreditations] = useState<Accreditation[]>([]);
    const [rankDistribution, setRankDistribution] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccreditations();
    }, []);

    const fetchAccreditations = async () => {
        try {
            const response = await fetch("/api/study-program-accreditations");
            const data: Accreditation[] = await response.json();

            // Filter critical accreditations (red status - < 1 year or expired)
            const critical = data.filter((item) => {
                const status = calculateAccreditationStatus(
                    item.validUntil ? new Date(item.validUntil) : null
                );
                return status.color === "danger"; // Red status
            });

            setCriticalAccreditations(critical);

            // Calculate rank distribution for pie chart
            const rankCounts: Record<string, number> = {};
            data.forEach((item) => {
                if (item.rank) {
                    rankCounts[item.rank] = (rankCounts[item.rank] || 0) + 1;
                }
            });

            const chartData = Object.entries(rankCounts).map(([rank, count]) => ({
                name: rank,
                value: count,
                color: RANK_COLORS[rank as keyof typeof RANK_COLORS] || "#6b7280",
            }));

            setRankDistribution(chartData);
        } catch (error) {
            console.error("Error fetching accreditations:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <section className="relative py-16 md:py-20 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/10 dark:via-zinc-900 dark:to-orange-950/10" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-200/20 dark:bg-red-800/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 dark:bg-orange-800/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-4">
                        Status Akreditasi Nasional
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-base md:text-lg">
                        Informasi tenggat waktu berakhirnya akreditasi program studi yang memerlukan perhatian segera
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Critical Accreditations List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                            <CardBody className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        Perlu Reakreditasi Segera
                                    </h3>
                                    <Chip
                                        color="danger"
                                        variant="solid"
                                        size="lg"
                                        className="font-bold text-base px-4"
                                    >
                                        {criticalAccreditations.length} Prodi
                                    </Chip>
                                </div>

                                {criticalAccreditations.length === 0 ? (
                                    <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
                                        {/* Custom checkmark icon */}
                                        <div className="flex items-center justify-center mb-4">
                                            <img
                                                src="/assets/images/ceklis.png"
                                                alt="Verified"
                                                className="w-20 h-20 object-contain"
                                            />
                                        </div>
                                        <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                                            Semua program studi dalam status baik
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                        {criticalAccreditations.map((item, index) => {
                                            const status = calculateAccreditationStatus(
                                                item.validUntil ? new Date(item.validUntil) : null
                                            );

                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="p-5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl hover:shadow-lg transition-all duration-300"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2 truncate">
                                                                {item.studyProgram}
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                <Chip size="sm" variant="flat" color="primary" className="font-medium">
                                                                    {LEVEL_LABELS[item.level] || item.level}
                                                                </Chip>
                                                                <Chip size="sm" variant="flat" color="success" className="font-medium">
                                                                    {item.rank}
                                                                </Chip>
                                                            </div>
                                                            {item.validUntil && (
                                                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                                    📅 Berakhir: {formatDateID(item.validUntil)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Chip
                                                            color="danger"
                                                            variant="solid"
                                                            size="md"
                                                            className="font-bold flex-shrink-0 px-3"
                                                        >
                                                            {status.message}
                                                        </Chip>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </motion.div>

                    {/* Pie Chart - Rank Distribution */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                            <CardBody className="p-6 md:p-8">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Distribusi Peringkat Akreditasi
                                </h3>

                                {rankDistribution.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        <p className="text-lg">Belum ada data akreditasi</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-4 mb-6">
                                            <ResponsiveContainer width="100%" height={320}>
                                                <PieChart>
                                                    <Pie
                                                        data={rankDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }: any) =>
                                                            `${name} (${(percent * 100).toFixed(0)}%)`
                                                        }
                                                        outerRadius={110}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        strokeWidth={2}
                                                        stroke="#fff"
                                                    >
                                                        {rankDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {rankDistribution.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div
                                                            className="w-4 h-4 rounded-full shadow-sm"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
                                                        {item.value}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                        Program Studi
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.5);
        }
      `}</style>
        </section >
    );
}
