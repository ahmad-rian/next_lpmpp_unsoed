"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface DataBuku {
  id: string;
  judul: string;
  deskripsi?: string | null;
  gambar?: string | null;
  link?: string | null;
}

export default function BukuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [book, setBook] = useState<DataBuku | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBook(id);
  }, [id]);

  const fetchBook = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}`);
      if (!res.ok) throw new Error("Failed to fetch book");
      const data: DataBuku = await res.json();
      setBook(data);
    } catch (error) {
      console.error("Error fetching book:", error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full relative">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-6 md:pt-8">
        <nav className="text-sm text-default-600">
          <ol className="list-none p-0 inline-flex items-center gap-2">
            <li>
              <Link href="/" className="text-red-600 hover:text-red-700">Beranda</Link>
            </li>
            <li className="text-default-400">/</li>
            <li>
              <Link href="/buku" className="text-red-600 hover:text-red-700">Buku</Link>
            </li>
            <li className="text-default-400">/</li>
            <li className="text-default-700 dark:text-default-300">{book?.judul || "Detail"}</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {loading ? (
          <div className="h-8 w-64 bg-default-200 animate-pulse rounded" />
        ) : book ? (
          <div className="flex items-start gap-6">
            {book.gambar && (
              <img src={book.gambar} alt={book.judul} className="w-24 h-32 object-cover rounded-lg shadow-md" />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">{book.judul}</h1>
              {book.deskripsi && (
                <p className="mt-2 text-sm md:text-base text-default-600 dark:text-default-400 max-w-3xl">{book.deskripsi}</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <button onClick={() => router.back()} className="px-3 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30 transition-colors">Kembali</button>
                {book.link && (
                  <Link href={book.link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">Buka di tab baru</Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-default-600">Data buku tidak ditemukan.</p>
        )}
      </div>

      {/* Reader */}
      <div className="container mx-auto px-4 pb-16 md:pb-24">
        {loading ? (
          <div className="w-full h-[70vh] bg-default-200 animate-pulse rounded-xl" />
        ) : book && book.link ? (
          <div className="w-full h-[80vh] rounded-xl overflow-hidden border border-divider">
            {/* Try to embed PDF/URL; some sources may block embedding */}
            <iframe src={book.link} className="w-full h-full" title={`Pembaca: ${book.judul}`} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-default-600">Link buku belum tersedia untuk dibaca langsung.</p>
          </div>
        )}
      </div>
    </section>
  );
}