"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SiteConfig {
    gambarStaff?: string | null;
    gambarTambahan?: string | null;
}

export default function TenagaGambarSection() {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch("/api/site-config");
            if (response.ok) {
                const data = await response.json();
                setConfig(data);
            }
        } catch (error) {
            console.error("Error fetching config:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full py-16">
                <div className="container mx-auto px-4">
                    <div className="h-96 rounded-3xl bg-default-200 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <section className="w-full py-16 md:py-24 relative overflow-hidden">
            {/* Pure Batik Jawa Background - Kawung Pattern */}
            <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.12]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B4513' fill-opacity='1'%3E%3Cpath d='M60 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30-16.569 0-30-13.431-30-30C30 13.431 43.431 0 60 0zm0 10c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20zm0 60c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30zm0 10c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20zM0 60c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30v-60zm10 10c0 11.046 8.954 20 20 20v-40c-11.046 0-20 8.954-20 20zm110-10c-16.569 0-30 13.431-30 30 0 16.569 13.431 30 30 30V60zm-10 10c0 11.046-8.954 20-20 20V50c11.046 0 20 8.954 20 20zM0 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30V0zm10 10c0 11.046 8.954 20 20 20V10C18.954 10 10 18.954 10 30V10zm110-10c-16.569 0-30 13.431-30 30 0 16.569 13.431 30 30 30V0zm-10 10c0 11.046-8.954 20-20 20V10c11.046 0 20 8.954 20 20V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: "120px 120px",
                    }}
                />
            </div>

            {/* Decorative Batik Border Elements */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-800/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-800/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10 space-y-16 md:space-y-24">
                {/* Tenaga Kependidikan */}
                {config?.gambarStaff && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-7xl mx-auto"
                    >
                        {/* Title with Batik Ornament */}
                        <div className="text-center mb-8 md:mb-12">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-amber-800" />
                                <svg className="w-6 h-6 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                                </svg>
                                <h2 className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-600">
                                    Tenaga Kependidikan
                                </h2>
                                <svg className="w-6 h-6 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                                </svg>
                                <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-amber-800" />
                            </div>
                            <p className="text-sm md:text-base text-default-600">
                                Tim profesional LPMPP UNSOED
                            </p>
                        </div>

                        {/* Image with Batik Frame */}
                        <div className="relative group">
                            {/* Batik Corner Ornaments */}
                            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-amber-800/30 rounded-tl-2xl" />
                            <div className="absolute -top-4 -right-4 w-16 h-16 border-t-4 border-r-4 border-amber-800/30 rounded-tr-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-4 border-l-4 border-amber-800/30 rounded-bl-2xl" />
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-amber-800/30 rounded-br-2xl" />

                            {/* Main Image Container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-900/10 dark:border-amber-800/20 bg-white dark:bg-zinc-900">
                                <img
                                    src={config.gambarStaff}
                                    alt="Tenaga Kependidikan LPMPP UNSOED"
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                    loading="lazy"
                                />
                                {/* Batik Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Gambar Tambahan */}
                {config?.gambarTambahan && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-7xl mx-auto"
                    >
                        {/* Title with Batik Ornament */}
                        <div className="text-center mb-8 md:mb-12">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-amber-800" />
                                <svg className="w-6 h-6 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="M15.5 11L12 15l-2.5-3L6 16h12z" />
                                </svg>
                                <h2 className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-600">
                                    Informasi Tambahan
                                </h2>
                                <svg className="w-6 h-6 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="M15.5 11L12 15l-2.5-3L6 16h12z" />
                                </svg>
                                <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-amber-800" />
                            </div>
                        </div>

                        {/* Image with Batik Frame */}
                        <div className="relative group">
                            {/* Batik Corner Ornaments - Different Style */}
                            <div className="absolute -top-3 -left-3 w-12 h-12">
                                <svg viewBox="0 0 40 40" className="w-full h-full text-amber-800/30" fill="currentColor">
                                    <circle cx="5" cy="5" r="3" />
                                    <circle cx="15" cy="5" r="2" />
                                    <circle cx="5" cy="15" r="2" />
                                    <circle cx="25" cy="5" r="1.5" />
                                    <circle cx="5" cy="25" r="1.5" />
                                </svg>
                            </div>
                            <div className="absolute -top-3 -right-3 w-12 h-12 rotate-90">
                                <svg viewBox="0 0 40 40" className="w-full h-full text-amber-800/30" fill="currentColor">
                                    <circle cx="5" cy="5" r="3" />
                                    <circle cx="15" cy="5" r="2" />
                                    <circle cx="5" cy="15" r="2" />
                                    <circle cx="25" cy="5" r="1.5" />
                                    <circle cx="5" cy="25" r="1.5" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-3 -left-3 w-12 h-12 -rotate-90">
                                <svg viewBox="0 0 40 40" className="w-full h-full text-amber-800/30" fill="currentColor">
                                    <circle cx="5" cy="5" r="3" />
                                    <circle cx="15" cy="5" r="2" />
                                    <circle cx="5" cy="15" r="2" />
                                    <circle cx="25" cy="5" r="1.5" />
                                    <circle cx="5" cy="25" r="1.5" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-12 h-12 rotate-180">
                                <svg viewBox="0 0 40 40" className="w-full h-full text-amber-800/30" fill="currentColor">
                                    <circle cx="5" cy="5" r="3" />
                                    <circle cx="15" cy="5" r="2" />
                                    <circle cx="5" cy="15" r="2" />
                                    <circle cx="25" cy="5" r="1.5" />
                                    <circle cx="5" cy="25" r="1.5" />
                                </svg>
                            </div>

                            {/* Main Image Container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-900/10 dark:border-amber-800/20 bg-white dark:bg-zinc-900">
                                <img
                                    src={config.gambarTambahan}
                                    alt="Informasi Tambahan LPMPP UNSOED"
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                    loading="lazy"
                                />
                                {/* Batik Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
