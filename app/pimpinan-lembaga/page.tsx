"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";
import { title, subtitle } from "@/components/primitives";

interface Leadership {
  id: string;
  position: "HEAD" | "SECRETARY";
  name: string;
  title: string | null;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PimpinanLembagaPage() {
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadership();
  }, []);

  const fetchLeadership = async () => {
    try {
      const response = await fetch("/api/leadership");
      if (response.ok) {
        const data = await response.json();
        setLeadership(data);
      }
    } catch (error) {
      console.error("Error fetching leadership:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-8 px-4">
        <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
          <Skeleton className="h-12 w-96 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-64 mx-auto rounded-lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Pimpinan Lembaga
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Struktur Kepemimpinan Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LPMPP) 
          Universitas Jenderal Soedirman
        </p>
        <Divider className="max-w-24 mx-auto bg-red-500" />
      </div>

      {/* Leadership Cards */}
      {leadership.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {leadership.map((leader) => (
            <Card 
              key={leader.id}
              className="shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-red-500 group"
            >
              <CardHeader className="flex flex-col items-center pb-4 pt-8">
                <div className="relative mb-4">
                  {leader.photo ? (
                    <div className="relative">
                      <Image
                        src={leader.photo}
                        alt={leader.name}
                        width={150}
                        height={150}
                        className="object-cover rounded-full border-4 border-red-200 dark:border-red-700 group-hover:border-red-400 dark:group-hover:border-red-500 transition-colors"
                      />
                      <div className="absolute inset-0 bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div className="w-36 h-36 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 rounded-full flex items-center justify-center border-4 border-red-200 dark:border-red-700">
                      <svg className="w-20 h-20 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {leader.name}
                  </h3>
                  {leader.title && (
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {leader.title}
                    </p>
                  )}
                  <Chip 
                    color="danger" 
                    variant="flat" 
                    size="sm"
                    className="mb-2"
                  >
                    {leader.position === "HEAD" ? "Kepala Lembaga" : "Sekretaris Lembaga"}
                  </Chip>
                </div>
              </CardHeader>
              
              <CardBody className="pt-0">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {leader.position === "HEAD" 
                      ? "Memimpin dan mengarahkan kebijakan strategis LPMPP dalam pengembangan pembelajaran dan penjaminan mutu pendidikan di Universitas Jenderal Soedirman."
                      : "Membantu kepala lembaga dalam koordinasi administratif dan operasional kegiatan LPMPP serta memastikan kelancaran program-program yang dijalankan."
                    }
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg border-l-4 border-red-500">
          <CardBody className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 text-red-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Belum Ada Data Pimpinan
            </h3>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Data pimpinan lembaga akan ditampilkan di sini ketika sudah tersedia.
            </p>
          </CardBody>
        </Card>
      )}

      {/* Additional Info Section */}
      <Card className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 shadow-lg border-t-4 border-red-500">
        <CardBody className="text-center py-12">
          <h2 className="text-xl md:text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
            Komitmen Kepemimpinan
          </h2>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Para pimpinan LPMPP UNSOED berkomitmen untuk memajukan kualitas pembelajaran dan penjaminan mutu 
            pendidikan melalui kepemimpinan yang visioner, inovatif, dan berkelanjutan demi terwujudnya 
            Universitas Jenderal Soedirman yang unggul dan berdaya saing.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
