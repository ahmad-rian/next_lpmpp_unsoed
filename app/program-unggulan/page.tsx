"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type FeaturedProgram = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  documentUrl?: string | null;
  documentName?: string | null;
  icon?: string | null;
  order: number;
  isActive: boolean;
};

export default function ProgramUnggulanPage() {
  const [programs, setPrograms] = useState<FeaturedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Fetch programs
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/featured-programs");
        const data: FeaturedProgram[] = await res.json();
        const sorted = data.sort((a, b) => a.order - b.order);
        setPrograms(sorted);
        if (sorted.length > 0) {
          setActiveSlug(sorted[0].slug);
        }
      } catch (e) {
        console.error("Failed to fetch featured programs", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  const activeProgram = programs.find((p) => p.slug === activeSlug);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
          <p className="text-default-600">Memuat program...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-12">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12 space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400">
          Program Unggulan
        </h1>
        <p className="text-base md:text-xl text-default-600 max-w-3xl mx-auto">
          Kumpulan program unggulan LPMPP UNSOED
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {programs.length === 0 ? (
          <Card>
            <CardBody className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-default-100 mb-4">
                <svg className="w-8 h-8 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Belum Ada Program</h3>
              <p className="text-default-500">Program unggulan belum tersedia saat ini</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Tabs */}
            <div className="lg:col-span-4">
              <Card className="sticky top-24">
                <CardBody className="p-4">
                  <h3 className="text-sm font-semibold text-default-500 mb-3 px-2">
                    DAFTAR PROGRAM
                  </h3>
                  {/* Scrollable area with max height */}
                  <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden pr-2 space-y-2 scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent hover:scrollbar-thumb-default-400">
                    {programs.map((program, index) => (
                      <button
                        key={program.id}
                        onClick={() => setActiveSlug(program.slug)}
                        className={clsx(
                          "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                          activeSlug === program.slug
                            ? "bg-red-50 dark:bg-red-950/30 shadow-sm"
                            : "hover:bg-default-100"
                        )}
                      >
                        {/* Active Indicator */}
                        {activeSlug === program.slug && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 dark:bg-red-400"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}

                        {/* Number Badge */}
                        <div className="flex items-start gap-3">
                          <div
                            className={clsx(
                              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                              activeSlug === program.slug
                                ? "bg-red-600 dark:bg-red-500 text-white"
                                : "bg-default-200 dark:bg-default-100 text-default-600 group-hover:bg-red-100 group-hover:text-red-600"
                            )}
                          >
                            {index + 1}
                          </div>

                          {/* Title */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={clsx(
                                "text-sm font-semibold transition-colors line-clamp-2",
                                activeSlug === program.slug
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-default-700 dark:text-default-300 group-hover:text-red-600"
                              )}
                            >
                              {program.title}
                            </p>
                          </div>

                          {/* Arrow */}
                          <svg
                            className={clsx(
                              "w-5 h-5 flex-shrink-0 transition-all",
                              activeSlug === program.slug
                                ? "text-red-600 dark:text-red-400 opacity-100"
                                : "text-default-400 opacity-0 group-hover:opacity-100"
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {activeProgram && (
                  <motion.div
                    key={activeProgram.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardBody className="p-6 md:p-8">
                        {/* Header */}
                        <div className="mb-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                              {activeProgram.title}
                            </h2>
                            {activeProgram.documentUrl && (
                              <a
                                href={activeProgram.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                {activeProgram.documentName || "Lihat Dokumen"}
                              </a>
                            )}
                          </div>
                          <div className="w-16 h-1 bg-red-500 rounded-full"></div>
                        </div>

                        {/* Content */}
                        {activeProgram.description ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="prose prose-sm md:prose-base lg:prose-lg max-w-none 
                              prose-headings:text-default-900 dark:prose-headings:text-default-100
                              prose-p:text-default-700 dark:prose-p:text-default-300
                              prose-a:text-primary hover:prose-a:text-primary-600
                              prose-strong:text-default-900 dark:prose-strong:text-default-100
                              prose-ul:text-default-700 dark:prose-ul:text-default-300
                              prose-ol:text-default-700 dark:prose-ol:text-default-300"
                            dangerouslySetInnerHTML={{ __html: activeProgram.description }}
                          />
                        ) : (
                          <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-default-100 mb-4">
                              <svg className="w-8 h-8 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            </div>
                            <p className="text-default-500">Belum ada deskripsi untuk program ini</p>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}