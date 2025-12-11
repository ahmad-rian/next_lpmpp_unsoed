"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

// Data Buku (public)
interface DataBuku {
    id: string;
    judul: string;
    deskripsi?: string | null;
    gambar?: string | null;
    link?: string | null;
    order?: number;
    isActive?: boolean;
    createdAt?: string;
}

// Berita (public)
interface NewsItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string | null;
    author: string;
    publishedAt: string;
    viewCount: number;
}

// Galeri (public)
interface GalleryItem {
    id: string;
    gambar: string;
    judul?: string | null;
}

export default function BukuBeritaGaleriSection() {
    const [books, setBooks] = useState<DataBuku[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(true);

    useEffect(() => {
        fetchBooks();
        fetchNewsList();
        fetchGalleryList();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch("/api/books");
            if (!res.ok) throw new Error("Failed to fetch books");
            const data: DataBuku[] = await res.json();
            const active = Array.isArray(data) ? data.filter((b) => b.isActive !== false) : [];
            setBooks(active.slice(0, 3));
        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
        } finally {
            setLoadingBooks(false);
        }
    };

    const fetchNewsList = async () => {
        try {
            const res = await fetch("/api/news?published=true&limit=3");
            if (!res.ok) throw new Error("Failed to fetch news");
            const data: NewsItem[] = await res.json();
            setNews(Array.isArray(data) ? data.slice(0, 3) : []);
        } catch (error) {
            console.error("Error fetching news:", error);
            setNews([]);
        } finally {
            setLoadingNews(false);
        }
    };

    const fetchGalleryList = async () => {
        try {
            const res = await fetch("/api/galeri?limit=8");
            if (!res.ok) throw new Error("Failed to fetch gallery");
            const data: GalleryItem[] = await res.json();
            setGallery(Array.isArray(data) ? data.slice(0, 8) : []);
        } catch (error) {
            console.error("Error fetching gallery:", error);
            setGallery([]);
        } finally {
            setLoadingGallery(false);
        }
    };

    return (
        <section className="w-full relative overflow-hidden">
            {/* Batik Pattern Background - Variatif */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]">
                {/* Pattern 1 - Top */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23dc2626' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                        backgroundSize: "100px 100px",
                    }}
                />
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-200/10 dark:bg-red-800/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/10 dark:bg-orange-800/5 rounded-full blur-3xl" />

            <div className="relative z-10">
                {/* Buku Ajar */}
                <div className="w-full py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12 space-y-3"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                                Buku Ajar
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto rounded-full" />
                            <p className="text-sm md:text-base text-default-600">
                                Kumpulan buku ajar dari LPMPP UNSOED
                            </p>
                        </motion.div>

                        {loadingBooks ? (
                            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-64 rounded-xl bg-default-200 animate-pulse" />
                                ))}
                            </div>
                        ) : books.length > 0 ? (
                            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                {books.map((book, index) => (
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.08 }}
                                    >
                                        <Card className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                                            <CardBody className="p-0">
                                                {book.gambar ? (
                                                    <div className="w-full aspect-[3/2] overflow-hidden rounded-t-xl">
                                                        <img
                                                            src={book.gambar}
                                                            alt={book.judul}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full aspect-[3/2] flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-t-xl">
                                                        <svg
                                                            className="w-12 h-12 text-red-400 dark:text-red-600"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="p-6 space-y-3">
                                                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 line-clamp-2">
                                                        {book.judul}
                                                    </h3>
                                                    {book.deskripsi && (
                                                        <p className="text-sm text-default-600 dark:text-default-400 line-clamp-3">
                                                            {book.deskripsi}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-3 pt-2">
                                                        <Link
                                                            href={`/buku/${book.id}`}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                                                />
                                                            </svg>
                                                            Baca
                                                        </Link>
                                                        {book.link && (
                                                            <Link
                                                                href={book.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-red-600 hover:text-red-700 underline"
                                                            >
                                                                Buka sumber
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <p className="text-sm text-default-500">Belum ada data buku aktif</p>
                            </motion.div>
                        )}

                        <div className="max-w-6xl mx-auto mt-10 flex justify-center">
                            <Link
                                href="/buku"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border-2 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30 transition-colors font-medium"
                            >
                                Lihat selengkapnya
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Berita */}
                <div className="w-full py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12 space-y-3"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                                Berita
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto rounded-full" />
                            <p className="text-sm md:text-base text-default-600">
                                Informasi terbaru dari LPMPP UNSOED
                            </p>
                        </motion.div>

                        {loadingNews ? (
                            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-64 rounded-xl bg-default-200 animate-pulse" />
                                ))}
                            </div>
                        ) : news.length > 0 ? (
                            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                {news.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.08 }}
                                    >
                                        <Card className="h-full border border-divider hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-orange-500/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                                            <CardBody className="p-0">
                                                {item.coverImage && (
                                                    <div className="w-full h-40 md:h-44 overflow-hidden rounded-t-xl">
                                                        <img
                                                            src={item.coverImage}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-6 space-y-3">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-default-600 dark:text-default-400 line-clamp-3">
                                                        {item.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs text-default-500 pt-2">
                                                        <span>
                                                            {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                        <Link
                                                            href={`/berita/${item.slug}`}
                                                            className="text-orange-600 hover:text-orange-700 underline font-medium"
                                                        >
                                                            Baca
                                                        </Link>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <p className="text-sm text-default-500">Belum ada berita terbaru</p>
                            </motion.div>
                        )}

                        <div className="max-w-6xl mx-auto mt-10 flex justify-center">
                            <Link
                                href="/berita"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border-2 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-950/30 transition-colors font-medium"
                            >
                                Lihat selengkapnya
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Galeri */}
                <div className="w-full py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12 space-y-3"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                                Galeri
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto rounded-full" />
                            <p className="text-sm md:text-base text-default-600">
                                Kumpulan dokumentasi kegiatan
                            </p>
                        </motion.div>

                        {loadingGallery ? (
                            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="aspect-[4/3] rounded-xl bg-default-200 animate-pulse" />
                                ))}
                            </div>
                        ) : gallery.length > 0 ? (
                            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                {gallery.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    >
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-default-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                            <img
                                                src={item.gambar}
                                                alt={item.judul || `Galeri ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <p className="text-sm text-default-500">Belum ada gambar galeri</p>
                            </motion.div>
                        )}

                        <div className="max-w-6xl mx-auto mt-10 flex justify-center">
                            <Link
                                href="/galeri"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border-2 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30 transition-colors font-medium"
                            >
                                Lihat selengkapnya
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
