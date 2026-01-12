"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import NextLink from "next/link";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  author: string;
  publishedAt: string;
  viewCount: number;
};

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 9;

  useEffect(() => {
    fetchNews(1, true);
  }, []);

  const fetchNews = async (pageToFetch: number, reset = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/news?published=true&page=${pageToFetch}&pageSize=${pageSize}`);
      const data: NewsItem[] = await res.json();
      if (reset) {
        setNews(data);
      } else {
        setNews(prev => [...prev, ...data]);
      }
      setPage(pageToFetch);
      setHasMore(data.length === pageSize);
    } catch (e) {
      console.error("Gagal memuat berita:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchNews(page + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-red-600 dark:text-red-400">Berita</h1>
        <p className="text-default-600">Informasi dan kabar terbaru dari LPMPP Unsoed</p>
      </div>

      {loading && news.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
            <p className="text-default-600">Memuat berita...</p>
          </div>
        </div>
      ) : (
        <>
          {news.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card key={item.id} isHoverable className="border border-default-200 dark:border-default-100">
                  <CardBody className="p-0">
                    {item.coverImage && (
                      <div className="w-full h-48 md:h-56 overflow-hidden">
                        <Image src={item.coverImage} alt={item.title} removeWrapper className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      <h2 className="text-lg font-bold line-clamp-2">{item.title}</h2>
                      <p className="text-sm text-default-600 line-clamp-3">{item.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-default-500">
                        <span>Oleh {item.author}</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-default-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {item.viewCount} dilihat
                        </span>
                        <Button as={NextLink} href={`/berita/${item.slug}`} color="primary" size="sm" variant="flat">
                          Baca Selengkapnya
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-16">
                <div className="text-5xl mb-4">📰</div>
                <h3 className="text-xl font-bold mb-2">Belum ada berita</h3>
                <p className="text-default-600">Silakan kembali lagi nanti.</p>
              </CardBody>
            </Card>
          )}

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button onPress={handleLoadMore} isLoading={loading} variant="flat" color="primary">
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}