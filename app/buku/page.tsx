"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DataBuku {
  id: string;
  judul: string;
  deskripsi?: string | null;
  gambar?: string | null;
  link?: string | null;
}

export default function BukuPage() {
  const [books, setBooks] = useState<DataBuku[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data: DataBuku[] = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
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
            <li className="text-default-700 dark:text-default-300">Buku</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">Koleksi Buku Ajar</h1>
          <p className="text-sm md:text-base text-default-600">Temukan dan baca buku ajar LPMPP UNSOED</p>
        </div>
      </div>

      {/* Grid Buku */}
      <div className="w-full pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-default-200 animate-pulse" />
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="group border border-divider rounded-xl overflow-hidden bg-white dark:bg-default-100 hover:shadow-lg transition-all">
                  {book.gambar ? (
                    <div className="w-full aspect-[3/2] overflow-hidden">
                      <img src={book.gambar} alt={book.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="w-full aspect-[3/2] flex items-center justify-center bg-default-100">
                      <svg className="w-12 h-12 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 line-clamp-2">{book.judul}</h3>
                    {book.deskripsi && (
                      <p className="text-sm text-default-600 dark:text-default-400 line-clamp-3">{book.deskripsi}</p>
                    )}
                    <div className="pt-2 flex items-center gap-3">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-default-500">Belum ada data buku aktif</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}