"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

interface SafetyBriefing {
  id: string;
  title: string;
  description: string | null;
  images: string | null;
  videos: string | null;
}

function safeParseArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SafetyBriefingPage() {
  const [data, setData] = useState<SafetyBriefing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/safety-briefing");
        if (res.ok) setData(await res.json());
      } catch (error) {
        console.error("Error fetching safety briefing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-8 px-4">
        <Skeleton className="h-16 w-full max-w-md mx-auto rounded-xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const images = safeParseArray(data?.images);
  const videos = safeParseArray(data?.videos);
  const hasContent = Boolean(data?.description) || images.length > 0 || videos.length > 0;

  return (
    <div className="w-full px-4 pb-12">
      {/* Header */}
      <div className="text-center mb-8 md:mb-14 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          {data?.title || "Safety Briefing LPMPP Building"}
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Petunjuk Keselamatan Gedung LPMPP
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6" />
      </div>

      {!hasContent && (
        <Card className="max-w-3xl mx-auto">
          <CardBody className="py-16 text-center text-gray-500 dark:text-gray-400">
            Belum ada konten petunjuk keselamatan.
          </CardBody>
        </Card>
      )}

      {/* Deskripsi */}
      {data?.description && (
        <Card className="max-w-4xl mx-auto mb-8">
          <CardBody className="p-6 md:p-8">
            <p className="whitespace-pre-line text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {data.description}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Video YouTube */}
      {videos.length > 0 && (
        <div className="max-w-5xl mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Video</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((url, index) => {
              const embed = getYoutubeEmbedUrl(url);
              if (!embed) return null;
              return (
                <div
                  key={`${url}-${index}`}
                  className="aspect-video w-full overflow-hidden rounded-2xl shadow-md bg-black"
                >
                  <iframe
                    src={embed}
                    title={`Video ${index + 1}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Galeri Gambar */}
      {images.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Galeri</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="overflow-hidden rounded-2xl shadow-md border border-default-200"
              >
                <img
                  src={url}
                  alt={`Petunjuk keselamatan ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
