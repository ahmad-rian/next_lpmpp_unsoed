"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { SearchIcon } from "@/components/icons";

// Types
interface Document {
    id: number;
    title: string;
    description: string | null;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    type: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export default function DokumenSpmiPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch documents
    useEffect(() => {
        async function fetchDocuments() {
            try {
                const response = await fetch("/api/documents?type=SPMI");
                if (response.ok) {
                    const data = await response.json();
                    setDocuments(data);
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDocuments();
    }, []);

    // Filter documents based on search query
    const filteredDocuments = useMemo(() => {
        if (!searchQuery.trim()) return documents;

        const query = searchQuery.toLowerCase();
        return documents.filter(doc =>
            doc.title.toLowerCase().includes(query) ||
            doc.description?.toLowerCase().includes(query) ||
            doc.fileName.toLowerCase().includes(query)
        );
    }, [documents, searchQuery]);

    // Format file size utility function
    function formatFileSize(bytes: number): string {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }

    if (loading) {
        return (
            <div className="w-full px-4 pb-12">
                <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
                        Dokumen SPMI
                    </h1>
                    <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
                        Sistem Penjaminan Mutu Internal
                    </p>
                </div>
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-500">Memuat dokumen...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 pb-12">
            {/* Hero Header */}
            <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
                    Dokumen SPMI
                </h1>
                <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
                    Sistem Penjaminan Mutu Internal
                </p>
                <p className="text-sm md:text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto px-4">
                    Universitas Jenderal Soedirman
                </p>
                <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto">
                {/* Search Bar */}
                <div className="mb-6">
                    <Input
                        isClearable
                        placeholder="Cari dokumen berdasarkan judul, deskripsi, atau nama file..."
                        startContent={<SearchIcon className="text-gray-400" />}
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        onClear={() => setSearchQuery("")}
                        className="w-full"
                        classNames={{
                            input: "text-sm",
                            inputWrapper: "h-12 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 focus-within:!border-red-500 dark:focus-within:!border-red-400",
                        }}
                    />
                </div>

                {/* Results Count */}
                {searchQuery && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ditemukan {filteredDocuments.length} dokumen dari {documents.length} total dokumen
                        </p>
                    </div>
                )}

                {filteredDocuments.length > 0 ? (
                    <div className="space-y-4">
                        {filteredDocuments.map((doc, index) => (
                            <Card key={doc.id} className="shadow-md hover:shadow-lg transition-shadow">
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20">
                                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {doc.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Chip size="sm" variant="flat" color="primary">
                                                            Dokumen SPMI
                                                        </Chip>
                                                        {doc.fileSize && (
                                                            <span className="text-xs text-gray-500">
                                                                {formatFileSize(doc.fileSize)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {doc.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                                                    {doc.description}
                                                </p>
                                            )}

                                            <div className="mt-4">
                                                <Link
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>
                                                    Unduh Dokumen
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-xs text-gray-500">
                                                {doc.fileName}
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="shadow-md">
                        <CardBody className="p-8 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    {searchQuery ? (
                                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {searchQuery ? "Tidak Ada Hasil" : "Belum Ada Dokumen"}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchQuery
                                            ? `Tidak ditemukan dokumen yang sesuai dengan pencarian "${searchQuery}".`
                                            : "Dokumen SPMI belum tersedia saat ini."
                                        }
                                    </p>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="mt-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                        >
                                            Hapus pencarian
                                        </button>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
}
