"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";

interface InternationalAccreditation {
  id: string;
  faculty: string;
  studyProgram: string;
  accreditationBody: string;
  order: number;
}

export default function AkreditasiInternasionalPage() {
  const [loading, setLoading] = useState(true);
  const [accreditations, setAccreditations] = useState<InternationalAccreditation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/accreditation");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAccreditations(data.internationalAccreditations || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search query
  const filteredAccreditations = useMemo(() => {
    if (!searchQuery) return accreditations;
    
    const query = searchQuery.toLowerCase();
    return accreditations.filter(
      (acc) =>
        acc.studyProgram.toLowerCase().includes(query) ||
        acc.faculty.toLowerCase().includes(query) ||
        acc.accreditationBody.toLowerCase().includes(query)
    );
  }, [accreditations, searchQuery]);

  if (loading) {
    return (
      <div className="w-full px-4 pb-12">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <div className="h-10 w-80 bg-default-200 rounded-lg mx-auto animate-pulse" />
          <div className="h-6 w-96 bg-default-100 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-12 bg-default-100 rounded-lg animate-pulse" />
          <div className="h-20 bg-default-100 rounded-lg animate-pulse" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-default-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-12">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12 space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400">
          Akreditasi Internasional
        </h1>
        <p className="text-base md:text-xl text-default-600 max-w-3xl mx-auto">
          Program studi UNSOED yang telah mendapatkan akreditasi internasional
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Cari program studi, fakultas, atau lembaga akreditasi..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={
              <svg className="w-5 h-5 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
            classNames={{
              input: "text-sm",
              inputWrapper: "h-12"
            }}
            className="flex-1"
          />
          <Chip
            size="lg"
            variant="flat"
            color="primary"
            className="px-4"
          >
            {filteredAccreditations.length} Program Studi
          </Chip>
        </div>

        {/* Summary Stats */}
        {accreditations.length > 0 && (
          <Card>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-default-500 mb-1">Total Program Studi</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {accreditations.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-default-500 mb-1">Total Fakultas</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {new Set(accreditations.map(a => a.faculty)).size}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-default-500 mb-1">Lembaga Akreditasi</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {new Set(accreditations.map(a => a.accreditationBody)).size}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Accreditations List */}
        {filteredAccreditations.length > 0 ? (
          <div className="space-y-4">
            {filteredAccreditations.map((acc, index) => (
              <Card
                key={acc.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardBody className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                        {acc.studyProgram}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-default-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                          </svg>
                          <span className="text-default-500">Fakultas:</span>
                          <span className="font-semibold">{acc.faculty}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-default-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                          </svg>
                          <span className="text-default-500">Lembaga:</span>
                          <span className="font-semibold text-primary">{acc.accreditationBody}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-default-100 mb-4">
                <svg className="w-8 h-8 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "Tidak Ada Hasil" : "Belum Ada Data"}
              </h3>
              <p className="text-default-500">
                {searchQuery 
                  ? `Tidak ditemukan hasil untuk "${searchQuery}"`
                  : "Data akreditasi internasional belum tersedia saat ini"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
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