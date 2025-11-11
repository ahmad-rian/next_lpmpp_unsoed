"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";

type DownloadItem = {
  id: string;
  name: string;
  description?: string | null;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  downloadCount: number;
  createdAt: string;
};

function formatBytes(bytes: number) {
  if (!bytes || bytes < 0) return "-";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value < 10 ? 2 : 1)} ${sizes[i]}`;
}

export default function UnduhanPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [q, setQ] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const pageSize = 12;

  useEffect(() => {
    // Initial load
    fetchDownloads(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDownloads = async (pageToFetch: number, reset = false, query = q) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        paginated: "true",
        page: String(pageToFetch),
        pageSize: String(pageSize),
      });
      if (query) params.set("q", query);

      const res = await fetch(`/api/downloads?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data unduhan");
      const data = await res.json();

      // Expect shape: { items, total, page, pageSize }
      const list: DownloadItem[] = Array.isArray(data) ? data : data.items;
      if (reset) {
        setItems(list);
      } else {
        setItems(prev => [...prev, ...list]);
      }
      setPage(pageToFetch);
      const total = Array.isArray(data) ? list.length : data.total;
      setHasMore(Array.isArray(data) ? list.length === pageSize : (pageToFetch * pageSize) < total);
    } catch (e) {
      console.error("Gagal memuat unduhan:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await fetchDownloads(1, true, q);
  };

  const loadMore = async () => {
    if (hasMore && !loading) {
      await fetchDownloads(page + 1, false);
    }
  };

  const handleDownload = async (item: DownloadItem) => {
    try {
      setDownloadingId(item.id);
      // Increment download count atomically and get latest
      const res = await fetch(`/api/downloads?id=${encodeURIComponent(item.id)}`);
      if (res.ok) {
        const updated: DownloadItem = await res.json();
        setItems(prev => prev.map(it => (it.id === item.id ? { ...it, downloadCount: updated.downloadCount } : it)));
      }
      // Open file in new tab
      window.open(item.fileUrl, "_blank");
    } catch (e) {
      console.error("Gagal mengunduh file:", e);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-red-600 dark:text-red-400">Unduhan</h1>
        <p className="text-default-600">Kumpulan dokumen PDF/DOCS yang dapat diunduh</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari dokumen..."
          variant="bordered"
          className="w-full sm:w-auto flex-1"
        />
        <Button color="primary" variant="flat" onPress={handleSearch} isDisabled={loading}>
          Cari
        </Button>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
            <p className="text-default-600">Memuat data unduhan...</p>
          </div>
        </div>
      ) : (
        <>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} isHoverable className="border border-default-200 dark:border-default-100">
                  <CardBody className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold line-clamp-2 mr-3">{item.name}</h2>
                      <Chip size="sm" variant="flat" color="primary" className="capitalize">
                        {item.fileType}
                      </Chip>
                    </div>
                    {item.description && (
                      <p className="text-sm text-default-600 line-clamp-3">{item.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-default-500">
                      <span className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-9 0v-9M7.5 12l3.75 3.75L15 12" />
                          </svg>
                          {item.downloadCount} unduhan
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                          </svg>
                          {formatBytes(item.fileSize)}
                        </span>
                      </span>
                      <Button
                        color="primary"
                        size="sm"
                        variant="flat"
                        onPress={() => handleDownload(item)}
                        isLoading={downloadingId === item.id}
                      >
                        Unduh
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-16">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-xl font-bold mb-2">Belum ada dokumen unduhan</h3>
                <p className="text-default-600">Silakan kembali lagi nanti.</p>
              </CardBody>
            </Card>
          )}

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button onPress={loadMore} isLoading={loading} variant="flat" color="primary">
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}