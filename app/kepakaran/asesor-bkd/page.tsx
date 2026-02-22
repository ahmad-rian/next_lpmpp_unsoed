"use client";

import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

interface ExpertiseItem {
  id: string;
  name: string;
  profileUrl: string | null;
  order?: number;
}

export default function AsesorBKDPage() {
  const [items, setItems] = useState<ExpertiseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  async function fetchData() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: "EVALUASI_BKD",
        page: String(page),
        pageSize: String(pageSize)
      });
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/expertise?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [page, q]);

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="w-full px-4 pb-12">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12 space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400">
          Evaluasi BKD
        </h1>
        <p className="text-base md:text-xl text-default-600 max-w-3xl mx-auto">
          Daftar asesor Evaluasi Beban Kerja Dosen (BKD) LPMPP UNSOED
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Chip
            size="lg"
            variant="flat"
            color="primary"
            startContent={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            }
          >
            {total} Asesor
          </Chip>

          <Input
            type="text"
            placeholder="Cari nama asesor..."
            value={q}
            onValueChange={(val) => { setQ(val); setPage(1); }}
            startContent={
              <svg className="w-5 h-5 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
            classNames={{
              input: "text-sm",
              inputWrapper: "h-12"
            }}
            className="max-w-md"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-default-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            {/* Cards Grid */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardBody className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Number Badge */}
                      <div className="flex-shrink-0 w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {startIndex + idx + 1}
                        </span>
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-default-500">
                          Asesor Evaluasi BKD
                        </p>
                      </div>

                      {/* Icon / Profile Link */}
                      <div className="flex-shrink-0 hidden sm:flex items-center gap-2">
                        {item.profileUrl ? (
                          <a
                            href={item.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors group"
                            title="Lihat Profile"
                          >
                            <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  total={pages}
                  initialPage={1}
                  page={page}
                  onChange={setPage}
                  showControls
                  color="primary"
                  size="lg"
                />
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardBody className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-default-100 mb-4">
                <svg className="w-8 h-8 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {q ? "Tidak Ada Hasil" : "Belum Ada Data"}
              </h3>
              <p className="text-default-500">
                {q
                  ? `Tidak ditemukan hasil untuk "${q}"`
                  : "Data asesor belum tersedia saat ini"}
              </p>
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="mt-4 text-primary hover:underline text-sm font-medium"
                >
                  Hapus pencarian
                </button>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}