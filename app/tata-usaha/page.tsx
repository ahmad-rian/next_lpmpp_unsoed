"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";
import { title, subtitle } from "@/components/primitives";

interface Staff {
  id: string;
  position: "SUB_COORDINATOR" | "GENERAL_STAFF" | "PROGRAM_DATA_INFO_STAFF" | "DRIVER" | "OFFICE_ASSISTANT";
  name: string;
  title: string | null;
  photo: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function TataUsahaPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch("/api/staff");
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group staff by position
  const groupedStaff = staff.reduce((acc, person) => {
    const positionName = {
      'SUB_COORDINATOR': 'Sub Koordinator',
      'GENERAL_STAFF': 'Staff Umum', 
      'PROGRAM_DATA_INFO_STAFF': 'Staff Program, Data & Informasi',
      'DRIVER': 'Pengemudi',
      'OFFICE_ASSISTANT': 'Pramu Bakti'
    }[person.position] || 'Staff Umum';
    
    if (!acc[positionName]) {
      acc[positionName] = [];
    }
    acc[positionName].push(person);
    return acc;
  }, {} as Record<string, Staff[]>);

  if (loading) {
    return (
      <div className="w-full space-y-8 px-4">
        <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
          <Skeleton className="h-12 w-96 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-64 mx-auto rounded-lg" />
        </div>
        
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, staffIndex) => (
                  <Skeleton key={staffIndex} className="h-80 rounded-xl" />
                ))}
              </div>
            </div>
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
          Tata Usaha
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Tim Tata Usaha Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LPMPP) 
          Universitas Jenderal Soedirman
        </p>
        <Divider className="max-w-24 mx-auto bg-red-500" />
      </div>

      {/* Staff by Position */}
      {Object.keys(groupedStaff).length > 0 ? (
        <div className="space-y-12">
          {Object.entries(groupedStaff).map(([positionName, staffMembers]) => (
            <div key={positionName} className="space-y-8">
              {/* Position Header */}
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                  {positionName}
                </h2>
                <div className="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
              </div>

              {/* Staff Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {staffMembers.map((person) => (
                  <Card 
                    key={person.id}
                    className="shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-red-500 group"
                  >
                    <CardHeader className="flex flex-col items-center pb-2 pt-6">
                      <div className="relative mb-3">
                        {person.photo ? (
                          <div className="relative">
                            <Image
                              src={person.photo}
                              alt={person.name}
                              width={120}
                              height={120}
                              className="object-cover rounded-full border-3 border-red-200 dark:border-red-700 group-hover:border-red-400 dark:group-hover:border-red-500 transition-colors"
                            />
                            <div className="absolute inset-0 bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ) : (
                          <div className="w-30 h-30 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 rounded-full flex items-center justify-center border-3 border-red-200 dark:border-red-700">
                            <svg className="w-16 h-16 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-sm md:text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
                          {person.name}
                        </h3>
                        {person.title && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {person.title}
                          </p>
                        )}
                        <Chip 
                          color="danger" 
                          variant="flat" 
                          size="sm"
                          className="text-xs"
                        >
                          {positionName}
                        </Chip>
                      </div>
                    </CardHeader>
                    
                    <CardBody className="pt-2">
                      <div className="text-center">
                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {person.position === 'SUB_COORDINATOR' 
                            ? "Membantu koordinasi kegiatan dan program kerja lembaga"
                            : person.position === 'PROGRAM_DATA_INFO_STAFF'
                            ? "Mengelola program, data, dan sistem informasi lembaga"
                            : person.position === 'DRIVER'
                            ? "Menyediakan layanan transportasi untuk kegiatan lembaga"
                            : person.position === 'OFFICE_ASSISTANT'
                            ? "Memberikan dukungan kebersihan dan pemeliharaan kantor"
                            : "Memberikan dukungan administratif umum"
                          }
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
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
              Belum Ada Data Staff
            </h3>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Data staff tata usaha akan ditampilkan di sini ketika sudah tersedia.
            </p>
          </CardBody>
        </Card>
      )}

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 shadow-lg border-l-4 border-red-500">
          <CardHeader>
            <h3 className="text-lg md:text-xl font-bold text-red-700 dark:text-red-300">
              Peran Tata Usaha
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Memberikan dukungan administratif untuk seluruh kegiatan LPMPP
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Mengelola dokumentasi dan arsip lembaga
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Mengkoordinasikan kegiatan operasional harian
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20 shadow-lg border-l-4 border-rose-500">
          <CardHeader>
            <h3 className="text-lg md:text-xl font-bold text-rose-700 dark:text-rose-300">
              Layanan Tata Usaha
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Pelayanan administrasi akademik dan non-akademik
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Pengelolaan surat menyurat dan komunikasi resmi
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Dukungan teknis untuk kegiatan dan acara lembaga
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
