"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import Link from "next/link";

type NewsDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  galleryImages?: string | null;
  author: string;
  publishedAt: string;
  viewCount: number;
};

export default function NewsDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!slug) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/news?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error("Gagal mengambil berita");
        const data: NewsDetail = await res.json();
        setNews(data);
      } catch (e) {
        console.error("Gagal memuat berita:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
          <p className="text-default-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <p className="text-default-600">Berita tidak ditemukan.</p>
      </div>
    );
  }

  const gallery: string[] = (() => {
    try {
      return news.galleryImages ? JSON.parse(news.galleryImages) : [];
    } catch {
      return [];
    }
  })();

  // Combine cover image and gallery
  const allImages = [
    ...(news.coverImage ? [news.coverImage] : []),
    ...gallery
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs size="sm">
          <BreadcrumbItem>
            <Link href="/berita">Berita</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{news.title}</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-red-600 dark:text-red-400">
          {news.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-default-500">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>Oleh {news.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>
              {new Date(news.publishedAt).toLocaleDateString("id-ID", { 
                day: "2-digit", 
                month: "long", 
                year: "numeric" 
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{news.viewCount} views</span>
          </div>
        </div>
      </div>

      {/* Image Slider */}
      {allImages.length > 0 && (
        <div className="relative mb-6 rounded-xl overflow-hidden bg-default-100 dark:bg-default-900/50">
          {/* Main Image */}
          <div className="relative w-full h-64 sm:h-80 md:h-96">
            <img
              src={allImages[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-contain transition-opacity duration-500"
            />
          </div>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? "bg-white w-8" 
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          {allImages.length > 1 && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {currentSlide + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <Card>
        <CardBody className="p-4 md:p-6">
          <div 
            className="prose prose-sm md:prose-base lg:prose-lg max-w-none 
              prose-headings:text-default-900 dark:prose-headings:text-default-100
              prose-p:text-default-700 dark:prose-p:text-default-300
              prose-a:text-primary hover:prose-a:text-primary-600
              prose-strong:text-default-900 dark:prose-strong:text-default-100
              prose-ul:text-default-700 dark:prose-ul:text-default-300
              prose-ol:text-default-700 dark:prose-ol:text-default-300
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: news.content }} 
          />
        </CardBody>
      </Card>
    </div>
  );
}