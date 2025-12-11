"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImagesSlider } from "@/components/ui/images-slider";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";

interface SiteConfig {
  siteName: string;
  tagline?: string;
  motto?: string;
  carouselImages?: string;
  gambarSlogan?: string | null;
  gambarTeam?: string | null;
  gambarPartner?: string | null;
  gambarStaff?: string | null;
  gambarTambahan?: string | null;
  layananKami?: string | null;
  pelatihan?: string | null;
  pembelajaran?: string | null;
  penjaminanMutu?: string | null;
  headMessage?: string | null;
  informasiLayanan?: string | null;
  gambarInformasi?: string | null;
}

interface TautanLayananItem {
  id: string;
  nama: string;
  gambar?: string | null;
  link: string;
  order: number;
  isActive: boolean;
}

interface Leadership {
  id: string;
  name: string;
  title?: string | null;
  photo?: string | null;
  position: "HEAD" | "SECRETARY" | string;
}

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

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceLinks, setServiceLinks] = useState<TautanLayananItem[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [headLeader, setHeadLeader] = useState<Leadership | null>(null);
  const [loadingHead, setLoadingHead] = useState(true);
  const [books, setBooks] = useState<DataBuku[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    fetchSiteConfig();
    fetchServiceLinks();
    fetchLeadershipHead();
    fetchBooks();
    fetchNewsList();
    fetchGalleryList();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const response = await fetch("/api/site-config");
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error("Error fetching site config:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceLinks = async () => {
    try {
      const res = await fetch("/api/tautan-layanan");
      if (!res.ok) throw new Error("Failed to fetch tautan layanan");
      const data = await res.json();
      setServiceLinks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tautan layanan:", error);
      setServiceLinks([]);
    } finally {
      setLoadingLinks(false);
    }
  };

  const fetchLeadershipHead = async () => {
    try {
      const res = await fetch("/api/leadership");
      if (!res.ok) throw new Error("Failed to fetch leadership");
      const data: Leadership[] = await res.json();
      const head = Array.isArray(data)
        ? data.find((item) => item.position === "HEAD") || null
        : null;
      setHeadLeader(head);
    } catch (error) {
      console.error("Error fetching leadership (HEAD):", error);
      setHeadLeader(null);
    } finally {
      setLoadingHead(false);
    }
  };

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

  const carouselImages = config?.carouselImages
    ? JSON.parse(config.carouselImages)
    : [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2940&auto=format&fit=crop",
    ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="w-full relative">
      {/* Gradient Background - Very Strong Red Tint */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/70 via-red-50/50 via-40% to-red-100/60 dark:from-red-950/25 dark:via-red-950/15 dark:via-40% dark:to-red-950/30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/40 via-transparent to-red-50/40 dark:from-orange-950/15 dark:to-red-950/15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100/50 via-transparent to-transparent dark:from-red-900/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent dark:from-orange-900/20" />
      </div>

      {/* Hero Section - Split Layout with Wayang Decorations */}
      <div className="container mx-auto px-4 pt-6 md:pt-10 lg:pt-12 pb-12 md:pb-16 lg:pb-20 relative overflow-visible">
        {/* Wayang Kiri Bawah - Mereng ke Kanan (45deg) */}
        <motion.div
          initial={{ opacity: 0, x: -100, rotate: 45 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: 45,
            y: [0, -15, 0]
          }}
          transition={{
            opacity: { duration: 1 },
            x: { duration: 1 },
            rotate: { duration: 1 },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="absolute left-0 bottom-0 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto opacity-60 dark:opacity-40 pointer-events-none z-0"
          style={{ filter: 'drop-shadow(0 10px 30px rgba(220, 38, 38, 0.4))' }}
        >
          <img
            src="/assets/images/wayang.webp"
            alt="Wayang Decoration Left"
            className="w-full h-auto"
          />
        </motion.div>

        {/* Wayang Kanan Bawah - Mereng ke Kiri (-45deg) */}
        <motion.div
          initial={{ opacity: 0, x: 100, rotate: -45 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: -45,
            y: [0, 15, 0]
          }}
          transition={{
            opacity: { duration: 1 },
            x: { duration: 1 },
            rotate: { duration: 1 },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }
          }}
          className="absolute right-0 bottom-0 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto opacity-60 dark:opacity-40 pointer-events-none z-0"
          style={{ filter: 'drop-shadow(0 10px 30px rgba(220, 38, 38, 0.4))' }}
        >
          <img
            src="/assets/images/wayang.webp"
            alt="Wayang Decoration Right"
            className="w-full h-auto"
          />
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto relative z-10">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:pr-8"
          >
            <motion.h1
              className="font-playfair text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-red-600 dark:text-red-400 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              LPMPP UNSOED
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-default-700 dark:text-default-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {config?.tagline || "Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran"}
            </motion.p>

            <motion.p
              className="text-base md:text-lg text-default-600 dark:text-default-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Universitas Jenderal Soedirman
            </motion.p>

            {config?.motto && (
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm md:text-base text-red-700 dark:text-red-300 font-medium italic">
                  "{config.motto}"
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Right Side - Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl max-w-2xl">
              <ImagesSlider
                images={carouselImages}
                autoplay={true}
                direction="up"
                className="h-full w-full"
                overlay={false}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-600/10 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Seksi gambar tambahan */}
      <div className="w-full py-12 md:py-16 lg:py-20 space-y-12 md:space-y-16 lg:space-y-20">
        {config?.gambarSlogan && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full px-4 md:px-8 lg:px-12"
          >
            <img src={config.gambarSlogan} alt="Visi dan Misi LPMPP UNSOED" className="w-full h-auto object-cover" loading="lazy" />
          </motion.section>
        )}

        {config?.gambarTeam && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full px-4 md:px-8 lg:px-12"
          >
            <img src={config.gambarTeam} alt="Tim LPMPP UNSOED" className="w-full h-auto object-cover" loading="lazy" />
          </motion.section>
        )}

        {config?.gambarPartner && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full px-4 md:px-8 lg:px-12"
          >
            <img src={config.gambarPartner} alt="Mitra LPMPP UNSOED" className="w-full h-auto object-cover" loading="lazy" />
          </motion.section>
        )}
      </div>

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
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card isPressable className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10">
                <CardBody className="p-6 gap-3">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-7 h-7 text-red-600 dark:text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Pelatihan</h3>
                  </div>
                  <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                    {config?.pelatihan || "Konten belum dikonfigurasi di Admin → Site Config (pelatihan)."}
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            {/* Pembelajaran */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card isPressable className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10">
                <CardBody className="p-6 gap-3">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-7 h-7 text-red-600 dark:text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Pembelajaran</h3>
                  </div>
                  <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                    {config?.pembelajaran || "Konten belum dikonfigurasi di Admin → Site Config (pembelajaran)."}
                  </p>
                </CardBody>
              </Card>
            </motion.div>

            {/* Penjaminan Mutu */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card isPressable className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10">
                <CardBody className="p-6 gap-3">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-7 h-7 text-red-600 dark:text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Penjaminan Mutu</h3>
                  </div>
                  <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                    {config?.penjaminanMutu || "Konten belum dikonfigurasi di Admin → Site Config (penjaminanMutu)."}
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
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">Tautan Layanan</h2>
            <p className="text-sm md:text-base text-default-600">Akses cepat ke berbagai layanan digital LPMPP UNSOED</p>
          </motion.div>

          {loadingLinks ? (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl bg-default-200 animate-pulse" />
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
                    <Link href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined} rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined} className="block group">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-default-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {item.gambar ? (
                          <Image src={item.gambar} alt={item.nama} className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" removeWrapper />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                            <svg className="w-12 h-12 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                            <span className="text-xs text-default-500 text-center">{item.nama}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-default-100 mb-4">
                <svg className="w-8 h-8 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <p className="text-sm text-default-500">Belum ada tautan layanan aktif</p>
            </motion.div>
          )}
        </div>
      </div>



      {/* Sambutan Ketua Lembaga - Redesigned */}
      <div className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Foto Ketua - Left Side */}
              <div className="md:col-span-4 flex justify-center md:justify-start">
                {headLeader?.photo ? (
                  <div className="relative group">
                    <img
                      src={headLeader.photo}
                      alt={headLeader.name}
                      className="w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover shadow-xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-default-100 to-default-200 dark:from-default-100 dark:to-default-50 flex items-center justify-center shadow-xl">
                    <svg className="w-20 h-20 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Nama & Pesan Ketua - Right Side */}
              <div className="md:col-span-8 space-y-6">
                {headLeader && (
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-bold text-default-900 dark:text-default-100">
                      {headLeader.name}
                    </h3>
                    {headLeader.title && (
                      <p className="text-base md:text-lg text-red-600 dark:text-red-400 font-medium">
                        {headLeader.title}
                      </p>
                    )}
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-red-600/50 via-red-600/20 to-transparent" />

                {config?.headMessage ? (
                  <p className="text-base md:text-lg leading-relaxed text-default-700 dark:text-default-300">
                    {config.headMessage}
                  </p>
                ) : (
                  <p className="text-sm text-default-500 italic">
                    Pesan Ketua Lembaga belum dikonfigurasi. Silakan atur di Admin → Site Config.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Informasi dan Layanan - Redesigned */}
      <div className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Teks Informasi - Left Side */}
              <div className="md:col-span-7 space-y-6 order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
                  Informasi dan Layanan
                </h2>

                <div className="h-px bg-gradient-to-r from-red-600/50 via-red-600/20 to-transparent" />

                {config?.informasiLayanan ? (
                  <p className="text-base md:text-lg leading-relaxed text-default-700 dark:text-default-300">
                    {config.informasiLayanan}
                  </p>
                ) : (
                  <p className="text-sm text-default-500 italic">
                    Informasi layanan belum dikonfigurasi. Silakan atur di Admin → Site Config.
                  </p>
                )}
              </div>

              {/* Gambar Informasi - Right Side */}
              <div className="md:col-span-5 order-1 md:order-2">
                {config?.gambarInformasi ? (
                  <div className="relative group">
                    <img
                      src={config.gambarInformasi}
                      alt="Informasi dan Layanan"
                      className="w-full rounded-3xl shadow-xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-3xl bg-gradient-to-br from-default-100 to-default-200 dark:from-default-100 dark:to-default-50 flex items-center justify-center shadow-xl">
                    <svg className="w-16 h-16 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Buku Ajar - Pindah di bawah Informasi dan Layanan */}
      <div className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 space-y-3"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">Buku Ajar</h2>
            <p className="text-sm md:text-base text-default-600">Kumpulan buku ajar dari LPMPP UNSOED</p>
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
                  <Card className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10">
                    <CardBody className="p-0">
                      {book.gambar ? (
                        <div className="w-full aspect-[3/2] overflow-hidden rounded-t-xl">
                          <img
                            src={book.gambar}
                            alt={book.judul}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[3/2] flex items-center justify-center bg-default-100 rounded-t-xl">
                          <svg className="w-12 h-12 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                      )}
                      <div className="p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 line-clamp-2">{book.judul}</h3>
                        {book.deskripsi && (
                          <p className="text-sm text-default-600 dark:text-default-400 line-clamp-3">{book.deskripsi}</p>
                        )}
                        <div className="flex items-center gap-3 pt-2">
                          <Link href={`/buku/${book.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
                            </svg>
                            Baca
                          </Link>
                          {book.link && (
                            <Link href={book.link} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:text-red-700 underline">Buka sumber</Link>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-sm text-default-500">Belum ada data buku aktif</p>
            </motion.div>
          )}

          <div className="max-w-6xl mx-auto mt-10 flex justify-center">
            <Link href="/buku" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30 transition-colors">
              Lihat selengkapnya
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Berita - Tampilkan beberapa item */}
      <div className="w-full py-8 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 space-y-3"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">Berita</h2>
            <p className="text-sm md:text-base text-default-600">Informasi terbaru dari LPMPP UNSOED</p>
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
                  <Card className="h-full border border-divider hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/10">
                    <CardBody className="p-0">
                      {item.coverImage && (
                        <div className="w-full h-40 md:h-44 overflow-hidden rounded-t-xl">
                          <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6 space-y-3">
                        <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-default-600 line-clamp-3">{item.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-default-500">
                          <span>{new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                          <Link href={`/berita/${item.slug}`} className="text-red-600 hover:text-red-700 underline">Baca</Link>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-sm text-default-500">Belum ada berita terbaru</p>
            </motion.div>
          )}

          <div className="max-w-6xl mx-auto mt-10 flex justify-center">
            <Link href="/berita" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30 transition-colors">
              Lihat selengkapnya
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Galeri - Hanya gambar */}
      <div className="w-full py-8 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 space-y-3"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">Galeri</h2>
            <p className="text-sm md:text-base text-default-600">Kumpulan dokumentasi kegiatan</p>
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
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-default-100">
                    <img src={item.gambar} alt={item.judul || `Galeri ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-sm text-default-500">Belum ada gambar galeri</p>
            </motion.div>
          )}

          <div className="max-w-6xl mx-auto mt-10 flex justify-center">
            <Link href="/galeri" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30 transition-colors">
              Lihat selengkapnya
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Staff Pendukung (dipindah di bawah Galeri) */}
      {config?.gambarStaff && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 md:px-8 lg:px-12"
        >
          <img
            src={config.gambarStaff}
            alt="Staff Pendukung LPMPP UNSOED"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.section>
      )}

      {/* Gambar tambahan (dipindah di bawah Galeri) */}
      {config?.gambarTambahan && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 md:px-8 lg:px-12"
        >
          <img
            src={config.gambarTambahan}
            alt="Gambar Tambahan"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </motion.section>
      )}

    </section>
  );
}