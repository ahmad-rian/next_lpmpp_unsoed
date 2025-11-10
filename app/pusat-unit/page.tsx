"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

interface Center {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isActive: boolean;
  members?: CenterMember[];
}

interface CenterMember {
  id: string;
  centerId: string;
  role: string;
  name: string;
  title: string | null;
  photo: string | null;
  order: number;
}

export default function PusatUnitPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenterId, setSelectedCenterId] = useState<string>("");

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const res = await fetch('/api/centers');
      if (res.ok) {
        const data = await res.json();
        setCenters(data || []);
        if (data && data.length > 0) {
          setSelectedCenterId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching centers', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCenter = centers.find(c => c.id === selectedCenterId);

  if (loading) {
    return (
      <div className="w-full space-y-8 px-4">
        <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
          <Skeleton className="h-12 w-96 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-64 mx-auto rounded-lg" />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </div>
          
          <div className="w-full lg:w-3/4 space-y-6">
            <Skeleton className="h-32 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-80 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!centers.length) {
    return (
      <div className="w-full space-y-8 px-4">
        <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
            Pusat & Unit
          </h1>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
            Struktur Pusat dan Unit Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LPMPP)
          </p>
          <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
        </div>
        
        <Card className="shadow-md border-l-4 border-red-500">
          <CardBody className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Belum Ada Data Pusat & Unit
            </h3>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Data pusat dan unit akan ditampilkan di sini ketika sudah tersedia.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Pusat & Unit
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Struktur Pusat dan Unit Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu (LPMPP)
        </p>
        <p className="text-sm md:text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto px-4">
          Universitas Jenderal Soedirman
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar - Navigation */}
        <div className="w-full lg:w-1/4">
          <Card className="sticky top-4 bg-white dark:bg-gray-900 shadow-md">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  Pilih Pusat / Unit
                </h3>
                <Chip color="default" variant="flat" size="sm" className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold">
                  {centers.length}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="space-y-1 p-2">
              {centers.map((center) => (
                <Button
                  key={center.id}
                  variant="light"
                  className={`w-full justify-start h-auto py-3 px-4 rounded-lg transition-all ${
                    selectedCenterId === center.id 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setSelectedCenterId(center.id)}
                >
                  <div className="text-left w-full">
                    <div className="font-semibold text-sm md:text-base line-clamp-2">
                      {center.name}
                    </div>
                    <div className={`text-xs mt-1 ${
                      selectedCenterId === center.id 
                        ? 'text-red-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {center.members?.length || 0} Anggota
                    </div>
                  </div>
                </Button>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          {selectedCenter ? (
            <div className="space-y-6 md:space-y-8">
              {/* Center Overview */}
              <Card className="bg-white dark:bg-gray-900 shadow-md border-l-4 border-red-500">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedCenter.name}
                      </h3>
                      <Chip color="default" variant="flat" size="sm" className="w-fit bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold">
                        {selectedCenter.members?.length || 0} Anggota
                      </Chip>
                    </div>
                    
                    {/* Active Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/30 rounded-full border border-green-200 dark:border-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">Aktif</span>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-6">
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedCenter.description || 'Deskripsi pusat/unit ini akan segera tersedia.'}
                  </p>
                </CardBody>
              </Card>

              {/* Members Section */}
              {selectedCenter.members && selectedCenter.members.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      Anggota & Struktur Organisasi
                    </h4>
                    <Chip color="default" variant="flat" size="sm" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                      {selectedCenter.members.length} Orang
                    </Chip>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {selectedCenter.members.map((member) => (
                      <Card 
                        key={member.id}
                        className="shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700"
                      >
                        <CardHeader className="flex flex-col items-center pb-2 pt-6 p-4">
                          <div className="relative mb-3">
                            {member.photo ? (
                              <div className="relative">
                                <Image
                                  src={member.photo}
                                  alt={member.name}
                                  width={80}
                                  height={80}
                                  className="object-cover rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                                />
                              </div>
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                                <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-center">
                            <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
                              {member.name}
                            </h3>
                            {member.title && (
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {member.title}
                              </p>
                            )}
                            <Chip 
                              color="default" 
                              variant="flat" 
                              size="sm"
                              className="text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-medium"
                            >
                              {member.role}
                            </Chip>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="shadow-md border-l-4 border-gray-300 dark:border-gray-700">
                  <CardBody className="text-center py-8">
                    <div className="mb-4">
                      <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Belum Ada Anggota
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Data anggota {selectedCenter.name} akan ditampilkan di sini ketika sudah tersedia.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          ) : (
            <Card className="shadow-md border-l-4 border-gray-300 dark:border-gray-700">
              <CardBody className="text-center py-12">
                <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Pilih Pusat atau Unit
                </h3>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                  Silakan pilih pusat atau unit di sidebar untuk melihat detail dan anggotanya.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}