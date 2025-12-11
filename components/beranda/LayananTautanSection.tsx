"use client";

import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";

interface SiteConfig {
    layananKami?: string | null;
    pelatihan?: string | null;
    pembelajaran?: string | null;
    penjaminanMutu?: string | null;
}

interface TautanLayananItem {
    id: string;
    nama: string;
    gambar?: string | null;
    link: string;
    order: number;
    isActive: boolean;
}

interface LayananTautanSectionProps {
    config: SiteConfig | null;
    serviceLinks: TautanLayananItem[];
    loading?: boolean;
}

export default function LayananTautanSection({
    config,
    serviceLinks,
    loading = false,
}: LayananTautanSectionProps) {
    return (
        <>
            {/* Layanan Kami */}
            <div className="w-full py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12 space-y-3"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
                            Layanan Kami
                        </h2>
                        {config?.layananKami && (
                            <p className="text-base md:text-lg text-default-600 max-w-3xl mx-auto">
                                {config.layananKami}
                            </p>
                        )}
                    </motion.div>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pelatihan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Card
                                isPressable
                                className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10"
                            >
                                <CardBody className="p-6 gap-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg
                                            className="w-7 h-7 text-red-600 dark:text-red-500 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                                            />
                                        </svg>
                                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                                            Pelatihan
                                        </h3>
                                    </div>
                                    <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                                        {config?.pelatihan ||
                                            "Konten belum dikonfigurasi di Admin → Site Config (pelatihan)."}
                                    </p>
                                </CardBody>
                            </Card>
                        </motion.div>

                        {/* Pembelajaran */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card
                                isPressable
                                className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10"
                            >
                                <CardBody className="p-6 gap-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg
                                            className="w-7 h-7 text-red-600 dark:text-red-500 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                            />
                                        </svg>
                                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                                            Pembelajaran
                                        </h3>
                                    </div>
                                    <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                                        {config?.pembelajaran ||
                                            "Konten belum dikonfigurasi di Admin → Site Config (pembelajaran)."}
                                    </p>
                                </CardBody>
                            </Card>
                        </motion.div>

                        {/* Penjaminan Mutu */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card
                                isPressable
                                className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10"
                            >
                                <CardBody className="p-6 gap-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg
                                            className="w-7 h-7 text-red-600 dark:text-red-500 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                                            />
                                        </svg>
                                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                                            Penjaminan Mutu
                                        </h3>
                                    </div>
                                    <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                                        {config?.penjaminanMutu ||
                                            "Konten belum dikonfigurasi di Admin → Site Config (penjaminanMutu)."}
                                    </p>
                                </CardBody>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Tautan Layanan */}
            <div className="w-full py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12 space-y-3"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
                            Tautan Layanan
                        </h2>
                        <p className="text-sm md:text-base text-default-600">
                            Akses cepat ke berbagai layanan digital LPMPP UNSOED
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-[4/3] rounded-xl bg-default-200 animate-pulse"
                                    />
                                ))}
                            </div>
                        </div>
                    ) : serviceLinks.length > 0 ? (
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {serviceLinks.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.link}
                                            target={item.link.startsWith("http") ? "_blank" : undefined}
                                            rel={
                                                item.link.startsWith("http")
                                                    ? "noopener noreferrer"
                                                    : undefined
                                            }
                                            className="block group"
                                        >
                                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-default-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                                {item.gambar ? (
                                                    <Image
                                                        src={item.gambar}
                                                        alt={item.nama}
                                                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                                        removeWrapper
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                                                        <svg
                                                            className="w-12 h-12 text-default-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                                            />
                                                        </svg>
                                                        <span className="text-xs text-default-500 text-center">
                                                            {item.nama}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-default-100 mb-4">
                                <svg
                                    className="w-8 h-8 text-default-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm text-default-500">
                                Belum ada tautan layanan aktif
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
