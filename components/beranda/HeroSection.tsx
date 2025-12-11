"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PixelBlast from "./PixelBlast";
import { ImagesSlider } from "@/components/ui/images-slider";

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    motto?: string;
    carouselImages?: string[];
}

export default function HeroSection({
    title = "LPMPP UNSOED",
    subtitle = "Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran",
    description = "Universitas Jenderal Soedirman",
    motto = "Unggul dalam Mutu, Inovatif dalam Pembelajaran",
    carouselImages = [],
}: HeroSectionProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* PixelBlast Background */}
            <div className="absolute inset-0 z-0">
                <PixelBlast
                    variant="circle"
                    pixelSize={6}
                    color="#dc2626"
                    patternScale={3}
                    patternDensity={1.2}
                    speed={0.6}
                    edgeFade={0.25}
                    transparent
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80 dark:from-zinc-950/80 dark:via-zinc-950/60 dark:to-zinc-950/80 z-[1]" />

            {/* Wayang Kiri - Paling Depan */}
            <motion.div
                initial={{ opacity: 0, x: -100, rotate: 45 }}
                animate={{
                    opacity: mounted ? 0.7 : 0,
                    x: 0,
                    rotate: 45,
                }}
                transition={{
                    opacity: { duration: 1 },
                    x: { duration: 1 },
                    rotate: { duration: 1 },
                }}
                className="absolute left-2 md:left-4 lg:left-8 bottom-16 sm:bottom-20 md:bottom-8 w-24 sm:w-32 md:w-40 lg:w-48 h-auto z-50"
                style={{ filter: "drop-shadow(0 10px 30px rgba(220, 38, 38, 0.5))" }}
            >
                <img
                    src="/assets/images/wayang.webp"
                    alt="Wayang Decoration Left"
                    className="w-full h-auto"
                />
            </motion.div>

            {/* Wayang Kanan - Paling Depan */}
            <motion.div
                initial={{ opacity: 0, x: 100, rotate: -45 }}
                animate={{
                    opacity: mounted ? 0.7 : 0,
                    x: 0,
                    rotate: -45,
                }}
                transition={{
                    opacity: { duration: 1 },
                    x: { duration: 1 },
                    rotate: { duration: 1 },
                }}
                className="absolute right-2 md:right-4 lg:right-8 bottom-16 sm:bottom-20 md:bottom-8 w-24 sm:w-32 md:w-40 lg:w-48 h-auto z-50"
                style={{ filter: "drop-shadow(0 10px 30px rgba(220, 38, 38, 0.5))" }}
            >
                <img
                    src="/assets/images/wayang.webp"
                    alt="Wayang Decoration Right"
                    className="w-full h-auto"
                />
            </motion.div>

            {/* Content Container */}
            <div className="relative z-10 px-4 h-full flex flex-col items-center justify-start pt-8 md:pt-12">
                <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4 md:gap-6">

                    {/* Image Carousel di Tengah Atas - Lebih Pendek */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full max-w-3xl"
                    >
                        <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
                            {carouselImages && carouselImages.length > 0 ? (
                                <ImagesSlider
                                    images={carouselImages}
                                    autoplay={true}
                                    direction="up"
                                    className="h-full w-full"
                                    overlay={false}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950 dark:to-red-900 flex items-center justify-center">
                                    <svg
                                        className="w-20 h-20 text-red-600 dark:text-red-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            )}

                            {/* Decorative corner accents */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-red-600 dark:border-red-400 rounded-tl-2xl" />
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-red-600 dark:border-red-400 rounded-br-2xl" />
                        </div>
                    </motion.div>

                    {/* Text Content di Bawah - Compact */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center space-y-3 max-w-3xl"
                    >
                        {/* Welcome Text */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="space-y-1"
                        >
                            <p className="text-base md:text-lg lg:text-xl text-red-600 dark:text-red-400 font-semibold tracking-wide">
                                Selamat Datang di
                            </p>
                            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-red-600 dark:text-red-400 leading-tight">
                                {title}
                            </h1>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-white leading-relaxed font-medium px-4"
                        >
                            {subtitle}
                        </motion.p>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300"
                        >
                            {description}
                        </motion.p>

                        {/* Motto Badge */}
                        {motto && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1, duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl shadow-lg backdrop-blur-sm max-w-full"
                            >
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-xs sm:text-sm md:text-base lg:text-lg text-red-700 dark:text-red-300 font-semibold italic break-words">
                                    "{motto}"
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
