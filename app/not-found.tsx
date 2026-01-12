"use client";

import { motion } from "framer-motion";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4">
            <div className="max-w-4xl w-full text-center">
                {/* 404 with Dino Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-8"
                >
                    {/* 404 Text - Pixel Style */}
                    <div className="relative inline-block">
                        {/* Large 404 Numbers */}
                        <div className="flex items-center justify-center gap-4 md:gap-8">
                            {/* First 4 */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="relative"
                            >
                                <svg viewBox="0 0 100 140" className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48">
                                    {/* Pixelated 4 */}
                                    <g fill="#dc2626" className="dark:fill-red-500">
                                        <rect x="60" y="0" width="20" height="20" />
                                        <rect x="60" y="20" width="20" height="20" />
                                        <rect x="50" y="40" width="20" height="20" />
                                        <rect x="40" y="60" width="20" height="20" />
                                        <rect x="30" y="80" width="20" height="20" />
                                        <rect x="0" y="100" width="100" height="20" />
                                        <rect x="60" y="40" width="20" height="20" />
                                        <rect x="60" y="60" width="20" height="20" />
                                        <rect x="60" y="80" width="20" height="20" />
                                        <rect x="60" y="100" width="20" height="20" />
                                        <rect x="60" y="120" width="20" height="20" />
                                    </g>
                                </svg>
                            </motion.div>

                            {/* 0 with Dino */}
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="relative"
                            >
                                <svg viewBox="0 0 120 140" className="w-28 h-32 md:w-36 md:h-40 lg:w-44 lg:h-48">
                                    {/* Pixelated 0 */}
                                    <g fill="#dc2626" className="dark:fill-red-500">
                                        <rect x="20" y="0" width="80" height="20" />
                                        <rect x="0" y="20" width="20" height="100" />
                                        <rect x="100" y="20" width="20" height="100" />
                                        <rect x="20" y="120" width="80" height="20" />
                                    </g>

                                    {/* Dino - Animated */}
                                    <motion.g
                                        animate={{
                                            y: mounted ? [0, -10, 0] : 0,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        fill="#1f2937"
                                        className="dark:fill-zinc-200"
                                    >
                                        {/* Dino Body */}
                                        <rect x="45" y="50" width="10" height="10" />
                                        <rect x="55" y="50" width="10" height="10" />
                                        <rect x="45" y="60" width="10" height="10" />
                                        <rect x="55" y="60" width="10" height="10" />
                                        <rect x="65" y="60" width="10" height="10" />
                                        <rect x="35" y="70" width="10" height="10" />
                                        <rect x="45" y="70" width="10" height="10" />
                                        <rect x="55" y="70" width="10" height="10" />
                                        <rect x="65" y="70" width="10" height="10" />
                                        <rect x="75" y="70" width="10" height="10" />
                                        {/* Legs */}
                                        <rect x="45" y="80" width="10" height="10" />
                                        <rect x="65" y="80" width="10" height="10" />
                                        {/* Eye */}
                                        <rect x="55" y="55" width="5" height="5" fill="#dc2626" className="dark:fill-red-500" />
                                    </motion.g>
                                </svg>
                            </motion.div>

                            {/* Second 4 */}
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="relative"
                            >
                                <svg viewBox="0 0 100 140" className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48">
                                    {/* Pixelated 4 */}
                                    <g fill="#dc2626" className="dark:fill-red-500">
                                        <rect x="60" y="0" width="20" height="20" />
                                        <rect x="60" y="20" width="20" height="20" />
                                        <rect x="50" y="40" width="20" height="20" />
                                        <rect x="40" y="60" width="20" height="20" />
                                        <rect x="30" y="80" width="20" height="20" />
                                        <rect x="0" y="100" width="100" height="20" />
                                        <rect x="60" y="40" width="20" height="20" />
                                        <rect x="60" y="60" width="20" height="20" />
                                        <rect x="60" y="80" width="20" height="20" />
                                        <rect x="60" y="100" width="20" height="20" />
                                        <rect x="60" y="120" width="20" height="20" />
                                    </g>
                                </svg>
                            </motion.div>
                        </div>

                        {/* Ground lines */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="flex justify-center gap-8 mt-4"
                        >
                            <div className="h-1 w-16 bg-gray-800 dark:bg-gray-300 rounded" />
                            <div className="h-1 w-12 bg-gray-800 dark:bg-gray-300 rounded" />
                            <div className="h-1 w-20 bg-gray-800 dark:bg-gray-300 rounded" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Page not found text - Pixel Font Style */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 dark:text-red-400 mb-4 tracking-wider"
                    style={{ fontFamily: 'monospace' }}
                >
                    Page not found
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
                >
                    Halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Button
                        as={Link}
                        href="/"
                        size="lg"
                        color="danger"
                        variant="solid"
                        className="font-semibold"
                        startContent={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        }
                    >
                        Kembali ke Beranda
                    </Button>

                    <Button
                        onClick={() => router.back()}
                        size="lg"
                        color="danger"
                        variant="bordered"
                        className="font-semibold"
                        startContent={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        }
                    >
                        Halaman Sebelumnya
                    </Button>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                    className="mt-12 text-sm text-gray-500 dark:text-gray-500"
                >
                    <p>Error Code: 404 - LPMPP UNSOED</p>
                </motion.div>
            </div>
        </div>
    );
}
