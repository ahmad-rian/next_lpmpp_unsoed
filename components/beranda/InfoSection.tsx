"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
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

const RANK_COLORS = {
    UNGGUL: "#22c55e",
    BAIK_SEKALI: "#3b82f6",
    BAIK: "#eab308",
    A: "#22c55e",
    B: "#3b82f6",
    C: "#eab308",
    TERAKREDITASI: "#6b7280",
};

const LEVEL_LABELS: Record<string, string> = {
    D3: "D-III",
    S1: "S1",
    S2: "S2",
    S3: "S3",
    PROFESI: "Profesi",
    SPESIALIS: "Spesialis",
};

export default function InfoSection() {
    const [criticalAccreditations, setCriticalAccreditations] = useState<Accreditation[]>([]);
    const [rankDistribution, setRankDistribution] = useState<any[]>([]);
    const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchAccreditations();
        fetchAgendas();
    }, [currentMonth, currentYear]);

    const fetchAccreditations = async () => {
        try {
            const response = await fetch("/api/study-program-accreditations");
            const data: Accreditation[] = await response.json();

            // Filter critical accreditations and sort by days remaining (ascending - smallest first)
            const critical = data
                .filter((item) => {
                    const status = calculateAccreditationStatus(
                        item.validUntil ? new Date(item.validUntil) : null
                    );
                    return status.color === "danger";
                })
                .sort((a, b) => {
                    const statusA = calculateAccreditationStatus(
                        a.validUntil ? new Date(a.validUntil) : null
                    );
                    const statusB = calculateAccreditationStatus(
                        b.validUntil ? new Date(b.validUntil) : null
                    );
                    // Sort by days remaining ascending (expired/most urgent first)
                    const daysA = statusA.daysRemaining ?? -Infinity;
                    const daysB = statusB.daysRemaining ?? -Infinity;
                    return daysA - daysB;
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
        }
    };

    const fetchAgendas = async () => {
        try {
            const response = await fetch(
                `/api/agenda?month=${currentMonth}&year=${currentYear}&activeOnly=true`
            );
            const data = await response.json();
            setAgendas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching agendas:", error);
            setAgendas([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString("id-ID", { month: "short" }),
            weekday: date.toLocaleDateString("id-ID", { weekday: "short" }),
            fullDate: date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }),
        };
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Group agendas by date
    const groupedAgendas = agendas.reduce((acc, agenda) => {
        const dateKey = agenda.date.split("T")[0];
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(agenda);
        return acc;
    }, {} as Record<string, Agenda[]>);

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
                        Informasi & Agenda
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-base md:text-lg">
                        Status akreditasi dan jadwal kegiatan LPMPP UNSOED
                    </p>
                </motion.div>

                {/* Content Grid - 3 Columns on Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Critical Accreditations */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                            <CardBody className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                        Perlu Reakreditasi
                                    </h3>
                                    <Chip color="danger" variant="solid" size="sm" className="font-bold">
                                        {criticalAccreditations.length}
                                    </Chip>
                                </div>

                                {criticalAccreditations.length === 0 ? (
                                    <div className="text-center py-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <img
                                            src="/assets/images/ceklis.png"
                                            alt="Verified"
                                            className="w-12 h-12 object-contain mx-auto mb-2"
                                        />
                                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                            Semua prodi status baik
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                                        {criticalAccreditations.slice(0, 10).map((item) => {
                                            const status = calculateAccreditationStatus(
                                                item.validUntil ? new Date(item.validUntil) : null
                                            );

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-2.5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 rounded-lg hover:shadow-md transition-all"
                                                >
                                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1.5 line-clamp-1">
                                                        {item.studyProgram}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1 mb-1.5">
                                                        <Chip size="sm" variant="flat" color="primary" className="text-xs h-5">
                                                            {LEVEL_LABELS[item.level] || item.level}
                                                        </Chip>
                                                        <Chip size="sm" variant="flat" color="success" className="text-xs h-5">
                                                            {item.rank}
                                                        </Chip>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        {item.validUntil && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                📅 {formatDateID(item.validUntil)}
                                                            </p>
                                                        )}
                                                        <Chip color="danger" variant="solid" size="sm" className="text-xs h-5 ml-auto">
                                                            {status.message}
                                                        </Chip>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </motion.div>

                    {/* Column 2: Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                            <CardBody className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Distribusi Peringkat
                                </h3>

                                {rankDistribution.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <p className="text-sm">Belum ada data</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-3 mb-4">
                                            <ResponsiveContainer width="100%" height={200}>
                                                <PieChart>
                                                    <Pie
                                                        data={rankDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={true}
                                                        label={({ value }) => {
                                                            const total = rankDistribution.reduce((sum, item) => sum + item.value, 0);
                                                            const percentage = (((value as number) / total) * 100).toFixed(1);
                                                            return `${percentage}%`;
                                                        }}
                                                        outerRadius={60}
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
                                                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                            border: "none",
                                                            borderRadius: "8px",
                                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                        }}
                                                        formatter={(value) => {
                                                            const numValue = typeof value === 'number' ? value : 0;
                                                            const total = rankDistribution.reduce((sum, item) => sum + item.value, 0);
                                                            const percentage = ((numValue / total) * 100).toFixed(1);
                                                            return [`${numValue} Prodi (${percentage}%)`, "Jumlah"];
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {rankDistribution.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="p-2 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700"
                                                >
                                                    <div className="flex items-start gap-1 mb-1 min-h-[2rem]">
                                                        <div
                                                            className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight break-words">
                                                            {item.name.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                                        {item.value}
                                                    </p>
                                                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                                        Prodi
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </motion.div>

                    {/* Column 3: Agenda */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                            <CardBody className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    Agenda Kegiatan
                                </h3>

                                {/* Month Navigator */}
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Button isIconOnly size="sm" variant="flat" color="primary" onPress={handlePrevMonth}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </Button>

                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-lg text-center shadow-md min-w-[120px]">
                                        <div className="text-xs font-semibold uppercase">
                                            {monthNames[currentMonth - 1]}
                                        </div>
                                        <div className="text-lg font-bold">{currentYear}</div>
                                    </div>

                                    <Button isIconOnly size="sm" variant="flat" color="primary" onPress={handleNextMonth}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Button>
                                </div>

                                {/* Agenda List */}
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.keys(groupedAgendas).length === 0 ? (
                                        <div className="text-center py-8 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                            <div className="text-4xl mb-2">📅</div>
                                            <p className="text-sm text-default-500">Tidak ada agenda</p>
                                        </div>
                                    ) : (
                                        Object.entries(groupedAgendas).slice(0, 5).map(([dateKey, items]) => {
                                            const dateInfo = formatDate(items[0].date);

                                            return (
                                                <div key={dateKey} className="space-y-2">
                                                    {/* Date Header */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-1.5 text-center min-w-[50px]">
                                                            <div className="text-xs uppercase font-semibold">{dateInfo.month}</div>
                                                            <div className="text-xl font-bold leading-none">{dateInfo.day}</div>
                                                        </div>
                                                        <div className="text-xs font-semibold text-default-600 dark:text-default-400">
                                                            {dateInfo.weekday}
                                                        </div>
                                                    </div>

                                                    {/* Agenda Items */}
                                                    {items.map((agenda) => (
                                                        <div
                                                            key={agenda.id}
                                                            className="p-3 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-lg border-l-4"
                                                            style={{ borderLeftColor: agenda.color }}
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <div
                                                                    className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                                                                    style={{ backgroundColor: agenda.color }}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <Chip
                                                                        size="sm"
                                                                        variant="flat"
                                                                        style={{
                                                                            backgroundColor: `${agenda.color}20`,
                                                                            color: agenda.color,
                                                                        }}
                                                                        className="text-xs mb-1"
                                                                    >
                                                                        {agenda.startTime} - {agenda.endTime}
                                                                    </Chip>
                                                                    <h4 className="font-bold text-xs text-gray-900 dark:text-white mb-1 line-clamp-2">
                                                                        {agenda.title}
                                                                    </h4>
                                                                    <div className="flex items-center gap-1 text-xs text-default-600 dark:text-default-400">
                                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        </svg>
                                                                        <span className="truncate">{agenda.location}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
        </section>
    );
}
