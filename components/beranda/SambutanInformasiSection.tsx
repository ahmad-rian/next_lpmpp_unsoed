"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Leadership {
    id: string;
    name: string;
    title?: string | null;
    photo?: string | null;
    position: "HEAD" | "SECRETARY" | string;
}

interface SiteConfig {
    headMessage?: string | null;
    informasiLayanan?: string | null;
    gambarInformasi?: string | null;
}

export default function SambutanInformasiSection() {
    const [headLeader, setHeadLeader] = useState<Leadership | null>(null);
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch leadership
            const leadershipRes = await fetch("/api/leadership");
            if (leadershipRes.ok) {
                const data: Leadership[] = await leadershipRes.json();
                const head = Array.isArray(data)
                    ? data.find((item) => item.position === "HEAD") || null
                    : null;
                setHeadLeader(head);
            }

            // Fetch site config
            const configRes = await fetch("/api/site-config");
            if (configRes.ok) {
                const configData = await configRes.json();
                setConfig(configData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="h-64 rounded-3xl bg-default-200 animate-pulse" />
                        <div className="h-64 rounded-3xl bg-default-200 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full py-16 md:py-24 relative overflow-hidden">
            {/* Batik Pattern Background */}
            <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: "80px 80px",
                    }}
                />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-200/10 dark:bg-red-800/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/10 dark:bg-orange-800/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Sambutan Kepala Lembaga */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Section Title */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
                                Sambutan Kepala Lembaga
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto rounded-full" />
                        </motion.div>

                        {/* Content Card */}
                        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/30 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 md:p-12">
                                {/* Foto Kepala - Left Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="md:col-span-4 flex justify-center md:justify-start"
                                >
                                    {headLeader?.photo ? (
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                                            <img
                                                src={headLeader.photo}
                                                alt={headLeader.name}
                                                className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover shadow-xl ring-4 ring-white dark:ring-zinc-800"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950/30 dark:to-orange-950/30 flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-zinc-800">
                                            <svg className="w-20 h-20 text-red-400 dark:text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Nama & Pesan Kepala - Right Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="md:col-span-8 space-y-6"
                                >
                                    {headLeader && (
                                        <div className="space-y-2">
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                                {headLeader.name}
                                            </h3>
                                            {headLeader.title && (
                                                <p className="text-base md:text-lg text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    {headLeader.title}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="h-px bg-gradient-to-r from-red-600/50 via-red-600/20 to-transparent" />

                                    {config?.headMessage ? (
                                        <div className="relative">
                                            <svg className="absolute -top-2 -left-2 w-8 h-8 text-red-200 dark:text-red-900/50" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                            </svg>
                                            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 px-6 italic">
                                                {config.headMessage}
                                            </p>
                                            <svg className="absolute -bottom-2 -right-2 w-8 h-8 text-red-200 dark:text-red-900/50 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-6">
                                            Pesan Kepala Lembaga belum dikonfigurasi. Silakan atur di Admin → Site Config.
                                        </p>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Informasi dan Layanan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Content Card */}
                        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 dark:border-orange-900/30 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 md:p-12">
                                {/* Teks Informasi - Left Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="md:col-span-7 space-y-6 order-2 md:order-1"
                                >
                                    <div className="space-y-3">
                                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                                            Informasi dan Layanan
                                        </h2>
                                        <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full" />
                                    </div>

                                    {config?.informasiLayanan ? (
                                        <div className="space-y-4">
                                            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                                                {config.informasiLayanan}
                                            </p>

                                            {/* Feature Icons */}
                                            <div className="grid grid-cols-2 gap-4 pt-4">
                                                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30">
                                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Terpercaya</h4>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">Layanan berkualitas</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
                                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                                    </svg>
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Cepat</h4>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">Respon optimal</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            Informasi layanan belum dikonfigurasi. Silakan atur di Admin → Site Config.
                                        </p>
                                    )}
                                </motion.div>

                                {/* Gambar Informasi - Right Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="md:col-span-5 order-1 md:order-2"
                                >
                                    {config?.gambarInformasi ? (
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                                            <img
                                                src={config.gambarInformasi}
                                                alt="Informasi dan Layanan"
                                                className="relative w-full rounded-3xl shadow-xl ring-4 ring-white dark:ring-zinc-800"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video w-full rounded-3xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 flex flex-col items-center justify-center shadow-xl ring-4 ring-white dark:ring-zinc-800 gap-3">
                                            <svg className="w-16 h-16 text-orange-400 dark:text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Gambar belum tersedia</p>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
