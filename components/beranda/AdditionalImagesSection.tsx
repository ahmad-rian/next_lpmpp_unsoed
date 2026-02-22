"use client";

import { motion } from "framer-motion";

interface AdditionalImagesSectionProps {
    gambarSlogan?: string;
    gambarPartner?: string;
    gambarTambahan?: string;
}

export default function AdditionalImagesSection({
    gambarSlogan,
    gambarPartner,
    gambarTambahan,
}: AdditionalImagesSectionProps) {
    // Jika tidak ada gambar sama sekali, jangan render section
    if (!gambarSlogan && !gambarPartner && !gambarTambahan) {
        return null;
    }

    return (
        <section className="relative w-full overflow-hidden">
            {/* Background dengan Wave Gradient Natural */}
            <div className="absolute inset-0 z-0">
                {/* Base gradient yang halus */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/20 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />

                {/* Wave SVG - Top (Natural) */}
                <svg
                    className="absolute top-0 left-0 w-full h-20 md:h-28 lg:h-36"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        className="fill-red-50/60 dark:fill-red-950/20"
                        d="M0,128L60,138.7C120,149,240,171,360,165.3C480,160,600,128,720,128C840,128,960,160,1080,165.3C1200,171,1320,149,1380,138.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
                    />
                </svg>

                {/* Wave SVG - Bottom (Natural) */}
                <svg
                    className="absolute bottom-0 left-0 w-full h-20 md:h-28 lg:h-36 rotate-180"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        className="fill-red-50/60 dark:fill-red-950/20"
                        d="M0,160L60,154.7C120,149,240,139,360,144C480,149,600,171,720,176C840,181,960,171,1080,154.7C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
                    />
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full py-12 md:py-16 lg:py-20 space-y-8 md:space-y-12 lg:space-y-16">
                {gambarSlogan && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full px-4 md:px-8 lg:px-12 xl:px-16"
                    >
                        <div className="max-w-7xl mx-auto">
                            <img
                                src={gambarSlogan}
                                alt="Visi dan Misi LPMPP UNSOED"
                                className="w-full h-auto object-cover rounded-xl md:rounded-2xl"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                )}

                {gambarPartner && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full px-4 md:px-8 lg:px-12 xl:px-16"
                    >
                        <div className="max-w-7xl mx-auto">
                            <img
                                src={gambarPartner}
                                alt="Mitra LPMPP UNSOED"
                                className="w-full h-auto object-cover rounded-xl md:rounded-2xl"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                )}

                {gambarTambahan && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full px-4 md:px-8 lg:px-12 xl:px-16"
                    >
                        <div className="max-w-7xl mx-auto">
                            <img
                                src={gambarTambahan}
                                alt="Informasi Tambahan LPMPP UNSOED"
                                className="w-full h-auto object-cover rounded-xl md:rounded-2xl"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
