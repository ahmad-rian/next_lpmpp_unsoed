"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

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

export default function AgendaSection() {
    const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchAgendas();
    }, [currentMonth, currentYear]);

    const fetchAgendas = async () => {
        try {
            const response = await fetch(
                `/api/agenda?month=${currentMonth}&year=${currentYear}&activeOnly=true`
            );
            const data = await response.json();
            setAgendas(data);
        } catch (error) {
            console.error("Error fetching agendas:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString("id-ID", { month: "short" }),
            weekday: date.toLocaleDateString("id-ID", { weekday: "long" }),
        };
    };

    const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
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

    return (
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/10 dark:to-zinc-950">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
                        Agenda Kegiatan
                    </h2>
                    <p className="text-default-600">
                        Jadwal kegiatan dan acara LPMPP UNSOED
                    </p>
                </motion.div>

                {/* Month Navigator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-4 mb-8"
                >
                    <Button
                        isIconOnly
                        variant="flat"
                        color="primary"
                        onPress={handlePrevMonth}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </Button>

                    <div className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-3 rounded-2xl min-w-[200px] text-center">
                        <div className="text-lg font-bold uppercase">
                            {monthNames[currentMonth - 1]}
                        </div>
                        <div className="text-2xl font-bold">{currentYear}</div>
                    </div>

                    <Button
                        isIconOnly
                        variant="flat"
                        color="primary"
                        onPress={handleNextMonth}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Button>
                </motion.div>

                {/* Agenda List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
                        </div>
                    ) : Object.keys(groupedAgendas).length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-4">📅</div>
                            <p className="text-default-500">
                                Tidak ada agenda untuk bulan ini
                            </p>
                        </motion.div>
                    ) : (
                        Object.entries(groupedAgendas).map(([dateKey, items], index) => {
                            const dateInfo = formatDate(items[0].date);

                            return (
                                <motion.div
                                    key={dateKey}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {/* Date Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-xl p-3 text-center min-w-[80px]">
                                                <div className="text-xs uppercase font-semibold">
                                                    {dateInfo.month}
                                                </div>
                                                <div className="text-3xl font-bold">{dateInfo.day}</div>
                                            </div>
                                            <div className="text-xl font-semibold text-default-700 dark:text-default-300">
                                                {dateInfo.weekday}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agenda Items */}
                                    <div className="space-y-3">
                                        {items.map((agenda) => (
                                            <Card
                                                key={agenda.id}
                                                className="border-l-4 hover:shadow-lg transition-shadow"
                                                style={{ borderLeftColor: agenda.color }}
                                            >
                                                <CardBody className="p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Chip
                                                                    size="sm"
                                                                    variant="flat"
                                                                    style={{
                                                                        backgroundColor: `${agenda.color}20`,
                                                                        color: agenda.color,
                                                                    }}
                                                                >
                                                                    {agenda.startTime} - {agenda.endTime}
                                                                </Chip>
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: agenda.color }}
                                                                />
                                                            </div>
                                                            <h3 className="text-lg font-bold text-default-900 dark:text-white mb-2">
                                                                {agenda.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-default-600 dark:text-default-400">
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                </svg>
                                                                <span>{agenda.location}</span>
                                                            </div>
                                                            {agenda.description && (
                                                                <p className="text-sm text-default-500 mt-2">
                                                                    {agenda.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
