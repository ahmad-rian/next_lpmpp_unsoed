"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

interface Expertise {
    id: string;
    name: string;
    type: string;
    order: number;
    isActive: boolean;
}

export default function AsesorSerdosPage() {
    const [data, setData] = useState<Expertise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("/api/expertise?type=ASESOR_SERDOS");
            const result = await response.json();
            setData(result.filter((item: Expertise) => item.isActive));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on search term
    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-3">
                    Asesor Serdos
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Daftar Asesor Sertifikasi Dosen LPMPP UNSOED
                </p>
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 max-w-xl mx-auto"
            >
                <Input
                    placeholder="Cari berdasarkan nama..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    classNames={{
                        input: "text-sm",
                        inputWrapper: "h-12",
                    }}
                    size="lg"
                />
            </motion.div>

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                Menampilkan {currentData.length} dari {filteredData.length} asesor
            </div>

            {/* Grid */}
            {currentData.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm
                            ? "Tidak ada data yang sesuai dengan pencarian"
                            : "Belum ada data asesor serdos"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                        {currentData.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow h-full">
                                    <CardBody className="p-4">
                                        <div className="flex items-start justify-between mb-3 gap-2">
                                            <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 flex-1">
                                                {item.name}
                                            </h3>
                                            <Chip size="sm" color="success" variant="flat" className="flex-shrink-0">
                                                Aktif
                                            </Chip>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                total={totalPages}
                                page={currentPage}
                                onChange={setCurrentPage}
                                showControls
                                color="danger"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
