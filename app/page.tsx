"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImagesSlider } from "@/components/ui/images-slider";

interface SiteConfig {
  siteName: string;
  tagline?: string;
  motto?: string;
  carouselImages?: string;
}

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteConfig();
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

  // Parse carousel images from JSON string
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
    <section className="w-full">
      {/* Hero Section with Image Slider */}
      <ImagesSlider className="h-[50vh] md:h-[60vh] lg:h-[40rem]" images={carouselImages}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 flex flex-col justify-center items-center px-4"
        >
          <motion.h1 className="font-bold text-3xl md:text-5xl lg:text-7xl text-center bg-clip-text text-transparent bg-gradient-to-b from-red-200 via-red-300 to-red-500 py-4">
            {config?.siteName || "LPMPP UNSOED"}
          </motion.h1>
          <motion.p 
            className="text-sm md:text-lg lg:text-2xl text-center text-red-100 font-medium max-w-3xl mt-2 md:mt-4 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {config?.tagline || "Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran"}
          </motion.p>
          <motion.p 
            className="text-xs md:text-base text-center text-red-200/80 max-w-2xl mt-1 md:mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Universitas Jenderal Soedirman
          </motion.p>
         
          {config?.motto && (
            <motion.div
              className="mt-4 md:mt-8 px-4 md:px-6 py-2 md:py-3 backdrop-blur-sm border bg-red-500/10 border-red-400/30 text-red-50 mx-auto text-center rounded-full relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span className="text-xs md:text-sm lg:text-base italic font-medium">"{config.motto}"</span>
              <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-red-400 to-transparent" />
            </motion.div>
          )}
        </motion.div>
      </ImagesSlider>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Add your additional homepage content here */}
      </div>
    </section>
  );
}